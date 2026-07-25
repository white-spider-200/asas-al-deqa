import type { NextFunction, Request, Response, Router } from 'express';
import { Router as createRouter } from 'express';
import crypto from 'crypto';
import { loginRateLimit } from './rateLimit.js';

const COOKIE_NAME = 'admin_session';
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours
const MIN_PASSWORD_LENGTH = 12;

/** token -> expiresAt (ms). In-memory; sessions clear on process restart. */
const sessions = new Map<string, number>();

function timingSafeEqualString(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) {
    crypto.timingSafeEqual(aBuf, aBuf);
    return false;
  }
  return crypto.timingSafeEqual(aBuf, bBuf);
}

/** Format: scrypt:<saltHex>:<hashHex> */
export function hashAdminPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `scrypt:${salt}:${hash}`;
}

function verifyPassword(password: string): boolean {
  const hashEnv = (process.env.ADMIN_PASSWORD_HASH || '').trim();
  if (hashEnv.startsWith('scrypt:')) {
    const parts = hashEnv.split(':');
    if (parts.length !== 3) return false;
    const [, salt, expectedHex] = parts;
    if (!salt || !expectedHex) return false;
    try {
      const derived = crypto.scryptSync(password, salt, 64);
      const expected = Buffer.from(expectedHex, 'hex');
      if (expected.length !== derived.length) return false;
      return crypto.timingSafeEqual(derived, expected);
    } catch {
      return false;
    }
  }

  const expected = process.env.ADMIN_PASSWORD || '';
  if (!expected) return false;
  return timingSafeEqualString(password, expected);
}

function pruneSessions(): void {
  const now = Date.now();
  for (const [token, expiresAt] of sessions) {
    if (now >= expiresAt) sessions.delete(token);
  }
}

function createSession(): string {
  pruneSessions();
  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, Date.now() + SESSION_TTL_MS);
  return token;
}

function destroySession(token: string | undefined): void {
  if (token) sessions.delete(token);
}

function readSessionToken(req: Request): string | undefined {
  const token = req.signedCookies?.[COOKIE_NAME];
  return typeof token === 'string' && token.length > 0 ? token : undefined;
}

export function isAuthenticated(req: Request): boolean {
  const token = readSessionToken(req);
  if (!token) return false;
  const expiresAt = sessions.get(token);
  if (!expiresAt || Date.now() >= expiresAt) {
    sessions.delete(token);
    return false;
  }
  return true;
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (!isAuthenticated(req)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  next();
}

/** Fail closed in production if admin secrets are missing or obviously weak. */
export function assertAdminSecretsConfigured(): void {
  const isProd = process.env.NODE_ENV === 'production';
  const secret = process.env.ADMIN_SESSION_SECRET || '';
  const password = process.env.ADMIN_PASSWORD || '';
  const passwordHash = (process.env.ADMIN_PASSWORD_HASH || '').trim();

  if (!isProd) {
    if (!secret) {
      console.warn(
        '[auth] ADMIN_SESSION_SECRET is unset; using an insecure development default.',
      );
    }
    if (!password && !passwordHash) {
      console.warn('[auth] ADMIN_PASSWORD / ADMIN_PASSWORD_HASH unset — admin login will fail.');
    }
    return;
  }

  if (!secret || secret === 'dev-insecure-session-secret' || secret.length < 32) {
    throw new Error(
      'ADMIN_SESSION_SECRET must be set to a random string of at least 32 characters in production.',
    );
  }

  if (!passwordHash && !password) {
    throw new Error('Set ADMIN_PASSWORD_HASH (preferred) or ADMIN_PASSWORD in production.');
  }

  if (!passwordHash && (password === 'changeme' || password.length < MIN_PASSWORD_LENGTH)) {
    throw new Error(
      `ADMIN_PASSWORD must be at least ${MIN_PASSWORD_LENGTH} characters and not the default "changeme". Prefer ADMIN_PASSWORD_HASH.`,
    );
  }

  if (passwordHash && !passwordHash.startsWith('scrypt:')) {
    throw new Error('ADMIN_PASSWORD_HASH must use the scrypt:<salt>:<hash> format from scripts/hash-admin-password.mjs');
  }
}

function cookieOptions() {
  return {
    httpOnly: true,
    signed: true,
    sameSite: 'strict' as const,
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_TTL_MS,
    path: '/',
  };
}

export function createAuthRouter(): Router {
  const router = createRouter();

  router.post('/login', loginRateLimit, (req, res) => {
    const password = typeof req.body?.password === 'string' ? req.body.password : '';
    const hasHash = Boolean((process.env.ADMIN_PASSWORD_HASH || '').trim());
    const hasPlain = Boolean(process.env.ADMIN_PASSWORD);

    if (!hasHash && !hasPlain) {
      console.error('ADMIN_PASSWORD / ADMIN_PASSWORD_HASH is not configured');
      return res.status(500).json({ error: 'Admin auth is not configured' });
    }

    if (!password || !verifyPassword(password)) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const previous = readSessionToken(req);
    destroySession(previous);

    const token = createSession();
    res.cookie(COOKIE_NAME, token, cookieOptions());
    return res.json({ ok: true });
  });

  router.post('/logout', (req, res) => {
    destroySession(readSessionToken(req));
    res.clearCookie(COOKIE_NAME, {
      path: '/',
      httpOnly: true,
      signed: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });
    return res.json({ ok: true });
  });

  router.get('/me', (req, res) => {
    if (!isAuthenticated(req)) {
      return res.status(401).json({ authenticated: false });
    }
    return res.json({ authenticated: true });
  });

  return router;
}
