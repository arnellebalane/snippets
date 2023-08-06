import * as path from 'node:path';
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3Assets from 'aws-cdk-lib/aws-s3-assets';
import * as s3Deployment from 'aws-cdk-lib/aws-s3-deployment';
import * as s3Notifications from 'aws-cdk-lib/aws-s3-notifications';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaNode from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apiGateway from 'aws-cdk-lib/aws-apigateway';
import * as customResources from 'aws-cdk-lib/custom-resources';
import * as synthetics from '@aws-cdk/aws-synthetics-alpha';
import { Construct } from 'constructs';

interface FrontendStackProps extends cdk.StackProps {
    certificate: acm.Certificate;
    backendApiGateway: apiGateway.LambdaRestApi;
}

export class FrontendStack extends cdk.Stack {
    asset: s3Assets.Asset;
    bucket: s3.Bucket;
    deployment: s3Deployment.BucketDeployment;

    certificate: acm.Certificate;
    backendApiGateway: apiGateway.LambdaRestApi;
    distribution: cloudfront.CloudFrontWebDistribution;
    distributionInvalidation: customResources.AwsCustomResource;
    distributionLoggingBucket: s3.Bucket;
    originAccessControl: cloudfront.CfnOriginAccessControl;

    logGroup: logs.LogGroup;
    executionRole: iam.Role;
    lambda: lambdaNode.NodejsFunction;

    canary: synthetics.Canary;

    constructor(scope: Construct, id: string, props: FrontendStackProps) {
        super(scope, id, props);

        this.certificate = props.certificate;
        this.backendApiGateway = props.backendApiGateway;

        this.setupBucketDeployment();
        this.setupLoggingBucket();
        this.setupDistribution();
        this.setupDistributionInvalidation();
        this.setupOriginAccessControl();

        // Forward access logs from S3 log bucket to CloudWatch
        this.setupLogGroup();
        this.setupLambdaExecutionRole();
        this.setupLambda();
        this.setupLoggingBucketEventNotifications();

        // Monitor app availability
        this.setupCanary();
    }

    private getDistributionDefaultOrigin() {
        return {
            behaviors: [
                {
                    allowedMethods: cloudfront.CloudFrontAllowedMethods.ALL,
                    isDefaultBehavior: true,
                    // TODO: Using HTTPS_ONLY currently returns an 403 response from CloudFront, and
                    // REDIRECT_TO_HTTPS causes a redirect loop to the same URL.
                    viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.ALLOW_ALL,
                },
            ],
            s3OriginSource: {
                s3BucketSource: this.deployment.deployedBucket,
            },
        };
    }

    private getDistributionApiOrigin() {
        // https://github.com/awslabs/aws-solutions-constructs/blob/09465d65fc5969da5691cf5057c278ded8753b43/source/patterns/%40aws-solutions-constructs/core/lib/cloudfront-distribution-defaults.ts#L38-L39
        const apiEndpointUrlWithoutProtocol = cdk.Fn.select(1, cdk.Fn.split('://', this.backendApiGateway.url));
        const apiEndpointDomainName = cdk.Fn.select(0, cdk.Fn.split('/', apiEndpointUrlWithoutProtocol));

        return {
            behaviors: [
                {
                    pathPattern: '/api/*',
                    allowedMethods: cloudfront.CloudFrontAllowedMethods.ALL,
                    viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.ALLOW_ALL,
                },
            ],
            customOriginSource: {
                domainName: apiEndpointDomainName,
                originPath: `/${this.backendApiGateway.deploymentStage.stageName}`,
            },
        };
    }

    setupBucketDeployment() {
        this.asset = new s3Assets.Asset(this, 'S3-Assets', {
            path: path.resolve(__dirname, '../../../frontend'),
            bundling: {
                image: cdk.DockerImage.fromRegistry('node:18.15.0-slim'),
                user: 'node',
                command: [
                    'bash',
                    '-c',
                    ['npm ci', 'npm run build', 'cp -r /asset-input/dist/* /asset-output/'].join(' && '),
                ],
            },
        });

        this.bucket = new s3.Bucket(this, 'S3-Bucket', {
            bucketName: 'snippets-frontend',
            autoDeleteObjects: true,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            versioned: true,
        });

        this.deployment = new s3Deployment.BucketDeployment(this, 'S3-Deployment', {
            sources: [s3Deployment.Source.bucket(this.asset.bucket, this.asset.s3ObjectKey)],
            destinationBucket: this.bucket,
        });
    }

