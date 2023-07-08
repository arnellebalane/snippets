import * as path from 'node:path';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

export class BackendStack extends cdk.Stack {
    layer: lambda.LayerVersion;

    constructor(scope: Construct, id: string, props: cdk.StackProps) {
        super(scope, id, props);

        this.setupLayer();
    }

    setupLayer() {
        this.layer = new lambda.LayerVersion(this, 'Lambda-PrismaLayer', {
            layerVersionName: 'SnippetsBackendPrismaLayer',
            compatibleArchitectures: [lambda.Architecture.X86_64],
            compatibleRuntimes: [lambda.Runtime.NODEJS_18_X],
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            code: lambda.Code.fromAsset(
                path.resolve(__dirname, '../../../backend-lambda/functions/migrate-database/layer'),
                {
                    bundling: {
                        image: lambda.Runtime.NODEJS_18_X.bundlingImage,
                        command: [
                            'bash',
                            '-c',
                            [
                                'PRISMA_CLI_BINARY_TARGETS=rhel-openssl-1.0.x npm ci',
                                'mkdir -p /asset-output/nodejs',
                                'mv node_modules /asset-output/nodejs',
                            ].join(' && '),
                        ],
                        environment: {
                            NPM_CONFIG_CACHE: '/tmp/npm-cache',
                        },
                    },
                }
            ),
        });
    }
}
