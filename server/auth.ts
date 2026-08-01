import type { NextFunction, Request, Response, Router } from 'express';
import { Router as createRouter } from 'express';
import crypto from 'crypto';
import { loginRateLimit, rateLimit } from './rateLimit.js';
import { prisma } from './db.js';
import { createTransporter, emailLayout, isMailConfigured } from './mailer.js';

const COOKIE_NAME = 'admin_session';
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours
const MIN_PASSWORD_LENGTH = 12;
const RESET_TOKEN_TTL_MS = 1000 * 60 * 30; // 30 minutes

/** token -> expiresAt (ms). In-memory; sessions clear on process restart. */
const sessions = new Map<string, number>();

function adminEmail(): string {
  return process.env.ADMIN_EMAIL || process.env.CONTACT_TO || 'info@adfta.com';
}

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

function verifyAgainstHash(password: string, hashEnv: string): boolean {
  if (!hashEnv.startsWith('scrypt:')) return false;
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

/** DB-stored hash (set via password reset) takes priority over env config. */
async function currentPasswordHash(): Promise<string | null> {
  const record = await prisma.adminCredential.findUnique({ where: { id: 1 } });
  return record?.passwordHash ?? null;
}

async function verifyPassword(password: string): Promise<boolean> {
  const dbHash = await currentPasswordHash();
  if (dbHash) {
    return verifyAgainstHash(password, dbHash);
  }

  const hashEnv = (process.env.ADMIN_PASSWORD_HASH || '').trim();
  if (hashEnv.startsWith('scrypt:')) {
    return verifyAgainstHash(password, hashEnv);
  }

  const expected = process.env.ADMIN_PASSWORD || '';
  if (!expected) return false;
  return timingSafeEqualString(password, expected);
}

async function hasAnyPasswordConfigured(): Promise<boolean> {
  if (await currentPasswordHash()) return true;
  return Boolean((process.env.ADMIN_PASSWORD_HASH || '').trim() || process.env.ADMIN_PASSWORD);
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

/** Invalidate every active admin session, e.g. after a password reset. */
function destroyAllSessions(): void {
  sessions.clear();
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
      console.warn(
        '[auth] ADMIN_PASSWORD / ADMIN_PASSWORD_HASH unset — admin login will fail unless a password was set via reset.',
      );
    }
    return;
  }

  if (!secret || secret === 'dev-insecure-session-secret' || secret.length < 32) {
    throw new Error(
      'ADMIN_SESSION_SECRET must be set to a random string of at least 32 characters in production.',
    );
  }

  // In production a password may also come solely from a prior reset stored in the DB,
  // so we only warn (not throw) when no env-configured password/hash is present.
  if (!passwordHash && (password === 'changeme' || (password && password.length < MIN_PASSWORD_LENGTH))) {
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

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function resetLandingUrl(token: string): string {
  const base = (process.env.VITE_SITE_URL || process.env.APP_URL || 'http://localhost:3000').replace(/\/$/, '');
  return `${base}/admin/reset-password?token=${token}`;
}

async function sendResetEmail(token: string): Promise<void> {
  const transporter = createTransporter();
  const link = resetLandingUrl(token);
  const minutes = Math.round(RESET_TOKEN_TTL_MS / 60000);

  const html = emailLayout(
    `
      <div style="display:inline-block;padding:7px 12px;background:#e8f3f9;border-radius:999px;color:#005f93;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;">Admin account</div>
      <h1 style="margin:20px 0 14px;color:#12212e;font-size:26px;line-height:1.3;">Reset your blog admin password</h1>
      <p style="margin:0 0 24px;color:#52606b;font-size:15px;line-height:1.7;">A password reset was requested for the Asas Al-Deqa blog admin. This link expires in ${minutes} minutes and can only be used once. If you didn't request this, you can ignore this email.</p>
      <table role="presentation" cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td style="background:#005f93;border-radius:10px;">
            <a href="${link}" style="display:inline-block;padding:14px 22px;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;">Set a new password</a>
          </td>
        </tr>
      </table>
      <p style="margin:24px 0 0;color:#94a3b8;font-size:12px;line-height:1.6;word-break:break-all;">${link}</p>
    `,
    { preheader: 'Reset your Asas Al-Deqa blog admin password.' },
  );

  await transporter.sendMail({
    from: `"Asas Al-Deqa" <${process.env.SMTP_USER || 'info@adfta.com'}>`,
    to: adminEmail(),
    subject: 'Reset your blog admin password',
    text: `A password reset was requested for the Asas Al-Deqa blog admin.\n\nOpen this link within ${minutes} minutes to set a new password:\n${link}\n\nIf you didn't request this, you can ignore this email.`,
    html,
  });
}

export function createAuthRouter(): Router {
  const router = createRouter();

  const forgotPasswordRateLimit = rateLimit({
    name: 'auth-forgot-password',
    windowMs: 60 * 60 * 1000,
    max: 3,
    message: 'Too many reset requests. Please try again later.',
  });

  const resetPasswordRateLimit = rateLimit({
    name: 'auth-reset-password',
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: 'Too many attempts. Please try again later.',
  });

  router.post('/login', loginRateLimit, async (req, res) => {
    const password = typeof req.body?.password === 'string' ? req.body.password : '';

    if (!(await hasAnyPasswordConfigured())) {
      console.error('Admin auth is not configured');
      return res.status(500).json({ error: 'Admin auth is not configured' });
    }

    if (!password || !(await verifyPassword(password))) {
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

  // Single-admin site: no email input needed, always emails the configured admin address.
  // Response is identical whether or not mail is configured, to avoid leaking config state.
  router.post('/forgot-password', forgotPasswordRateLimit, async (_req, res) => {
    const genericResponse = {
      ok: true,
      message: 'If admin auth is configured, a reset link has been emailed.',
    };

    if (!isMailConfigured()) {
      console.error('Cannot send password reset: SMTP is not configured');
      return res.json(genericResponse);
    }

    try {
      const token = crypto.randomBytes(32).toString('hex');
      await prisma.passwordResetToken.create({
        data: {
          tokenHash: hashToken(token),
          expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
        },
      });
      await sendResetEmail(token);
    } catch (err) {
      console.error('Failed to create/send password reset:', err);
    }

    return res.json(genericResponse);
  });

  router.post('/reset-password', resetPasswordRateLimit, async (req, res) => {
    const token = typeof req.body?.token === 'string' ? req.body.token : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';

    if (!token) {
      return res.status(400).json({ error: 'Missing reset token' });
    }
    if (!password || password.length < MIN_PASSWORD_LENGTH) {
      return res.status(400).json({ error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` });
    }

    const record = await prisma.passwordResetToken.findUnique({
      where: { tokenHash: hashToken(token) },
    });

    if (!record || record.usedAt || record.expiresAt.getTime() < Date.now()) {
      return res.status(400).json({ error: 'This reset link is invalid or has expired' });
    }

    const passwordHash = hashAdminPassword(password);

    await prisma.$transaction([
      prisma.adminCredential.upsert({
        where: { id: 1 },
        create: { id: 1, passwordHash },
        update: { passwordHash },
      }),
      prisma.passwordResetToken.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      }),
    ]);

    destroyAllSessions();

    return res.json({ ok: true });
  });

  return router;
}
