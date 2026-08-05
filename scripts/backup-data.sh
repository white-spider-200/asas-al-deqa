#!/usr/bin/env bash
#
# Nightly backup of the adfta.com live data (blog database + uploaded images).
#
# The database is copied with `sqlite3 .backup` rather than `cp`: the site is
# live, and a plain copy can capture a torn file if a write lands mid-read.
#
# Installed as a cron job — see docs/deployment.md.
set -euo pipefail

DATA_DIR="${ADFTA_DATA_DIR:-/home/server/data/adfta}"
BACKUP_ROOT="${ADFTA_BACKUP_DIR:-/home/server/backups/adfta}"
KEEP_DAYS="${ADFTA_BACKUP_KEEP_DAYS:-30}"

STAMP="$(date +%Y%m%d-%H%M%S)"
DEST="$BACKUP_ROOT/$STAMP"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"; }

if [ ! -f "$DATA_DIR/blog.db" ]; then
  log "ERROR: $DATA_DIR/blog.db not found — nothing to back up"
  exit 1
fi

mkdir -p "$DEST"

# Consistent snapshot of a live SQLite database.
sqlite3 "$DATA_DIR/blog.db" ".backup '$DEST/blog.db'"

# Verify the copy is readable and non-empty before we trust it.
POSTS="$(sqlite3 "$DEST/blog.db" 'SELECT COUNT(*) FROM BlogPost;')"
log "database backed up ($POSTS posts)"

if [ -d "$DATA_DIR/uploads" ]; then
  tar -czf "$DEST/uploads.tar.gz" -C "$DATA_DIR" uploads
  log "uploads backed up ($(du -sh "$DEST/uploads.tar.gz" | cut -f1))"
fi

# Retention: drop snapshots older than KEEP_DAYS.
find "$BACKUP_ROOT" -mindepth 1 -maxdepth 1 -type d -mtime "+$KEEP_DAYS" -exec rm -rf {} + 2>/dev/null || true

log "backup complete: $DEST"
