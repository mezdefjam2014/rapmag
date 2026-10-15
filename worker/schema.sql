-- RAPAECHELON · RAPMAG articles (Cloudflare D1)
CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  dek TEXT DEFAULT '',
  body TEXT DEFAULT '',
  cover TEXT DEFAULT '',
  category TEXT DEFAULT 'breaking',
  tags TEXT DEFAULT '',
  author TEXT DEFAULT 'RAPMAG Staff',
  status TEXT NOT NULL DEFAULT 'draft',
  featured INTEGER NOT NULL DEFAULT 0,
  views INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  published_at TEXT
);
CREATE INDEX IF NOT EXISTS posts_pub ON posts(status, published_at DESC);
CREATE INDEX IF NOT EXISTS posts_cat ON posts(category, status, published_at DESC);
CREATE TABLE IF NOT EXISTS settings (k TEXT PRIMARY KEY, v TEXT);
