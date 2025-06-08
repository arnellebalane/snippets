#!/usr/bin/env node
import { App } from 'aws-cdk-lib';
import * as dotenv from 'dotenv';
import { CertificateStack } from '../stacks/CertificateStack';
import { FrontendStack } from '../stacks/FrontendStack';

dotenv.config();
const app = new App();

const certificateStack = new CertificateStack(app, 'SnippetsCertificateStack', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: 'us-east-1',
    },
    crossRegionReferences: true,
});

const frontendStack = new FrontendStack(app, 'SnippetsFrontendStack', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: 'ap-southeast-1',
    },
    crossRegionReferences: true,
    certificate: certificateStack.certificate,
});
frontendStack.addDependency(certificateStack);
