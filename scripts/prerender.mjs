import { createServer } from 'node:http';
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import express from 'express';
import Database from 'better-sqlite3';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');
const publicDir = path.resolve(__dirname, '../public');
const port = Number(process.env.PRERENDER_PORT) || 4173;
const siteUrl = (process.env.VITE_SITE_URL || 'https://adfta.com').replace(/\/$/, '');

const LANGS = ['ar', 'en'];
const PAGES = ['', '/about', '/services', '/contact', '/wealth', '/institutional', '/insights'];
const SERVICE_SLUGS = [
  'tax-compliance',
  'accounting',
  'tax-management',
  'tax-litigation',
  'documentation',
  'inventory',
  'erp',
];

function resolveDbPath() {
  const raw = process.env.DATABASE_URL || 'file:./prisma/dev.db';
  const filePath = raw.startsWith('file:') ? raw.slice('file:'.length) : raw;
  return path.isAbsolute(filePath)
    ? filePath
    : path.resolve(__dirname, '..', filePath);
}

function loadPublishedSlugs() {
  const dbPath = resolveDbPath();
  if (!existsSync(dbPath)) {
    console.warn(`Database not found at ${dbPath}; skipping blog prerender routes.`);
    return [];
  }
  try {
    const db = new Database(dbPath, { readonly: true });
    const rows = db
      .prepare('SELECT slug FROM BlogPost WHERE published = 1 ORDER BY publishedAt DESC')
      .all();
    db.close();
    return rows.map((r) => r.slug).filter(Boolean);
  } catch (err) {
    console.warn('Failed to read published blog slugs:', err);
    return [];
  }
}

function buildRoutes(blogSlugs) {
  const routes = [];
  for (const lang of LANGS) {
    for (const page of PAGES) {
      routes.push(`/${lang}${page}`);
    }
    for (const slug of SERVICE_SLUGS) {
      routes.push(`/${lang}/services/${slug}`);
    }
    for (const slug of blogSlugs) {
      routes.push(`/${lang}/insights/${slug}`);
    }
  }
  return routes;
}

function routeToOutputFile(route) {
  const normalized = route.endsWith('/') && route.length > 1 ? route.slice(0, -1) : route;
  if (normalized === '/ar' || normalized === '/en') {
    return path.join(distDir, normalized.slice(1), 'index.html');
  }
  const relative = normalized.startsWith('/') ? normalized.slice(1) : normalized;
  return path.join(distDir, relative, 'index.html');
}

function writeSitemap(blogSlugs) {
  const escapeXml = (value) =>
    String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

  const bilingualAlternates = (pathAfterLang) => {
    const ar = `${siteUrl}/ar${pathAfterLang}`;
    const en = `${siteUrl}/en${pathAfterLang}`;
    return [
      `    <xhtml:link rel="alternate" hreflang="ar" href="${escapeXml(ar)}" />`,
      `    <xhtml:link rel="alternate" hreflang="en" href="${escapeXml(en)}" />`,
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(ar)}" />`,
    ].join('\n');
  };

  const urls = [];

  const push = (pathAfterLang, changefreq, priority) => {
    for (const lang of LANGS) {
      urls.push(`  <url>
    <loc>${siteUrl}/${lang}${pathAfterLang}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
${bilingualAlternates(pathAfterLang)}
  </url>`);
    }
  };

  push('', 'weekly', '1.0');
  push('/about', 'monthly', '0.8');
  push('/services', 'monthly', '0.9');
  push('/contact', 'monthly', '0.8');
  push('/wealth', 'monthly', '0.7');
  push('/institutional', 'monthly', '0.7');
  push('/insights', 'weekly', '0.85');
  for (const slug of SERVICE_SLUGS) {
    push(`/services/${slug}`, 'monthly', '0.85');
  }
  for (const slug of blogSlugs) {
    push(`/insights/${slug}`, 'weekly', '0.7');
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`;

  writeFileSync(path.join(publicDir, 'sitemap.xml'), xml, 'utf8');
  writeFileSync(path.join(distDir, 'sitemap.xml'), xml, 'utf8');
  console.log(`Sitemap written with ${blogSlugs.length} blog post(s).`);
}

function startStaticServer() {
  const app = express();
  const uploadsDir = path.resolve(__dirname, '../uploads');
  const dbPath = resolveDbPath();

  if (existsSync(uploadsDir)) {
    app.use('/uploads', express.static(uploadsDir));
  }

  // Serve published blog JSON so client pages hydrate during prerender
  app.get('/api/blog', (_req, res) => {
    if (!existsSync(dbPath)) return res.json([]);
    try {
      const db = new Database(dbPath, { readonly: true });
      const posts = db
        .prepare(
          `SELECT id, slug, titleAr, titleEn, excerptAr, excerptEn, coverImage, tagAr, tagEn, publishedAt, createdAt
           FROM BlogPost WHERE published = 1
           ORDER BY publishedAt DESC`,
        )
        .all();
      db.close();
      res.json(posts);
    } catch (err) {
      console.warn('prerender /api/blog failed:', err);
      res.json([]);
    }
  });

  app.get('/api/blog/:slug', (req, res) => {
    if (!existsSync(dbPath)) return res.status(404).json({ error: 'Not found' });
    try {
      const db = new Database(dbPath, { readonly: true });
      const post = db
        .prepare('SELECT * FROM BlogPost WHERE slug = ? AND published = 1')
        .get(req.params.slug);
      db.close();
      if (!post) return res.status(404).json({ error: 'Not found' });
      res.json(post);
    } catch (err) {
      console.warn('prerender /api/blog/:slug failed:', err);
      res.status(500).json({ error: 'Failed' });
    }
  });

  app.use(express.static(distDir));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });

  return new Promise((resolve) => {
    const server = createServer(app);
    server.listen(port, () => resolve(server));
  });
}

async function prerender() {
  if (!existsSync(distDir)) {
    console.error('dist/ not found. Run vite build first.');
    process.exit(1);
  }

  // Load env for DATABASE_URL
  try {
    const dotenv = await import('dotenv');
    dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
    dotenv.config({ path: path.resolve(__dirname, '../.env') });
  } catch {
    // optional
  }

  const blogSlugs = loadPublishedSlugs();
  writeSitemap(blogSlugs);

  const routes = buildRoutes(blogSlugs);
  const server = await startStaticServer();
  const browser = await chromium.launch({ headless: true });

  console.log(`Prerendering ${routes.length} routes (${blogSlugs.length} blog slugs)...`);

  try {
    for (const route of routes) {
      const page = await browser.newPage();
      const url = `http://127.0.0.1:${port}${route}`;

      await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
      await page.waitForTimeout(500);

      const html = await page.content();
      const outFile = routeToOutputFile(route);
      mkdirSync(path.dirname(outFile), { recursive: true });
      writeFileSync(outFile, html, 'utf8');

      console.log(`  ✓ ${route}`);
      await page.close();
    }
  } finally {
    await browser.close();
    server.close();
  }

  console.log('Prerender complete.');
}

prerender().catch((err) => {
  console.error(err);
  process.exit(1);
});
