/**
 * The set of paths the SPA actually renders.
 *
 * The production catch-all used to return the app shell with 200 for *any*
 * path, so every mistyped or fabricated URL looked like a real page to search
 * engines. This lets the server answer 404 for paths the router has no route
 * for, while still serving the shell so the visitor sees the app's own
 * not-found screen.
 *
 * Must stay in sync with the <Routes> table in src/App.tsx. The sitemap
 * (server/sitemap.ts) imports the same lists, so adding a page in one place
 * surfaces it in the other.
 */

export const LANGS = ['ar', 'en'] as const;

/** Top-level pages under /:lang, mirroring App.tsx. */
export const STATIC_PAGE_PATHS = [
  '',
  '/about',
  '/services',
  '/contact',
  '/wealth',
  '/institutional',
  '/insights',
] as const;

export const SERVICE_SLUGS = [
  'tax-compliance',
  'accounting',
  'tax-management',
  'tax-litigation',
  'documentation',
  'inventory',
  'erp',
] as const;

/** Paths App.tsx redirects to their /ar equivalent. */
const LEGACY_SEGMENTS = ['about', 'services', 'contact', 'wealth', 'institutional', 'insights'];

const LANG_SET = new Set<string>(LANGS);
const PAGE_SET = new Set<string>(STATIC_PAGE_PATHS);
const SERVICE_SET = new Set<string>(SERVICE_SLUGS);

/**
 * True when the SPA has a route for this path.
 *
 * `/:lang/insights/:slug` is deliberately excluded: whether it exists depends
 * on the database, so serveBlogPostHtml decides and answers 404 itself.
 */
export function isKnownAppPath(pathname: string): boolean {
  const path = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;

  if (path === '/' || path === '') return true;

  // Admin is a private area; keep it permissive so its sub-routes never 404.
  if (path === '/admin' || path.startsWith('/admin/')) return true;

  // Legacy redirects: /services -> /ar/services, including nested paths.
  const firstSegment = path.split('/')[1];
  if (LEGACY_SEGMENTS.includes(firstSegment)) return true;

  const segments = path.split('/').filter(Boolean);
  if (segments.length === 0) return true;

  const [lang, ...rest] = segments;
  if (!LANG_SET.has(lang)) return false;

  // /ar
  if (rest.length === 0) return true;

  // /ar/about, /ar/services, ...
  if (rest.length === 1) return PAGE_SET.has(`/${rest[0]}`);

  if (rest.length === 2) {
    // /ar/services/accounting
    if (rest[0] === 'services') return SERVICE_SET.has(rest[1]);
    // /ar/insights/<slug> — resolved against the database elsewhere.
    if (rest[0] === 'insights') return true;
  }

  return false;
}
