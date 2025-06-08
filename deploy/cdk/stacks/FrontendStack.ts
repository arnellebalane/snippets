import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import {
    AllowedMethods,
    CachePolicy,
    Distribution,
    Function,
    FunctionCode,
    FunctionEventType,
    FunctionRuntime,
    ViewerProtocolPolicy,
} from 'aws-cdk-lib/aws-cloudfront';
import { HttpOrigin, S3BucketOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { BlockPublicAccess, Bucket } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';
import path from 'node:path';

interface FrontendStackProps extends StackProps {
    certificate: Certificate;
}

export class FrontendStack extends Stack {
    certificate: Certificate;
    bucket: Bucket;
    distribution: Distribution;

    constructor(scope: Construct, id: string, props: FrontendStackProps) {
        super(scope, id, props);

        this.certificate = props.certificate;

        this.bucket = this.createBucket();
        this.distribution = this.createDistribution();
        this.uploadBucketContents();
    }

    private createBucket() {
        return new Bucket(this, 'Bucket', {
            bucketName: 'snippets-frontend',
            autoDeleteObjects: true,
            blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
            removalPolicy: RemovalPolicy.DESTROY,
            versioned: true,
        });
    }

    private createDistribution() {
        if (!process.env.SNIPPETS_CLIENT_URL) {
            throw new Error('Environment variable "SNIPPETS_CLIENT_URL" is not defined.');
        }
        if (!process.env.SNIPPETS_API_URL) {
            throw new Error('Environment variable "SNIPPETS_API_URL" is not defined.');
        }

        return new Distribution(this, 'Distribution', {
            domainNames: [new URL(process.env.SNIPPETS_CLIENT_URL).hostname],
            certificate: this.certificate,
            defaultBehavior: {
                origin: S3BucketOrigin.withOriginAccessControl(this.bucket),
                viewerProtocolPolicy: ViewerProtocolPolicy.HTTPS_ONLY,
                allowedMethods: AllowedMethods.ALLOW_GET_HEAD,
                cachePolicy: CachePolicy.CACHING_OPTIMIZED,
                functionAssociations: [
                    {
                        eventType: FunctionEventType.VIEWER_REQUEST,
                        function: new Function(this, 'EdgeFunction', {
                            code: FunctionCode.fromInline(`
                                function handler(event) {
                                    const request = event.request;
                                    const lastSegment = request.uri.split('/').pop();
                                    const hasExtension = !request.uri.endsWith('/') && lastSegment.includes('.');
                                    if (!hasExtension) {
                                        request.uri = '/';
                                    }
                                    return request;
                                }
                            `),
                            runtime: FunctionRuntime.JS_2_0,
                        }),
                    },
                ],
            },
            additionalBehaviors: {
                '/api/*': {
                    origin: new HttpOrigin(new URL(process.env.SNIPPETS_API_URL).hostname),
                    viewerProtocolPolicy: ViewerProtocolPolicy.HTTPS_ONLY,
                    allowedMethods: AllowedMethods.ALLOW_ALL,
                },
            },
            defaultRootObject: 'index.html',
        });
    }

    private uploadBucketContents() {
        const deploymentId = new Date().getTime();

        new BucketDeployment(this, `BucketDeployment:${deploymentId}`, {
            sources: [Source.asset(path.join(__dirname, '../../../frontend/dist'))],
            destinationBucket: this.bucket,
            distribution: this.distribution,
        });
    }
}
