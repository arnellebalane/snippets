import * as path from 'node:path';
import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaNode from 'aws-cdk-lib/aws-lambda-nodejs';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as triggers from 'aws-cdk-lib/triggers';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';

interface BackendStackProps extends cdk.StackProps {
    databaseUrl: secretsmanager.Secret;
}

export class BackendStack extends cdk.Stack {
    prismaLayer: lambda.LayerVersion;
    databaseUrl: secretsmanager.Secret;

    executionRole: iam.Role;
    migrationLambda: lambdaNode.NodejsFunction;
    apiLambda: lambdaNode.NodejsFunction;
    apiGateway: apigateway.LambdaRestApi;

    constructor(scope: Construct, id: string, props: BackendStackProps) {
        super(scope, id, props);

        this.databaseUrl = props.databaseUrl;
        this.setupExecutionRole();
        this.setupMigrationLambda();
        this.setupApiLambda();
        this.setupApiGateway();
    }

    setupExecutionRole() {
        this.executionRole = new iam.Role(this, 'IAM-LambdaExecutionRole', {
            roleName: 'SnippetsBackendLambdaExecutionRole',
            assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
            managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')],
            inlinePolicies: {
                AllowSecretsManagerGetSecretValuePolicy: new iam.PolicyDocument({
                    statements: [
                        new iam.PolicyStatement({
                            actions: ['secretsmanager:GetSecretValue'],
                            resources: [this.databaseUrl.secretArn],
                        }),
                    ],
                }),
            },
        });
    }

    setupMigrationLambda() {
        this.migrationLambda = new lambdaNode.NodejsFunction(this, 'Lambda-DatabaseMigrator', {
            functionName: 'SnippetsBackendDatabaseMigrator',
            depsLockFilePath: path.resolve(__dirname, '../../../backend-lambda/package-lock.json'),
            entry: path.resolve(__dirname, '../../../backend-lambda/functions/migrate-database/index.ts'),
            bundling: {
                nodeModules: ['prisma'],
                commandHooks: {
                    beforeInstall: (inputDir, outputDir) => [`cp -r ${inputDir}/prisma ${outputDir}`],
                    beforeBundling: () => [],
                    afterBundling: () => [],
                },
                format: lambdaNode.OutputFormat.ESM,
            },
            runtime: lambda.Runtime.NODEJS_18_X,
            timeout: cdk.Duration.minutes(5),
            handler: 'handler',
            memorySize: 1024,
            role: this.executionRole,
            environment: {
                DATABASE_URL_SECRET_ARN: this.databaseUrl.secretArn,
            },
        });

        new triggers.Trigger(this, 'Triggers-DatabaseMigrator', {
            handler: this.migrationLambda,
            invocationType: triggers.InvocationType.EVENT,
        });
    }

    setupApiLambda() {
        this.apiLambda = new lambdaNode.NodejsFunction(this, 'Lambda-SnippetsApi', {
            functionName: 'SnippetsBackendApi',
            depsLockFilePath: path.resolve(__dirname, '../../../backend-lambda/package-lock.json'),
            entry: path.resolve(__dirname, '../../../backend-lambda/functions/snippets-api/index.ts'),
            bundling: {
                nodeModules: ['prisma', '@prisma/client', 'lambda-api'],
                commandHooks: {
                    beforeInstall: (inputDir, outputDir) => [
                        `mkdir ${outputDir}/prisma`,
                        `cp ${inputDir}/prisma/schema.prisma ${outputDir}/prisma`,
                    ],
                    beforeBundling: () => [],
                    afterBundling: () => [],
                },
                format: lambdaNode.OutputFormat.ESM,
            },
            runtime: lambda.Runtime.NODEJS_18_X,
            timeout: cdk.Duration.minutes(5),
            handler: 'handler',
            memorySize: 1024,
            role: this.executionRole,
            environment: {
                DATABASE_URL_SECRET_ARN: this.databaseUrl.secretArn,
            },
        });
    }

    setupApiGateway() {
        this.apiGateway = new apigateway.LambdaRestApi(this, 'ApiGateway-SnippetsApi', {
            handler: this.apiLambda,
            proxy: false,
            restApiName: 'SnippetsBackendApi',
        });

        const snippets = this.apiGateway.root.addResource('snippets');
        snippets.addMethod('POST');

        const snippet = snippets.addResource('{hash}');
        snippet.addMethod('GET');
    }
}
