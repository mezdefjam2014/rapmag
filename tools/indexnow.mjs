// After each GitHub Pages deploy: tell IndexNow (Bing, Yahoo, DuckDuckGo, Yandex, Seznam, Naver…) about stories changed in the last 3 hours.
// Runs after the deploy so the pages already exist. Only on the real domain (IndexNow does not accept github.io).
import fs from 'fs';
const API = process.env.RM_API || 'https://rapmag-api.cookupking18.workers.dev';
const d = await (await fetch(API + '/api/build')).json(), S = d.settings || {};
const SITE = (S.site_url || 'https://www.rapaechelon.com').replace(/\/+$/, ''), host = new URL(SITE).hostname;
if (host.endsWith('github.io')) { console.log('IndexNow skipped: site is still on github.io'); process.exit(0) }
const key = fs.readdirSync('site').find(f => /^[0-9a-f]{32}\.txt$/.test(f)).slice(0, 32);
const since = Date.now() - 3 * 3600e3, iso = s => Date.parse(String(s).replace(' ', 'T') + 'Z');
const urls = d.posts.filter(p => iso(p.updated_at || p.published_at) > since || iso(p.published_at) > since).map(p => SITE + '/' + (p.category === 'page' ? 'page/' : 'article/') + p.slug + '/');
if (!urls.length) { console.log('IndexNow: nothing new'); process.exit(0) }
urls.push(SITE + '/', SITE + '/sitemap.xml');
const r = await fetch('https://api.indexnow.org/indexnow', { method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' }, body: JSON.stringify({ host, key, keyLocation: SITE + '/' + key + '.txt', urlList: urls }) });
console.log('IndexNow', r.status, urls.length, 'urls');
