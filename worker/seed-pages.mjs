// adds the About / Editorial Standards / Corrections Policy pages (text from rapaechelon.com) through the back office API
// usage: node seed-pages.mjs [apiBase]   (local preview reads the password from .dev.vars)
import fs from 'fs';
const API=process.argv[2]||'http://127.0.0.1:8787',pw=process.env.RM_PW||fs.readFileSync('.dev.vars','utf8').match(/ADMIN_PASSWORD=(.*)/)[1].trim();
const {token}=await (await fetch(API+'/api/admin/login',{method:'POST',body:JSON.stringify({password:pw})})).json();
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
for(const p of JSON.parse(fs.readFileSync('info-pages.json','utf8'))){
 const slug=p.slug==='corrections'?'corrections-policy':p.slug,body=p.content.split(/\n\s*\n/).map(x=>'<p>'+esc(x.trim())+'</p>').join('');
 const r=await fetch(API+'/api/admin/posts',{method:'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify({title:p.title,slug,dek:'',body,category:'page',status:'published',author:'Rapaechelon'})});
 console.log(slug,r.status)}
