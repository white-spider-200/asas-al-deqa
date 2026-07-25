import type { Router } from 'express';
import { Router as createRouter } from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { prisma } from './db.js';
import { requireAuth } from './auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const uploadsDir = path.resolve(__dirname, '../uploads');

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
  'code', 'pre', 'hr',
]);

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

    return `<${tag}>`;
  });

  return out;
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
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
  if (!titleAr || !titleEn) {
    throw Object.assign(new Error('titleAr and titleEn are required'), { status: 400 });
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
    published: Boolean(body.published),
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
        return res.status(400).json({ error: (err as Error).message });
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
        return res.status(400).json({ error: (err as Error).message });
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
