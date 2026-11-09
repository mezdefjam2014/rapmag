/* RAPMAG share cards: the artist picks Poster / Gold Plaque / Magazine and Story / Square, then shares or saves a real PNG. Loaded only when SHARE is tapped. */
(function(){
const CSS=`.shc .c{position:relative;overflow:hidden;font-family:Inter}
.shc .grain:after{content:'';position:absolute;inset:0;opacity:.09;mix-blend-mode:overlay;pointer-events:none;background:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence baseFrequency='.8' numOctaves='3'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}
.shc .logo{height:70px;width:auto}
.shc .heart{width:1em;height:1em;vertical-align:-.12em}
.shc /* ===== A: POSTER (black,.shc huge red rank,.shc record bleeding off the edge) ===== */
.A{background:#0a0a0b;color:#fff}
.shc .A .rec{position:absolute;border-radius:50%;filter:drop-shadow(0 30px 80px #000)}
.shc .A .glow{position:absolute;border-radius:50%;background:radial-gradient(#e0242f55,transparent 65%)}
.shc .A .rk{font:400 Anton;font-family:Anton;color:#e0242f;line-height:.8;letter-spacing:-.02em}
.shc .A .wk{font:900 26px Inter;letter-spacing:.35em;color:#fff}
.shc .A .t{font-family:Anton;line-height:.95;text-transform:uppercase}
.shc .A .ar{font:800 Inter;font-family:Inter;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:#bbb}
.shc .A .mv{display:inline-block;background:#e0242f;color:#fff;font:900 34px Inter;padding:10px 22px;letter-spacing:.08em}
.shc .A .st{display:flex;gap:46px;font:800 36px Inter;color:#fff}
.shc .A .st small{display:block;font:800 18px Inter;letter-spacing:.3em;color:#888;margin-bottom:6px}
.shc .A .foot{position:absolute;left:0;right:0;bottom:0;background:#0a0a0b;z-index:2;display:flex;justify-content:space-between;align-items:center;border-top:3px solid #e0242f}
.shc .A .url{font:900 24px Inter;letter-spacing:.3em}
.shc /* ===== B: GOLD (gold record centered,.shc warm,.shc luxury chart plaque) ===== */
.B{background:radial-gradient(circle at 50% 38%,#3a2a0c 0,#120d05 55%,#050403 100%);color:#f6e7c1;text-align:center}
.shc .B .ring{position:absolute;left:50%;transform:translateX(-50%);border:3px solid #c9a24a55;border-radius:50%}
.shc .B .rec{position:absolute;left:50%;transform:translateX(-50%);border-radius:50%;filter:drop-shadow(0 0 70px #d6a73c66)}
.shc .B .lbl{font:900 26px Inter;letter-spacing:.45em;color:#d6b25e}
.shc .B .rk{font-family:Anton;background:linear-gradient(180deg,#fff3c4,#d6a73c 55%,#8a6414);-webkit-background-clip:text;color:transparent;line-height:.85}
.shc .B .t{font-family:'Source Serif 4';font-style:italic;font-weight:600;line-height:1.02;color:#fff}
.shc .B .ar{font:800 Inter;font-family:Inter;font-weight:800;letter-spacing:.32em;text-transform:uppercase;color:#d6b25e}
.shc .B .line{height:2px;background:linear-gradient(90deg,transparent,#d6b25e,transparent);margin:0 auto}
.shc .B .st{display:flex;justify-content:center;gap:70px;font:800 38px Inter}
.shc .B .st small{display:block;font:800 17px Inter;letter-spacing:.32em;color:#a88a4a;margin-bottom:6px}
.shc .B .mv{color:#7ee08a}
.shc /* ===== C: MAGAZINE (off-white paper,.shc big type,.shc red bar,.shc like the site) ===== */
.C{background:#f7f6f3;color:#0c0c0e}
.shc .C .bar{position:absolute;left:0;right:0;top:0;background:#e0242f;color:#fff;font:900 24px Inter;letter-spacing:.35em;display:flex;align-items:center;justify-content:center}
.shc .C .cov{position:absolute;background:#0c0c0e;overflow:hidden}
.shc .C .cov img{width:100%;height:100%;object-fit:cover}
.shc .C .rk{font-family:Anton;color:#0c0c0e;line-height:.8}
.shc .C .rk sup{font-size:.35em;vertical-align:top;color:#e0242f;margin-right:6px}
.shc .C .t{font-family:Anton;text-transform:uppercase;line-height:.92}
.shc .C .ar{font:800 Inter;font-family:Inter;font-weight:800;letter-spacing:.22em;text-transform:uppercase;color:#e0242f}
.shc .C .st{display:flex;gap:0;border-top:3px solid #0c0c0e;border-bottom:1px solid #0c0c0e}
.shc .C .st div{flex:1;padding:22px 0;font:800 40px Inter}
.shc .C .st div+div{border-left:1px solid #0c0c0e;padding-left:28px}
.shc .C .st small{display:block;font:800 17px Inter;letter-spacing:.3em;color:#6b6b72;margin-bottom:4px}
.shc .C .mv{color:#1a9c3a}
.shc .C .foot{position:absolute;left:0;right:0;bottom:0;background:#0c0c0e;color:#fff;display:flex;justify-content:space-between;align-items:center}
.shc .st>div{white-space:nowrap}
.shc img.heart{display:inline-block;margin:0 .1em 0 0}
.shm{position:fixed;inset:0;z-index:400;background:rgba(8,8,10,.86);display:flex;align-items:center;justify-content:center;padding:16px;font-family:Inter,sans-serif}
.shm-b{background:#121214;color:#fff;width:min(560px,100%);max-height:100%;overflow:auto;padding:18px;border:1px solid #2a2a2e;position:relative}
.shm-h{font:400 26px Anton,sans-serif;letter-spacing:.02em;margin:0 40px 12px 0}
.shm-x{position:absolute;right:10px;top:8px;background:none;border:0;color:#fff;font-size:30px;line-height:1;cursor:pointer}
.shm-t{display:flex;gap:6px;margin-bottom:8px;flex-wrap:wrap}.shm-t button{flex:1;background:#1f1f23;color:#bbb;border:1px solid #333;padding:9px 6px;font:800 11px Inter,sans-serif;letter-spacing:.12em;cursor:pointer}
.shm-t button.on{background:#e0242f;border-color:#e0242f;color:#fff}
.shm-p{display:flex;justify-content:center;margin:12px 0;min-height:200px}.shm-p .shc{overflow:hidden;box-shadow:0 12px 40px #000}.shm-p .shc>.c{transform-origin:0 0}
.shm-a{display:flex;gap:8px}.shm-a button{flex:1;padding:13px;font:900 13px Inter,sans-serif;letter-spacing:.14em;border:0;cursor:pointer}
.shm-a .go{background:#e0242f;color:#fff}.shm-a .sv{background:#fff;color:#111}.shm-a button[disabled]{opacity:.5}
.shm-n{font:600 12px Inter,sans-serif;color:#999;text-align:center;margin-top:10px;min-height:16px}
.shc-off{position:fixed;left:-20000px;top:0;pointer-events:none}`;
const esc=v=>String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const fit=(b,t)=>Math.round(b*Math.max(.5,Math.min(1,Math.sqrt(26/Math.max(1,String(t).length)))));
const H='<img class="heart" src="heart.webp">',L='<img class="logo" src="logo.webp">',TRO='🏆';
const T={
A:{
story:s=>`<div class="c A grain" style="width:1080px;height:1920px">
 <div class="glow" style="width:1500px;height:1500px;right:-700px;top:-200px"></div>
 <img class="rec" src="${s.cover}" style="width:1250px;height:1250px;right:-560px;top:120px">
 <div style="position:absolute;left:80px;top:90px">${L}</div>
 <div class="wk" style="position:absolute;left:80px;top:210px">INDIE CHARTS · ${s.week}</div>
 <div class="rk" style="position:absolute;left:58px;top:330px;font-size:620px">#${s.rank}</div>
 <div style="position:absolute;left:80px;right:80px;top:1010px">
  <span class="mv">${s.move}</span> ${s.rank==1?`<span class="mv" style="background:#fff;color:#0a0a0b">${TRO} #1 THIS WEEK</span>`:``}
  <div class="t" style="font-size:${fit(150,s.title)}px;margin-top:40px">${s.title}</div>
  <div class="ar" style="font-size:46px;margin-top:26px">${s.artist}</div>
  <div class="st" style="margin-top:70px"><div><small>PLAYS</small>${s.plays}</div><div><small>LIKES</small>${H} ${s.likes}</div><div><small>LAST WEEK</small>${s.lastTxt}</div></div>
 </div>
 <div class="foot" style="height:150px;padding:0 80px"><span class="url">RAPAECHELON.COM/CHARTS</span><span class="url" style="color:#e0242f">LISTEN NOW →</span></div></div>`,
post:s=>`<div class="c A grain" style="width:1080px;height:1080px">
 <div class="glow" style="width:1100px;height:1100px;right:-500px;top:-300px"></div>
 <img class="rec" src="${s.cover}" style="width:820px;height:820px;right:-330px;top:20px">
 <div style="position:absolute;left:70px;top:60px">${L}</div>
 <div class="rk" style="position:absolute;left:52px;top:170px;font-size:400px">#${s.rank}</div>
 <div style="position:absolute;left:70px;right:300px;top:590px"><span class="mv" style="font-size:28px">${s.move}</span>
  <div class="t" style="font-size:${fit(96,s.title)}px;margin-top:22px">${s.title}</div>
  <div class="ar" style="font-size:34px;margin-top:16px">${s.artist} · ${H} ${s.likes}</div></div>
 <div class="foot" style="height:110px;padding:0 70px"><span class="url" style="font-size:20px">INDIE CHARTS · ${s.week}</span><span class="url" style="font-size:20px;color:#e0242f">RAPAECHELON.COM</span></div></div>`},
B:{
story:s=>`<div class="c B grain" style="width:1080px;height:1920px">
 <div style="position:absolute;left:0;right:0;top:100px">${L}</div>
 <div class="lbl" style="position:absolute;left:0;right:0;top:220px">INDIE CHARTS · ${s.week}</div>
 <div class="ring" style="width:980px;height:980px;top:330px"></div><div class="ring" style="width:1060px;height:1060px;top:290px;opacity:.5"></div>
 <img class="rec" src="${s.cover}" style="width:900px;height:900px;top:370px">
 <div class="rk" style="position:absolute;left:0;right:0;top:1150px;font-size:300px">№${s.rank}</div>
 <div style="position:absolute;left:90px;right:90px;top:1440px"><div class="t" style="font-size:${fit(88,s.title)}px">${s.title}</div>
 <div class="ar" style="font-size:38px;margin-top:22px">${s.artist}</div></div>
 <div style="position:absolute;left:0;right:0;bottom:90px"><div class="line" style="width:600px;margin-bottom:34px"></div>
  <div class="st"><div><small>PLAYS</small>${s.plays}</div><div><small>LIKES</small>${H} ${s.likes}</div><div><small>MOVE</small><span class="mv">${s.move}</span></div></div></div>
 </div>`,
post:s=>`<div class="c B grain" style="width:1080px;height:1080px">
 <div class="lbl" style="position:absolute;left:0;right:0;top:56px;font-size:22px">INDIE CHARTS · ${s.week}</div>
 <div class="ring" style="width:640px;height:640px;top:120px"></div>
 <img class="rec" src="${s.cover}" style="width:580px;height:580px;top:150px">
 <div class="rk" style="position:absolute;left:0;right:0;top:330px;font-size:230px;text-shadow:none;filter:drop-shadow(0 8px 20px #000)">№${s.rank}</div>
 <div style="position:absolute;left:70px;right:70px;top:760px"><div class="t" style="font-size:${fit(58,s.title)}px">${s.title}</div>
 <div class="ar" style="font-size:26px;margin-top:12px">${s.artist}</div></div>
 <div class="st" style="position:absolute;left:0;right:0;top:950px;font-size:30px"><div>${s.plays} PLAYS</div><div>${H} ${s.likes}</div><div class="mv">${s.move}</div></div></div>`},
C:{
story:s=>`<div class="c C grain" style="width:1080px;height:1920px">
 <div class="bar" style="height:110px">INDIE CHARTS · ${s.week}</div>
 <div class="cov" style="left:80px;right:80px;top:200px;height:920px"><img src="${s.cover}" style="object-fit:contain;padding:60px;background:#0c0c0e"></div>
 <div class="rk" style="position:absolute;right:80px;top:1060px;font-size:300px;background:#f7f6f3;padding:20px 30px 0"><sup>NO.</sup>${s.rank}</div>
 <div style="position:absolute;left:80px;right:80px;top:1250px">
  <div class="ar" style="font-size:38px">${s.artist}${s.rank==1?` · ${TRO} #1 THIS WEEK`:``}</div>
  <div class="t" style="font-size:${fit(130,s.title)}px;margin-top:14px">${s.title}</div>
  <div class="st" style="margin-top:44px"><div><small>PLAYS</small>${s.plays}</div><div><small>LIKES</small>${H} ${s.likes}</div><div><small>MOVE</small><span class="mv">${s.move}</span></div></div></div>
 <div class="foot" style="height:140px;padding:0 80px">${L.replace('70px','60px')}<span style="font:900 24px Inter;letter-spacing:.3em">LISTEN → RAPAECHELON.COM</span></div></div>`,
post:s=>`<div class="c C grain" style="width:1080px;height:1080px">
 <div class="bar" style="height:84px;font-size:20px">INDIE CHARTS · ${s.week}</div>
 <div class="cov" style="left:60px;top:144px;width:470px;height:470px"><img src="${s.cover}" style="object-fit:contain;padding:30px"></div>
 <div class="rk" style="position:absolute;left:580px;top:150px;font-size:400px"><sup>NO.</sup>${s.rank}</div>
 <div style="position:absolute;left:60px;right:60px;top:650px">
  <div class="ar" style="font-size:30px">${s.artist}</div>
  <div class="t" style="font-size:${fit(88,s.title)}px;margin-top:8px">${s.title}</div></div>
 <div class="foot" style="height:110px;padding:0 60px"><span style="font:800 28px Inter">${s.plays} plays · ${H} ${s.likes} · <span style="color:#5be07a">${s.move}</span></span><span style="font:900 18px Inter;letter-spacing:.3em">RAPAECHELON.COM</span></div></div>`}};

const SZ={story:[1080,1920],post:[1080,1080]},NM={A:'POSTER',B:'GOLD',C:'MAGAZINE'};
const lib=()=>window.htmlToImage?Promise.resolve():new Promise((ok,no)=>{const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/html-to-image@1.11.11/dist/html-to-image.js';s.onload=ok;s.onerror=no;document.head.appendChild(s)});
const data=(it,week)=>{const n=v=>Number(v||0).toLocaleString('en-US'),mv=it.last?(it.last>it.rank?'▲ '+(it.last-it.rank):it.last<it.rank?'▼ '+(it.rank-it.last):'– SAME'):'NEW';
 return{rank:it.rank,title:esc(it.title),artist:esc(it.artist),plays:n(it.plays),likes:n(it.likes),move:mv,lastTxt:it.last?'#'+it.last:'NEW',
  week:'WEEK OF '+new Date(week||Date.now()).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}).toUpperCase(),cover:esc(it.coverUrl||'gold-record.webp')}};
window.RMShare=function(it,week){
 if(!document.getElementById('shc-css')){const s=document.createElement('style');s.id='shc-css';s.textContent=CSS;document.head.appendChild(s);const f=document.createElement('link');f.rel='stylesheet';f.crossOrigin='anonymous';f.href='https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@1,8..60,600&display=swap';document.head.appendChild(f)}
 let st=localStorage.getItem('rm-sh-st')||'A',sz='story',busy=0;const S=data(it,week);
 const m=document.createElement('div');m.className='shm';m.innerHTML=`<div class="shm-b" role="dialog" aria-label="Share card"><button class="shm-x" aria-label="Close">×</button><div class="shm-h">SHARE #${S.rank} · ${S.title}</div>
  <div class="shm-t" id="shs">${Object.keys(NM).map(k=>`<button data-s="${k}">${NM[k]}</button>`).join('')}</div>
  <div class="shm-t" id="shz"><button data-z="story">STORY 9:16</button><button data-z="post">SQUARE</button></div>
  <div class="shm-p"></div><div class="shm-a"><button class="go">SHARE</button><button class="sv">SAVE IMAGE</button></div><div class="shm-n"></div></div>`;
 document.body.appendChild(m);const q=x=>m.querySelector(x),note=t=>q('.shm-n').textContent=t;
 const close=()=>{m.remove();document.removeEventListener('keydown',kd)},kd=e=>{if(e.key==='Escape')close()};document.addEventListener('keydown',kd);
 m.onclick=e=>{if(e.target===m)close()};q('.shm-x').onclick=close;
 const draw=()=>{const [w,h]=SZ[sz],box=q('.shm-p'),vw=Math.min(box.clientWidth||300,sz==='story'?290:420),k=vw/w;
  box.innerHTML=`<div class="shc" style="width:${w*k}px;height:${h*k}px">${T[st][sz](S)}</div>`;box.querySelector('.c').style.transform=`scale(${k})`;
  m.querySelectorAll('[data-s]').forEach(b=>b.classList.toggle('on',b.dataset.s===st));m.querySelectorAll('[data-z]').forEach(b=>b.classList.toggle('on',b.dataset.z===sz))};
 q('#shs').onclick=e=>{const b=e.target.closest('[data-s]');if(b){st=b.dataset.s;try{localStorage.setItem('rm-sh-st',st)}catch(x){}draw()}};
 q('#shz').onclick=e=>{const b=e.target.closest('[data-z]');if(b){sz=b.dataset.z;draw()}};
 const png=async()=>{await lib();await document.fonts.ready;const [w,h]=SZ[sz],off=document.createElement('div');off.className='shc shc-off';off.innerHTML=T[st][sz](S);document.body.appendChild(off);
  try{await Promise.all([...off.querySelectorAll('img')].map(i=>i.complete?0:new Promise(r=>{i.onload=i.onerror=r})));
   const blob=await htmlToImage.toBlob(off.firstElementChild,{width:w,height:h,pixelRatio:1,cacheBust:false});return new File([blob],`indie-charts-${S.rank}-${it.title.toLowerCase().replace(/[^a-z0-9]+/g,'-').slice(0,40)}-${sz}.png`,{type:'image/png'})}
  finally{off.remove()}};
 const act=async share=>{if(busy)return;busy=1;m.querySelectorAll('.shm-a button').forEach(b=>b.disabled=true);note('Making your card…');
  try{const f=await png(),link=location.origin+location.pathname+'?c=indie-charts';
   if(share&&navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],title:'Indie Charts #'+it.rank,text:`"${it.title}" by ${it.artist} is #${it.rank} on the RapAechelon Indie Charts. ${link}`}).catch(()=>{});note('')}
   else{const a=document.createElement('a');a.href=URL.createObjectURL(f);a.download=f.name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),4000);note(share?'Saved. Post it from your photos or downloads.':'Saved to your device.')}}
  catch(e){note('Could not make the card. Try again.')}busy=0;m.querySelectorAll('.shm-a button').forEach(b=>b.disabled=false)};
 q('.go').onclick=()=>act(1);q('.sv').onclick=()=>act(0);requestAnimationFrame(draw)};
})();
