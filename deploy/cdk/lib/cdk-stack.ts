import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as rds from 'aws-cdk-lib/aws-rds';
import { Construct } from 'constructs';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const appName = 'snippets';

    const vpc = new ec2.Vpc(this, 'VPC', {});

    const secret = new secretsmanager.Secret(this, 'PostgresCredentials', {
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: 'postgres' }),
        generateStringKey: 'password',
        excludePunctuation: true,
        passwordLength: 32,
      },
    });

    const database = new rds.DatabaseInstance(this, 'PostgresInstance', {
      engine: rds.DatabaseInstanceEngine.POSTGRES,
      databaseName: appName,
      instanceIdentifier: appName,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MICRO),
      credentials: {
        username: secret.secretValueFromJson('username').unsafeUnwrap(),
        password: secret.secretValueFromJson('password'),
      },
      multiAz: false,
      vpc,
    });
  }
}
