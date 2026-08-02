import type { Request, Response } from 'express';
import fs from 'fs';
import { prisma } from './db.js';

const SITE_URL = (process.env.VITE_SITE_URL || 'https://adfta.com').replace(/\/$/, '');
const SITE_NAME_EN = 'Asas Al-Deqa';
const SITE_NAME_AR = 'أساس الدقة';
const OG_IMAGE = '/og-image.jpg';

/** Matches /ar/insights/my-slug and /en/insights/my-slug */
const POST_PATH = /^\/(ar|en)\/insights\/([^/]+)$/;

export function matchPostPath(pathname: string): { lang: 'ar' | 'en'; slug: string } | null {
  const match = POST_PATH.exec(pathname);
  if (!match) return null;
  return { lang: match[1] as 'ar' | 'en', slug: decodeURIComponent(match[2]) };
}

function escapeAttr(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** JSON embedded in a <script> must not be able to close the tag early. */
function safeJson(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * Percent-encodes the slug. Arabic slugs are valid but must not appear raw in
 * canonical / hreflang / og:url.
 */
export function postUrl(lang: 'ar' | 'en', slug: string): string {
  return `${SITE_URL}/${lang}/insights/${encodeURIComponent(slug)}`;
}

/** Plain-text fallback description when the editor left the excerpt empty. */
function textFromHtml(html: string, limit = 160): string {
  const text = html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= limit) return text;
  return `${text.slice(0, limit - 1).trimEnd()}…`;
}

type PostMeta = {
  title: string;
  description: string;
  image: string;
  canonical: string;
  lang: 'ar' | 'en';
  publishedTime: string;
  modifiedTime: string;
  tag: string | null;
  slug: string;
  /** Languages this post actually has a body for. */
  availableLangs: ('ar' | 'en')[];
};

/** A slug is only a real page in a language once that language has content. */
export function availableLangsFor(post: { contentAr: string; contentEn: string }): ('ar' | 'en')[] {
  const langs: ('ar' | 'en')[] = [];
  if (post.contentAr?.trim()) langs.push('ar');
  if (post.contentEn?.trim()) langs.push('en');
  return langs;
}

function buildMeta(
  lang: 'ar' | 'en',
  post: {
    slug: string;
    titleAr: string;
    titleEn: string;
    excerptAr: string;
    excerptEn: string;
    contentAr: string;
    contentEn: string;
    coverImage: string | null;
    tagAr: string | null;
    tagEn: string | null;
    publishedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  },
): PostMeta {
  const isArabic = lang === 'ar';
  const title = (isArabic ? post.titleAr : post.titleEn) || post.titleEn || post.titleAr;
  const excerpt = (isArabic ? post.excerptAr : post.excerptEn) || '';
  const content = (isArabic ? post.contentAr : post.contentEn) || '';
  const siteName = isArabic ? SITE_NAME_AR : SITE_NAME_EN;

  return {
    title: `${title} | ${siteName}`,
    description: excerpt || textFromHtml(content) || title,
    image: absoluteUrl(post.coverImage || OG_IMAGE),
    canonical: postUrl(lang, post.slug),
    lang,
    publishedTime: new Date(post.publishedAt || post.createdAt).toISOString(),
    modifiedTime: new Date(post.updatedAt).toISOString(),
    tag: isArabic ? post.tagAr : post.tagEn,
    slug: post.slug,
    availableLangs: availableLangsFor(post),
  };
}

function buildHead(meta: PostMeta): string {
  const isArabic = meta.lang === 'ar';
  const siteName = isArabic ? SITE_NAME_AR : SITE_NAME_EN;

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: meta.title,
    description: meta.description,
    image: meta.image,
    datePublished: meta.publishedTime,
    dateModified: meta.modifiedTime,
    author: { '@type': 'Organization', name: siteName },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      logo: { '@type': 'ImageObject', url: absoluteUrl(OG_IMAGE) },
    },
    mainEntityOfPage: meta.canonical,
    inLanguage: meta.lang,
    ...(meta.tag ? { articleSection: meta.tag, keywords: meta.tag } : {}),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: isArabic ? 'الرئيسية' : 'Home',
        item: `${SITE_URL}/${meta.lang}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: isArabic ? 'رؤى' : 'Insights',
        item: `${SITE_URL}/${meta.lang}/insights`,
      },
      { '@type': 'ListItem', position: 3, name: meta.title, item: meta.canonical },
    ],
  };

  // Only advertise a language once it has a body — pointing hreflang at an empty
  // translation tells Google a page exists that has nothing on it.
  const alternates = meta.availableLangs.map(
    (l) => `<link rel="alternate" hreflang="${l}" href="${escapeAttr(postUrl(l, meta.slug))}">`,
  );
  const xDefault = meta.availableLangs.includes('ar') ? 'ar' : meta.availableLangs[0];
  if (xDefault) {
    alternates.push(
      `<link rel="alternate" hreflang="x-default" href="${escapeAttr(postUrl(xDefault, meta.slug))}">`,
    );
  }

  return [
    `<title>${escapeAttr(meta.title)}</title>`,
    `<meta name="description" content="${escapeAttr(meta.description)}">`,
    `<link rel="canonical" href="${escapeAttr(meta.canonical)}">`,
    ...alternates,
    `<meta property="og:type" content="article">`,
    `<meta property="og:site_name" content="${escapeAttr(siteName)}">`,
    `<meta property="og:title" content="${escapeAttr(meta.title)}">`,
    `<meta property="og:description" content="${escapeAttr(meta.description)}">`,
    `<meta property="og:url" content="${escapeAttr(meta.canonical)}">`,
    `<meta property="og:image" content="${escapeAttr(meta.image)}">`,
    `<meta property="og:locale" content="${isArabic ? 'ar_JO' : 'en_US'}">`,
    `<meta property="article:published_time" content="${escapeAttr(meta.publishedTime)}">`,
    `<meta property="article:modified_time" content="${escapeAttr(meta.modifiedTime)}">`,
    ...(meta.tag ? [`<meta property="article:section" content="${escapeAttr(meta.tag)}">`] : []),
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${escapeAttr(meta.title)}">`,
    `<meta name="twitter:description" content="${escapeAttr(meta.description)}">`,
    `<meta name="twitter:image" content="${escapeAttr(meta.image)}">`,
    `<script type="application/ld+json">${safeJson(articleJsonLd)}</script>`,
    `<script type="application/ld+json">${safeJson(breadcrumbJsonLd)}</script>`,
  ].join('\n    ');
}

