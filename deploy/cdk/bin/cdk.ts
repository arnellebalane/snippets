#!/usr/bin/env node
import * as dotenv from 'dotenv';
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CertificateStack } from '../stacks/CertificateStack';
import { FrontendStack } from '../stacks/FrontendStack';

dotenv.config();
const app = new cdk.App();

const props: cdk.StackProps = {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION,
    },
    crossRegionReferences: true,
};

const certificateStack = new CertificateStack(app, 'SnippetsCertificateStack', props);

const frontendStack = new FrontendStack(app, 'SnippetsFrontendStack', {
    ...props,
    certificate: certificateStack.frontendCertificate,
});
frontendStack.addDependency(certificateStack);
