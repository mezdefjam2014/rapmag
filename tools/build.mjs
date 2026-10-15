// RAPMAG static build (GitHub Actions, on every push + hourly): copies site/ to dist/ and pre-renders every live article,
// info page and author at a clean URL with its own title, description, canonical, Open Graph and JSON-LD, so Google reads full
// stories without running JavaScript. Also writes sitemap.xml, news-sitemap.xml, feed.xml (RSS), robots.txt, ads.txt and 404.html.
import fs from 'fs'; import path from 'path';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), '..'), SRC = path.join(ROOT, 'site'), OUT = path.join(ROOT, 'dist');
const API = process.env.RM_API || 'https://rapmag-api.cookupking18.workers.dev';
const data = await (await fetch(API + '/api/build')).json();
const S = data.settings || {}, SITE = (S.site_url || process.env.SITE_URL || 'https://mezdefjam2014.github.io/rapmag').replace(/\/+$/, ''), BASE = new URL(SITE + '/').pathname;
const CN = Object.fromEntries((data.cats || []).map(c => [c.slug, c.name]));
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const img = u => !u ? '' : /^https?:/.test(u) ? u : API + u, iso = d => d ? d.replace(' ', 'T') + 'Z' : '';
const when = d => d ? new Date(iso(d)).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }) : '';
const strip = h => String(h || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const fixBody = h => String(h || '').replace(/(<img[^>]*src=")(\/img\/[^"]+)"/g, (m, a, b) => a + API + b + '" loading="lazy"');

fs.rmSync(OUT, { recursive: true, force: true }); fs.cpSync(SRC, OUT, { recursive: true });
const tpl = name => fs.readFileSync(path.join(SRC, name), 'utf8').replace('<head>', `<head><base href="${BASE}">`);
for (const f of fs.readdirSync(OUT).filter(f => f.endsWith('.html'))) fs.writeFileSync(path.join(OUT, f), tpl(f));
fs.writeFileSync(path.join(OUT, '404.html'), tpl('article.html').replace('data-page="article"', 'data-page="auto"'));

function page(template, dir, { title, desc, image, type, ld, main }) {
  const url = SITE + '/' + dir + '/';
  let h = tpl(template).replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`).replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${esc(desc)}">`)
    .replace(/<meta property="og:title"[^>]*>/, '').replace(/<meta property="og:image"[^>]*>/, '')
    .replace('</head>', `<link rel="canonical" href="${url}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${url}"><meta property="og:type" content="${type}"><meta property="og:image" content="${esc(image || SITE + '/og.jpg')}"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(desc)}"><meta name="twitter:image" content="${esc(image || SITE + '/og.jpg')}">${ld ? `<script type="application/ld+json" data-ld="article">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>` : ''}</head>`)
    .replace(/<main id="main">[\s\S]*?<\/main>/, `<main id="main">${main}</main>`);
  fs.mkdirSync(path.join(OUT, dir), { recursive: true }); fs.writeFileSync(path.join(OUT, dir, 'index.html'), h);
}
const posts = data.posts || [], articles = posts.filter(p => p.category !== 'page');
/* home page starts instantly from data built into it (refreshed by every build) */
{ const L = ['id', 'slug', 'title', 'dek', 'cover', 'cover_alt', 'category', 'featured', 'published_at', 'author', 'author_slug', 'author_verified'], top = articles.slice().sort((a, b) => (b.featured || 0) - (a.featured || 0)).slice(0, 12).map(p => Object.fromEntries(L.map(k => [k, p[k]])));
  const boot = { settings: S, cats: data.cats || [], posts: { posts: top } }, f = path.join(OUT, 'index.html');
  fs.writeFileSync(f, fs.readFileSync(f, 'utf8').replace('<script src="config.js', `<script>window.RM_BOOT=${JSON.stringify(boot).replace(/</g, '\\u003c')}</script><script src="config.js`)) }
