/* RAPAECHELON · RAPMAG API (Cloudflare Worker)
   Public:  GET /api/posts?cat=&q=&limit=&offset=   GET /api/posts/:slug   GET /api/cats   GET /api/trending   POST /api/view/:slug   GET /img/<key>
   Admin (Bearer token from /api/admin/login): GET/POST /api/admin/posts, GET/DELETE /api/admin/posts/:id, POST /api/admin/upload, GET /api/admin/images, DELETE /api/admin/images/<key>
   Images live in the R2 bucket bound as IMAGES and are served through /img/ with long cache headers. */
const CATS = ['breaking', 'music', 'entertainment', 'page'];
const SETTINGS = ['logo', 'promo_image', 'promo_link', 'promo_label', 'youtube', 'instagram', 'x', 'tagline'];
const LIST_COLS = 'id,slug,title,dek,cover,category,tags,author,featured,views,published_at';

export default {
  async fetch(req, env) {
    const url = new URL(req.url), p = url.pathname, origin = req.headers.get('Origin') || '';
    const allowed = (env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim());
    const cors = { 'Access-Control-Allow-Origin': allowed.includes(origin) ? origin : allowed[0] || '*', 'Access-Control-Allow-Headers': 'Content-Type, Authorization', 'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS', 'Vary': 'Origin' };
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
    const json = (d, s = 200, h = {}) => new Response(JSON.stringify(d), { status: s, headers: { 'Content-Type': 'application/json', ...cors, ...h } });
    try {
      /* ---------- images ---------- */
      if (p.startsWith('/img/') && req.method === 'GET') {
        const key = decodeURIComponent(p.slice(5)), obj = await env.IMAGES.get(key);
        if (!obj) return new Response('Not found', { status: 404, headers: cors });
        const h = new Headers(cors); obj.writeHttpMetadata(h); h.set('ETag', obj.httpEtag); h.set('Cache-Control', 'public, max-age=31536000, immutable');
        return new Response(obj.body, { headers: h });
      }
      /* ---------- public ---------- */
      if (p === '/api/posts' && req.method === 'GET') {
        const cat = url.searchParams.get('cat'), q = (url.searchParams.get('q') || '').trim(), lim = Math.min(50, +url.searchParams.get('limit') || 24), off = Math.max(0, +url.searchParams.get('offset') || 0);
        let sql = `SELECT ${LIST_COLS} FROM posts WHERE status='published' AND category<>'page'`, args = [];
        if (cat) { sql += ' AND category=?'; args.push(cat) }
        if (q) { sql += ' AND (title LIKE ? OR dek LIKE ? OR tags LIKE ?)'; args.push(`%${q}%`, `%${q}%`, `%${q}%`) }
        sql += ' ORDER BY featured DESC, published_at DESC LIMIT ? OFFSET ?'; args.push(lim, off);
        const r = await env.DB.prepare(sql).bind(...args).all();
        return json({ posts: r.results }, 200, { 'Cache-Control': 'public, max-age=60' });
      }
      if (p === '/api/trending' && req.method === 'GET') {
        const r = await env.DB.prepare(`SELECT ${LIST_COLS} FROM posts WHERE status='published' AND category<>'page' AND published_at > datetime('now','-30 days') ORDER BY views DESC LIMIT 5`).all();
        return json({ posts: r.results }, 200, { 'Cache-Control': 'public, max-age=120' });
      }
      if (p === '/api/settings' && req.method === 'GET') {
        const r = await env.DB.prepare('SELECT k,v FROM settings').all();
        return json({ settings: Object.fromEntries(r.results.map(x => [x.k, x.v])) }, 200, { 'Cache-Control': 'public, max-age=60' });
      }
      if (p === '/api/cats' && req.method === 'GET') {
        const r = await env.DB.prepare(`SELECT category, COUNT(*) n FROM posts WHERE status='published' GROUP BY category`).all();
        return json({ cats: CATS, counts: r.results });
      }
      let m = p.match(/^\/api\/posts\/([a-z0-9-]+)$/);
      if (m && req.method === 'GET') {
        const post = await env.DB.prepare(`SELECT * FROM posts WHERE slug=? AND status='published'`).bind(m[1]).first();
        if (!post) return json({ error: 'not found' }, 404);
        const rel = await env.DB.prepare(`SELECT ${LIST_COLS} FROM posts WHERE status='published' AND category=? AND id<>? ORDER BY published_at DESC LIMIT 4`).bind(post.category, post.id).all();
        return json({ post, related: rel.results }, 200, { 'Cache-Control': 'public, max-age=60' });
      }
      m = p.match(/^\/api\/view\/([a-z0-9-]+)$/);
      if (m && req.method === 'POST') { await env.DB.prepare(`UPDATE posts SET views=views+1 WHERE slug=? AND status='published'`).bind(m[1]).run(); return json({ ok: true }) }

      /* ---------- admin ---------- */
      if (p === '/api/admin/login' && req.method === 'POST') {
        const { password } = await req.json().catch(() => ({}));
        if (!env.ADMIN_PASSWORD || !password || !(await same(password, env.ADMIN_PASSWORD))) { await new Promise(r => setTimeout(r, 600)); return json({ error: 'Wrong password' }, 401) }
        const exp = Date.now() + 1000 * 60 * 60 * 24 * 7;
        return json({ token: exp + '.' + await sign(String(exp), env) });
      }
      if (p.startsWith('/api/admin/')) {
        if (!(await authed(req, env))) return json({ error: 'Not logged in' }, 401);
        if (p === '/api/admin/posts' && req.method === 'GET') {
          const r = await env.DB.prepare(`SELECT ${LIST_COLS},status,updated_at FROM posts ORDER BY COALESCE(published_at,updated_at) DESC`).all();
          return json({ posts: r.results });
        }
        m = p.match(/^\/api\/admin\/posts\/(\d+)$/);
        if (m && req.method === 'GET') return json({ post: await env.DB.prepare('SELECT * FROM posts WHERE id=?').bind(+m[1]).first() });
        if (m && req.method === 'DELETE') { await env.DB.prepare('DELETE FROM posts WHERE id=?').bind(+m[1]).run(); return json({ ok: true }) }
        if (p === '/api/admin/posts' && req.method === 'POST') {
          const b = await req.json(), slug = slugify(b.slug || b.title || '');
          if (!b.title || !slug) return json({ error: 'A title is needed' }, 400);
          const cat = CATS.includes(b.category) ? b.category : 'breaking', status = b.status === 'published' ? 'published' : 'draft';
          const vals = [slug, String(b.title).slice(0, 200), String(b.dek || '').slice(0, 400), clean(String(b.body || '')), String(b.cover || ''), cat, String(b.tags || '').slice(0, 300), String(b.author || 'RAPMAG Staff').slice(0, 80), status, b.featured ? 1 : 0];
          const dupe = await env.DB.prepare('SELECT id FROM posts WHERE slug=? AND id<>?').bind(slug, +b.id || 0).first();
          if (dupe) return json({ error: 'Another article already uses this link (slug). Change the title or slug.' }, 409);
          if (b.featured) await env.DB.prepare('UPDATE posts SET featured=0 WHERE id<>?').bind(+b.id || 0).run();
          let id = +b.id;
          if (id) {
            await env.DB.prepare(`UPDATE posts SET slug=?,title=?,dek=?,body=?,cover=?,category=?,tags=?,author=?,status=?,featured=?,updated_at=datetime('now'),published_at=CASE WHEN ?='published' THEN COALESCE(published_at,datetime('now')) ELSE published_at END WHERE id=?`).bind(...vals, status, id).run();
          } else {
            const r = await env.DB.prepare(`INSERT INTO posts (slug,title,dek,body,cover,category,tags,author,status,featured,published_at) VALUES (?,?,?,?,?,?,?,?,?,?,CASE WHEN ?='published' THEN datetime('now') END) RETURNING id`).bind(...vals, status).first();
            id = r.id;
          }
          return json({ post: await env.DB.prepare('SELECT * FROM posts WHERE id=?').bind(id).first() });
        }
        if (p === '/api/admin/settings' && req.method === 'POST') {
          const b = await req.json();
          for (const k of SETTINGS) if (k in b) await env.DB.prepare('INSERT INTO settings (k,v) VALUES (?,?) ON CONFLICT(k) DO UPDATE SET v=excluded.v').bind(k, String(b[k] || '').slice(0, 500)).run();
          return json({ ok: true });
        }
        if (p === '/api/admin/upload' && req.method === 'POST') {
          const fd = await req.formData(), f = fd.get('file');
          if (!f || typeof f === 'string') return json({ error: 'No file' }, 400);
          if (!/^image\/(jpeg|png|webp|gif|avif)$/.test(f.type)) return json({ error: 'Images only (JPG, PNG, WEBP, GIF, AVIF)' }, 400);
          if (f.size > 15 * 1024 * 1024) return json({ error: 'Image is over 15 MB' }, 400);
          const d = new Date(), ext = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif', 'image/avif': 'avif' }[f.type];
          const key = `images/${d.getUTCFullYear()}/${String(d.getUTCMonth() + 1).padStart(2, '0')}/${crypto.randomUUID().slice(0, 8)}-${slugify(String(f.name).replace(/\.[^.]+$/, '')).slice(0, 40) || 'image'}.${ext}`;
          await env.IMAGES.put(key, f.stream(), { httpMetadata: { contentType: f.type } });
          return json({ key, url: '/img/' + key });
        }
        if (p === '/api/admin/images' && req.method === 'GET') {
          const l = await env.IMAGES.list({ prefix: 'images/', limit: 200, cursor: url.searchParams.get('cursor') || undefined });
          return json({ images: l.objects.sort((a, b) => b.uploaded - a.uploaded).map(o => ({ key: o.key, url: '/img/' + o.key, size: o.size, uploaded: o.uploaded })), cursor: l.truncated ? l.cursor : null });
        }
        if (p.startsWith('/api/admin/images/') && req.method === 'DELETE') { await env.IMAGES.delete(decodeURIComponent(p.slice(18))); return json({ ok: true }) }
      }
      return json({ error: 'Not found' }, 404);
    } catch (e) { return json({ error: String(e && e.message || e) }, 500) }
  }
};