    setupLoggingBucket() {
        this.distributionLoggingBucket = new s3.Bucket(this, 'S3-LoggingBucket', {
            bucketName: 'snippets-frontend-logs',
            autoDeleteObjects: false,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_PREFERRED,
            lifecycleRules: [
                {
                    id: 'DeleteObjectsAfterThirtyDays',
                    enabled: true,
                    expiration: cdk.Duration.days(30),
                },
            ],
        });
    }

    setupDistribution() {
        let domainName;
        if (process.env.SNIPPETS_CLIENT_URL) {
            const url = new URL(process.env.SNIPPETS_CLIENT_URL);
            domainName = url.hostname;
        }

        this.distribution = new cloudfront.CloudFrontWebDistribution(this, 'CF-Distribution', {
            originConfigs: [this.getDistributionDefaultOrigin(), this.getDistributionApiOrigin()],
            loggingConfig: {
                bucket: this.distributionLoggingBucket,
                prefix: 'snippets-frontend',
            },
            defaultRootObject: 'index.html',
            errorConfigurations: [403, 404].map((errorCode) => ({
                errorCode,
                responseCode: 200,
                responsePagePath: '/index.html',
                errorCachingMinTtl: 0,
            })),
            viewerCertificate: this.certificate
                ? cloudfront.ViewerCertificate.fromAcmCertificate(this.certificate, {
                      aliases: domainName ? [domainName] : [],
                      securityPolicy: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
                  })
                : undefined,
        });

        new cdk.CfnOutput(this, 'DistributionDomainName', {
            value: this.distribution.distributionDomainName,
        });
        if (domainName) {
            new cdk.CfnOutput(this, 'FrontendEndpoint', {
                value: domainName,
            });
        }
    }

    setupDistributionInvalidation() {
        const timestamp = Date.now().toString();
        const distributionId = this.distribution.distributionId;

        this.distributionInvalidation = new customResources.AwsCustomResource(this, `CF-Invalidation-${timestamp}`, {
            functionName: 'SnippetsFrontendDistributionInvalidator',
            onCreate: {
                service: 'CloudFront',
                action: 'createInvalidation',
                parameters: {
                    DistributionId: distributionId,
                    InvalidationBatch: {
                        CallerReference: timestamp,
                        Paths: {
                            Quantity: 1,
                            Items: ['/*'],
                        },
                    },
                },
                physicalResourceId: customResources.PhysicalResourceId.of(`${distributionId}-${timestamp}`),
            },
            policy: customResources.AwsCustomResourcePolicy.fromSdkCalls({
                resources: customResources.AwsCustomResourcePolicy.ANY_RESOURCE,
            }),
        });
    }

    setupOriginAccessControl() {
        // https://github.com/aws/aws-cdk/issues/21771#issuecomment-1281190832
        this.originAccessControl = new cloudfront.CfnOriginAccessControl(this, 'CF-OriginAccessControl', {
            originAccessControlConfig: {
                name: 'SnippetsOriginAccessControl',
                originAccessControlOriginType: 's3',
                signingBehavior: 'always',
                signingProtocol: 'sigv4',
            },
        });
        this.originAccessControl.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

        const distribution = this.distribution.node.defaultChild as cloudfront.CfnDistribution;
        distribution.addPropertyOverride(
            'DistributionConfig.Origins.0.OriginAccessControlId',
            this.originAccessControl.attrId
        );

        const oacPolicy = new iam.PolicyStatement({
            actions: ['s3:GetObject'],
            resources: [this.bucket.arnForObjects('*')],
            principals: [new iam.ServicePrincipal('cloudfront.amazonaws.com')],
        });
        oacPolicy.addCondition('StringEquals', {
            'AWS:SourceArn': cdk.Arn.format(
                {
                    region: '',
                    service: 'cloudfront',
                    resource: 'distribution',
                    resourceName: this.distribution.distributionId,
                },
                this
            ),
        });
        this.bucket.addToResourcePolicy(oacPolicy);
    }