/**
 * Strip the static tags from index.html that we are about to replace, so
 * crawlers don't see two competing titles / canonicals / og values.
 */
function stripStaticMeta(html: string): string {
  return html
    .replace(/<title>[\s\S]*?<\/title>/i, '')
    .replace(/<meta\s+name=["']description["'][^>]*>/gi, '')
    .replace(/<meta\s+property=["']og:[^"']*["'][^>]*>/gi, '')
    .replace(/<meta\s+name=["']twitter:[^"']*["'][^>]*>/gi, '')
    .replace(/<link\s+rel=["']canonical["'][^>]*>/gi, '');
}

/**
 * Serves a published post's HTML shell with real SEO tags injected at request
 * time. This is what lets marketing publish an article and have it indexable
 * immediately — no rebuild, no redeploy.
 *
 * Returns true if it handled the request.
 */
export async function serveBlogPostHtml(
  req: Request,
  res: Response,
  indexHtmlPath: string,
): Promise<boolean> {
  const match = matchPostPath(req.path);
  if (!match) return false;

  try {
    const post = await prisma.blogPost.findFirst({
      where: { slug: match.slug, published: true },
    });

    // Unknown or unpublished slug. Serve the SPA shell so the visitor sees the
    // app's "not found" screen, but with a real 404 so search engines do not
    // index every junk URL as a valid page.
    if (!post) {
      const shell = await fs.promises.readFile(indexHtmlPath, 'utf8');
      res.status(404).type('html').send(shell);
      return true;
    }

    const meta = buildMeta(match.lang, post);

    // The post exists but not in this language yet. Send the reader to the
    // language that does have a body rather than rendering a blank article.
    // 302, not 301: the translation is expected to arrive later.
    if (!meta.availableLangs.includes(match.lang)) {
      const fallback = meta.availableLangs[0];
      if (!fallback) {
        const shell = await fs.promises.readFile(indexHtmlPath, 'utf8');
        res.status(404).type('html').send(shell);
        return true;
      }
      res.redirect(302, `/${fallback}/insights/${encodeURIComponent(post.slug)}`);
      return true;
    }

    const template = await fs.promises.readFile(indexHtmlPath, 'utf8');
    let html = stripStaticMeta(template);
    html = html.replace(
      /<html([^>]*)>/i,
      `<html lang="${meta.lang}" dir="${meta.lang === 'ar' ? 'rtl' : 'ltr'}">`,
    );
    html = html.replace('</head>', `    ${buildHead(meta)}\n  </head>`);

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    res.send(html);
    return true;
  } catch (err) {
    console.error('Failed to render blog post meta:', err);
    return false;
  }
}
