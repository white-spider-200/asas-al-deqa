const DEFAULT_SITE_URL = 'https://adfta.com';

export const SITE_URL = (
  import.meta.env.VITE_SITE_URL || DEFAULT_SITE_URL
).replace(/\/$/, '');

export const SITE_NAME = 'Asas Al-Deqa';
export const OG_IMAGE_PATH = '/og-image.png';

export function absoluteUrl(path = '/'): string {
  if (!path || path === '/') {
    return `${SITE_URL}/`;
  }
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

export function ogImageUrl(): string {
  return absoluteUrl(OG_IMAGE_PATH);
}

export function ogLocale(language: string): string {
  return language.startsWith('ar') ? 'ar_JO' : 'en_US';
}
