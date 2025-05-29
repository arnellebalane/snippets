import crypto from 'node:crypto';
import { PrismaClient, Snippet } from '@prisma/client';

let prisma: PrismaClient | undefined;

const getDatabaseClient = () => {
    if (!prisma) {
        prisma = new PrismaClient();
    }
    return prisma;
};

const generateHash = (data: string): string => {
    return crypto
        .createHash('sha256')
        .update(data)
        .digest('base64')
        .replace(/[^\w\d]/g, '')
        .substring(0, 8);
};

export const createSnippet = async (body: string): Promise<Snippet> => {
    const db = getDatabaseClient();
    let hash: string;
    let existing: Snippet | null;

    do {
        const content = body + Date.now();
        hash = generateHash(content);
        existing = await db.snippet.findUnique({ where: { hash } });
    } while (existing);

    return db.snippet.create({
        data: { hash, body },
    });
};

export const readSnippet = async (hash: string): Promise<Snippet> => {
    const db = getDatabaseClient();
    return db.snippet.findUniqueOrThrow({ where: { hash } });
};
