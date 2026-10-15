"""One-time import of the published stories from the old rapaechelon.com into the new RAPMAG (D1 + R2).
Reads each public article page (NewsArticle JSON-LD + the articleBody HTML), copies the featured and inline images into
the rapmag-images bucket, and writes import-old.sql. Images are uploaded with wrangler (already logged in)."""
import re, json, html, os, subprocess, urllib.request, urllib.parse, hashlib
from html.parser import HTMLParser
os.chdir(os.path.dirname(os.path.abspath(__file__)))
BASE = 'https://www.rapaechelon.com'
UA = {'User-Agent': 'Mozilla/5.0'}
WR = ['node', 'node_modules/wrangler/bin/wrangler.js']
CATS = {'Music': 'music', 'Entertainment': 'entertainment', 'Breaking': 'breaking'}
SITE = 'https://mezdefjam2014.github.io/rapmag'

def get(u, binary=False):
    r = urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=60)
    b = r.read(); return (b, r.headers.get('Content-Type', '')) if binary else b.decode('utf-8', 'ignore')

def inner(page, cls):
    """HTML inside the first <div class="cls"> (balanced)."""
    m = re.search(r'<div class="' + cls + r'"[^>]*>', page)
    if not m: return ''
    i, depth = m.end(), 1
    for t in re.finditer(r'<(/?)div\b[^>]*>', page[i:]):
        depth += -1 if t.group(1) else 1
        if depth == 0: return page[i:i + t.start()]
    return ''

def real(u):
    """undo Next.js /_next/image?url=... wrappers"""
    u = html.unescape(u)
    if '/_next/image' in u: u = urllib.parse.parse_qs(urllib.parse.urlparse(u).query).get('url', [u])[0]
    return urllib.parse.urljoin(BASE, u)

uploaded = {}
def copy_image(u, when, name):
    u = real(u)
    if u in uploaded: return uploaded[u]
    data, ct = get(u, True); ct = ct.split(';')[0].strip()
    ext = {'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif', 'image/avif': 'avif'}.get(ct, 'jpg')
    key = f"images/{when[:4]}/{when[5:7]}/{hashlib.md5(u.encode()).hexdigest()[:8]}-{name[:40]}.{ext}"
    tmp = 'tmp-import.' + ext; open(tmp, 'wb').write(data)
    subprocess.run(WR + ['r2', 'object', 'put', 'rapmag-images/' + key, '--file', tmp, '--content-type', ct or 'image/jpeg', '--remote'], check=True, capture_output=True)
    os.remove(tmp); uploaded[u] = '/img/' + key; print('  image ->', key); return uploaded[u]

home = get(BASE + '/')
slugs = sorted(set(re.findall(r'href="/article/([a-z0-9-]+)"', home)))
q = lambda s: "'" + str(s).replace("'", "''") + "'"
sql = []
for slug in slugs:
    page = get(BASE + '/article/' + slug); print(slug)
    ld = next(json.loads(x) for x in re.findall(r'<script type="application/ld\+json">(.*?)</script>', page, re.S) if '"NewsArticle"' in x)
    when = ld['datePublished'][:19].replace('T', ' ')
    hero = re.search(r'<img[^>]*class="articleHeroNative"[^>]*>', page) or re.search(r'<img[^>]*articleHeroNative[^>]*>', page)
    alt = html.unescape(re.search(r'alt="([^"]*)"', hero.group(0)).group(1)) if hero else ''
    cover = copy_image(ld['image'][0] if isinstance(ld.get('image'), list) else ld['image'], when, slug) if ld.get('image') else ''
    body = inner(page, 'articleBody')
    # inline images: keep one clean <figure><img></figure> per image, copied into R2
    def fig(m):
        tag = m.group(0); src = re.search(r'src="([^"]+)"', tag)
        if not src: return ''
        a = re.search(r'alt="([^"]*)"', tag); a = a.group(1) if a else ''
        return f'<figure><img src="{copy_image(src.group(1), when, slug + "-inline")}" alt="{a}"></figure>'
    body = re.sub(r'<img\b[^>]*>', fig, body)
    body = re.sub(r'\s(class|style|data-[\w-]+|loading|decoding|sizes|srcset|srcSet|width|height|data-nimg)="[^"]*"', '', body)
    body = re.sub(r'<(/?)(span|div)\b[^>]*>', '', body)            # wrappers from the old layout
    body = re.sub(r'<a href="/article/([a-z0-9-]+)"', lambda m: f'<a href="{SITE}/article/{m.group(1)}/"', body)  # old internal links -> new site
    body = re.sub(r'<a (?![^>]*target=)', '<a target="_blank" rel="noopener" ', body)
    body = re.sub(r'(<figure>)(?:\s*<figure>)+', r'\1', body); body = re.sub(r'(</figure>)(?:\s*</figure>)+', r'\1', body)
    body = body.strip()
    cat = CATS.get(ld.get('articleSection', ''), 'entertainment')
    sql.append("INSERT INTO posts (slug,title,dek,body,cover,cover_alt,category,tags,author,author_id,status,featured,published_at,updated_at) VALUES ("
               + ','.join([q(slug), q(html.unescape(ld['headline'])), q(html.unescape(ld.get('description', ''))[:400]), q(body), q(cover), q(alt[:200]), q(cat), q(''), q('RAPMAG Staff'),
                           "(SELECT id FROM authors WHERE slug='rapmag-staff')", "'published'", '0', q(when), q(ld.get('dateModified', ld['datePublished'])[:19].replace('T', ' '))])
               + ") ON CONFLICT(slug) DO NOTHING;")
open('import-old.sql', 'w', encoding='utf-8').write('\n'.join(sql) + '\n')
print('wrote import-old.sql with', len(sql), 'articles,', len(uploaded), 'images')
