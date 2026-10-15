-- v2: authors, categories, alt text, audio, social posting marks
ALTER TABLE posts ADD COLUMN cover_alt TEXT DEFAULT '';
ALTER TABLE posts ADD COLUMN audio TEXT DEFAULT '';
ALTER TABLE posts ADD COLUMN author_id INTEGER;
ALTER TABLE posts ADD COLUMN social_fb TEXT;
ALTER TABLE posts ADD COLUMN social_x TEXT;
CREATE TABLE IF NOT EXISTS authors (id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT UNIQUE NOT NULL, name TEXT NOT NULL, role TEXT DEFAULT '', beat TEXT DEFAULT '', location TEXT DEFAULT '', bio TEXT DEFAULT '', photo TEXT DEFAULT '', website TEXT DEFAULT '', instagram TEXT DEFAULT '', x TEXT DEFAULT '', facebook TEXT DEFAULT '', youtube TEXT DEFAULT '', verified INTEGER DEFAULT 0, active INTEGER DEFAULT 1);
CREATE TABLE IF NOT EXISTS categories (slug TEXT PRIMARY KEY, name TEXT NOT NULL, visible INTEGER DEFAULT 1, sort INTEGER DEFAULT 0);
INSERT OR IGNORE INTO categories (slug,name,visible,sort) VALUES ('breaking','Breaking',1,1),('music','Music',1,2),('entertainment','Entertainment',1,3);
INSERT OR IGNORE INTO authors (slug,name,role,verified,active) VALUES ('rapmag-staff','RAPMAG Staff','RAPMAG Editorial Staff',1,1);
UPDATE posts SET author_id=(SELECT id FROM authors WHERE slug='rapmag-staff') WHERE author_id IS NULL AND category<>'page';
