import type { Router } from 'express';
import { Router as createRouter } from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { prisma } from './db.js';
import { requireAuth } from './auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Uploaded images are live content. In production point UPLOADS_DIR at a path
// outside the repo (e.g. /var/lib/adfta/uploads) so redeploys don't wipe them.
export const uploadsDir = process.env.UPLOADS_DIR?.trim()
  ? path.resolve(process.env.UPLOADS_DIR.trim())
  : path.resolve(__dirname, '../uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase().slice(0, 10);
    const safeExt = /^\.(jpe?g|png|gif|webp)$/.test(ext) ? ext : '.bin';
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${safeExt}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp']);
    if (!allowed.has(file.mimetype)) {
      cb(new Error('Only JPEG, PNG, GIF, or WebP uploads are allowed'));
      return;
    }
    cb(null, true);
  },
});

const ALLOWED_TAGS = new Set([
  'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'blockquote',
  'ul', 'ol', 'li', 'h2', 'h3', 'h4', 'a', 'img', 'span',
  'code', 'pre', 'hr', 'mark',
]);

/**
 * Values we are willing to echo back into a style attribute.
 * Deliberately narrow: no url(), no var(), no expression(), no arbitrary CSS.
 */
const SAFE_COLOUR = /^(#[0-9a-f]{3,8}|rgba?\([\d\s.,%/]+\)|inherit|transparent|currentcolor)$/i;
const SAFE_ALIGN = /^(left|right|center|justify)$/i;

/** Property allowlists, one per tag family the editor can produce. */
const COLOUR_ONLY: Record<string, RegExp> = { color: SAFE_COLOUR };
const HIGHLIGHT_STYLE: Record<string, RegExp> = {
  'background-color': SAFE_COLOUR,
  color: SAFE_COLOUR,
};
const ALIGN_ONLY: Record<string, RegExp> = { 'text-align': SAFE_ALIGN };

/** Block tags the alignment control may write a style onto. */
const ALIGNABLE_TAGS = new Set(['p', 'h2', 'h3', 'h4']);

/**
 * Rebuilds a style attribute containing only the declarations we recognise,
 * each validated against its own pattern. The editor's colour picker,
 * highlighter and alignment buttons are the only things that set these
 * (see src/components/blog/editor/), so everything else is dropped.
 */
function safeStyle(attrs: string, allowed: Record<string, RegExp>): string {
  const styleMatch = attrs.match(/\sstyle\s*=\s*(['"])(.*?)\1/i);
  if (!styleMatch) return '';

  const kept: string[] = [];
  for (const declaration of styleMatch[2].split(';')) {
    const [rawProp, ...rest] = declaration.split(':');
    const prop = rawProp?.trim().toLowerCase();
    const value = rest.join(':').trim();
    if (!prop || !value) continue;
    const pattern = allowed[prop];
    if (!pattern || !pattern.test(value)) continue;
    kept.push(`${prop}: ${value}`);
  }

  return kept.length ? ` style="${kept.join('; ').replace(/"/g, '&quot;')}"` : '';
}

/** Strip scripts/styles and non-whitelisted tags; keep safe attrs on a/img. */
export function sanitizeHtml(html: string): string {
  if (!html) return '';
  let out = html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
    .replace(/on\w+\s*=\s*(['"]).*?\1/gi, '')
    .replace(/on\w+\s*=\s*[^\s>]+/gi, '')
    .replace(/javascript:/gi, '');

  out = out.replace(/<\/?([a-zA-Z0-9]+)(\s[^>]*)?>/g, (match, tagName: string, attrs = '') => {
    const tag = tagName.toLowerCase();
    const isClose = match.startsWith('</');
    if (!ALLOWED_TAGS.has(tag)) return '';
    if (isClose) return `</${tag}>`;

    if (tag === 'a') {
      const hrefMatch = attrs.match(/\shref\s*=\s*(['"])(.*?)\1/i);
      const href = hrefMatch?.[2]?.trim() || '';
      if (!href || /^javascript:/i.test(href)) return '<a>';
      const safe = href.replace(/"/g, '&quot;');
      return `<a href="${safe}" rel="noopener noreferrer">`;
    }

    if (tag === 'img') {
      const srcMatch = attrs.match(/\ssrc\s*=\s*(['"])(.*?)\1/i);
      const altMatch = attrs.match(/\salt\s*=\s*(['"])(.*?)\1/i);
      const src = srcMatch?.[2]?.trim() || '';
      if (!src || /^javascript:/i.test(src)) return '';
      const alt = (altMatch?.[2] || '').replace(/"/g, '&quot;');
      const classMatch = attrs.match(/\sclass\s*=\s*(['"])(.*?)\1/i);
      const cls = classMatch?.[2] ? ` class="${classMatch[2].replace(/"/g, '&quot;')}"` : '';
      return `<img src="${src.replace(/"/g, '&quot;')}" alt="${alt}"${cls}>`;
    }

    // Text colour from the editor's palette.
    if (tag === 'span') {
      return `<span${safeStyle(attrs, COLOUR_ONLY)}>`;
    }

    // Highlight. TipTap emits data-color alongside the inline style.
    if (tag === 'mark') {
      return `<mark${safeStyle(attrs, HIGHLIGHT_STYLE)}>`;
    }

    // Alignment is the only style the editor writes onto a block element.
    if (ALIGNABLE_TAGS.has(tag)) {
      return `<${tag}${safeStyle(attrs, ALIGN_ONLY)}>`;
    }

    return `<${tag}>`;
  });

  return out;
}

/** Arabic diacritics (tashkeel) and tatweel — invisible, but they break slug matching. */
const ARABIC_MARKS = /[ً-ٰٟـ]/g;

/**
 * Builds a URL slug, keeping Unicode letters so an Arabic title produces a
 * readable Arabic slug instead of a meaningless `post-<timestamp>`.
 *
 * Arabic slugs are valid URLs and good for Arabic search; they are
 * percent-encoded wherever they are emitted (see postUrl in postMeta.ts, which
 * canonical, hreflang and the sitemap all route through).
 */
function slugify(input: string): string {
  return input
    .normalize('NFKC')
    .toLowerCase()
    .trim()
    .replace(ARABIC_MARKS, '')
    // Keep letters and numbers in any script; drop punctuation and symbols.
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 120) || `post-${Date.now()}`;
}

type PostBody = {
  slug?: string;
  titleAr?: string;
  titleEn?: string;
  excerptAr?: string;
  excerptEn?: string;
  contentAr?: string;
  contentEn?: string;
  coverImage?: string | null;
  tagAr?: string | null;
  tagEn?: string | null;
  published?: boolean;
};

function normalizePostInput(body: PostBody, existingSlug?: string) {
  const titleAr = (body.titleAr ?? '').trim();
  const titleEn = (body.titleEn ?? '').trim();
  const published = Boolean(body.published);

  // Drafts stay permissive: writers work in one language first and translate
  // later, so requiring both titles up front would block saving real work.
  // Both are only enforced at publish, when the post becomes public in both.
  // `code` lets the admin UI show a translated message instead of this string.
  if (!titleAr && !titleEn) {
    throw Object.assign(new Error('A title is required in at least one language'), {
      status: 400,
      code: 'TITLE_REQUIRED',
    });
  }
  if (published && (!titleAr || !titleEn)) {
    throw Object.assign(new Error('Both the Arabic and English titles are required to publish'), {
      status: 400,
      code: 'BOTH_TITLES_REQUIRED',
    });
  }

  let slug = (body.slug ?? '').trim() || slugify(titleEn || titleAr);
  slug = slugify(slug);
  if (existingSlug && !body.slug?.trim()) {
    slug = existingSlug;
  }

  return {
    slug,
    titleAr,
    titleEn,
    excerptAr: (body.excerptAr ?? '').trim(),
    excerptEn: (body.excerptEn ?? '').trim(),
    contentAr: sanitizeHtml(body.contentAr ?? ''),
    contentEn: sanitizeHtml(body.contentEn ?? ''),
    coverImage: body.coverImage === undefined ? undefined : (body.coverImage || null),
    tagAr: body.tagAr === undefined ? undefined : (body.tagAr?.trim() || null),
    tagEn: body.tagEn === undefined ? undefined : (body.tagEn?.trim() || null),
    published,
  };
}

export function createPublicBlogRouter(): Router {
  const router = createRouter();

  router.get('/', async (_req, res) => {
    try {
      const posts = await prisma.blogPost.findMany({
        where: { published: true },
        orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
        select: {
          id: true,
          slug: true,
          titleAr: true,
          titleEn: true,
          excerptAr: true,
          excerptEn: true,
          coverImage: true,
          tagAr: true,
          tagEn: true,
          publishedAt: true,
          createdAt: true,
        },
      });
      return res.json(posts);
    } catch (err) {
      console.error('Failed to list blog posts:', err);
      return res.status(500).json({ error: 'Failed to list posts' });
    }
  });

  router.get('/:slug', async (req, res) => {
    try {
      const post = await prisma.blogPost.findFirst({
        where: { slug: req.params.slug, published: true },
      });
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
      return res.json(post);
    } catch (err) {
      console.error('Failed to get blog post:', err);
      return res.status(500).json({ error: 'Failed to get post' });
    }
  });

  return router;
}

export function createAdminBlogRouter(): Router {
  const router = createRouter();
  router.use(requireAuth);

  router.get('/', async (_req, res) => {
    try {
      const posts = await prisma.blogPost.findMany({
        orderBy: [{ updatedAt: 'desc' }],
      });
      return res.json(posts);
    } catch (err) {
      console.error('Failed to list admin posts:', err);
      return res.status(500).json({ error: 'Failed to list posts' });
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const post = await prisma.blogPost.findUnique({ where: { id: req.params.id } });
      if (!post) return res.status(404).json({ error: 'Post not found' });
      return res.json(post);
    } catch (err) {
      console.error('Failed to get admin post:', err);
      return res.status(500).json({ error: 'Failed to get post' });
    }
  });

  router.post('/', async (req, res) => {
    try {
      const data = normalizePostInput(req.body as PostBody);
      const existing = await prisma.blogPost.findUnique({ where: { slug: data.slug } });
      if (existing) {
        return res.status(409).json({ error: 'Slug already exists' });
      }

      const post = await prisma.blogPost.create({
        data: {
          ...data,
          coverImage: data.coverImage ?? null,
          tagAr: data.tagAr ?? null,
          tagEn: data.tagEn ?? null,
          publishedAt: data.published ? new Date() : null,
        },
      });
      return res.status(201).json(post);
    } catch (err) {
      const status = (err as { status?: number }).status || 500;
      if (status === 400) {
        return res.status(400).json({
          error: (err as Error).message,
          code: (err as { code?: string }).code,
        });
      }
      console.error('Failed to create post:', err);
      return res.status(500).json({ error: 'Failed to create post' });
    }
  });

  router.put('/:id', async (req, res) => {
    try {
      const current = await prisma.blogPost.findUnique({ where: { id: req.params.id } });
      if (!current) return res.status(404).json({ error: 'Post not found' });

      const data = normalizePostInput(req.body as PostBody, current.slug);
      if (data.slug !== current.slug) {
        const clash = await prisma.blogPost.findUnique({ where: { slug: data.slug } });
        if (clash) return res.status(409).json({ error: 'Slug already exists' });
      }

      const becomingPublished = data.published && !current.published;
      const post = await prisma.blogPost.update({
        where: { id: current.id },
        data: {
          slug: data.slug,
          titleAr: data.titleAr,
          titleEn: data.titleEn,
          excerptAr: data.excerptAr,
          excerptEn: data.excerptEn,
          contentAr: data.contentAr,
          contentEn: data.contentEn,
          coverImage: data.coverImage === undefined ? current.coverImage : data.coverImage,
          tagAr: data.tagAr === undefined ? current.tagAr : data.tagAr,
          tagEn: data.tagEn === undefined ? current.tagEn : data.tagEn,
          published: data.published,
          publishedAt: data.published
            ? becomingPublished || !current.publishedAt
              ? new Date()
              : current.publishedAt
            : null,
        },
      });
      return res.json(post);
    } catch (err) {
      const status = (err as { status?: number }).status || 500;
      if (status === 400) {
        return res.status(400).json({
          error: (err as Error).message,
          code: (err as { code?: string }).code,
        });
      }
      console.error('Failed to update post:', err);
      return res.status(500).json({ error: 'Failed to update post' });
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
      const current = await prisma.blogPost.findUnique({ where: { id: req.params.id } });
      if (!current) return res.status(404).json({ error: 'Post not found' });
      await prisma.blogPost.delete({ where: { id: current.id } });
      return res.json({ ok: true });
    } catch (err) {
      console.error('Failed to delete post:', err);
      return res.status(500).json({ error: 'Failed to delete post' });
    }
  });

  return router;
}

export function createUploadHandler() {
  return (req: import('express').Request, res: import('express').Response) => {
    upload.single('file')(req, res, (err) => {
      if (err) {
        console.error('Upload failed:', err);
        return res.status(400).json({ error: err instanceof Error ? err.message : 'Upload failed' });
      }
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      return res.json({ url: `/uploads/${req.file.filename}` });
    });
  };
}
