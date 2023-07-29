import crypto from 'node:crypto';
import { PrismaClient, Snippet } from '@prisma/client';
import { loadSecretsToEnvironment } from '../../utils/env';

await loadSecretsToEnvironment();
const prisma = new PrismaClient();

export const generateHash = (data: string): string => {
    return crypto
        .createHash('sha256')
        .update(data)
        .digest('base64')
        .replace(/[^\w\d]/g, '')
        .substring(0, 8);
};

export const createSnippet = async (body: string): Promise<Snippet> => {
    let hash: string;
    let existing: Snippet | null;

    do {
        const content = body + Date.now();
        hash = generateHash(content);
        existing = await prisma.snippet.findUnique({ where: { hash } });
    } while (existing);

    return prisma.snippet.create({
        data: { hash, body },
    });
};

export const readSnippet = async (hash: string): Promise<Snippet> => {
    return prisma.snippet.findUniqueOrThrow({ where: { hash } });
};
