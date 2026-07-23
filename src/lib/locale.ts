export const SUPPORTED_LANGS = ['ar', 'en'] as const;
export type Lang = (typeof SUPPORTED_LANGS)[number];
export const DEFAULT_LANG: Lang = 'ar';

export function isLang(value: string | undefined): value is Lang {
  return value === 'ar' || value === 'en';
}

/** Build a locale-prefixed path, e.g. localizedPath('ar', '/services') => '/ar/services' */
export function localizedPath(lang: Lang, path = '/'): string {
  if (!path || path === '/') {
    return `/${lang}`;
  }
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `/${lang}${normalized}`;
}

/** Strip /ar or /en prefix from pathname */
export function stripLocalePrefix(pathname: string): string {
  const stripped = pathname.replace(/^\/(ar|en)(?=\/|$)/, '');
  return stripped || '/';
}

/** Swap locale in current pathname */
export function swapLocalePath(pathname: string, newLang: Lang): string {
  const pathWithoutLang = stripLocalePrefix(pathname);
  return localizedPath(newLang, pathWithoutLang);
}
