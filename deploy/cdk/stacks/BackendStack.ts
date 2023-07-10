import * as path from 'node:path';
import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaNode from 'aws-cdk-lib/aws-lambda-nodejs';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as triggers from 'aws-cdk-lib/triggers';
import { Construct } from 'constructs';

interface BackendStackProps extends cdk.StackProps {
    databaseUrl: secretsmanager.Secret;
}

export class BackendStack extends cdk.Stack {
    prismaLayer: lambda.LayerVersion;
    migrationsLayer: lambda.LayerVersion;
    databaseUrl: secretsmanager.Secret;

    executionRole: iam.Role;
    migrationLambda: lambdaNode.NodejsFunction;
    apiLambda: lambdaNode.NodejsFunction;

    constructor(scope: Construct, id: string, props: BackendStackProps) {
        super(scope, id, props);

        this.databaseUrl = props.databaseUrl;
        this.setupPrismaLayer();
        this.setupMigrationsLayer();
        this.setupExecutionRole();
        this.setupMigrationLambda();
        this.setupApiLambda();
    }

    setupPrismaLayer() {
        this.prismaLayer = new lambda.LayerVersion(this, 'Lambda-PrismaLayer', {
            layerVersionName: 'SnippetsBackendPrismaLayer',
            compatibleArchitectures: [lambda.Architecture.X86_64],
            compatibleRuntimes: [lambda.Runtime.NODEJS_18_X],
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            code: lambda.Code.fromAsset(
                path.resolve(__dirname, '../../../backend-lambda/functions/migrate-database/layer'),
                {
                    bundling: {
                        image: lambda.Runtime.NODEJS_18_X.bundlingImage,
                        command: [
                            'bash',
                            '-c',
                            [
                                'PRISMA_CLI_BINARY_TARGETS=rhel-openssl-1.0.x npm ci',
                                'mkdir -p /asset-output/nodejs',
                                'cp -r node_modules /asset-output/nodejs',
                            ].join(' && '),
                        ],
                        environment: {
                            NPM_CONFIG_CACHE: '/tmp/npm-cache',
                        },
                    },
                }
            ),
        });
    }

    setupMigrationsLayer() {
        this.migrationsLayer = new lambda.LayerVersion(this, 'Lambda-MigrationsLayer', {
            layerVersionName: 'SnippetsBackendMigrationsLayer',
            compatibleArchitectures: [lambda.Architecture.X86_64],
            compatibleRuntimes: [lambda.Runtime.NODEJS_18_X],
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            code: lambda.Code.fromAsset(path.resolve(__dirname, '../../../backend-lambda'), {
                bundling: {
                    image: lambda.Runtime.NODEJS_18_X.bundlingImage,
                    command: ['bash', '-c', 'cp -r prisma /asset-output'],
                },
            }),
        });
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
            runtime: lambda.Runtime.NODEJS_18_X,
            timeout: cdk.Duration.minutes(5),
            handler: 'handler',
            memorySize: 1024,
            role: this.executionRole,
            layers: [this.prismaLayer, this.migrationsLayer],
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
            runtime: lambda.Runtime.NODEJS_18_X,
            timeout: cdk.Duration.minutes(5),
            handler: 'handler',
            memorySize: 1024,
            role: this.executionRole,
            environment: {
                DATABASE_URL_SECRET_ARN: this.databaseUrl.secretArn,
            },
        });

        this.apiLambda.addFunctionUrl({
            authType: lambda.FunctionUrlAuthType.NONE,
            cors: {
                allowedOrigins: ['*'],
            },
        });
    }
}
