import { promisify } from 'node:util';
import { exec as _exec } from 'node:child_process';
import middy from '@middy/core';
import secretsManager from '@middy/secrets-manager';
import { Context, Handler } from 'aws-lambda';

const exec = promisify(_exec);

type CustomContext = Context & { DATABASE_URL: string };

export const handler: Handler = middy(async (event, context: CustomContext) => {
    // https://stackoverflow.com/a/72157907
    process.env.NPM_CONFIG_CACHE = '/tmp/npm-cache';
    process.env.DATABASE_URL = context.DATABASE_URL;
    process.env.DEBUG = 'prisma:*';

    // https://github.com/prisma/prisma/issues/15881#issuecomment-1289420222
    await exec('node node_modules/prisma/build/index.js migrate deploy');
}).use(
    secretsManager({
        fetchData: {
            DATABASE_URL: process.env.DATABASE_URL_SECRET_ARN,
        },
        setToContext: true,
    })
);
