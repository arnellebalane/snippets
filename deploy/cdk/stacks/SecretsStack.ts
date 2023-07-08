import * as cdk from 'aws-cdk-lib';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';

export class SecretsStack extends cdk.Stack {
    databaseUrl: secretsmanager.Secret;

    constructor(scope: Construct, id: string, props: cdk.StackProps) {
        super(scope, id, props);

        this.databaseUrl = new secretsmanager.Secret(this, 'Secret-DatabaseUrl', {
            secretName: 'SnippetsDatabaseUrl',
        });
    }
}
