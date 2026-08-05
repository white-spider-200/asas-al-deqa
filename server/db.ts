import fs from 'fs';
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

const databaseUrl = resolveSqliteUrl(process.env.DATABASE_URL);

// In production the DB lives outside the repo (e.g. /var/lib/adfta/blog.db) so
// deploys can't overwrite it. Make sure that directory exists before connecting.
if (databaseUrl.startsWith('file:')) {
  const dir = path.dirname(databaseUrl.slice('file:'.length));
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Log the resolved path at startup. A silent fallback to the wrong file empties
// the blog without any error, so this must always be visible in the pm2 logs.
console.log(`[db] using ${databaseUrl}`);

const adapter = new PrismaBetterSqlite3({ url: databaseUrl });

export const prisma = new PrismaClient({ adapter });
