/* RAPAECHELON - RAPMAG API (Cloudflare Worker)
   Public:  GET /api/posts?cat=&q=&author=&limit=&offset=   GET /api/posts/:slug   GET /api/cats   GET /api/authors/:slug   GET /api/trending
            GET /api/settings   GET /api/build (everything the static page builder needs)   POST /api/view/:slug   GET /img/<key>
   Admin (Bearer token from /api/admin/login): posts, authors, categories, settings, media/audio upload, related-story search,
            social distribution (Facebook Page + X) with optional auto-posting when an article goes live (scheduled ones via the cron).
   A post is public when status='published' AND published_at <= now, so scheduling is just a future published_at. */
const SETTINGS = ['logo', 'promo_image', 'promo_link', 'promo_label', 'youtube', 'instagram', 'x', 'facebook', 'tagline', 'site_url', 'adsense_id', 'auto_fb', 'auto_x', 'social_hashtag', 'social_excerpt', 'social_category'];
const LIVE = `p.status='published' AND p.published_at <= datetime('now')`;
const LIST = `p.id,p.slug,p.title,p.dek,p.cover,p.cover_alt,p.category,p.tags,p.featured,p.views,p.published_at,p.updated_at,COALESCE(a.name,p.author) author,a.slug author_slug,a.verified author_verified`;
const FROM = `FROM posts p LEFT JOIN authors a ON a.id=p.author_id`;

