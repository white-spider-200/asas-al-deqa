import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { assertAdminSecretsConfigured, createAuthRouter, requireAuth } from './auth.js';
import {
  createAdminBlogRouter,
  createPublicBlogRouter,
  createUploadHandler,
  uploadsDir,
} from './blog.js';
import { handleSitemap } from './sitemap.js';
import { contactRateLimit } from './rateLimit.js';
import { createTransporter, emailLayout, isMailConfigured } from './mailer.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: '.env.local' });
dotenv.config();

assertAdminSecretsConfigured();

const app = express();
const PORT = Number(process.env.PORT) || 3001;

const SMTP_USER = process.env.SMTP_USER || 'info@adfta.com';
const CONTACT_TO = process.env.CONTACT_TO || 'info@adfta.com';
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'dev-insecure-session-secret';

/** Allowed browser origins for credentialed CORS (admin cookie). */
function allowedOrigins(): Set<string> {
  const origins = [
    process.env.VITE_SITE_URL,
    process.env.APP_URL,
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3001',
  ]
    .filter((v): v is string => Boolean(v && v.trim()))
    .map((v) => v.replace(/\/$/, ''));
  return new Set(origins);
}

const ALLOWED_ORIGINS = allowedOrigins();

// Behind nginx/Cloudflare, trust one hop so rate-limit IPs are accurate.
if (process.env.TRUST_PROXY === '1' || process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

app.use(express.json({ limit: '1mb' }));
app.use(cookieParser(SESSION_SECRET));

app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('X-DNS-Prefetch-Control', 'off');
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
});

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.has(origin.replace(/\/$/, ''))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Vary', 'Origin');
  }
  // Same-origin requests (no Origin) need no CORS headers.
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    if (origin && !ALLOWED_ORIGINS.has(origin.replace(/\/$/, ''))) {
      return res.sendStatus(403);
    }
    return res.sendStatus(204);
  }
  return next();
});

app.use('/uploads', express.static(uploadsDir, {
  // Uploads are user content — never execute as HTML/JS in the browser.
  setHeaders(res) {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Disposition', 'inline');
    res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  },
}));
app.use('/api/auth', createAuthRouter());
app.use('/api/blog', createPublicBlogRouter());
app.use('/api/admin/blog', createAdminBlogRouter());
app.post('/api/admin/upload', requireAuth, createUploadHandler());
app.get('/sitemap.xml', handleSitemap);

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

