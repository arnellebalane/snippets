#!/usr/bin/env node
import * as dotenv from 'dotenv';
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CertificateStack } from '../stacks/CertificateStack';
import { SnippetsSharedStack } from '../stacks/SnippetsSharedStack';
import { SnippetsBackendStack } from '../stacks/SnippetsBackendStack';
import { FrontendStack } from '../stacks/FrontendStack';
import { BackendStack } from '../stacks/BackendStack';

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

new BackendStack(app, 'SnippetsBackendStack', props);
// const shared = new SnippetsSharedStack(app, 'SnippetsSharedStack', { env });

// new SnippetsBackendStack(app, 'SnippetsBackendStack', {
//   env,
//   vpc: shared.vpc,
// });

// new SnippetsFrontendStack(app, 'SnippetsFrontendStack', {
//   env,
//   vpc: shared.vpc,
// });
