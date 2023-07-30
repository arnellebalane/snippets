import * as cdk from 'aws-cdk-lib';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import { Construct } from 'constructs';

export class CertificateStack extends cdk.Stack {
    frontendCertificate: acm.Certificate;
    backendCertificate: acm.Certificate;

    constructor(scope: Construct, id: string, props: cdk.StackProps) {
        super(scope, id, {
            ...props,
            env: {
                ...props.env,
                region: 'us-east-1',
            },
        });

        this.setupFrontendCertificate();
    }

    setupFrontendCertificate() {
        if (process.env.SNIPPETS_CLIENT_URL) {
            const url = new URL(process.env.SNIPPETS_CLIENT_URL);

            this.frontendCertificate = new acm.Certificate(this, 'FrontendCertificate', {
                domainName: url.hostname,
                certificateName: 'SnippetsFrontendCertificate',
                validation: acm.CertificateValidation.fromDns(),
            });

            new cdk.CfnOutput(this, 'FrontendCertificateArn', {
                value: this.frontendCertificate.certificateArn,
            });
        }
    }
}
