"""Make 800px WebP copies (thumbs/800/...) of every image already in rapmag-images, for fast story cards.
New uploads get their copy from the back office automatically; this covers older images. Uses wrangler (logged in)."""
import json, os, subprocess, io, urllib.request
from PIL import Image
try: import pillow_avif  # noqa: F401  (AVIF support)
except ImportError: pass
os.chdir(os.path.dirname(os.path.abspath(__file__)))
WR = ['node', 'node_modules/wrangler/bin/wrangler.js']
API = 'https://rapmag-api.cookupking18.workers.dev'
d = json.load(urllib.request.urlopen(urllib.request.Request(API + '/api/build', headers={'User-Agent': 'Mozilla/5.0'})))
import re
keys = set()
for p in d['posts']:
    for m in re.finditer(r'/img/(images/[^"\'\s?<>)]+)', (p.get('cover') or '') + ' ' + (p.get('body') or '')): keys.add(m.group(1))
for k in ('logo', 'promo_image'):
    v = d['settings'].get(k) or ''
    if v.startswith('/img/images/'): keys.add(v[5:])
for key in sorted(keys):
    raw = urllib.request.urlopen(urllib.request.Request(API + '/img/' + key, headers={'User-Agent': 'Mozilla/5.0'})).read()
    im = Image.open(io.BytesIO(raw)); im = im.convert('RGBA' if im.mode in ('RGBA', 'LA', 'P') else 'RGB')
    if im.width > 800: im = im.resize((800, round(im.height * 800 / im.width)), Image.LANCZOS)
    buf = io.BytesIO(); im.save(buf, 'WEBP', quality=82, method=6); open('tmp-thumb.webp', 'wb').write(buf.getvalue())
    tk = 'thumbs/800/' + re.sub(r'\.[a-z0-9]+$', '', key) + '.webp'
    subprocess.run(WR + ['r2', 'object', 'put', 'rapmag-images/' + tk, '--file', 'tmp-thumb.webp', '--content-type', 'image/webp', '--remote'], check=True, capture_output=True)
    print(f'{len(raw)//1024:>6} KB -> {len(buf.getvalue())//1024:>4} KB  {key}')
os.remove('tmp-thumb.webp')
