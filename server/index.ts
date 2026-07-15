import dotenv from 'dotenv';
import express from 'express';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: '.env.local' });
dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3001;

const SMTP_HOST = process.env.SMTP_HOST || 'smtp.zoho.com';
const SMTP_PORT = Number(process.env.SMTP_PORT) || 465;
const SMTP_USER = process.env.SMTP_USER || 'info@adfta.com';
const SMTP_PASS = process.env.SMTP_PASS;
const CONTACT_TO = process.env.CONTACT_TO || 'info@adfta.com';

app.use(express.json({ limit: '32kb' }));

app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.options('/api/contact', (_req, res) => {
  res.sendStatus(204);
});

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

function emailLayout(content: string, options?: { direction?: 'ltr' | 'rtl'; preheader?: string }): string {
  const direction = options?.direction || 'ltr';
  const preheader = options?.preheader || '';

  return `<!doctype html>
<html lang="${direction === 'rtl' ? 'ar' : 'en'}" dir="${direction}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>Asas Al-Deqa</title>
  </head>
  <body style="margin:0;padding:0;background:#f3f6f8;color:#12212e;font-family:Arial,'Helvetica Neue',sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${preheader}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:#f3f6f8;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:620px;background:#ffffff;border:1px solid #dce3e8;border-radius:20px;overflow:hidden;box-shadow:0 12px 36px rgba(18,33,46,0.08);">
            <tr>
              <td style="height:6px;background:#005f93;font-size:0;line-height:0;">&nbsp;</td>
            </tr>
            <tr>
              <td style="padding:30px 36px 22px;border-bottom:1px solid #e8edf0;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td style="vertical-align:middle;">
                      <div style="display:inline-block;padding:10px 14px;background:#005f93;border-radius:10px;color:#ffffff;font-size:18px;font-weight:800;letter-spacing:1px;">ADFTA</div>
                    </td>
                    <td align="${direction === 'rtl' ? 'left' : 'right'}" style="vertical-align:middle;color:#6b7280;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;">
                      ${direction === 'rtl' ? 'أساس الدقة' : 'Asas Al-Deqa'}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:36px;">${content}</td>
            </tr>
            <tr>
              <td align="center" style="padding:22px 36px;background:#f8fafb;border-top:1px solid #e8edf0;color:#6b7280;font-size:12px;line-height:1.6;">
                ${direction === 'rtl'
                  ? 'أساس الدقة للاستشارات الضريبية والمحاسبية<br>عمّان، الأردن · info@adfta.com'
                  : 'Asas Al-Deqa Tax & Accounting Advisory<br>Amman, Jordan · info@adfta.com'}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

app.post('/api/contact', async (req, res) => {
  if (!SMTP_PASS) {
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

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

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
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
