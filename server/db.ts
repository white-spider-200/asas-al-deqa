import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../src/generated/prisma/client.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

function resolveSqliteUrl(raw?: string): string {
  const url = raw?.trim() || 'file:./prisma/dev.db';
  if (!url.startsWith('file:')) {
    return url;
  }
  const filePath = url.slice('file:'.length);
  if (path.isAbsolute(filePath)) {
    return url;
  }
  return `file:${path.resolve(projectRoot, filePath)}`;
}

const adapter = new PrismaBetterSqlite3({
  url: resolveSqliteUrl(process.env.DATABASE_URL),
});

export const prisma = new PrismaClient({ adapter });