export default {
  async scheduled(ev, env, ctx) { ctx.waitUntil(autoSocial(env)) },
  async fetch(req, env, ctx) {
    const url = new URL(req.url), p = url.pathname, origin = req.headers.get('Origin') || '';
    const allowed = (env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim());
    const cors = { 'Access-Control-Allow-Origin': allowed.includes(origin) ? origin : allowed[0] || '*', 'Access-Control-Allow-Headers': 'Content-Type, Authorization', 'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS', 'Vary': 'Origin' };
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
    const json = (d, s = 200, h = {}) => new Response(JSON.stringify(d), { status: s, headers: { 'Content-Type': 'application/json', ...cors, ...h } });
    const DB = env.DB, all = async (sql, ...a) => (await DB.prepare(sql).bind(...a).all()).results, one = (sql, ...a) => DB.prepare(sql).bind(...a).first();
    try {
      /* ---------- files ---------- */
      if (p.startsWith('/img/') && req.method === 'GET') {
        const key = decodeURIComponent(p.slice(5)), range = req.headers.get('Range');
        const obj = await env.IMAGES.get(key, range ? { range: req.headers } : undefined);
        if (!obj) return new Response('Not found', { status: 404, headers: cors });
        const h = new Headers(cors); obj.writeHttpMetadata(h); h.set('ETag', obj.httpEtag); h.set('Cache-Control', 'public, max-age=31536000, immutable'); h.set('Accept-Ranges', 'bytes');
        if (range && obj.range) { const o = obj.range.offset || 0, l = obj.range.length ?? obj.size - o; h.set('Content-Range', `bytes ${o}-${o + l - 1}/${obj.size}`); h.set('Content-Length', l); return new Response(obj.body, { status: 206, headers: h }) }
        return new Response(obj.body, { headers: h });
      }
      /* ---------- public ---------- */
      if (p === '/api/posts' && req.method === 'GET') {
        const cat = url.searchParams.get('cat'), au = url.searchParams.get('author'), q = (url.searchParams.get('q') || '').trim(), lim = Math.min(50, +url.searchParams.get('limit') || 24), off = Math.max(0, +url.searchParams.get('offset') || 0);
        let sql = `SELECT ${LIST} ${FROM} WHERE ${LIVE} AND p.category<>'page'`, args = [];
        if (cat) { sql += ' AND p.category=?'; args.push(cat) }
        if (au) { sql += ' AND a.slug=?'; args.push(au) }
        if (q) { sql += ' AND (p.title LIKE ? OR p.dek LIKE ? OR p.tags LIKE ?)'; args.push(`%${q}%`, `%${q}%`, `%${q}%`) }
        sql += ' ORDER BY p.featured DESC, p.published_at DESC LIMIT ? OFFSET ?'; args.push(lim, off);
        return json({ posts: await all(sql, ...args) }, 200, { 'Cache-Control': 'public, max-age=60' });
      }
      if (p === '/api/trending') return json({ posts: await all(`SELECT ${LIST} ${FROM} WHERE ${LIVE} AND p.category<>'page' AND p.published_at > datetime('now','-30 days') ORDER BY p.views DESC LIMIT 5`) }, 200, { 'Cache-Control': 'public, max-age=120' });
      if (p === '/api/settings') return json({ settings: await settings(env) }, 200, { 'Cache-Control': 'public, max-age=60' });
      if (p === '/api/cats') return json({ cats: await all(`SELECT slug,name FROM categories WHERE visible=1 ORDER BY sort,name`) }, 200, { 'Cache-Control': 'public, max-age=120' });
      let m = p.match(/^\/api\/authors\/([a-z0-9-]+)$/);
      if (m) { const a = await one(`SELECT slug,name,role,beat,location,bio,photo,website,instagram,x,facebook,youtube,verified FROM authors WHERE slug=? AND active=1`, m[1]); return a ? json({ author: a }) : json({ error: 'not found' }, 404) }
      m = p.match(/^\/api\/posts\/([a-z0-9-]+)$/);
      if (m && req.method === 'GET') {
        const post = await one(`SELECT p.*,COALESCE(a.name,p.author) author,a.slug author_slug,a.verified author_verified,a.photo author_photo,a.role author_role ${FROM} WHERE p.slug=? AND ${LIVE}`, m[1]);
        if (!post) return json({ error: 'not found' }, 404);
        const related = post.category === 'page' ? [] : await all(`SELECT ${LIST} ${FROM} WHERE ${LIVE} AND p.category=? AND p.id<>? ORDER BY p.published_at DESC LIMIT 4`, post.category, post.id);
        return json({ post, related }, 200, { 'Cache-Control': 'public, max-age=60' });
      }
      if (p === '/api/build') {
        const posts = await all(`SELECT p.slug,p.title,p.dek,p.body,p.cover,p.cover_alt,p.category,p.tags,p.audio,p.published_at,p.updated_at,COALESCE(a.name,p.author) author,a.slug author_slug,a.verified author_verified ${FROM} WHERE ${LIVE} ORDER BY p.published_at DESC`);
        return json({ posts, authors: await all(`SELECT slug,name,role,beat,location,bio,photo,website,instagram,x,facebook,youtube,verified FROM authors WHERE active=1`), cats: await all(`SELECT slug,name FROM categories WHERE visible=1 ORDER BY sort,name`), settings: await settings(env) });
      }
      m = p.match(/^\/api\/view\/([a-z0-9-]+)$/);
      if (m && req.method === 'POST') { await DB.prepare(`UPDATE posts SET views=views+1 WHERE slug=?`).bind(m[1]).run(); return json({ ok: true }) }

      /* ---------- admin ---------- */
      if (p === '/api/admin/login' && req.method === 'POST') {
        const { password } = await req.json().catch(() => ({}));
        if (!env.ADMIN_PASSWORD || !password || !(await same(password, env.ADMIN_PASSWORD))) { await new Promise(r => setTimeout(r, 600)); return json({ error: 'Wrong password' }, 401) }
        const exp = Date.now() + 1000 * 60 * 60 * 24 * 7;
        return json({ token: exp + '.' + await sign(String(exp), env) });
      }
      if (!p.startsWith('/api/admin/')) return json({ error: 'Not found' }, 404);
      if (!(await authed(req, env))) return json({ error: 'Not logged in' }, 401);
      const body = req.method === 'POST' && !(req.headers.get('Content-Type') || '').startsWith('multipart') ? await req.json().catch(() => ({})) : null;

      /* posts */
      if (p === '/api/admin/posts' && req.method === 'GET') return json({ posts: await all(`SELECT ${LIST},p.status,p.social_fb,p.social_x FROM posts p LEFT JOIN authors a ON a.id=p.author_id ORDER BY COALESCE(p.published_at,p.updated_at) DESC`) });
      m = p.match(/^\/api\/admin\/posts\/(\d+)$/);
      if (m && req.method === 'GET') return json({ post: await one('SELECT * FROM posts WHERE id=?', +m[1]) });
      if (m && req.method === 'DELETE') {
        /* delete the article, then every file it used (cover, audio, story images) that nothing else still uses */
        const post = await one('SELECT * FROM posts WHERE id=?', +m[1]); if (!post) return json({ ok: true });
        await DB.prepare('DELETE FROM posts WHERE id=?').bind(post.id).run();
        const keys = filesOf(post), removed = [], kept = [];
        for (const k of keys) { if ((await usage(env, k)).length) kept.push(k); else { await env.IMAGES.delete(k); removed.push(k) } }
        return json({ ok: true, removed: removed.length, kept: kept.length });
      }
      if (p === '/api/admin/images/usage' && req.method === 'GET') return json({ used: await usage(env, url.searchParams.get('key') || '') });
      if (p === '/api/admin/posts' && req.method === 'POST') {
        const b = body, slug = slugify(b.slug || b.title || '');
        if (!b.title || !slug) return json({ error: 'A title is needed' }, 400);
        const cats = (await all('SELECT slug FROM categories')).map(c => c.slug).concat('page');
        const cat = cats.includes(b.category) ? b.category : (cats[0] || 'breaking'), status = b.status === 'published' ? 'published' : 'draft';
        const when = b.publish_at && !isNaN(Date.parse(b.publish_at)) ? new Date(b.publish_at).toISOString().slice(0, 19).replace('T', ' ') : null;
        const au = (+b.author_id ? await one('SELECT id,name FROM authors WHERE id=?', +b.author_id) : null) || (cat === 'page' ? null : await one('SELECT id,name FROM authors WHERE active=1 ORDER BY id LIMIT 1'));
        const dupe = await one('SELECT id FROM posts WHERE slug=? AND id<>?', slug, +b.id || 0);
        if (dupe) return json({ error: 'Another article already uses this link (slug). Change the title or slug.' }, 409);
        if (b.featured) await DB.prepare('UPDATE posts SET featured=0 WHERE id<>?').bind(+b.id || 0).run();
        const f = { slug, title: String(b.title).slice(0, 200), dek: String(b.dek || '').slice(0, 400), body: clean(String(b.body || '')), cover: String(b.cover || ''), cover_alt: String(b.cover_alt || '').slice(0, 200), category: cat, tags: String(b.tags || '').slice(0, 300), author: au ? au.name : String(b.author || 'RAPMAG Staff').slice(0, 80), author_id: au ? au.id : null, audio: String(b.audio || ''), status, featured: b.featured ? 1 : 0 };
        let id = +b.id, prev = id ? await one('SELECT status,published_at FROM posts WHERE id=?', id) : null;
        const pub = status === 'published' ? (when || (prev && prev.status === 'published' && prev.published_at) || now()) : (prev ? prev.published_at : null);
        const cols = Object.keys(f);
        if (id) await DB.prepare(`UPDATE posts SET ${cols.map(c => c + '=?').join(',')},published_at=?,updated_at=datetime('now') WHERE id=?`).bind(...cols.map(c => f[c]), pub, id).run();
        else id = (await DB.prepare(`INSERT INTO posts (${cols.join(',')},published_at) VALUES (${cols.map(() => '?').join(',')},?) RETURNING id`).bind(...cols.map(c => f[c]), pub).first()).id;
        if (status === 'published') ctx.waitUntil(autoSocial(env));
        return json({ post: await one('SELECT * FROM posts WHERE id=?', id) });
      }
      if (p === '/api/admin/related' && req.method === 'GET') {
        const q = (url.searchParams.get('q') || '').trim(), words = q.split(/\s+/).filter(w => w.length > 2).slice(0, 6);
        if (!words.length) return json({ posts: [] });
        const r = await all(`SELECT p.slug,p.title,p.category,p.published_at FROM posts p WHERE ${LIVE} AND p.category<>'page' AND (${words.map(() => '(p.title LIKE ? OR p.tags LIKE ? OR p.dek LIKE ?)').join(' OR ')}) ORDER BY p.published_at DESC LIMIT 20`, ...words.flatMap(w => [`%${w}%`, `%${w}%`, `%${w}%`]));
        return json({ posts: r });
      }
      /* authors */
      if (p === '/api/admin/authors' && req.method === 'GET') return json({ authors: await all('SELECT a.*,(SELECT COUNT(*) FROM posts WHERE author_id=a.id) n FROM authors a ORDER BY a.id') });
      if (p === '/api/admin/authors' && req.method === 'POST') {
        const b = body, slug = slugify(b.slug || b.name || ''); if (!b.name || !slug) return json({ error: 'A name is needed' }, 400);
        const F = ['name', 'role', 'beat', 'location', 'bio', 'photo', 'website', 'instagram', 'x', 'facebook', 'youtube'], v = F.map(k => String(b[k] || '').slice(0, k === 'bio' ? 2000 : 300));
        if (+b.id) { await DB.prepare(`UPDATE authors SET slug=?,${F.map(k => k + '=?').join(',')},verified=?,active=? WHERE id=?`).bind(slug, ...v, b.verified ? 1 : 0, b.active === false ? 0 : 1, +b.id).run(); await DB.prepare('UPDATE posts SET author=? WHERE author_id=?').bind(String(b.name).slice(0, 80), +b.id).run() }
        else await DB.prepare(`INSERT INTO authors (slug,${F.join(',')},verified,active) VALUES (?,${F.map(() => '?').join(',')},?,1)`).bind(slug, ...v, b.verified ? 1 : 0).run();
        return json({ ok: true });
      }
      m = p.match(/^\/api\/admin\/authors\/(\d+)$/);
      if (m && req.method === 'DELETE') { const n = await one('SELECT COUNT(*) n FROM posts WHERE author_id=?', +m[1]); if (n.n) return json({ error: 'This author has articles. Move them to another author first, or switch the profile off.' }, 409); await DB.prepare('DELETE FROM authors WHERE id=?').bind(+m[1]).run(); return json({ ok: true }) }
      /* categories */
      if (p === '/api/admin/categories' && req.method === 'GET') return json({ cats: await all(`SELECT c.*,(SELECT COUNT(*) FROM posts WHERE category=c.slug) n FROM categories c ORDER BY sort,name`) });
      if (p === '/api/admin/categories' && req.method === 'POST') {
        const b = body, name = String(b.name || '').trim().slice(0, 40); if (!name) return json({ error: 'A name is needed' }, 400);
        if (b.old) await DB.prepare('UPDATE categories SET name=?,visible=?,sort=? WHERE slug=?').bind(name, b.visible === false ? 0 : 1, +b.sort || 0, b.old).run();
        else { const s = slugify(name); if (s === 'page' || await one('SELECT slug FROM categories WHERE slug=?', s)) return json({ error: 'That category already exists' }, 409); await DB.prepare('INSERT INTO categories (slug,name,visible,sort) VALUES (?,?,1,?)').bind(s, name, 99).run() }
        return json({ ok: true });
      }
      m = p.match(/^\/api\/admin\/categories\/([a-z0-9-]+)$/);
      if (m && req.method === 'DELETE') { const n = await one('SELECT COUNT(*) n FROM posts WHERE category=?', m[1]); if (n.n) return json({ error: 'This category still has ' + n.n + ' article(s). Move them first, or hide the category.' }, 409); await DB.prepare('DELETE FROM categories WHERE slug=?').bind(m[1]).run(); return json({ ok: true }) }
      /* settings */
      if (p === '/api/admin/settings' && req.method === 'POST') {
        for (const k of SETTINGS) if (k in body) await DB.prepare('INSERT INTO settings (k,v) VALUES (?,?) ON CONFLICT(k) DO UPDATE SET v=excluded.v').bind(k, String(body[k] ?? '').slice(0, 500)).run();
        return json({ ok: true });
      }
      /* uploads: images and article audio */
      if (p === '/api/admin/upload' && req.method === 'POST') {
        const fd = await req.formData(), f = fd.get('file');
        if (!f || typeof f === 'string') return json({ error: 'No file' }, 400);
        const T = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif', 'image/avif': 'avif', 'audio/mpeg': 'mp3', 'audio/mp3': 'mp3', 'audio/mp4': 'm4a', 'audio/x-m4a': 'm4a', 'audio/wav': 'wav', 'audio/x-wav': 'wav', 'audio/ogg': 'ogg' }, ext = T[f.type];
        if (!ext) return json({ error: 'Images (JPG, PNG, WEBP, GIF, AVIF) or audio (MP3, M4A, WAV, OGG) only' }, 400);
        const audio = f.type.startsWith('audio/'); if (f.size > (audio ? 80 : 15) * 1024 * 1024) return json({ error: audio ? 'Audio is over 80 MB' : 'Image is over 15 MB' }, 400);
        const d = new Date(), key = `${audio ? 'audio' : 'images'}/${d.getUTCFullYear()}/${String(d.getUTCMonth() + 1).padStart(2, '0')}/${crypto.randomUUID().slice(0, 8)}-${slugify(String(f.name).replace(/\.[^.]+$/, '')).slice(0, 40) || 'file'}.${ext}`;
        await env.IMAGES.put(key, f.stream(), { httpMetadata: { contentType: f.type } });
        return json({ key, url: '/img/' + key });
      }
      if (p === '/api/admin/images' && req.method === 'GET') {
        const l = await env.IMAGES.list({ prefix: 'images/', limit: 300, cursor: url.searchParams.get('cursor') || undefined });
        return json({ images: l.objects.sort((a, b) => b.uploaded - a.uploaded).map(o => ({ key: o.key, url: '/img/' + o.key, size: o.size, uploaded: o.uploaded })), cursor: l.truncated ? l.cursor : null });
      }
      if (p.startsWith('/api/admin/images/') && req.method === 'DELETE') { await env.IMAGES.delete(decodeURIComponent(p.slice(18))); return json({ ok: true }) }
      /* social distribution */
      if (p === '/api/admin/social/test') return json(await socialTest(env));
      if (p === '/api/admin/social/post' && req.method === 'POST') {
        const post = await one(`SELECT p.* FROM posts p WHERE p.id=? AND ${LIVE}`, +body.id); if (!post) return json({ error: 'Only live articles can be posted' }, 400);
        const S = await settings(env), out = {};
        if (body.fb) out.facebook = await postFacebook(env, post, S).then(() => 'posted', e => e.message);
        if (body.x) out.x = await postX(env, post, S).then(() => 'posted', e => e.message);
        if (out.facebook === 'posted') await DB.prepare(`UPDATE posts SET social_fb=datetime('now') WHERE id=?`).bind(post.id).run();
        if (out.x === 'posted') await DB.prepare(`UPDATE posts SET social_x=datetime('now') WHERE id=?`).bind(post.id).run();
        return json({ result: out });
      }
      return json({ error: 'Not found' }, 404);
    } catch (e) { return json({ error: String(e && e.message || e) }, 500) }
  }
};

