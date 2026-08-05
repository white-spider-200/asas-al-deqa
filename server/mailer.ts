import nodemailer from 'nodemailer';

// Read lazily (not at module load) — dotenv.config() in index.ts runs after
// ESM imports resolve, so top-level env reads here would see empty values.
function smtpHost(): string {
  return process.env.SMTP_HOST || 'smtp.zoho.com';
}

function smtpPort(): number {
  return Number(process.env.SMTP_PORT) || 465;
}

export function getSender(): string {
  return process.env.SMTP_USER || 'info@adfta.com';
}

export function isMailConfigured(): boolean {
  return Boolean(process.env.SMTP_PASS);
}

export function createTransporter() {
  const pass = process.env.SMTP_PASS;
  if (!pass) {
    throw new Error('SMTP_PASS is not configured');
  }
  const port = smtpPort();
  return nodemailer.createTransport({
    host: smtpHost(),
    port,
    secure: port === 465,
    auth: {
      user: getSender(),
      pass,
    },
  });
}

/** Shared branded HTML email shell used for all outgoing site emails. */
export function emailLayout(
  content: string,
  options?: { direction?: 'ltr' | 'rtl'; preheader?: string },
): string {
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
