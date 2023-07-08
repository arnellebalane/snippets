import { promisify } from 'node:util';
import { exec as _exec } from 'node:child_process';

// https://stackoverflow.com/a/72157907
process.env.NPM_CONFIG_CACHE = '/tmp/npm-cache';

const exec = promisify(_exec);

export const handler = async () => {
    await exec('node /opt/nodejs/node_modules/prisma/build/index.js migrate deploy');
};
