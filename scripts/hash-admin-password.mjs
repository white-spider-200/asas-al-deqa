#!/usr/bin/env node
/**
 * Generate a scrypt password hash for ADMIN_PASSWORD_HASH.
 *
 * Usage:
 *   node scripts/hash-admin-password.mjs "your-strong-password"
 *
 * Then put the printed value in .env (and remove plain ADMIN_PASSWORD).
 */
import crypto from 'crypto';

const password = process.argv[2];
if (!password || password.length < 12) {
  console.error('Usage: node scripts/hash-admin-password.mjs "<password at least 12 chars>"');
  process.exit(1);
}

const salt = crypto.randomBytes(16).toString('hex');
const hash = crypto.scryptSync(password, salt, 64).toString('hex');
console.log(`scrypt:${salt}:${hash}`);
