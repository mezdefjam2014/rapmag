"""Rebuild cut-off excerpts of the imported stories from their opening sentences (full sentences, about 140-260 characters)."""
import json, re, html, subprocess, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
WR = ['node', 'node_modules/wrangler/bin/wrangler.js', 'd1', 'execute', 'rapmag-db', '--remote', '--json']
rows = json.loads(subprocess.run(WR + ['--command', "SELECT slug,dek,body FROM posts WHERE category<>'page'"], capture_output=True, text=True, encoding='utf-8').stdout)[0]['results']
q = lambda s: "'" + s.replace("'", "''") + "'"
out = []
for r in rows:
    text = html.unescape(re.sub(r'<[^>]+>', '', re.sub(r'</(p|h[1-6]|li|figure|blockquote)>', ' ', r['body']))); text = re.sub(r'\s+', ' ', text).strip()
    sents = re.findall(r'.+?[.!?](?:["”’])?(?=\s|$)', text)
    dek = ''
    for s in sents:
        if len(dek) + len(s) > 260 and len(dek) >= 120: break
        dek = (dek + ' ' + s.strip()).strip()
    if len(dek) > 300: dek = dek[:297].rsplit(' ', 1)[0] + '…'
    print(len(dek), '|', dek[:90])
    out.append(f"UPDATE posts SET dek={q(dek)} WHERE slug={q(r['slug'])};")
open('fix-deks.sql', 'w', encoding='utf-8').write('\n'.join(out) + '\n')
