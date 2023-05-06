#!/usr/bin/env node
import * as dotenv from 'dotenv';
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { SnippetsSharedStack } from '../lib/SnippetsSharedStack';
import { SnippetsBackendStack } from '../lib/SnippetsBackendStack';
import { SnippetsFrontendStack } from '../lib/SnippetsFrontendStack';

dotenv.config();
const app = new cdk.App();

const env: cdk.Environment = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const shared = new SnippetsSharedStack(app, 'SnippetsSharedStack', { env });

new SnippetsBackendStack(app, 'SnippetsBackendStack', {
  env,
  vpc: shared.vpc,
});

new SnippetsFrontendStack(app, 'SnippetsFrontendStack', {
  env,
  vpc: shared.vpc,
});
