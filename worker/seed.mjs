// local preview only: fills the local database with demo articles and uploads demo images to the local R2
import fs from 'fs';
const API='http://127.0.0.1:8787',pw=fs.readFileSync('.dev.vars','utf8').match(/ADMIN_PASSWORD=(.*)/)[1].trim();
const {token}=await (await fetch(API+'/api/admin/login',{method:'POST',body:JSON.stringify({password:pw})})).json();
const H={Authorization:'Bearer '+token};
const imgs=[];for(const f of process.argv.slice(2)){const fd=new FormData();fd.append('file',new Blob([fs.readFileSync(f)],{type:f.endsWith('.png')?'image/png':f.endsWith('.webp')?'image/webp':'image/jpeg'}),f.split(/[\/]/).pop());imgs.push((await (await fetch(API+'/api/admin/upload',{method:'POST',headers:H,body:fd})).json()).url)}
const P=[['The New Wave Is Here: Inside the Sound Taking Over 2026','Demo article. A look at the producers and rappers pushing the culture forward.','culture',1],
['Demo Interview: The Producer Behind Everybody\'s Favorite Beat','Demo article. Long-form conversation about sampling, crates and late nights.','interviews',0],
['New Music Friday: 10 Demo Tracks You Need This Week','Demo article. Fresh drops across drill, boom bap and R&B.','new-music',0],
['Review: A Demo Album That Rewrites the Rules','Demo article. Track-by-track breakdown and score.','reviews',0],
['Demo News: Festival Lineup Announced','Demo article. Dates, cities and the full bill.','news',0],
['How Vinyl Crates Still Shape Hip Hop Production','Demo article. Why producers keep digging.','producers',0],
['Demo News: Surprise Mixtape Drops at Midnight','Demo article. Everything we know so far.','news',0],
['Culture Check: Fashion, Sneakers and the Studio','Demo article. Where style meets sound.','culture',0]];
const body=(i)=>`<p>This is a demo article for the local preview of RAPAECHELON · RAPMAG. Real stories are written in the back office and replace these.</p><h2>The headline section</h2><p>Body text is set in a readable serif with big Anton headings, red accents and pull quotes, matching the record-store look.</p><blockquote>A pull quote looks like this, big and loud.</blockquote><figure><img src="${imgs[(i+1)%imgs.length]}" alt="demo"><figcaption>Images uploaded in the back office live in Cloudflare R2.</figcaption></figure><h3>Small heading</h3><ul><li>Lists work</li><li>Links work</li></ul><p>Last paragraph of the demo.</p>`;
for(const [i,[t,d,c,f]] of P.entries()){await fetch(API+'/api/admin/posts',{method:'POST',headers:{...H,'Content-Type':'application/json'},body:JSON.stringify({title:t,dek:d,category:c,featured:f,cover:imgs[i%imgs.length],body:body(i),tags:'demo, '+c,status:'published'})})}
console.log('seeded',P.length,'posts',imgs.length,'images');
