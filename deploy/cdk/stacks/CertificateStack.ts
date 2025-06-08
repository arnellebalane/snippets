import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Certificate, CertificateValidation } from 'aws-cdk-lib/aws-certificatemanager';
import { Construct } from 'constructs';

export class CertificateStack extends Stack {
    certificate: Certificate;

    constructor(scope: Construct, id: string, props: StackProps) {
        super(scope, id, props);

        this.certificate = this.createCertificate();
    }

    private createCertificate() {
        if (!process.env.SNIPPETS_CLIENT_URL) {
            throw new Error('Environment variable "SNIPPETS_CLIENT_URL" is not defined.');
        }

        return new Certificate(this, 'FrontendCertificate', {
            domainName: new URL(process.env.SNIPPETS_CLIENT_URL).hostname,
            certificateName: 'SnippetsFrontendCertificate',
            validation: CertificateValidation.fromDns(),
        });
    }
}
