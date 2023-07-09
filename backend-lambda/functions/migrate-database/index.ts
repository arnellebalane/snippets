import { promisify } from 'node:util';
import { exec as _exec } from 'node:child_process';
import middy from '@middy/core';
import secretsManager from '@middy/secrets-manager';

const exec = promisify(_exec);

export const handler = middy(async (event, context) => {
    // https://stackoverflow.com/a/72157907
    process.env.NPM_CONFIG_CACHE = '/tmp/npm-cache';
    process.env.DATABASE_URL = context.DATABASE_URL;

    // Prisma CLI binaries and migration files are provided via Lambda layers.
    // https://medium.com/ama-tech-blog/deploying-prisma-with-aws-lambda-layers-in-cdk-10608f5598c5
    await exec('node /opt/nodejs/node_modules/prisma/build/index.js migrate deploy --schema /opt/prisma/schema.prisma');
}).use(
    secretsManager({
        fetchData: {
            DATABASE_URL: process.env.DATABASE_URL_SECRET_ARN,
        },
        setToContext: true,
    })
);
