/* RAPAECHELON - RAPMAG API (Cloudflare Worker)
   Public:  GET /api/posts?cat=&q=&author=&limit=&offset=   GET /api/posts/:slug   GET /api/cats   GET /api/authors/:slug   GET /api/trending   GET /api/indie   POST /api/indie/play   POST /api/indie/like   GET /api/indie/mine
            GET /api/settings   GET /api/build (everything the static page builder needs)   POST /api/view/:slug   GET /img/<key>
   Admin (Bearer token from /api/admin/login): posts, authors, categories, settings, media/audio upload, related-story search,
            social distribution (Facebook Page + X) with optional auto-posting when an article goes live (scheduled ones via the cron).
   A post is public when status='published' AND published_at <= now, so scheduling is just a future published_at. */
const SETTINGS = ['logo', 'promo_image', 'promo_link', 'promo_label', 'youtube', 'instagram', 'x', 'facebook', 'tagline', 'site_url', 'adsense_id', 'auto_fb', 'auto_x', 'social_hashtag', 'social_excerpt', 'social_category'];
const LIVE = `p.status='published' AND p.published_at <= datetime('now')`;
const LIST = `p.id,p.slug,p.title,p.dek,p.cover,p.cover_alt,p.category,p.tags,p.featured,p.views,p.published_at,p.updated_at,COALESCE(a.name,p.author) author,a.slug author_slug,a.verified author_verified`;
const FROM = `FROM posts p LEFT JOIN authors a ON a.id=p.author_id`;

