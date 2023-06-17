#!/usr/bin/env node
import * as dotenv from 'dotenv';
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CertificateStack } from '../stacks/CertificateStack';
import { SnippetsSharedStack } from '../stacks/SnippetsSharedStack';
import { SnippetsBackendStack } from '../stacks/SnippetsBackendStack';
import { SnippetsFrontendStack } from '../stacks/SnippetsFrontendStack';
import { SnippetsFrontendReactStack } from '../stacks/SnippetsFrontendReactStack';

dotenv.config();
const app = new cdk.App();

const env: cdk.Environment = {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
};

new CertificateStack(app, 'SnippetsCertificateStack', { env });

// new SnippetsFrontendReactStack(app, 'SnippetsFrontendStack', { env });

// const shared = new SnippetsSharedStack(app, 'SnippetsSharedStack', { env });

// new SnippetsBackendStack(app, 'SnippetsBackendStack', {
//   env,
//   vpc: shared.vpc,
// });

// new SnippetsFrontendStack(app, 'SnippetsFrontendStack', {
//   env,
//   vpc: shared.vpc,
// });
