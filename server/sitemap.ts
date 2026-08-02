import type { Request, Response } from 'express';
import { prisma } from './db.js';
import { availableLangsFor, postUrl } from './postMeta.js';

const SITE_URL = (process.env.VITE_SITE_URL || 'https://adfta.com').replace(/\/$/, '');

const LANGS = ['ar', 'en'] as const;
const STATIC_PAGES: { path: string; changefreq: string; priority: string }[] = [
  { path: '', changefreq: 'weekly', priority: '1.0' },
  { path: '/about', changefreq: 'monthly', priority: '0.8' },
  { path: '/services', changefreq: 'monthly', priority: '0.9' },
  { path: '/contact', changefreq: 'monthly', priority: '0.8' },
  { path: '/wealth', changefreq: 'monthly', priority: '0.7' },
  { path: '/institutional', changefreq: 'monthly', priority: '0.7' },
  { path: '/insights', changefreq: 'weekly', priority: '0.85' },
];

const SERVICE_SLUGS = [
  'tax-compliance',
  'accounting',
  'tax-management',
  'tax-litigation',
  'documentation',
  'inventory',
  'erp',
];

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toIsoDate(date: Date | string | null | undefined): string | null {
  if (!date) return null;
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
}

function urlEntry(opts: {
  loc: string;
  lastmod?: string | null;
  changefreq: string;
  priority: string;
  alternates?: { lang: string; href: string }[];
}): string {
  const parts = [`    <loc>${escapeXml(opts.loc)}</loc>`];
  if (opts.lastmod) {
    parts.push(`    <lastmod>${opts.lastmod}</lastmod>`);
  }
  parts.push(`    <changefreq>${opts.changefreq}</changefreq>`);
  parts.push(`    <priority>${opts.priority}</priority>`);
  for (const alt of opts.alternates || []) {
    parts.push(
      `    <xhtml:link rel="alternate" hreflang="${alt.lang}" href="${escapeXml(alt.href)}" />`,
    );
  }
  return `  <url>\n${parts.join('\n')}\n  </url>`;
}

function bilingualAlternates(pathAfterLang: string) {
  const ar = `${SITE_URL}/ar${pathAfterLang}`;
  const en = `${SITE_URL}/en${pathAfterLang}`;
  return [
    { lang: 'ar', href: ar },
    { lang: 'en', href: en },
    { lang: 'x-default', href: ar },
  ];
}

export async function handleSitemap(_req: Request, res: Response) {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      select: {
        slug: true,
        publishedAt: true,
        updatedAt: true,
        contentAr: true,
        contentEn: true,
      },
      orderBy: { publishedAt: 'desc' },
    });

    const urls: string[] = [];

    for (const lang of LANGS) {
      for (const page of STATIC_PAGES) {
        const pathAfterLang = page.path;
        urls.push(
          urlEntry({
            loc: `${SITE_URL}/${lang}${pathAfterLang}`,
            changefreq: page.changefreq,
            priority: page.priority,
            alternates: bilingualAlternates(pathAfterLang || ''),
          }),
        );
      }

      for (const slug of SERVICE_SLUGS) {
        const pathAfterLang = `/services/${slug}`;
        urls.push(
          urlEntry({
            loc: `${SITE_URL}/${lang}${pathAfterLang}`,
            changefreq: 'monthly',
            priority: '0.85',
            alternates: bilingualAlternates(pathAfterLang),
          }),
        );
      }

      for (const post of posts) {
        // A post only has a page in a language once that language has a body.
        // Listing an empty translation sends Google to a blank article.
        const langs = availableLangsFor(post);
        if (!langs.includes(lang)) continue;

        const lastmod = toIsoDate(post.updatedAt) || toIsoDate(post.publishedAt);
        const alternates: { lang: string; href: string }[] = langs.map((l) => ({
          lang: l,
          href: postUrl(l, post.slug),
        }));
        alternates.push({
          lang: 'x-default',
          href: postUrl(langs.includes('ar') ? 'ar' : langs[0], post.slug),
        });

        urls.push(
          urlEntry({
            loc: postUrl(lang, post.slug),
            lastmod,
            changefreq: 'weekly',
            priority: '0.7',
            alternates,
          }),
        );
      }
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=300');
    return res.status(200).send(xml);
  } catch (err) {
    console.error('Failed to generate sitemap:', err);
    return res.status(500).type('text/plain').send('Failed to generate sitemap');
  }
}
