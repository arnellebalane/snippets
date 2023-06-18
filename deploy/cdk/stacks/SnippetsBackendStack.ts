import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as ecr_assets from 'aws-cdk-lib/aws-ecr-assets';
import * as ecr_deployment from 'cdk-ecr-deployment';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as elb from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import { Construct } from 'constructs';
import { SnippetsStackProps } from '../types/types';

export class SnippetsBackendStack extends cdk.Stack {
  vpc: ec2.Vpc;
  vpcSecurityGroup: ec2.ISecurityGroup;

  database: rds.DatabaseInstance;
  databaseCredentials: secretsmanager.Secret;

  repository: ecr.Repository;
  image: ecr_assets.DockerImageAsset;

  taskDefinition: ecs.TaskDefinition;
  container: ecs.ContainerDefinition;
  cluster: ecs.Cluster;
  service: ecs.FargateService;

  certificate: acm.Certificate;
  targetGroup: elb.ApplicationTargetGroup;
  loadBalancer: elb.ApplicationLoadBalancer;

  constructor(scope: Construct, id: string, props: SnippetsStackProps) {
    super(scope, id, props);

    this.vpc = props.vpc;

    this.setupVpc();
    this.setupDatabase();
    this.setupRepository();
    this.setupTaskDefinition();
    this.setupContainer();
    this.setupTargetGroup();
    this.setupService();
    this.setupCertificate();
    this.setupLoadBalancer();
  }

  setupVpc() {
    this.vpcSecurityGroup = ec2.SecurityGroup.fromSecurityGroupId(
      this,
      'VPC-SecurityGroup',
      this.vpc.vpcDefaultSecurityGroup
    );
  }

  setupDatabase() {
    this.databaseCredentials = new secretsmanager.Secret(this, 'Secret-PostgresCredentials', {
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: 'postgres' }),
        generateStringKey: 'password',
        excludePunctuation: true,
        passwordLength: 32,
      },
    });

    this.database = new rds.DatabaseInstance(this, 'RDS-PostgresInstance', {
      engine: rds.DatabaseInstanceEngine.POSTGRES,
      databaseName: 'snippets',
      instanceIdentifier: 'snippets',
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MICRO),
      credentials: {
        username: this.databaseCredentials.secretValueFromJson('username').unsafeUnwrap(),
        password: this.databaseCredentials.secretValueFromJson('password'),
      },
      multiAz: false,
      vpc: this.vpc,
    });

    this.database.connections.allowDefaultPortInternally();
  }

  setupRepository() {
    this.repository = new ecr.Repository(this, 'ECR-Repository', {
      repositoryName: 'snippets-backend',
      autoDeleteImages: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    this.image = new ecr_assets.DockerImageAsset(this, 'ECR-DockerImage', {
      directory: path.resolve(__dirname, '../../../backend'),
      file: 'deploy/Dockerfile',
    });

    new ecr_deployment.ECRDeployment(this, 'ECR-Deployment', {
      src: new ecr_deployment.DockerImageName(this.image.imageUri),
      dest: new ecr_deployment.DockerImageName(`${this.repository.repositoryUri}:latest`),
    });
  }

  setupTaskDefinition() {
    const executionRole = new iam.Role(this, 'ECS-ExecutionRole', {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
    });
    executionRole.addManagedPolicy({
      managedPolicyArn: 'arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy',
    });

    this.taskDefinition = new ecs.TaskDefinition(this, 'ECS-TaskDefinition', {
      family: 'SnippetsBackendTaskDefinition',
      compatibility: ecs.Compatibility.FARGATE,
      cpu: '512',
      memoryMiB: '1024',
      executionRole,
    });
  }

  setupContainer() {
    this.container = this.taskDefinition.addContainer('ECS-Container', {
      containerName: 'snippets-backend',
      image: ecs.ContainerImage.fromRegistry(`${this.repository.repositoryUri}:latest`),
      environment: {
        DATABASE_HOST: this.database.dbInstanceEndpointAddress,
        DATABASE_PORT: this.database.dbInstanceEndpointPort,
        DATABASE_NAME: 'postgres',
      },
      secrets: {
        DATABASE_USERNAME: ecs.Secret.fromSecretsManager(this.databaseCredentials, 'username'),
        DATABASE_PASSWORD: ecs.Secret.fromSecretsManager(this.databaseCredentials, 'password'),
      },
      logging: ecs.LogDriver.awsLogs({
        streamPrefix: 'ecs-snippets-backend',
        logRetention: logs.RetentionDays.ONE_WEEK,
      }),
    });
    this.container.addPortMappings({
      containerPort: 3000,
      protocol: ecs.Protocol.TCP,
    });
  }

  setupTargetGroup() {
    this.targetGroup = new elb.ApplicationTargetGroup(this, 'ELB-TargetGroup', {
      targetType: elb.TargetType.IP,
      targetGroupName: 'SnippetsBackendTargetGroup',
      protocol: elb.ApplicationProtocol.HTTP,
      vpc: this.vpc,
    });
  }

  setupService() {
    this.cluster = new ecs.Cluster(this, 'ECS-Cluster', {
      clusterName: 'SnippetsBackendCluster',
      vpc: this.vpc,
    });

    this.service = new ecs.FargateService(this, 'ECS-Service', {
      serviceName: 'SnippetsBackendService',
      cluster: this.cluster,
      taskDefinition: this.taskDefinition,
      desiredCount: 1,
      minHealthyPercent: 0,
      maxHealthyPercent: 100,
      securityGroups: [this.vpcSecurityGroup, ...this.database.connections.securityGroups],
      vpcSubnets: {
        subnets: [...this.vpc.publicSubnets, ...this.vpc.privateSubnets],
      },
    });

    this.targetGroup.addTarget(this.service);
  }

  setupCertificate() {
    let domainName;
    if (process.env.SNIPPETS_SERVER_URL) {
      const url = new URL(process.env.SNIPPETS_SERVER_URL);
      domainName = url.hostname;
    }

    if (domainName) {
      this.certificate = new acm.Certificate(this, 'ACM-Certificate', {
        domainName,
        certificateName: 'SnippetsBackendCertificate',
        validation: acm.CertificateValidation.fromDns(),
      });
    }
  }

  setupLoadBalancer() {
    this.loadBalancer = new elb.ApplicationLoadBalancer(this, 'ELB-LoadBalancer', {
      loadBalancerName: 'SnippetsBackendLoadBalancer',
      internetFacing: true,
      ipAddressType: elb.IpAddressType.IPV4,
      vpc: this.vpc,
      vpcSubnets: {
        subnets: this.vpc.publicSubnets,
      },
      securityGroup: this.vpcSecurityGroup,
    });

    if (this.certificate) {
      this.loadBalancer.addListener('ELB-HttpsListener', {
        protocol: elb.ApplicationProtocol.HTTPS,
        certificates: [this.certificate],
        defaultTargetGroups: [this.targetGroup],
      });
    }
    this.loadBalancer.addListener('ELB-HttpListener', {
      protocol: elb.ApplicationProtocol.HTTP,
      defaultTargetGroups: [this.targetGroup],
    });

    const endpoint = process.env.SNIPPETS_SERVER_URL || this.loadBalancer.loadBalancerDnsName;
    new cdk.CfnOutput(this, 'SnippetsBackendEndpoint', {
      value: endpoint,
      exportName: 'SnippetsBackendEndpoint',
    });
  }
}