/* ---------- helpers ---------- */
function slugify(s) { return String(s).toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 90) }
/* the body comes from the back office editor; strip anything that could run code */
function clean(h) { return h.replace(/<\s*(script|style|iframe(?![^>]*youtube(?:-nocookie)?\.com\/embed\/)|object|embed|form|input|button|link|meta)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, '').replace(/<\s*(script|style|object|embed|form|input|button|link|meta)[^>]*\/?>/gi, '').replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '').replace(/(href|src)\s*=\s*(["'])\s*javascript:[^"']*\2/gi, '$1="#"') }
async function key(env) { return crypto.subtle.importKey('raw', new TextEncoder().encode(env.SESSION_SECRET || env.ADMIN_PASSWORD), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']) }
async function sign(s, env) { const b = await crypto.subtle.sign('HMAC', await key(env), new TextEncoder().encode(s)); return btoa(String.fromCharCode(...new Uint8Array(b))).replace(/[+/=]/g, c => ({ '+': '-', '/': '_', '=': '' }[c])) }
async function same(a, b) { const [x, y] = await Promise.all([a, b].map(v => crypto.subtle.digest('SHA-256', new TextEncoder().encode(v)))); const u = new Uint8Array(x), w = new Uint8Array(y); let d = 0; for (let i = 0; i < u.length; i++) d |= u[i] ^ w[i]; return d === 0 }
async function authed(req, env) { const t = (req.headers.get('Authorization') || '').replace(/^Bearer /, ''), [exp, sig] = t.split('.'); if (!exp || !sig || +exp < Date.now()) return false; return same(sig, await sign(exp, env)) }
