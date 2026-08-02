import dotenv from 'dotenv';

/**
 * Loads .env BEFORE any other module is evaluated.
 *
 * ES module imports are evaluated in declaration order, so this file must be the
 * FIRST import in server/index.ts. Calling dotenv.config() in the body of
 * index.ts is too late: db.ts reads DATABASE_URL at import time, so it would
 * silently fall back to ./prisma/dev.db and ignore the configured path.
 */
dotenv.config({ path: '.env.local' });
dotenv.config();
