import { promisify } from 'node:util';
import { exec as _exec } from 'node:child_process';
import { PrismaClient } from '@prisma/client';
import { Handler } from 'aws-lambda';
import { loadSecretsToEnvironment } from '../../utils/env';

await loadSecretsToEnvironment();
const exec = promisify(_exec);
const prisma = new PrismaClient();

export const handler: Handler = async () => {
    // https://github.com/prisma/prisma/issues/15881#issuecomment-1289420222
    await exec('node node_modules/prisma/build/index.js migrate deploy');

    // Create test record if it doesn't exist yet
    const hash = process.env.SNIPPETS_SEED_HASH;
    const body = process.env.SNIPPETS_SEED_BODY;
    await prisma.snippet.upsert({
        where: { hash },
        create: { hash, body },
        update: {},
    });
};
