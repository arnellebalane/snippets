import { promisify } from 'node:util';
import { exec as _exec } from 'node:child_process';
import { Handler } from 'aws-lambda';
import { loadSecretsToEnvironment } from '../../utils/env';

await loadSecretsToEnvironment();
const exec = promisify(_exec);

export const handler: Handler = async () => {
    // https://github.com/prisma/prisma/issues/15881#issuecomment-1289420222
    await exec('node node_modules/prisma/build/index.js migrate deploy');
};