app.post('/api/contact', contactRateLimit, async (req, res) => {
  if (!isMailConfigured()) {
    console.error('SMTP_PASS is not configured');
    return res.status(500).json({ error: 'Email service is not configured' });
  }

  const { name, email, message, language } = req.body as {
    name?: string;
    email?: string;
    message?: string;
    language?: string;
  };

  const trimmedName = name?.trim();
  const trimmedEmail = email?.trim();
  const trimmedMessage = message?.trim();

  if (!trimmedName || !trimmedEmail || !trimmedMessage) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  if (!isValidEmail(trimmedEmail)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  const transporter = createTransporter();

  const safeName = escapeHtml(trimmedName);
  const safeEmail = escapeHtml(trimmedEmail);
  const safeMessage = escapeHtml(trimmedMessage).replace(/\n/g, '<br>');

  const isArabic = language === 'ar';
  const autoReplySubject = isArabic
    ? 'تم استلام طلب التواصل - أساس الدقة'
    : 'We received your message - Asas Al-Deqa';
  const autoReplyHtml = emailLayout(
    isArabic
      ? `
        <div style="display:inline-block;padding:7px 12px;background:#e8f3f9;border-radius:999px;color:#005f93;font-size:12px;font-weight:700;">تم استلام رسالتك</div>
        <h1 style="margin:20px 0 14px;color:#12212e;font-size:28px;line-height:1.3;">شكراً لتواصلك معنا، ${safeName}</h1>
        <p style="margin:0 0 24px;color:#52606b;font-size:16px;line-height:1.8;">لقد استلم فريق أساس الدقة طلبك بنجاح. سنراجع رسالتك ونتواصل معك خلال يوم عمل واحد.</p>
        <div style="padding:20px 22px;background:#f3f6f8;border-right:4px solid #005f93;border-radius:12px;">
          <p style="margin:0 0 8px;color:#005f93;font-size:12px;font-weight:700;">نسخة من رسالتك</p>
          <p style="margin:0;color:#334155;font-size:14px;line-height:1.8;">${safeMessage}</p>
        </div>
        <p style="margin:26px 0 0;color:#52606b;font-size:15px;line-height:1.8;">مع أطيب التحيات،<br><strong style="color:#12212e;">فريق أساس الدقة</strong></p>
      `
      : `
        <div style="display:inline-block;padding:7px 12px;background:#e8f3f9;border-radius:999px;color:#005f93;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;">Message received</div>
        <h1 style="margin:20px 0 14px;color:#12212e;font-size:28px;line-height:1.3;">Thank you for contacting us, ${safeName}</h1>
        <p style="margin:0 0 24px;color:#52606b;font-size:16px;line-height:1.7;">The Asas Al-Deqa team has received your request. We will review your message and contact you within one business day.</p>
        <div style="padding:20px 22px;background:#f3f6f8;border-left:4px solid #005f93;border-radius:12px;">
          <p style="margin:0 0 8px;color:#005f93;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;">Your message</p>
          <p style="margin:0;color:#334155;font-size:14px;line-height:1.7;">${safeMessage}</p>
        </div>
        <p style="margin:26px 0 0;color:#52606b;font-size:15px;line-height:1.7;">Best regards,<br><strong style="color:#12212e;">Asas Al-Deqa Team</strong></p>
      `,
    {
      direction: isArabic ? 'rtl' : 'ltr',
      preheader: isArabic
        ? 'تم استلام طلبك وسنتواصل معك خلال يوم عمل واحد.'
        : 'We received your request and will contact you within one business day.',
    },
  );

  const notificationHtml = emailLayout(
    isArabic
      ? `
        <div style="display:inline-block;padding:7px 12px;background:#e8f3f9;border-radius:999px;color:#005f93;font-size:12px;font-weight:700;">طلب تواصل جديد</div>
        <h1 style="margin:20px 0 8px;color:#12212e;font-size:28px;line-height:1.4;">طلب تواصل جديد</h1>
        <p style="margin:0 0 28px;color:#6b7280;font-size:15px;line-height:1.8;">أرسل زائر نموذج التواصل عبر موقع أساس الدقة.</p>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;border-collapse:separate;border-spacing:0;">
          <tr>
            <td style="width:90px;padding:14px 16px;background:#f8fafb;border-top:1px solid #e8edf0;color:#6b7280;font-size:12px;font-weight:700;">الاسم</td>
            <td style="padding:14px 16px;background:#f8fafb;border-top:1px solid #e8edf0;color:#12212e;font-size:15px;font-weight:700;">${safeName}</td>
          </tr>
          <tr>
            <td style="width:90px;padding:14px 16px;border-top:1px solid #e8edf0;color:#6b7280;font-size:12px;font-weight:700;">البريد الإلكتروني</td>
            <td style="padding:14px 16px;border-top:1px solid #e8edf0;color:#12212e;font-size:15px;"><a href="mailto:${safeEmail}" style="color:#005f93;text-decoration:none;font-weight:700;">${safeEmail}</a></td>
          </tr>
        </table>
        <div style="margin-top:24px;padding:22px;background:#f3f6f8;border-right:4px solid #005f93;border-radius:12px;">
          <p style="margin:0 0 10px;color:#005f93;font-size:12px;font-weight:700;">الرسالة</p>
          <p style="margin:0;color:#334155;font-size:15px;line-height:1.8;">${safeMessage}</p>
        </div>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-top:28px;">
          <tr>
            <td style="background:#005f93;border-radius:10px;">
              <a href="mailto:${safeEmail}?subject=${encodeURIComponent('رد: استفسارك لأساس الدقة')}" style="display:inline-block;padding:14px 22px;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;">الرد على ${safeName}</a>
            </td>
          </tr>
        </table>
      `
      : `
        <div style="display:inline-block;padding:7px 12px;background:#e8f3f9;border-radius:999px;color:#005f93;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;">New website enquiry</div>
        <h1 style="margin:20px 0 8px;color:#12212e;font-size:28px;line-height:1.3;">New contact request</h1>
        <p style="margin:0 0 28px;color:#6b7280;font-size:15px;line-height:1.6;">A visitor submitted the contact form on the Asas Al-Deqa website.</p>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;border-collapse:separate;border-spacing:0;">
          <tr>
            <td style="width:90px;padding:14px 16px;background:#f8fafb;border-top:1px solid #e8edf0;color:#6b7280;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;">Name</td>
            <td style="padding:14px 16px;background:#f8fafb;border-top:1px solid #e8edf0;color:#12212e;font-size:15px;font-weight:700;">${safeName}</td>
          </tr>
          <tr>
            <td style="width:90px;padding:14px 16px;border-top:1px solid #e8edf0;color:#6b7280;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;">Email</td>
            <td style="padding:14px 16px;border-top:1px solid #e8edf0;color:#12212e;font-size:15px;"><a href="mailto:${safeEmail}" style="color:#005f93;text-decoration:none;font-weight:700;">${safeEmail}</a></td>
          </tr>
        </table>
        <div style="margin-top:24px;padding:22px;background:#f3f6f8;border-left:4px solid #005f93;border-radius:12px;">
          <p style="margin:0 0 10px;color:#005f93;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;">Message</p>
          <p style="margin:0;color:#334155;font-size:15px;line-height:1.7;">${safeMessage}</p>
        </div>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-top:28px;">
          <tr>
            <td style="background:#005f93;border-radius:10px;">
              <a href="mailto:${safeEmail}?subject=${encodeURIComponent(`Re: Your enquiry to Asas Al-Deqa`)}" style="display:inline-block;padding:14px 22px;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;">Reply to ${safeName}</a>
            </td>
          </tr>
        </table>
      `,
    {
      direction: isArabic ? 'rtl' : 'ltr',
      preheader: isArabic
        ? `طلب تواصل جديد من ${safeName}`
        : `New contact request from ${safeName}`,
    },
  );

  const notificationSubject = isArabic
    ? `[نموذج التواصل] رسالة من ${trimmedName}`
    : `[Contact Form] Message from ${trimmedName}`;

  try {
    await transporter.sendMail({
      from: `"Website Contact" <${SMTP_USER}>`,
      to: CONTACT_TO,
      replyTo: trimmedEmail,
      subject: notificationSubject,
      text: isArabic
        ? `طلب تواصل جديد\n\nالاسم: ${trimmedName}\nالبريد الإلكتروني: ${trimmedEmail}\n\nالرسالة:\n${trimmedMessage}`
        : `New contact request\n\nName: ${trimmedName}\nEmail: ${trimmedEmail}\n\nMessage:\n${trimmedMessage}`,
      html: notificationHtml,
    });

    await transporter.sendMail({
      from: `"Asas Al-Deqa" <${SMTP_USER}>`,
      to: trimmedEmail,
      subject: autoReplySubject,
      text: isArabic
        ? `عزيزي/عزيزتي ${trimmedName}،\n\nشكراً لتواصلك مع أساس الدقة. لقد استلمنا طلبك وسنتواصل معك خلال يوم عمل واحد.\n\nمع أطيب التحيات،\nفريق أساس الدقة`
        : `Dear ${trimmedName},\n\nThank you for contacting Asas Al-Deqa. We received your request and will contact you within one business day.\n\nBest regards,\nAsas Al-Deqa Team`,
      html: autoReplyHtml,
    });

    return res.json({ success: true });
  } catch (err) {
    console.error('Failed to send email:', err);
    return res.status(500).json({ error: 'Failed to send email' });
  }
});

if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../dist');
  app.use(express.static(distPath));

  app.get('*', (req, res, next) => {
    if (
      req.path.startsWith('/api') ||
      req.path.startsWith('/uploads') ||
      req.path === '/sitemap.xml'
    ) {
      return next();
    }

    const normalized = req.path.endsWith('/') && req.path.length > 1
      ? req.path.slice(0, -1)
      : req.path;
    const prerendered = path.join(distPath, normalized, 'index.html');

    if (fs.existsSync(prerendered)) {
      return res.sendFile(prerendered);
    }

    return res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
