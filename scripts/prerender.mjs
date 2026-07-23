import { createServer } from 'node:http';
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import express from 'express';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');
const port = Number(process.env.PRERENDER_PORT) || 4173;

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

function buildRoutes() {
  const routes = [];
  for (const lang of LANGS) {
    for (const page of PAGES) {
      routes.push(`/${lang}${page}`);
    }
    for (const slug of SERVICE_SLUGS) {
      routes.push(`/${lang}/services/${slug}`);
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

function startStaticServer() {
  const app = express();
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

  const routes = buildRoutes();
  const server = await startStaticServer();
  const browser = await chromium.launch({ headless: true });

  console.log(`Prerendering ${routes.length} routes...`);

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
