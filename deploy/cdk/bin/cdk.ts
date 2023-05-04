#!/usr/bin/env node
import * as dotenv from 'dotenv';
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { SnippetsBackendStack } from '../lib/SnippetsBackendStack';
import { SnippetsFrontendStack } from '../lib/SnippetsFrontendStack';

dotenv.config();
const app = new cdk.App();

const backend = new SnippetsBackendStack(app, 'SnippetsBackendStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

new SnippetsFrontendStack(app, 'SnippetsFrontendStack', {
  vpc: backend.vpc,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