for (const p of posts) {
  const isPage = p.category === 'page', dir = (isPage ? 'page/' : 'article/') + p.slug, desc = (p.dek || strip(p.body).slice(0, 160)).slice(0, 300);
  const ld = isPage ? null : { '@context': 'https://schema.org', '@type': 'NewsArticle', headline: p.title, description: desc, image: p.cover ? [img(p.cover)] : undefined, datePublished: iso(p.published_at), dateModified: iso(p.updated_at || p.published_at), author: { '@type': 'Person', name: p.author, url: p.author_slug ? SITE + '/author/' + p.author_slug + '/' : undefined }, publisher: { '@type': 'NewsMediaOrganization', name: 'RAPAECHELON - RAPMAG', logo: { '@type': 'ImageObject', url: SITE + '/logo.webp' } }, articleSection: CN[p.category] || p.category, keywords: p.tags || undefined, mainEntityOfPage: SITE + '/' + dir + '/' };
  const main = `<article class="wrap story"><header class="st-head">${isPage ? '' : `<a class="c" href="index.html?c=${esc(p.category)}">${esc(CN[p.category] || p.category)}</a>`}<h1>${esc(p.title)}</h1>${p.dek ? `<p class="dek">${esc(p.dek)}</p>` : ''}${isPage ? '' : `<div class="meta">${when(p.published_at)} · By ${p.author_slug ? `<a href="author/${esc(p.author_slug)}/">${esc(p.author)}</a>` : esc(p.author)}</div>`}</header>${p.cover ? `<figure class="st-cover"><img src="${esc(img(p.cover))}" alt="${esc(p.cover_alt || p.title)}"></figure>` : ''}<div class="st-cols"><div><div class="body">${fixBody(p.body)}</div></div></div></article>`;
  page(isPage ? 'page.html' : 'article.html', dir, { title: p.title + ' | RAPAECHELON - RAPMAG', desc, image: p.cover ? img(p.cover) : '', type: 'article', ld, main });
}
for (const a of data.authors || []) {
  const mine = articles.filter(p => p.author_slug === a.slug).slice(0, 30);
  page('author.html', 'author/' + a.slug, { title: a.name + ' | RAPAECHELON - RAPMAG', desc: (a.bio || a.role || a.name + ' writes for RAPAECHELON - RAPMAG.').slice(0, 300), image: a.photo ? img(a.photo) : '', type: 'profile',
    ld: { '@context': 'https://schema.org', '@type': 'ProfilePage', mainEntity: { '@type': 'Person', name: a.name, jobTitle: a.role || undefined, description: a.bio || undefined, image: a.photo ? img(a.photo) : undefined, sameAs: ['website', 'instagram', 'x', 'facebook', 'youtube'].map(k => a[k]).filter(Boolean) } },
    main: `<div class="wrap shell"><h1>${esc(a.name)}</h1><p>${esc(a.bio || '')}</p><ul>${mine.map(p => `<li><a href="article/${p.slug}/">${esc(p.title)}</a></li>`).join('')}</ul></div>` });
}
/* sitemaps, feed, robots, ads.txt */
const x = s => esc(s), urls = [{ loc: SITE + '/', mod: articles[0] && articles[0].updated_at }].concat((data.cats || []).map(c => ({ loc: SITE + '/index.html?c=' + c.slug })), posts.map(p => ({ loc: SITE + '/' + (p.category === 'page' ? 'page/' : 'article/') + p.slug + '/', mod: p.updated_at || p.published_at, img: p.cover ? img(p.cover) : '' })), (data.authors || []).map(a => ({ loc: SITE + '/author/' + a.slug + '/' })));
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls.map(u => `<url><loc>${x(u.loc)}</loc>${u.mod ? `<lastmod>${iso(u.mod)}</lastmod>` : ''}${u.img ? `<image:image><image:loc>${x(u.img)}</image:loc></image:image>` : ''}</url>`).join('\n')}\n</urlset>\n`);
const recent = articles.filter(p => Date.now() - new Date(iso(p.published_at)) < 2 * 864e5);
fs.writeFileSync(path.join(OUT, 'news-sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n${recent.map(p => `<url><loc>${x(SITE + '/article/' + p.slug + '/')}</loc><news:news><news:publication><news:name>RAPAECHELON - RAPMAG</news:name><news:language>en</news:language></news:publication><news:publication_date>${iso(p.published_at)}</news:publication_date><news:title>${x(p.title)}</news:title></news:news></url>`).join('\n')}\n</urlset>\n`);
fs.writeFileSync(path.join(OUT, 'feed.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>RAPAECHELON - RAPMAG</title><link>${x(SITE + '/')}</link><description>Hip-hop, rap and entertainment news.</description><language>en-us</language>\n${articles.slice(0, 30).map(p => `<item><title>${x(p.title)}</title><link>${x(SITE + '/article/' + p.slug + '/')}</link><guid>${x(SITE + '/article/' + p.slug + '/')}</guid><pubDate>${new Date(iso(p.published_at)).toUTCString()}</pubDate><description>${x(p.dek || strip(p.body).slice(0, 300))}</description><author>${x(p.author)}</author><category>${x(CN[p.category] || p.category)}</category></item>`).join('\n')}\n</channel></rss>\n`);
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: ${BASE}admin.html\nSitemap: ${SITE}/sitemap.xml\nSitemap: ${SITE}/news-sitemap.xml\n`);
if (/^ca-pub-\d+$/.test(S.adsense_id || '')) fs.writeFileSync(path.join(OUT, 'ads.txt'), `google.com, ${S.adsense_id.replace('ca-', '')}, DIRECT, f08c47fec0942fa0\n`);
for (const f of ['index.html', 'article.html', 'page.html', 'author.html', '404.html']) { const p = path.join(OUT, f); fs.writeFileSync(p, fs.readFileSync(p, 'utf8').replace('</head>', `<link rel="alternate" type="application/rss+xml" title="RAPAECHELON - RAPMAG" href="${SITE}/feed.xml"></head>`)) }
/* custom domain: GitHub Pages reads the CNAME file */
const host = new URL(SITE).hostname; if (!host.endsWith('github.io')) fs.writeFileSync(path.join(OUT, 'CNAME'), host + '\n');
console.log(`built ${posts.length} posts, ${(data.authors || []).length} authors, ${recent.length} in news sitemap -> ${SITE}`);
