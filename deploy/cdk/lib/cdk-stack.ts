import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as ecr_assets from 'aws-cdk-lib/aws-ecr-assets';
import * as ecr_deployment from 'cdk-ecr-deployment';
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
      publiclyAccessible: true,
      vpc,
    });

    const backendRepository = new ecr.Repository(this, 'SnippetsBackendRepository', {
      repositoryName: 'snippets-backend',
      autoDeleteImages: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    const backendImage = new ecr_assets.DockerImageAsset(this, 'SnippetsBackendDockerImage', {
      directory: path.resolve(__dirname, '../../../backend'),
      file: 'deploy/Dockerfile',
    });
    new ecr_deployment.ECRDeployment(this, 'SnippetsBackendDeployment', {
      src: new ecr_deployment.DockerImageName(backendImage.imageUri),
      dest: new ecr_deployment.DockerImageName(`${backendRepository.repositoryUri}:latest`),
    });
  }
}