    setupLogGroup() {
        this.logGroup = new logs.LogGroup(this, 'CW-LogGroup', {
            logGroupName: 'SnippetsFrontendAccessLogs',
        });

        const metricNamespace = 'CloudFrontHttpRequests';
        this.logGroup.addMetricFilter('AllRequestsFilter', {
            filterPattern: {
                logPatternString: '{$.cs-uri-stem != ""}',
            },
            metricNamespace,
            metricName: 'AllRequestsCount',
            metricValue: '1',
            unit: cloudwatch.Unit.COUNT,
        });
        this.logGroup.addMetricFilter('FrontendRequestsFilter', {
            filterPattern: {
                logPatternString: '{$.cs-uri-stem != "/api/*"}',
            },
            metricNamespace,
            metricName: 'FrontendRequestsCount',
            metricValue: '1',
            unit: cloudwatch.Unit.COUNT,
        });
        this.logGroup.addMetricFilter('ApiRequestsFilter', {
            filterPattern: {
                logPatternString: '{$.cs-uri-stem = "/api/*"}',
            },
            metricNamespace,
            metricName: 'ApiRequestsCount',
            metricValue: '1',
            unit: cloudwatch.Unit.COUNT,
        });
    }

    setupLambdaExecutionRole() {
        this.executionRole = new iam.Role(this, 'IAM-LambdaExecutionRole', {
            roleName: 'SnippetsFrontendAccessLogsForwarderLambdaExecutionRole',
            assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
            inlinePolicies: {
                AllowGetAccessLogObjectsPolicy: new iam.PolicyDocument({
                    statements: [
                        new iam.PolicyStatement({
                            actions: ['s3:GetObject'],
                            resources: [this.distributionLoggingBucket.arnForObjects('*')],
                        }),
                    ],
                }),
            },
        });
        this.executionRole.addManagedPolicy(
            iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')
        );
    }

    setupLambda() {
        this.lambda = new lambdaNode.NodejsFunction(this, 'Lambda-AccessLogsForwarder', {
            functionName: 'SnippetsFrontendAccessLogsForwarder',
            entry: path.join(__dirname, '../functions/cloudfront-logs-forwarder/index.ts'),
            runtime: lambda.Runtime.NODEJS_18_X,
            timeout: cdk.Duration.minutes(5),
            handler: 'handler',
            memorySize: 1024,
            role: this.executionRole,
            environment: {
                CLOUDWATCH_LOG_GROUP_NAME: this.logGroup.logGroupName,
            },
        });
    }

    setupLoggingBucketEventNotifications() {
        this.distributionLoggingBucket.addEventNotification(
            s3.EventType.OBJECT_CREATED_PUT,
            new s3Notifications.LambdaDestination(this.lambda),
            {
                prefix: 'snippets-frontend/',
            }
        );
    }

    setupCanary() {
        this.canary = new synthetics.Canary(this, 'Synthetics-HeartbeatCanary', {
            canaryName: 'snippets-heartbeat',
            runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_4_0,
            schedule: synthetics.Schedule.rate(cdk.Duration.minutes(15)),
            test: synthetics.Test.custom({
                code: synthetics.Code.fromAsset(path.join(__dirname, '../functions/heartbeat-canary')),
                handler: 'index.handler',
            }),
            artifactsBucketLocation: {
                bucket: this.distributionLoggingBucket,
                prefix: 'heartbeat-canary',
            },
            environmentVariables: {
                SNIPPETS_CLIENT_URL: process.env.SNIPPETS_CLIENT_URL || '',
                SNIPPETS_SEED_HASH: process.env.SNIPPETS_SEED_HASH || '',
                SNIPPETS_SEED_BODY: process.env.SNIPPETS_SEED_BODY || '',
            },
        });
    }
}
