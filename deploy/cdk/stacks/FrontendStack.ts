import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3assets from 'aws-cdk-lib/aws-s3-assets';
import * as s3deployment from 'aws-cdk-lib/aws-s3-deployment';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
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

    constructor(scope: Construct, id: string, props: FrontendStackProps) {
        super(scope, id, props);

        this.certificate = props.certificate;
        this.setupBucketDeployment();
        this.setupDistribution();
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
            defaultRootObject: 'index.html',
            viewerCertificate: this.certificate
                ? cloudfront.ViewerCertificate.fromAcmCertificate(this.certificate, {
                      aliases: domainName ? [domainName] : [],
                  })
                : undefined,
            viewerProtocolPolicy: this.certificate
                ? cloudfront.ViewerProtocolPolicy.HTTPS_ONLY
                : cloudfront.ViewerProtocolPolicy.ALLOW_ALL,
        });

        new cdk.CfnOutput(this, 'FrontendEndpoint', {
            value: this.distribution.distributionDomainName,
        });
    }
}