/* ---------- social ---------- */
async function settings(env) { const r = await env.DB.prepare('SELECT k,v FROM settings').all(); return Object.fromEntries(r.results.map(x => [x.k, x.v])) }
function siteUrl(S) { return (S.site_url || 'https://mezdefjam2014.github.io/rapmag').replace(/\/+$/, '') }
function articleUrl(S, post) { return siteUrl(S) + '/article/' + post.slug + '/' }
function tags(post, S) { return (S.social_hashtag ? ' #' + S.social_hashtag.replace(/^#/, '').replace(/\s+/g, '') : '') + (S.social_category === '1' && post.category ? ' #' + post.category.replace(/-/g, '') : '') }
async function postFacebook(env, post, S) {
  if (!env.FB_PAGE_ID || !env.FB_PAGE_TOKEN) throw new Error('Facebook is not connected');
  const msg = post.title + (S.social_excerpt === '1' && post.dek ? '\n\n' + post.dek : '') + tags(post, S);
  const r = await fetch(`https://graph.facebook.com/v21.0/${env.FB_PAGE_ID}/feed`, { method: 'POST', body: new URLSearchParams({ message: msg, link: articleUrl(S, post), access_token: env.FB_PAGE_TOKEN }) });
  const d = await r.json(); if (!r.ok) throw new Error((d.error && d.error.message) || 'Facebook error ' + r.status);
}
async function postX(env, post, S) {
  if (!env.X_API_KEY || !env.X_API_SECRET || !env.X_ACCESS_TOKEN || !env.X_ACCESS_SECRET) throw new Error('X is not connected');
  const tail = '\n\n' + articleUrl(S, post) + tags(post, S), room = 280 - 23 - tags(post, S).length - 2, text = (post.title.length > room ? post.title.slice(0, room - 1) + '…' : post.title) + tail;
  const u = 'https://api.x.com/2/tweets', r = await fetch(u, { method: 'POST', headers: { Authorization: await oauth1('POST', u, env), 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) });
  const d = await r.json().catch(() => ({})); if (!r.ok) throw new Error(d.detail || d.title || 'X error ' + r.status);
}
async function socialTest(env) {
  const out = { facebook: 'not connected', x: 'not connected' };
  if (env.FB_PAGE_ID && env.FB_PAGE_TOKEN) { const r = await fetch(`https://graph.facebook.com/v21.0/${env.FB_PAGE_ID}?fields=name&access_token=${encodeURIComponent(env.FB_PAGE_TOKEN)}`), d = await r.json(); out.facebook = r.ok ? 'connected: ' + d.name : 'error: ' + ((d.error && d.error.message) || r.status) }
  if (env.X_API_KEY && env.X_ACCESS_TOKEN) { const u = 'https://api.x.com/2/users/me', r = await fetch(u, { headers: { Authorization: await oauth1('GET', u, env) } }), d = await r.json().catch(() => ({})); out.x = r.ok ? 'connected: @' + (d.data && d.data.username) : 'error: ' + (d.detail || d.title || r.status) }
  return out;
}
/* new live articles get posted once when auto-posting is on (called after publishing and by the cron for scheduled stories) */
async function autoSocial(env) {
  const S = await settings(env); if (S.auto_fb !== '1' && S.auto_x !== '1') return;
  const r = await env.DB.prepare(`SELECT * FROM posts p WHERE ${LIVE} AND p.category<>'page' AND p.published_at > datetime('now','-2 days') AND ((?=1 AND p.social_fb IS NULL) OR (?=1 AND p.social_x IS NULL)) LIMIT 5`).bind(S.auto_fb === '1' ? 1 : 0, S.auto_x === '1' ? 1 : 0).all();
  const mark = (col, id, v) => env.DB.prepare(`UPDATE posts SET ${col}=${v ? "datetime('now')" : "'failed'"} WHERE id=?`).bind(id).run();
  for (const post of r.results) {
    if (S.auto_fb === '1' && !post.social_fb) await postFacebook(env, post, S).then(() => mark('social_fb', post.id, 1), () => mark('social_fb', post.id, 0));
    if (S.auto_x === '1' && !post.social_x) await postX(env, post, S).then(() => mark('social_x', post.id, 1), () => mark('social_x', post.id, 0));
  }
}
async function oauth1(method, u, env) {
  const enc = s => encodeURIComponent(s).replace(/[!'()*]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase());
  const o = { oauth_consumer_key: env.X_API_KEY, oauth_nonce: crypto.randomUUID().replace(/-/g, ''), oauth_signature_method: 'HMAC-SHA1', oauth_timestamp: String(Math.floor(Date.now() / 1000)), oauth_token: env.X_ACCESS_TOKEN, oauth_version: '1.0' };
  const base = [method, enc(u), enc(Object.keys(o).sort().map(k => enc(k) + '=' + enc(o[k])).join('&'))].join('&');
  const k = await crypto.subtle.importKey('raw', new TextEncoder().encode(enc(env.X_API_SECRET) + '&' + enc(env.X_ACCESS_SECRET)), { name: 'HMAC', hash: 'SHA-1' }, false, ['sign']);
  o.oauth_signature = btoa(String.fromCharCode(...new Uint8Array(await crypto.subtle.sign('HMAC', k, new TextEncoder().encode(base)))));
  return 'OAuth ' + Object.keys(o).sort().map(x => enc(x) + '="' + enc(o[x]) + '"').join(', ');
}

/* ---------- storage clean-up ---------- */
/* storage keys (images/..., audio/...) an article points at */
function filesOf(post) { const s = [post.cover, post.audio, post.body].join(' '), out = new Set(); for (const m of s.matchAll(/\/img\/((?:images|audio)\/[^"'\s)<>]+)/g)) out.add(decodeURIComponent(m[1])); return [...out] }
/* where a stored file is still used: article titles, author names, or the site settings (logo, banner) */
async function usage(env, key) {
  if (!key) return []; const like = '%/img/' + key + '%', out = [];
  const p = await env.DB.prepare('SELECT title FROM posts WHERE cover LIKE ? OR audio LIKE ? OR body LIKE ? LIMIT 10').bind(like, like, like).all(); p.results.forEach(r => out.push('Article: ' + r.title));
  const a = await env.DB.prepare('SELECT name FROM authors WHERE photo LIKE ?').bind(like).all(); a.results.forEach(r => out.push('Author photo: ' + r.name));
  const s = await env.DB.prepare('SELECT k FROM settings WHERE v LIKE ?').bind(like).all(); s.results.forEach(r => out.push('Site setting: ' + r.k.replace('_', ' ')));
  return out;
}

/* ---------- helpers ---------- */
function now() { return new Date().toISOString().slice(0, 19).replace('T', ' ') }
function slugify(s) { return String(s).toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 90) }
/* the body comes from the back office editor; strip anything that could run code (YouTube/Vimeo embeds are allowed) */
function clean(h) { return h.replace(/<\s*(script|style|iframe(?![^>]*(?:youtube(?:-nocookie)?\.com\/embed\/|player\.vimeo\.com\/video\/))|object|embed|form|input|button|link|meta)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, '').replace(/<\s*(script|style|object|embed|form|input|button|link|meta)[^>]*\/?>/gi, '').replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '').replace(/(href|src)\s*=\s*(["'])\s*javascript:[^"']*\2/gi, '$1="#"') }
async function hkey(env) { return crypto.subtle.importKey('raw', new TextEncoder().encode(env.SESSION_SECRET || env.ADMIN_PASSWORD), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']) }
async function sign(s, env) { const b = await crypto.subtle.sign('HMAC', await hkey(env), new TextEncoder().encode(s)); return btoa(String.fromCharCode(...new Uint8Array(b))).replace(/[+/=]/g, c => ({ '+': '-', '/': '_', '=': '' }[c])) }
async function same(a, b) { const [x, y] = await Promise.all([a, b].map(v => crypto.subtle.digest('SHA-256', new TextEncoder().encode(v)))); const u = new Uint8Array(x), w = new Uint8Array(y); let d = 0; for (let i = 0; i < u.length; i++) d |= u[i] ^ w[i]; return d === 0 }
async function authed(req, env) { const t = (req.headers.get('Authorization') || '').replace(/^Bearer /, ''), [exp, sig] = t.split('.'); if (!exp || !sig || +exp < Date.now()) return false; return same(sig, await sign(exp, env)) }
