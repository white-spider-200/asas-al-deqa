# Deployment — Asas Al-Deqa (adfta.com)

Verified on the production host, 2026-08-02. This is the live setup; there is no
CI, no Dockerfile, and no deploy script. Deploys are manual on this machine.

## Request chain

```
adfta.com  →  301 → www.adfta.com
           →  Cloudflare (DNS is Cloudflare-proxied: 2a06:98c1:312x::7)
           →  cloudflared named tunnel  (token-based)
           →  http://127.0.0.1:3004
           →  pm2 process "asas-al-deqa"
           →  npm start  →  tsx server/index.ts   (NODE_ENV=production)
           →  Express serves dist/ + /api/* + /uploads/* + /sitemap.xml
```

Express serves both the API and the built SPA, so **one process serves the whole
site**. There is no separate frontend server.

## The pm2 process

| | |
|---|---|
| pm2 name | `asas-al-deqa` (id 27) |
| cwd | `/home/server/Desktop/project/asas-al-deqa` |
| command | `npm start` → `NODE_ENV=production tsx server/index.ts` |
| port | `3004` (set as a pm2 env var, **not** in `.env`) |
| node | 20.20.2 (via nvm) |
| stdout log | `/home/server/.pm2/logs/asas-al-deqa-out.log` |
| stderr log | `/home/server/.pm2/logs/asas-al-deqa-error.log` |

```bash
pm2 logs asas-al-deqa          # tail logs
pm2 restart asas-al-deqa       # restart after a deploy
pm2 describe asas-al-deqa      # full config
```

## Where the domain routing actually lives

**Not on this machine.** Both cloudflared tunnels run with `--token`, which means
their ingress rules are stored **remotely in the Cloudflare Zero Trust dashboard**
(Networks → Tunnels), not in a local file.

`/etc/cloudflared/config.yml` exists but is for a *different* tunnel
(`websites-local`, serving teamtask/sabina) and does **not** mention adfta.com.
`grep adfta /etc/nginx /etc/cloudflared` returns nothing. nginx does not proxy
this site at all.

So: to change the hostname → port mapping for adfta.com, edit the tunnel's public
hostname in the Cloudflare dashboard, not any file here.

## Deploying a change

```bash
cd /home/server/Desktop/project/asas-al-deqa
git pull
npm install                 # only if dependencies changed
npm run build               # vite build + Playwright prerender into dist/
pm2 restart asas-al-deqa
pm2 logs asas-al-deqa --lines 50
```

`npm start` runs TypeScript directly through `tsx` — the server is **not**
precompiled, so no build step is needed for files under `server/`. Only the
frontend needs `npm run build`.

## Ports on this host (many projects share it)

This machine runs ~27 pm2 apps. Ports already taken include 3000, 3001
(royal-regime), 3002, 3003, 3005–3014, 5000, 5175. **3004 is ours.** Check with
`ss -ltnp` before binding anything new for local testing.

## Known production issues

## Live data lives OUTSIDE the repo (as of 2026-08-02)

```
/home/server/data/adfta/blog.db     ← production SQLite database
/home/server/data/adfta/uploads/    ← uploaded blog images
```

Set in `.env` as `DATABASE_URL="file:/home/server/data/adfta/blog.db"` and
`UPLOADS_DIR="/home/server/data/adfta/uploads"`. Owned by the `server` user that
pm2 runs as. (`/var/lib/adfta` would be the conventional spot but needs root;
this host has no passwordless sudo.)

**Never point these back at the repo.** Previously `DATABASE_URL` was
`file:./prisma/dev.db` with pm2's cwd set to the repo, which meant a `git pull`,
`git checkout`, or `git stash` could overwrite live blog posts. `prisma/dev.db`
is now untracked and `*.db` is gitignored, but the real protection is the path
above.

The old `prisma/dev.db` has been deleted. Do not recreate it: if `DATABASE_URL`
is ever wrong, an empty file at that path would let the site come up serving no
posts instead of failing visibly.

### Backups

A cron job runs nightly at 03:15:

```
15 3 * * * /home/server/Desktop/project/asas-al-deqa/scripts/backup-data.sh \
             >> /home/server/backups/adfta/backup.log 2>&1
```

Snapshots land in `/home/server/backups/adfta/<timestamp>/` as `blog.db` plus
`uploads.tar.gz`, and are kept for 30 days. The script uses `sqlite3 .backup`
rather than `cp` — the site is live, and a plain copy can capture a torn file
mid-write. It counts the rows in the copy afterwards and fails loudly if the
source database is missing.

Run it by hand before risky work:

```bash
./scripts/backup-data.sh
tail /home/server/backups/adfta/backup.log
```

Restore is a straight copy back:

```bash
pm2 stop asas-al-deqa
cp /home/server/backups/adfta/<stamp>/blog.db /home/server/data/adfta/blog.db
tar -xzf /home/server/backups/adfta/<stamp>/uploads.tar.gz -C /home/server/data/adfta
pm2 start asas-al-deqa
```

## Known production issues

### 1. Uploaded images were already lost once

`uploads/` was found **empty** while the published post `moahmmed` still
referenced `/uploads/1784980572820-39uk7wfw.png`. That file is gone and is not
recoverable — the post renders with a broken cover image until someone
re-uploads one. Moving uploads outside the repo prevents a repeat, but there are
still no backups of this directory; consider a cron copy to `~/backups`.

### 2. Admin password is a single shared secret

`.env` holds `ADMIN_PASSWORD_HASH=scrypt:<salt>:<hash>` (generated by
`scripts/hash-admin-password.mjs`). The `AdminCredential` table is empty, so
`server/auth.ts` falls back to that env hash — meaning **the password survives a
database move but is lost if `.env` is lost.** A password reset via
`/admin/forgot-password` writes a row into `AdminCredential`, which then takes
priority over the env hash.

There is no per-user login: everyone on the marketing team shares one password,
so there is no record of who published what.

## Verifying a deploy

**Check the database path first.** A wrong `DATABASE_URL` produces no error at
all — the site comes up fine and simply serves an empty blog. The startup log
prints the resolved path:

```bash
pm2 logs asas-al-deqa --lines 20 --nostream | grep '\[db\]'
# expected: [db] using file:/home/server/data/adfta/blog.db
```

`server/env.ts` must stay the **first** import in `server/index.ts`. ES modules
evaluate imports in declaration order, and `db.ts` reads `DATABASE_URL` at import
time — calling `dotenv.config()` in the body of `index.ts` is too late and
silently falls back to `./prisma/dev.db`. `scripts/prerender.mjs` imports
`dotenv/config` for the same reason.

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:3004/
curl -s http://127.0.0.1:3004/api/blog | head -c 200   # must NOT be []

# Blog SEO tags are injected from the DB at request time (server/postMeta.ts).
# A published post must return og:type=article and its own canonical URL:
curl -s http://127.0.0.1:3004/ar/insights/<slug> | grep -E "<title|canonical|og:type"
```

If a post page returns `og:type="website"` and `canonical="https://adfta.com/"`,
the runtime meta injection is not active — that is the static `index.html` head
leaking through.
