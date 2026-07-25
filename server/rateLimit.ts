import type { NextFunction, Request, Response } from 'express';

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

function clientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0]!.trim();
  }
  if (Array.isArray(forwarded) && forwarded[0]) {
    return forwarded[0].split(',')[0]!.trim();
  }
  return req.socket.remoteAddress || 'unknown';
}

/** Simple in-memory rate limiter. Resets on process restart. */
export function rateLimit(opts: {
  windowMs: number;
  max: number;
  name: string;
  message?: string;
}) {
  const message = opts.message || 'Too many requests. Please try again later.';

  return (req: Request, res: Response, next: NextFunction): void => {
    const key = `${opts.name}:${clientIp(req)}`;
    const now = Date.now();
    let bucket = buckets.get(key);

    if (!bucket || now >= bucket.resetAt) {
      bucket = { count: 0, resetAt: now + opts.windowMs };
      buckets.set(key, bucket);
    }

    bucket.count += 1;

    const remaining = Math.max(0, opts.max - bucket.count);
    res.setHeader('X-RateLimit-Limit', String(opts.max));
    res.setHeader('X-RateLimit-Remaining', String(remaining));
    res.setHeader('X-RateLimit-Reset', String(Math.ceil(bucket.resetAt / 1000)));

    if (bucket.count > opts.max) {
      const retryAfter = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
      res.setHeader('Retry-After', String(retryAfter));
      res.status(429).json({ error: message });
      return;
    }

    next();
  };
}

const FIFTEEN_MIN = 15 * 60 * 1000;

export const loginRateLimit = rateLimit({
  name: 'auth-login',
  windowMs: FIFTEEN_MIN,
  max: 5,
  message: 'Too many login attempts. Please try again in 15 minutes.',
});

export const contactRateLimit = rateLimit({
  name: 'contact',
  windowMs: FIFTEEN_MIN,
  max: 5,
  message: 'Too many messages. Please try again in 15 minutes.',
});
