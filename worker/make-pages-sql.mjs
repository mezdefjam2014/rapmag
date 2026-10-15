// writes pages.sql (About / Editorial Standards / Corrections Policy) for: wrangler d1 execute rapmag-db --remote --file=pages.sql
import fs from 'fs';
const q = s => "'" + String(s).replace(/'/g, "''") + "'", esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const sql = JSON.parse(fs.readFileSync('info-pages.json', 'utf8')).map(p => {
  const slug = p.slug === 'corrections' ? 'corrections-policy' : p.slug, body = p.content.split(/\n\s*\n/).map(x => '<p>' + esc(x.trim()).replace(/([\w.+-]+@[\w-]+\.[\w.]+)/g, '<a href="mailto:$1">$1</a>') + '</p>').join('');
  return `INSERT INTO posts (slug,title,dek,body,category,author,status,published_at) VALUES (${q(slug)},${q(p.title)},'',${q(body)},'page','Rapaechelon','published',datetime('now')) ON CONFLICT(slug) DO UPDATE SET body=excluded.body WHERE posts.slug='contact';`;
}).join('\n');
fs.writeFileSync('pages.sql', sql + '\n'); console.log('pages.sql written');
