import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3assets from 'aws-cdk-lib/aws-s3-assets';
import * as s3deployment from 'aws-cdk-lib/aws-s3-deployment';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

interface FrontendStackProps extends cdk.StackProps {
    certificate: acm.Certificate;
}

export class FrontendStack extends cdk.Stack {
    asset: s3assets.Asset;
    bucket: s3.Bucket;
    deployment: s3deployment.BucketDeployment;

    certificate: acm.Certificate;
    distribution: cloudfront.CloudFrontWebDistribution;
    distributionLoggingBucket: s3.Bucket;
    originAccessControl: cloudfront.CfnOriginAccessControl;

    constructor(scope: Construct, id: string, props: FrontendStackProps) {
        super(scope, id, props);

        this.certificate = props.certificate;
        this.setupBucketDeployment();
        this.setupLoggingBucket();
        this.setupDistribution();
        this.setupOriginAccessControl();
    }

    setupBucketDeployment() {
        this.asset = new s3assets.Asset(this, 'S3-Assets', {
            path: path.resolve(__dirname, '../../../frontend-react'),
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

        this.deployment = new s3deployment.BucketDeployment(this, 'S3-Deployment', {
            sources: [s3deployment.Source.bucket(this.asset.bucket, this.asset.s3ObjectKey)],
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
            originConfigs: [
                {
                    behaviors: [
                        {
                            allowedMethods: cloudfront.CloudFrontAllowedMethods.ALL,
                            isDefaultBehavior: true,
                        },
                    ],
                    s3OriginSource: {
                        s3BucketSource: this.deployment.deployedBucket,
                    },
                },
            ],
            loggingConfig: {
                bucket: this.distributionLoggingBucket,
                prefix: 'snippets-frontend',
            },
            defaultRootObject: 'index.html',
            viewerCertificate: this.certificate
                ? cloudfront.ViewerCertificate.fromAcmCertificate(this.certificate, {
                      aliases: domainName ? [domainName] : [],
                      securityPolicy: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
                  })
                : undefined,
            // TODO: Using HTTPS_ONLY currently returns an 403 response from CloudFront, and REDIRECT_TO_HTTPS causes
            // a redirect loop to the same URL.
            viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.ALLOW_ALL,
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
}
