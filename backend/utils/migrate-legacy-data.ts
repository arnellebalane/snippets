// This is a one-off script that migrates the data from the old database
// managed by Sequelize into the new database models defined by Prisma. A dump
// of the old database was created, and individual records were copied into
// `data/dump.txt`, which is then read by this script and recreated into the
// new database.
//
// To run this script:
// 1. Define the DATABASE_URL environment variable to point to the new database
// 2. If this is a new database, run migrations with npx prisma migrate deploy
// 2. npx ts-node --esm utils/migrate-legacy-data.ts

import * as path from 'node:path';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { PrismaClient } from '@prisma/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

const dataPath = path.resolve(__dirname, '../data/dump.txt');
const contents = readFileSync(dataPath, 'utf-8');

const lines = contents.split(/\r?\n/g);

const records = lines
    .filter((line) => line.trim().length > 0)
    .map((line) => {
        const [hash, body, createdAt, updatedAt] = line.split(/\t/g);
        return {
            hash,
            body: body.replace(/\\n/g, '\n'),
            createdAt: new Date(createdAt),
            updatedAt: new Date(updatedAt),
        };
    });

await prisma.snippet.createMany({
    data: records,
});