export default {
  async scheduled(ev, env, ctx) { ctx.waitUntil(autoSocial(env)); ctx.waitUntil(rebuildIfNewlyLive(env)); ctx.waitUntil(indieDaily(env).catch(() => { })) /* keeps Stay #1 and the weekly ranks moving with nobody on the site */ },
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
        const key = decodeURIComponent(p.slice(5)), range = req.headers.get('Range'), w = url.searchParams.get('w');
        /* ?w=800: small copy for story cards (made at upload), falls back to the original */
        const obj = (w === '800' && key.startsWith('images/') && await env.IMAGES.get('thumbs/800/' + key.replace(/\.[a-z0-9]+$/, '') + '.webp')) || await env.IMAGES.get(key, range ? { range: req.headers } : undefined);
        if (!obj) return new Response('Not found', { status: 404, headers: cors });
        const h = new Headers(cors); obj.writeHttpMetadata(h); h.set('ETag', obj.httpEtag); h.set('Cache-Control', 'public, max-age=31536000, immutable'); h.set('Accept-Ranges', 'bytes');
        if (range && obj.range) { const o = obj.range.offset || 0, l = obj.range.length ?? obj.size - o; h.set('Content-Range', `bytes ${o}-${o + l - 1}/${obj.size}`); h.set('Content-Length', l); return new Response(obj.body, { status: 206, headers: h }) }
        return new Response(obj.body, { headers: h });
      }
      /* ---------- Studio "story from a link": reads a news page's title, summary and photo.
         Only for our own site (Origin check), only public http(s) hosts, small reads. ---------- */
      if ((p === '/api/og' || p === '/api/og/img') && req.method === 'GET') {
        if (!allowed.includes(origin) && !/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return json({ error: 'not allowed' }, 403);
        let t; try { t = new URL(url.searchParams.get('url') || '') } catch (e) { return json({ error: 'bad link' }, 400) }
        if (!/^https?:$/.test(t.protocol) || /^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|169\.254\.|0\.|\[)/.test(t.hostname) || !t.hostname.includes('.')) return json({ error: 'bad link' }, 400);
        const r = await fetch(t.toString(), { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; RapEchelonStudio/1.0)', 'Accept': p === '/api/og' ? 'text/html' : 'image/*' }, redirect: 'follow', cf: { cacheTtl: 600 } });
        if (!r.ok) return json({ error: 'that site said ' + r.status }, 502);
        if (p === '/api/og/img') {
          const ct = r.headers.get('Content-Type') || '', n = +(r.headers.get('Content-Length') || 0);
          if (!ct.startsWith('image/') || n > 15e6) return json({ error: 'not a picture' }, 400);
          return new Response(r.body, { headers: { 'Content-Type': ct, 'Cache-Control': 'public, max-age=3600', ...cors } });
        }
        const html = (await r.text()).slice(0, 400000);
        const meta = k => { const m = html.match(new RegExp(`<meta[^>]+(?:property|name)=["']${k}["'][^>]*>`, 'i')); const c = m && m[0].match(/content=["']([^"']*)["']/i); return c ? c[1] : '' };
        const dec = s => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#0?39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d)).trim();
        let title = dec(meta('og:title') || meta('twitter:title') || ((html.match(/<title[^>]*>([^<]*)/i) || [])[1] || ''));
        title = title.replace(/\s+[|\-–—]\s+[^|\-–—]{2,40}$/, '');
        let img = dec(meta('og:image') || meta('twitter:image') || ''); if (img) try { img = new URL(img, t).toString() } catch (e) { img = '' }
        return json({ title, desc: dec(meta('og:description') || meta('description') || ''), image: img });
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
      /* article likes: GET /api/likes?ids=1,2,3 -> counts + which ones this visitor liked; POST /api/likes/:id {on} */
      if (p === '/api/likes' && req.method === 'GET') {
        const ids = (url.searchParams.get('ids') || '').split(',').map(Number).filter(n => n > 0).slice(0, 60);
        if (!ids.length) return json({ likes: {}, mine: [] });
        await likeTables(env); const who = await visitor(req, env), q = ids.map(() => '?').join(',');
        const [posts, real, ex, mine] = await Promise.all([all(`SELECT p.id,p.views,p.published_at FROM posts p WHERE p.id IN (${q}) AND ${LIVE}`, ...ids), all(`SELECT post_id id, COUNT(*) n FROM post_likes WHERE post_id IN (${q}) GROUP BY post_id`, ...ids), all(`SELECT post_id id, bonus, auto FROM post_like_extra WHERE post_id IN (${q})`, ...ids), all(`SELECT post_id id FROM post_likes WHERE who=? AND post_id IN (${q})`, who, ...ids)]);
        const R = Object.fromEntries(real.map(r => [r.id, r.n])), E = Object.fromEntries(ex.map(r => [r.id, r]));
        return json({ likes: Object.fromEntries(posts.map(x => [x.id, articleLikes(x, R[x.id] || 0, E[x.id])])), mine: mine.map(r => r.id) }, 200, { 'Cache-Control': 'no-store' });
      }
      const lm = p.match(/^\/api\/likes\/(\d+)$/);
      if (lm && req.method === 'POST') {
        const { on } = await req.json().catch(() => ({})), id = +lm[1];
        if (!(await one(`SELECT p.id FROM posts p WHERE p.id=? AND ${LIVE}`, id))) return json({ error: 'not found' }, 404);
        await likeTables(env); const who = await visitor(req, env);
        await DB.prepare(on ? 'INSERT OR IGNORE INTO post_likes (post_id,who) VALUES (?,?)' : 'DELETE FROM post_likes WHERE post_id=? AND who=?').bind(id, who).run();
        return json({ ok: true });
      }
      /* Indie Charts: top 20 ranked by plays (one per song per visitor per day) plus the editor's added plays */
      /* digital magazine: published issues (archive list) and one issue */
      if (p === '/api/mags' && req.method === 'GET') { await magTable(env); const rows = await all("SELECT id,slug,title,label,doc,published_at FROM mags WHERE status='published' ORDER BY published_at DESC LIMIT 200"); return json({ mags: rows.map(r => { let d = {}; try { d = JSON.parse(r.doc || '{}') } catch (e) { } return { id: r.id, slug: r.slug, title: r.title, label: r.label, published_at: r.published_at, pages: (d.pages || []).length, cover: (d.pages || [])[0] || null, logo: d.logo || null } }) }, 200, { 'Cache-Control': 'public, max-age=60' }) }
      const mgm = p.match(/^\/api\/mags\/([a-z0-9-]+)$/);
      if (mgm && req.method === 'GET') { await magTable(env); const x = await one("SELECT id,slug,title,label,thumb,doc,published_at FROM mags WHERE slug=? AND status='published'", mgm[1]); if (!x) return json({ error: 'not found' }, 404); x.doc = JSON.parse(x.doc || '{}'); return json({ mag: x }, 200, { 'Cache-Control': 'public, max-age=60' }) }
      if (p === '/api/indie' && req.method === 'GET') { const c = await indieChart(env), items = await withHeat(env, c.items.slice(0, 20)); return json({ items, week: c.prevAt }, 200, { 'Cache-Control': 'no-store' }) }
      /* Hall of Fame: every song that reached #1, with its dates and days on top */
      if (p === '/api/indie/fame' && req.method === 'GET') { await heatTables(env); const r = await all('SELECT song,title,artist,cover,first,last,days FROM indie_fame ORDER BY first DESC LIMIT 200'); return json({ fame: r }, 200, { 'Cache-Control': 'public, max-age=120' }) }
      /* Next Up: the published monthly classes, newest first */
      if (p === '/api/nextup' && req.method === 'GET') { await heatTables(env); const r = await all('SELECT month,picks FROM nextup WHERE published=1 ORDER BY month DESC LIMIT 36'); return json({ classes: r.map(x => ({ month: x.month, ...nuParse(x.picks) })) }, 200, { 'Cache-Control': 'public, max-age=120' }) }
      /* likes: one per visitor per song, tap again to take it back */
      if (p === '/api/indie/like' && req.method === 'POST') {
        const { id, on } = await req.json().catch(() => ({})), cfg = await indieCfg(env);
        if (!cfg.songs.some(x => x.id === id)) return json({ error: 'unknown song' }, 404);
        await indieTable(env); const who = await visitor(req, env);
        await DB.prepare(on ? 'INSERT OR IGNORE INTO indie_likes (song,who) VALUES (?,?)' : 'DELETE FROM indie_likes WHERE song=? AND who=?').bind(id, who).run();
        return json({ ok: true });
      }
      if (p === '/api/indie/mine' && req.method === 'GET') { await indieTable(env); const r = await all('SELECT song FROM indie_likes WHERE who=?', await visitor(req, env)); return json({ liked: r.map(x => x.song) }, 200, { 'Cache-Control': 'no-store' }) }
      if (p === '/api/indie/play' && req.method === 'POST') {
        const { id } = await req.json().catch(() => ({})), cfg = await indieCfg(env);
        if (!cfg.songs.some(x => x.id === id)) return json({ error: 'unknown song' }, 404);
        await indieTable(env);
        const who = await visitor(req, env);
        await DB.prepare('INSERT OR IGNORE INTO indie_plays (song,day,who) VALUES (?,?,?)').bind(id, new Date().toISOString().slice(0, 10), who).run();
        return json({ ok: true });
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
        const posts = await all(`SELECT p.id,p.featured,p.slug,p.title,p.dek,p.body,p.cover,p.cover_alt,p.category,p.tags,p.audio,p.published_at,p.updated_at,COALESCE(a.name,p.author) author,a.slug author_slug,a.verified author_verified ${FROM} WHERE ${LIVE} ORDER BY p.published_at DESC`);
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

      /* Studio comment writer: Claude reads the story and writes lines that fit it */
      if (p === '/api/admin/comments' && req.method === 'POST') { const [d, st] = await aiComments(env, body || {}); return json(d, st) }

      /* posts */
      if (p === '/api/admin/posts' && req.method === 'GET') return json({ posts: await all(`SELECT ${LIST},p.status,p.social_fb,p.social_x FROM posts p LEFT JOIN authors a ON a.id=p.author_id ORDER BY COALESCE(p.published_at,p.updated_at) DESC`) });
      m = p.match(/^\/api\/admin\/posts\/(\d+)$/);
      if (m && req.method === 'GET') return json({ post: await one('SELECT * FROM posts WHERE id=?', +m[1]) });
      if (m && req.method === 'DELETE') {
        /* delete the article, then every file it used (cover, audio, story images) that nothing else still uses */
        const post = await one('SELECT * FROM posts WHERE id=?', +m[1]); if (!post) return json({ ok: true });
        await DB.prepare('DELETE FROM posts WHERE id=?').bind(post.id).run();
        const keys = filesOf(post), removed = [], kept = [];
        for (const k of keys) { if ((await usage(env, k)).length) kept.push(k); else { await env.IMAGES.delete(k); await env.IMAGES.delete('thumbs/800/' + k.replace(/\.[a-z0-9]+$/, '') + '.webp'); removed.push(k) } }
        if (post.status === 'published') ctx.waitUntil(rebuild(env, 'deleted ' + post.slug));
        return json({ ok: true, removed: removed.length, kept: kept.length });
      }
      if (p === '/api/admin/link-search' && req.method === 'GET') {
        /* web search for the highlighted words (Tavily or Brave Search; the key is a Cloudflare secret) */
        const q = (url.searchParams.get('q') || '').trim().slice(0, 200); if (!q) return json({ results: [] });
        if (env.TAVILY_API_KEY) {
          const r = await fetch('https://api.tavily.com/search', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + env.TAVILY_API_KEY }, body: JSON.stringify({ query: q, max_results: 8, search_depth: 'basic', topic: 'general' }) });
          const d = await r.json().catch(() => ({})); if (!r.ok) return json({ error: 'Search error: ' + (d.detail && (d.detail.error || d.detail) || r.status) }, 502);
          return json({ results: (d.results || []).map(x => ({ title: x.title, url: x.url, snippet: String(x.content || '').slice(0, 400) })) });
        }
        if (env.BRAVE_API_KEY) {
          const r = await fetch('https://api.search.brave.com/res/v1/web/search?count=8&q=' + encodeURIComponent(q), { headers: { Accept: 'application/json', 'X-Subscription-Token': env.BRAVE_API_KEY } });
          const d = await r.json().catch(() => ({})); if (!r.ok) return json({ error: 'Search error ' + r.status }, 502);
          return json({ results: ((d.web && d.web.results) || []).map(x => ({ title: x.title, url: x.url, snippet: String(x.description || '').replace(/<[^>]+>/g, '').slice(0, 400) })) });
        }
        return json({ error: 'not connected' }, 501);
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
        if (status === 'published' || (prev && prev.status === 'published')) ctx.waitUntil(rebuild(env, 'saved ' + slug));
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
      /* article likes in the editor: added likes + auto on/off */
      m = p.match(/^\/api\/admin\/likes\/(\d+)$/);
      if (m) {
        const id = +m[1]; await likeTables(env);
        if (req.method === 'POST') { await DB.prepare('INSERT INTO post_like_extra (post_id,bonus,auto) VALUES (?,?,?) ON CONFLICT(post_id) DO UPDATE SET bonus=excluded.bonus, auto=excluded.auto').bind(id, Math.max(0, Math.min(1e9, Math.round(+body.bonus || 0))), body.auto === 0 ? 0 : 1).run() }
        const x = await one('SELECT id,views,published_at FROM posts WHERE id=?', id); if (!x) return json({ error: 'not found' }, 404);
        const r = await one('SELECT COUNT(*) n FROM post_likes WHERE post_id=?', id), e = await one('SELECT bonus,auto FROM post_like_extra WHERE post_id=?', id), ae = { bonus: 0, auto: 1, ...(e || {}) };
        return json({ real: r.n, bonus: ae.bonus, auto: ae.auto, autoNow: articleLikes(x, 0, { bonus: 0, auto: ae.auto }), autoTarget: ae.auto ? articleTarget(x) : 0, total: articleLikes(x, r.n, ae) });
      }
      /* Indie Charts editor: songs, added plays, locked spots, reset */
      if (p === '/api/admin/indie' && req.method === 'GET') { const c = await indieChart(env); return json({ items: c.items, cfg: c.cfg }) }
      if (p === '/api/admin/indie' && req.method === 'POST') {
        const old = await indieCfg(env), songs = (Array.isArray(body.songs) ? body.songs : []).slice(0, 200).map(indieSong).filter(x => x.id && x.audio);
        await saveIndie(env, { ...old, songs });
        /* songs taken off: erase their audio and cover from storage (unless another song still uses the file) */
        const used = new Set(songs.flatMap(x => [x.audio, x.cover]));
        for (const x of old.songs.filter(o => !songs.some(n => n.id === o.id))) for (const u of [x.audio, x.cover]) if (u && !used.has(u) && /^\/img\/(audio|images)\//.test(u)) { const k = decodeURIComponent(u.slice(5)); await env.IMAGES.delete(k); await env.IMAGES.delete('thumbs/800/' + k.replace(/\.[a-z0-9]+$/, '') + '.webp') }
        const keep = songs.map(x => x.id); await indieTable(env);
        for (const t of ['indie_plays', 'indie_likes']) { if (keep.length) await DB.prepare(`DELETE FROM ${t} WHERE song NOT IN (${keep.map(() => '?').join(',')})`).bind(...keep).run(); else await DB.prepare(`DELETE FROM ${t}`).run() }
        return json({ ok: true });
      }
      /* Magazine Maker: drafts autosave here; publish / unpublish; delete erases the issue's images */
      if (p === '/api/admin/mags' && req.method === 'GET') { await magTable(env); return json({ mags: await all('SELECT id,slug,title,label,thumb,status,updated_at,published_at,(draft IS NOT NULL) AS has_draft FROM mags ORDER BY updated_at DESC') }) }
      if (p === '/api/admin/mags' && req.method === 'POST') {
        await magTable(env); const title = String(body.title || 'New issue').slice(0, 120), label = String(body.label || '').slice(0, 120);
        let slug = slugify(title) || 'issue'; if (await one('SELECT id FROM mags WHERE slug=?', slug)) slug += '-' + Date.now().toString(36);
        const r = await DB.prepare("INSERT INTO mags (slug,title,label,doc,status) VALUES (?,?,?,?, 'draft')").bind(slug, title, label, JSON.stringify(body.doc || { pages: [] })).run();
        return json({ id: r.meta.last_row_id, slug });
      }
      m = p.match(/^\/api\/admin\/mags\/(\d+)$/);
      if (m) {
        await magTable(env); const id = +m[1], x = await one('SELECT * FROM mags WHERE id=?', id); if (!x) return json({ error: 'not found' }, 404);
        if (req.method === 'GET') { x.has_draft = x.draft ? 1 : 0; x.doc = JSON.parse(x.draft || x.doc || '{}'); delete x.draft; return json({ mag: x }) }
        if (req.method === 'DELETE') {
          for (const u of magImages(x.doc)) if (!(await imageUsedElsewhere(env, u, id))) { const k = decodeURIComponent(u.slice(5)); await env.IMAGES.delete(k); await env.IMAGES.delete('thumbs/800/' + k.replace(/\.[a-z0-9]+$/, '') + '.webp') }
          await DB.prepare('DELETE FROM mags WHERE id=?').bind(id).run(); return json({ ok: true });
        }
        if (req.method === 'POST' && body.discard) { await DB.prepare('UPDATE mags SET draft=NULL WHERE id=?').bind(id).run(); return json({ ok: true, doc: JSON.parse(x.doc || '{}') }) }
        /* a live issue keeps working edits in a private draft until "update live issue" */
        if (req.method === 'POST' && body.draft && x.status === 'published') { const dd = JSON.stringify(body.doc || {}); if (dd.length > 900000) return json({ error: 'This issue is too big to save. Split it into two issues.' }, 400); await DB.prepare("UPDATE mags SET draft=?, updated_at=datetime('now') WHERE id=?").bind(dd, id).run(); return json({ ok: true, status: x.status, draft: 1 }) }
        if (req.method === 'POST') {
          const doc = body.doc ? JSON.stringify(body.doc) : x.doc; if (doc.length > 900000) return json({ error: 'This issue is too big to save. Split it into two issues.' }, 400);
          const status = body.status === 'published' || body.status === 'draft' ? body.status : x.status;
          /* images removed from the issue since the last save are erased */
          if (body.doc) { const keep = new Set([...magImages(doc), ...(x.draft ? magImages(x.draft) : [])]); for (const u of magImages(x.doc)) if (!keep.has(u) && !(await imageUsedElsewhere(env, u, id))) { const k = decodeURIComponent(u.slice(5)); await env.IMAGES.delete(k); await env.IMAGES.delete('thumbs/800/' + k.replace(/\.[a-z0-9]+$/, '') + '.webp') } }
          await DB.prepare("UPDATE mags SET title=?, label=?, thumb=?, doc=?, draft=NULL, status=?, updated_at=datetime('now'), published_at=CASE WHEN ?='published' AND published_at IS NULL THEN datetime('now') ELSE published_at END WHERE id=?")
            .bind(String(body.title ?? x.title).slice(0, 120), String(body.label ?? x.label).slice(0, 120), String(body.thumb ?? x.thumb ?? '').slice(0, 300), doc, status, status, id).run();
          return json({ ok: true, status });
        }
      }
      /* Next Up: the month's hottest artists (average heat over the days they charted) and the class you picked */
      if (p === '/api/admin/nextup' && req.method === 'GET') {
        await heatTables(env); await indieDaily(env); const month = /^\d{4}-\d{2}$/.test(url.searchParams.get('month') || '') ? url.searchParams.get('month') : new Date().toISOString().slice(0, 7);
        const rows = await all(`SELECT song, MAX(title) title, MAX(artist) artist, MAX(cover) cover, ROUND(AVG(heat)) heat, MAX(heat) peak, MIN(rank) best, COUNT(*) days FROM indie_hist WHERE day LIKE ? GROUP BY song ORDER BY AVG(heat)*MIN(1.0,COUNT(*)/7.0) DESC LIMIT 40`, month + '-%');
        const past = await all('SELECT month,picks FROM nextup WHERE month<>?', month), used = {}; for (const c of past) for (const k of nuParse(c.picks).picks) used[String(k.artist).toLowerCase()] = c.month;
        const seen = new Set(), list = []; for (const r of rows) { const a = String(r.artist).toLowerCase(); if (seen.has(a)) continue; seen.add(a); list.push({ ...r, was: used[a] || null }) }
        const cur = await one('SELECT picks,published FROM nextup WHERE month=?', month);
        return json({ month, shortlist: list.slice(0, 20), ...nuParse(cur && cur.picks), published: !!(cur && cur.published), months: (await all('SELECT month,published FROM nextup ORDER BY month DESC')) });
      }
      if (p === '/api/admin/nextup' && req.method === 'POST') {
        await heatTables(env); if (!/^\d{4}-\d{2}$/.test(body.month || '')) return json({ error: 'bad month' }, 400);
        const picks = (Array.isArray(body.picks) ? body.picks : []).slice(0, 10).map(k => ({ song: String(k.song || '').slice(0, 40), artist: String(k.artist || '').slice(0, 160), title: String(k.title || '').slice(0, 160), cover: httpsOnly(k.cover), photo: httpsOnly(k.photo), heat: +k.heat || 0 })).filter(k => k.artist), style = ['lineup', 'yearbook', 'cover'].includes(body.style) ? body.style : 'lineup';
        await DB.prepare('INSERT INTO nextup (month,picks,published) VALUES (?,?,?) ON CONFLICT(month) DO UPDATE SET picks=excluded.picks, published=excluded.published').bind(body.month, JSON.stringify({ style, picks }), body.publish ? 1 : 0).run();
        return json({ ok: true });
      }
      if (p === '/api/admin/indie/reset' && req.method === 'POST') {
        const c = await indieChart(env); await indieTable(env); await DB.prepare('DELETE FROM indie_plays').run();
        await saveIndie(env, { songs: c.cfg.songs.map(x => ({ ...x, bonus: 0, pace: 0, boosts: [], lbonus: 0, lboosts: [] })), prev: Object.fromEntries(c.items.map(x => [x.id, x.rank])), prevAt: Date.now() });
        return json({ ok: true });
      }
      /* settings */
      if (p === '/api/admin/settings' && req.method === 'POST') {
        for (const k of SETTINGS) if (k in body) await DB.prepare('INSERT INTO settings (k,v) VALUES (?,?) ON CONFLICT(k) DO UPDATE SET v=excluded.v').bind(k, String(body[k] ?? '').slice(0, 500)).run();
        return json({ ok: true });
      }
      /* uploads: images and article audio */
      if (p === '/api/admin/upload' && req.method === 'POST') {
        const fd = await req.formData(), f = fd.get('file');
        if (!f || typeof f === 'string') return json({ error: 'No file' }, 400);
        const of = String(fd.get('thumb_of') || '');
        if (of) { if (!/^images\/[\w\/.-]+$/.test(of) || f.type !== 'image/webp' || f.size > 2e6) return json({ error: 'bad thumbnail' }, 400); await env.IMAGES.put('thumbs/800/' + of.replace(/\.[a-z0-9]+$/, '') + '.webp', f.stream(), { httpMetadata: { contentType: 'image/webp' } }); return json({ ok: true }) }
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
      if (p.startsWith('/api/admin/images/') && req.method === 'DELETE') { const k = decodeURIComponent(p.slice(18)); await env.IMAGES.delete(k); await env.IMAGES.delete('thumbs/800/' + k.replace(/\.[a-z0-9]+$/, '') + '.webp'); return json({ ok: true }) }
      /* social distribution */
      if (p === '/api/admin/social/test') return json({ ...(await socialTest(env)), instant: env.GH_TOKEN ? 'connected' : 'not connected' });
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

/* ---------- digital magazine ---------- */
async function magTable(env) { await env.DB.prepare("CREATE TABLE IF NOT EXISTS mags (id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT NOT NULL UNIQUE, title TEXT NOT NULL, label TEXT DEFAULT '', thumb TEXT DEFAULT '', doc TEXT DEFAULT '{}', status TEXT NOT NULL DEFAULT 'draft', created_at TEXT NOT NULL DEFAULT (datetime('now')), updated_at TEXT NOT NULL DEFAULT (datetime('now')), published_at TEXT)").run(); try { await env.DB.prepare('ALTER TABLE mags ADD COLUMN draft TEXT').run() } catch (e) { } }
function magImages(doc) { return [...new Set(String(doc || '').match(/\/img\/images\/[\w\/.%-]+/g) || [])] }
/* never erase an image an article, the chart, settings or another issue still uses */
async function imageUsedElsewhere(env, u, magId) {
  const q = '%' + u + '%', D = env.DB;
  return !!((await D.prepare('SELECT 1 FROM posts WHERE cover=? OR body LIKE ? LIMIT 1').bind(u, q).first()) || (await D.prepare('SELECT 1 FROM settings WHERE v LIKE ? LIMIT 1').bind(q).first()) || (await D.prepare('SELECT 1 FROM mags WHERE id<>? AND doc LIKE ? LIMIT 1').bind(magId, q).first()));
}

/* ---------- article likes ---------- */
async function likeTables(env) { await env.DB.batch([env.DB.prepare('CREATE TABLE IF NOT EXISTS post_likes (post_id INTEGER NOT NULL, who TEXT NOT NULL, PRIMARY KEY (post_id, who))'), env.DB.prepare('CREATE TABLE IF NOT EXISTS post_like_extra (post_id INTEGER PRIMARY KEY, bonus INTEGER NOT NULL DEFAULT 0, auto INTEGER NOT NULL DEFAULT 1)')]) }
function seedOf(n) { let h = Math.imul((n | 0) ^ 0x9e3779b9, 2654435761); h ^= h >>> 15; h = Math.imul(h, 2246822507); h ^= h >>> 13; return h >>> 0 }
/* every article gets its own final total (more for stories people read more) and fills in like real readers: quick the first day, slower after */
function articleTarget(x) { return 90 + seedOf(x.id) % 760 + Math.floor((x.views || 0) * (0.12 + (seedOf(x.id + 7) % 80) / 1000)) }
function articleLikes(x, real, e) {
  const ex = e || { bonus: 0, auto: 1 }; let auto = 0;
  if (ex.auto !== 0) { const t = (Date.now() - Date.parse(String(x.published_at).replace(' ', 'T') + 'Z')) / 864e5, tau = 0.6 + (seedOf(x.id + 3) % 140) / 100; if (t > 0) auto = Math.floor(articleTarget(x) * (1 - Math.exp(-t / tau))) }
  return real + (ex.bonus || 0) + auto;
}

/* ---------- Indie Charts ---------- */
const httpsOnly = u => /^https:\/\//.test(String(u || '')) || /^\/img\/(audio|images)\//.test(String(u || '')) ? String(u) : '';
function indieSong(v) { return { id: /^[\w-]{1,40}$/.test(v.id) ? v.id : '', title: String(v.title || '').slice(0, 160), artist: String(v.artist || '').slice(0, 160), cover: httpsOnly(v.cover), audio: httpsOnly(v.audio), bonus: Math.max(0, Math.min(1e9, Math.round(+v.bonus || 0))), lock: Math.max(0, Math.min(20, Math.round(+v.lock || 0))), hold: v.hold ? 1 : 0, pace: Math.max(0, Math.round(+v.pace || 0)), lbonus: Math.max(0, Math.min(1e9, Math.round(+v.lbonus || 0))), lauto: v.lauto === 0 || v.lauto === false ? 0 : 1, lboosts: (Array.isArray(v.lboosts) ? v.lboosts : []).slice(0, 20).map(b => ({ a: Math.max(0, Math.min(1e9, Math.round(+b.a || 0))), s: +b.s || 0, e: +b.e || 0 })).filter(b => b.a && b.e > b.s), boosts: (Array.isArray(v.boosts) ? v.boosts : []).slice(0, 20).map(b => ({ a: Math.max(0, Math.min(1e9, Math.round(+b.a || 0))), s: +b.s || 0, e: +b.e || 0 })).filter(b => b.a && b.e > b.s) } }
/* autoplay: each boost adds its plays evenly from start to end */
/* each hour gets an uneven share (busier evenings, quieter nights, random swings) so the plays look like real listening; the total lands exactly on the target at the end */
function boostEarned(b, t = Date.now()) {
  if (t >= b.e) return b.a; if (t <= b.s) return 0;
  const H = Math.max(1, Math.ceil((b.e - b.s) / 36e5)), w = [];
  let seed = (b.s % 2147483647) || 1; const rnd = () => (seed = seed * 16807 % 2147483647) / 2147483647;
  for (let i = 0; i < H; i++) { const hr = new Date(b.s + i * 36e5).getUTCHours(), day = 0.55 + 0.45 * Math.sin((hr - 9) / 24 * 2 * Math.PI); w.push(day * (0.6 + rnd() * 0.8)) }
  const tot = w.reduce((x, y) => x + y, 0), pos = (t - b.s) / 36e5, k = Math.min(H - 1, Math.floor(pos));
  let done = 0; for (let i = 0; i < k; i++) done += w[i];
  return Math.min(b.a, Math.floor(b.a * (done + w[k] * Math.min(1, pos - k)) / tot));
}
const boosted = (x, t = Date.now()) => x.boosts.reduce((n, b) => n + boostEarned(b, t), 0)
async function indieTable(env) { await env.DB.batch([env.DB.prepare('CREATE TABLE IF NOT EXISTS indie_plays (song TEXT NOT NULL, day TEXT NOT NULL, who TEXT NOT NULL, PRIMARY KEY (song, day, who))'), env.DB.prepare('CREATE TABLE IF NOT EXISTS indie_likes (song TEXT NOT NULL, who TEXT NOT NULL, PRIMARY KEY (song, who))')]) }
/* a visitor = scrambled code of internet address + browser (the real address is never stored) */
async function visitor(req, env) { return (await sign((req.headers.get('CF-Connecting-IP') || '') + '|' + (req.headers.get('User-Agent') || ''), env)).slice(0, 22) }
/* each song's own like ratio, 22%-36% of plays, so no two songs look the same; likes never pass 40% of plays */
function likeRatio(id) { let h = 2166136261; for (const ch of String(id)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); h ^= h >>> 15; h = Math.imul(h, 2246822507); h ^= h >>> 13; return 0.22 + ((h >>> 0) % 1400) / 10000 }
async function indieCfg(env) { const r = await env.DB.prepare("SELECT v FROM settings WHERE k='indie'").first(); try { const c = JSON.parse(r && r.v || '{}'); return { songs: (c.songs || []).map(indieSong), prev: c.prev || {}, prevAt: c.prevAt || 0 } } catch (e) { return { songs: [], prev: {}, prevAt: 0 } } }
async function saveIndie(env, c) { await env.DB.prepare("INSERT INTO settings (k,v) VALUES ('indie',?) ON CONFLICT(k) DO UPDATE SET v=excluded.v").bind(JSON.stringify(c)).run() }
/* rank = plays + added plays, locked songs sit at their spot; movement compares with last week's ranks (snapshot every 7 days) */
async function indieChart(env) {
  await indieTable(env);
  const cfg = await indieCfg(env), rows = (await env.DB.prepare('SELECT song, COUNT(*) n FROM indie_plays GROUP BY song').all()).results, real = Object.fromEntries(rows.map(r => [r.song, r.n])), lrows = (await env.DB.prepare('SELECT song, COUNT(*) n FROM indie_likes GROUP BY song').all()).results, lreal = Object.fromEntries(lrows.map(r => [r.song, r.n]));
  const list = cfg.songs.map(x => { const auto = boosted(x); return { ...x, boosts: x.boosts.map(b => ({ ...b, got: boostEarned(b) })), real: real[x.id] || 0, auto, plays: (real[x.id] || 0) + x.bonus + auto + x.pace } });
  /* STAY #1: the held song earns just enough plays to stay a little ahead of the next song (kept, so its count never drops) */
  const held = list.find(x => x.hold && !x.lock);
  if (held) { const best = Math.max(0, ...list.filter(x => x !== held).map(x => x.plays)); if (held.plays <= best) { const add = best - held.plays + Math.max(1, Math.ceil(best * (0.02 + Math.random() * 0.03))); held.pace += add; held.plays += add; const c = cfg.songs.find(x => x.id === held.id); c.pace = held.pace; await saveIndie(env, cfg) } }
  for (const x of list) { const lb = x.lboosts.reduce((n, b) => n + boostEarned(b), 0), mine = (lreal[x.id] || 0) + x.lbonus + lb, ratio = x.lauto ? Math.floor(x.plays * likeRatio(x.id)) : 0;
    x.lreal = lreal[x.id] || 0; x.lboosted = lb; x.lratio = x.lauto ? ratio : 0; x.likes = Math.min(Math.max(x.lbonus + lb, ratio), Math.floor(x.plays * 0.4)) + x.lreal; x.lboosts = x.lboosts.map(b => ({ ...b, got: boostEarned(b) })) }
  const free = list.filter(x => !x.lock).sort((a, b) => b.plays - a.plays), out = [];
  for (const x of list.filter(x => x.lock).sort((a, b) => a.lock - b.lock)) out[x.lock - 1] ? free.unshift(x) : (out[x.lock - 1] = x);
  for (let i = 0; free.length; i++) if (!out[i]) out[i] = free.shift();
  const items = out.filter(Boolean).map((x, i) => { const was = cfg.prev[x.id], rank = i + 1; return { ...x, rank, move: was == null ? 'new' : was > rank ? 'up' : was < rank ? 'down' : 'same', last: was || null } });
  if (!cfg.prevAt && items.length) { cfg.prevAt = Date.now(); await saveIndie(env, cfg) }
  else if (Date.now() - cfg.prevAt > 7 * 864e5 && items.length) { cfg.prev = Object.fromEntries(items.map(x => [x.id, x.rank])); cfg.prevAt = Date.now(); await saveIndie(env, cfg) }
  return { items, cfg, prevAt: cfg.prevAt };
}

/* ---------- heat meter, Hall of Fame, Next Up ----------
   Heat (0-100) rises as a song climbs: chart spot (up to 60) + climbing since last week (up to 15) + days on the chart (up to 15) + days at #1 (up to 10).
   Once a day the chart is written down (indie_hist); a song at #1 gets / keeps its Hall of Fame plaque (indie_fame). */
async function heatTables(env) { await env.DB.batch([env.DB.prepare('CREATE TABLE IF NOT EXISTS indie_hist (song TEXT NOT NULL, day TEXT NOT NULL, rank INTEGER, heat INTEGER, title TEXT, artist TEXT, cover TEXT, PRIMARY KEY (song, day))'),
  env.DB.prepare('CREATE TABLE IF NOT EXISTS indie_fame (song TEXT PRIMARY KEY, title TEXT, artist TEXT, cover TEXT, first TEXT, last TEXT, days INTEGER DEFAULT 0)'),
  env.DB.prepare('CREATE TABLE IF NOT EXISTS nextup (month TEXT PRIMARY KEY, picks TEXT, published INTEGER DEFAULT 0)')]) }
/* a class is stored as {style, picks}; older ones were just the list */
function nuParse(v) { try { const d = JSON.parse(v || '[]'); return Array.isArray(d) ? { style: 'lineup', picks: d } : { style: d.style || 'lineup', picks: d.picks || [] } } catch (e) { return { style: 'lineup', picks: [] } } }
const heatLabel = h => h >= 85 ? 'BLAZING' : h >= 65 ? 'ON FIRE' : h >= 40 ? 'HOT' : 'WARM';
function heatOf(x, days, top) { const spot = Math.max(0, (21 - x.rank) / 20) * 60, climb = x.last && x.last > x.rank ? Math.min(15, (x.last - x.rank) * 3) : x.move === 'new' ? 6 : 0;
  return Math.max(1, Math.min(100, Math.round(spot + climb + Math.min(days, 28) / 28 * 15 + Math.min(top, 10)))) }
async function withHeat(env, items) { await heatTables(env);
  const d = Object.fromEntries((await env.DB.prepare('SELECT song, COUNT(*) n FROM indie_hist GROUP BY song').all()).results.map(r => [r.song, r.n])), f = Object.fromEntries((await env.DB.prepare('SELECT song, days FROM indie_fame').all()).results.map(r => [r.song, r.days]));
  const m = new Date().toISOString().slice(0, 7), nu = await env.DB.prepare('SELECT picks FROM nextup WHERE month=? AND published=1').bind(m).first(), cls = new Set(nuParse(nu && nu.picks).picks.map(k => String(k.artist).toLowerCase()));
  return items.map(x => { const heat = heatOf(x, d[x.id] || 0, f[x.id] || 0); return { ...x, heat, heatLabel: heatLabel(heat), days: d[x.id] || 0, top: f[x.id] || 0, nextup: cls.has(String(x.artist).toLowerCase()) } }) }
async function indieDaily(env) { await heatTables(env); const day = new Date().toISOString().slice(0, 10), c = await indieChart(env);
  if (!c.items.length || await env.DB.prepare('SELECT 1 FROM indie_hist WHERE day=? LIMIT 1').bind(day).first()) return;
  const items = await withHeat(env, c.items.slice(0, 20)), st = items.map(x => env.DB.prepare('INSERT OR REPLACE INTO indie_hist (song,day,rank,heat,title,artist,cover) VALUES (?,?,?,?,?,?,?)').bind(x.id, day, x.rank, x.heat, x.title, x.artist, x.cover || ''));
  const t = items[0]; st.push(env.DB.prepare('INSERT INTO indie_fame (song,title,artist,cover,first,last,days) VALUES (?,?,?,?,?,?,1) ON CONFLICT(song) DO UPDATE SET title=excluded.title, artist=excluded.artist, cover=excluded.cover, last=excluded.last, days=days+1').bind(t.id, t.title, t.artist, t.cover || '', day, day));
  await env.DB.batch(st) }

/* ---------- social ---------- */
async function settings(env) { const r = await env.DB.prepare('SELECT k,v FROM settings').all(); return Object.fromEntries(r.results.map(x => [x.k, x.v])) }
function siteUrl(S) { return (S.site_url || 'https://www.rapaechelon.com').replace(/\/+$/, '') }
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

/* ---------- instant Google pages: start the GitHub Pages build when a story goes live, changes or is removed ---------- */
async function rebuild(env, why) {
  if (!env.GH_TOKEN) return 'no GitHub key';
  const last = await env.DB.prepare("SELECT v FROM settings WHERE k='last_rebuild'").first();
  if (last && Date.now() - Date.parse(last.v) < 45000) return 'just started';   /* one build covers saves made close together */
  await env.DB.prepare("INSERT INTO settings (k,v) VALUES ('last_rebuild',?) ON CONFLICT(k) DO UPDATE SET v=excluded.v").bind(new Date().toISOString()).run();
  const r = await fetch('https://api.github.com/repos/' + (env.GH_REPO || 'mezdefjam2014/rapmag') + '/actions/workflows/pages.yml/dispatches', { method: 'POST', headers: { Authorization: 'Bearer ' + env.GH_TOKEN, Accept: 'application/vnd.github+json', 'User-Agent': 'rapmag-api', 'X-GitHub-Api-Version': '2022-11-28' }, body: JSON.stringify({ ref: 'main' }) });
  return r.ok ? 'started (' + why + ')' : 'GitHub said ' + r.status;
}
/* scheduled stories: when one has gone live since the last build, build again */
async function rebuildIfNewlyLive(env) {
  const last = await env.DB.prepare("SELECT v FROM settings WHERE k='last_rebuild'").first(), since = last ? last.v.slice(0, 19).replace('T', ' ') : '1970-01-01';
  const n = await env.DB.prepare(`SELECT COUNT(*) n FROM posts p WHERE ${LIVE} AND p.published_at > ?`).bind(since).first();
  if (n.n) await rebuild(env, 'scheduled story went live');
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


/* ---------- Studio comment writer. Runs on Cloudflare's own AI (the AI binding): no key, no outside account. ---------- */
const CMT_MODEL = '@cf/meta/llama-3.3-70b-instruct-fp8-fast';
const CMT_HEADS = [['GOOD', 'L'], ['BAD', 'H'], ['CONTROVERSIAL', 'S'], ['FUNNY', 'F'], ['TO SOMEBODY', 'T'], ['QUESTIONS', 'N']];
const CMT_SYSTEM = `You write the comment section for a hip-hop and entertainment media page. The page owner posts a story or a new song and needs realistic audience comments about that exact post.

Read the post first and work out what actually happened: who it is about, what they did or what happened to them, and what has not happened. Every comment must be true to that. If a game is delayed, nobody has played it. If someone was arrested, nobody says they were convicted. Never add facts, quotes, crimes, relationships or details that are not in the post.

How the comments sound:
- Like real people on Instagram and YouTube, each one a different person. Most type lowercase slang with loose grammar and no period at the end. Some type properly with full sentences. A few are one or two words. A few are long, two or three sentences.
- React to specific things in the post: the names, the place, the numbers, what happened. Mention the person or title by name in some comments, not all of them. Never use @ handles or hashtags.
- No emojis. They are added afterwards.
- Do not start more than two comments with the same word. Avoid opening with i think, maybe, or hey.
- Never write like an ad, a press release or a review. Never use words like masterpiece, truly, incredible, talented, kudos, vibes, resonates.
- No two comments may share a phrase or an opening. Vary length, wording and angle every time.
- Bad and controversial comments are opinions about the work or the situation. No slurs, no threats, no sexual comments, nothing about anyone's race, body or family, and no claims that someone committed a crime beyond what the post says.
- If the post is about a death, an injury or another tragedy: every comment is respectful and sympathetic. Put them all under GOOD and leave the other sections empty.

Sections: GOOD likes it or supports. BAD dislikes it or is unimpressed. CONTROVERSIAL is a hot take that starts an argument. FUNNY is a joke about this post. TO SOMEBODY talks to a person: a friend, the artist, other commenters, or the page (call it admin or RAPAECHELON, never page owner). QUESTIONS asks something a reader of this post would really ask.

Output format, exactly: a line with the section name in capitals (GOOD, BAD, CONTROVERSIAL, FUNNY, TO SOMEBODY, QUESTIONS), then one comment per line under it. No numbering, no bullets, no quotes, no blank commentary before or after.`;
async function aiComments(env, b) {
  if (!env.AI) return [{ error: 'The AI is not switched on for the server yet.', setup: true }, 503];
  const c = (v, n) => String(v == null ? '' : v).replace(/\s+/g, ' ').trim().slice(0, n);
  const kind = c(b.kind, 40), head = c(b.headline, 300), cap = c(b.caption, 600), artist = c(b.artist, 80), song = c(b.song, 120), who = c(b.who, 80), each = Math.min(30, Math.max(8, +b.each || 20));
  if (!head && !artist && !song) return [{ error: 'Type the subject first.' }, 400];
  const post = b.from === 'drop'
    ? `A new ${kind === 'beats' ? 'beat / instrumental' : kind === 'rnb' ? 'R&B song' : kind === 'album' ? 'album' : kind === 'video' ? 'music video' : 'rap song'} was just posted.\nArtist: ${artist || '(not given)'}\nTitle: ${song || '(not given)'}`
    : `Kind of post: ${kind || 'news'}\nHeadline: ${head}${cap ? '\nCaption: ' + cap : ''}${who ? '\nMainly about: ' + who : ''}`;
  /* tragic posts: respectful comments only, whatever was asked for */
  const sad = ['rip', 'hurt'].includes(kind) || /(\bdies\b|\bdied\b|\bdead\b|passed away|passes away|killed|funeral|found dead|overdose|hospitalized|critical condition|shot and)/i.test(head + ' ' + cap);
  const ask = sad ? `This is a tragedy. Write ${each * 3} respectful, sympathetic comments, all under GOOD. Write nothing under the other sections.` : `Write ${each} comments for each section.`;
  let r;
  try { r = await env.AI.run(CMT_MODEL, { max_tokens: 4096, temperature: 0.9, messages: [{ role: 'system', content: CMT_SYSTEM }, { role: 'user', content: `${post}\n\n${ask}` }] }) }
  catch (e) { const m = c(e && e.message, 200); return [{ error: /limit|quota|capacity|neurons/i.test(m) ? "Today's free AI allowance is used up. It resets tomorrow." : 'The AI did not answer: ' + m }, 502] }
  const text = String((r && (r.response || (r.choices && r.choices[0] && r.choices[0].message && r.choices[0].message.content))) || ''), lines = { L: [], H: [], S: [], F: [], T: [], N: [] };
  let cur = '';
  for (const raw of text.split('\n')) {
    const t = raw.replace(/^\s*(?:[-*#\u2022]+|\d{1,2}[.)])\s*/, '').replace(/[*:\s]+$/, '').trim(); if (!t) continue;
    const h = CMT_HEADS.find(([n]) => t.toUpperCase() === n); if (h) { cur = h[1]; continue }
    const x = t.replace(/^["'\u201c]+|["'\u201d]+$/g, '').trim();
    if (cur && x.length > 1 && x.length <= 260 && !/[#@]/.test(x) && !lines[cur].includes(x)) lines[cur].push(x);
  }
  if (!Object.values(lines).some(a => a.length)) return [{ error: 'The AI answer could not be read. Try again.' }, 502];
  if (sad) for (const k of ['H', 'S', 'F', 'T', 'N']) lines[k] = [];
  return [{ lines, model: CMT_MODEL }, 200];
}
