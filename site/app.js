/* RAPAECHELON - RAPMAG public site, laid out like rapaechelon.com (big centred logo, section menu, featured partner banner,
   two-column story grid, black footer) in the MZPRD record-store type: Anton headlines, red accents, grain, white paper.
   Live site uses clean links (article/<slug>/, page/<slug>/, author/<slug>/) that the hourly build pre-renders for Google;
   anything newer than the last build is drawn here from the API (404.html carries the same app). */
(function(){
const API=window.RM_API,PRETTY=!!window.RM_PRETTY,$=s=>document.querySelector(s),esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let CATS=[['breaking','Breaking'],['music','Music'],['entertainment','Entertainment']],CN=Object.fromEntries(CATS),SET={};
const img=u=>!u?'':/^https?:/.test(u)?u:API+u;
const get=p=>fetch(API+p).then(r=>r.ok?r.json():Promise.reject(r.status));
const when=d=>{if(!d)return'';const t=new Date(d.replace(' ','T')+'Z');return t.toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})};
const rt=h=>Math.max(1,Math.round(String(h||'').replace(/<[^>]+>/g,' ').split(/\s+/).filter(Boolean).length/230))+' min read';
const link=p=>{const k=p.category==='page'?'page':'article';return PRETTY?k+'/'+p.slug+'/':k+'.html?s='+encodeURIComponent(p.slug)};
const alink=s=>PRETTY?'author/'+s+'/':'author.html?s='+encodeURIComponent(s);
const check='<svg class="vf" viewBox="0 0 24 24" aria-label="Verified"><circle cx="12" cy="12" r="11"/><path d="M7 12.4l3.3 3.2L17 9" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const by=p=>p.author_slug?`<a href="${alink(p.author_slug)}">${esc(p.author)}</a>${p.author_verified?check:''}`:esc(p.author);
const ph=t=>'<div class="ph">'+esc((t||'RAPMAG').split(' ').slice(0,2).join(' '))+'</div>';
const qs=new URLSearchParams(location.search),page=document.body.dataset.page;
/* slug from ?s= or from a clean path like /rapmag/article/<slug>/ */
const pathSlug=k=>{const m=location.pathname.match(new RegExp('/'+k+'/([a-z0-9-]+)/?$'));return m?m[1]:null};

/* ---------- chrome ---------- */
function chrome(){const cat=qs.get('c'),here=page==='home'&&!cat&&qs.get('q')==null;
 document.body.insertAdjacentHTML('afterbegin',`<div class="prog" id="prog"></div>
 <header class="mast"><div class="wrap"><a class="brand" href="./" aria-label="Rapaechelon home"><img src="${esc(SET.logo?img(SET.logo):'logo.webp')}" alt="RAPAECHELON - RAPMAG" width="2000" height="770"></a>
 <div class="menu"><button class="hbtn" id="mb" aria-label="Menu" aria-expanded="false" aria-controls="nav"><span></span><span></span><span></span></button><nav class="links" id="nav"><a href="./"${here?' class="on"':''}>Home</a><a href="index.html?c=indie-charts"${cat==='indie-charts'?' class="on"':''}>Indie Charts</a>${CATS.map(([k,n])=>`<a href="index.html?c=${k}"${cat===k?' class="on"':''}>${esc(n)}</a>`).join('')}</nav><button class="sbtn" id="sb" aria-label="Search"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M21 21l-5-5"/></svg></button></div></div></header>
 <div class="search" id="sr"><div class="wrap"><input id="si" placeholder="Search RAPMAG…" value="${esc(qs.get('q')||'')}"></div></div>`);
 const pl=s=>PRETTY?'page/'+s+'/':'page.html?s='+s;
 document.body.insertAdjacentHTML('beforeend',`<footer class="foot"><div class="wrap"><div><a class="brand sm" href="./"><img src="logo.webp" alt="RAPAECHELON - RAPMAG" width="2000" height="770"></a><p>${esc(SET.tagline||'Music, entertainment, culture and breaking stories.')}</p>
 <div class="social">${['youtube','instagram','x','facebook'].filter(k=>SET[k]).map(k=>`<a href="${esc(SET[k])}" target="_blank" rel="noopener">${{youtube:'YouTube',instagram:'Instagram',x:'X',facebook:'Facebook'}[k]}</a>`).join('')}</div></div>
 <div><h5>SECTIONS</h5><ul><li><a href="./">Home</a></li>${CATS.map(([k,n])=>`<li><a href="index.html?c=${k}">${esc(n)}</a></li>`).join('')}</ul></div>
 <div><h5>INFORMATION</h5><ul><li><a href="index.html?q=">Search</a></li><li><a href="${pl('about')}">About Rapaechelon</a></li><li><a href="${pl('editorial-standards')}">Editorial Standards</a></li><li><a href="${pl('corrections-policy')}">Corrections Policy</a></li><li><a href="${pl('contact')}">Contact</a></li></ul></div></div>
 <div class="wrap copy">© ${new Date().getFullYear()} RAPAECHELON - RAPMAG${here?'<a class="staff" href="admin.html" aria-label="Staff" title="Staff"><svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg></a>':''}</div></footer>`);
 $('#mb').onclick=()=>{const o=$('#nav').classList.toggle('open');$('#mb').setAttribute('aria-expanded',o)};$('#sb').onclick=()=>{$('#sr').classList.toggle('on');$('#si').focus()};
 $('#si').onkeydown=e=>{if(e.key==='Enter')location.href='index.html?q='+encodeURIComponent(e.target.value.trim())};
 if(SET.adsense_id&&/^ca-pub-\d+$/.test(SET.adsense_id)&&!document.querySelector('script[data-ads]')){const s=document.createElement('script');s.async=true;s.crossOrigin='anonymous';s.dataset.ads=1;s.src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client='+SET.adsense_id;document.head.appendChild(s)}}
function promo(){return SET.promo_image?`<aside class="promo"><span>${esc(SET.promo_label||'Featured partner')}</span>${SET.promo_link?`<a href="${esc(SET.promo_link)}" target="_blank" rel="sponsored noopener">`:'<div>'}<img src="${esc(img(SET.promo_image))}" alt="Advertisement">${SET.promo_link?'</a>':'</div>'}</aside>`:''}
function card(p,lead){return`<article class="card rv${lead?' lead':''}${lead&&p.category==='breaking'?' brk':''}${lead&&p.title.length>70?' long':''}"><a class="im" href="${link(p)}" aria-label="${esc(p.title)}">${p.cover?`<img src="${esc(img(p.cover))}${/^\/img\/images\//.test(p.cover)?'?w=800':''}" alt="${esc(p.cover_alt||p.title)}" width="800" height="600" ${lead?'fetchpriority="high"':'loading="lazy"'} decoding="async">`:ph(p.title)}</a>
 <a class="c" href="index.html?c=${esc(p.category)}">${esc(CN[p.category]||p.category)}</a><h2><a href="${link(p)}">${esc(p.title)}</a></h2>${lead&&p.dek?`<p class="ldek">${esc(p.dek)}</p>`:''}<div class="meta">${when(p.published_at)} · By ${by(p)}${p.id&&p.category!=='page'?`<span class="alc" data-pid="${p.id}"></span>`:''}</div></article>`}
function reveal(){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -40px'});document.querySelectorAll('.rv:not(.in)').forEach(el=>io.observe(el))}
function ld(o){const s=document.createElement('script');s.type='application/ld+json';s.textContent=JSON.stringify(o);document.head.appendChild(s)}
function setMeta(t,d,im,type){document.title=t;let c=document.querySelector('link[rel=canonical]');if(!c){c=document.createElement('link');c.rel='canonical';document.head.appendChild(c)}c.href=location.href.split('#')[0];const m=(n,v,a)=>{if(!v)return;let el=document.querySelector(`meta[${a||'name'}="${n}"]`);if(!el){el=document.createElement('meta');el.setAttribute(a||'name',n);document.head.appendChild(el)}el.content=v};m('description',d);m('og:title',t,'property');m('og:description',d,'property');m('og:image',im||new URL('og.jpg',document.baseURI).href,'property');m('og:type',type||'website','property');m('og:url',location.href,'property');m('og:site_name','RAPAECHELON - RAPMAG','property');m('twitter:card','summary_large_image')}

/* ---------- home / section / search ---------- */
async function home(){const main=$('#main'),cat=qs.get('c'),q=qs.get('q');if(cat==='indie-charts')return indie();let off=0;const N=12;
 const head=!cat&&q==null?'<h1 class="vh">RAPAECHELON - RAPMAG: Hip-Hop, Rap &amp; Entertainment News</h1>':cat&&/new-music/.test(cat)?`<header class="nmf"><span>EVERY FRIDAY</span><h1>${esc(CN[cat]||'New Music Friday')}</h1><p>The week's hottest rap and hip-hop drops, ranked. Hit play and run the whole chart.</p></header>`:cat?`<div class="sh"><h1>${esc(CN[cat]||cat)}</h1></div>`:`<div class="sh"><h1>${q?'Search: '+esc(q):'Search'}</h1></div>`;
 setMeta(cat?(CN[cat]||cat)+' News | RAPAECHELON - RAPMAG':q!=null?'Search | RAPAECHELON - RAPMAG':'RAPAECHELON - RAPMAG | Hip-Hop, Rap & Entertainment News',cat?'The latest '+String(CN[cat]||cat).toLowerCase()+' stories in hip-hop and rap from RAPAECHELON - RAPMAG.':'RAPAECHELON - RAPMAG: breaking hip-hop and rap news, new music and entertainment stories, updated daily.');
 main.innerHTML=`<div class="wrap shell">${!cat&&q==null?promo():''}${head}<section class="grid" id="g" aria-label="Published articles"></section><button class="more" id="mo" hidden>LOAD MORE STORIES</button></div>`;
 const load=async()=>{const B=window.RM_BOOT,d=!off&&!cat&&q==null&&B&&B.posts?B.posts:await get('/api/posts?limit='+N+'&offset='+off+(cat?'&cat='+cat:'')+(q?'&q='+encodeURIComponent(q):''));
  const shown=!cat&&q==null?d.posts.filter(p=>!/new-music/.test(p.category)):d.posts;$('#g').insertAdjacentHTML('beforeend',shown.map((p,i)=>card(p,!cat&&q==null&&off===0&&i===0)).join(''));off+=d.posts.length;$('#mo').hidden=d.posts.length<N;
  if(!off)$('#g').innerHTML='<div class="empty">No stories here yet.</div>';reveal()};$('#mo').onclick=load;return load()}

/* ---------- Indie Charts: top 20 ranked by plays; a play counts after 10 seconds of listening ---------- */
async function indie(){const main=$('#main');
 setMeta('Indie Charts: Top 20 Indie Rap & R&B Songs | RAPAECHELON - RAPMAG','The top 20 indie rap and R&B songs, ranked by plays on RAPMAG. Hit play to hear each one.');
 main.innerHTML=`<div class="wrap shell"><header class="nmf"><span>RANKED BY YOUR PLAYS</span><h1>Indie Charts</h1><p>The top 20 indie rap and R&amp;B songs, ranked by plays. Hit play and run the whole chart.</p></header><div class="story rp-page"><div class="body" id="rpb"><div class="empty">Loading the chart…</div></div></div></div>`;
 let d;try{d=await get('/api/indie')}catch(e){$('#rpb').innerHTML='<div class="empty">The Indie Charts are coming soon.</div>';return}
 if(!d.items.length){$('#rpb').innerHTML='<div class="empty">The Indie Charts are coming soon.</div>';return}
 const TROPHY='<svg class="cr-tro" viewBox="0 0 24 24" role="img" aria-label="Number 1"><path d="M7 3h10v2h3v3a4 4 0 0 1-4 4h-.3A5 5 0 0 1 13 14.9V17h3v2H8v-2h3v-2.1A5 5 0 0 1 8.3 12H8a4 4 0 0 1-4-4V5h3zm0 4H6v1a2 2 0 0 0 1 1.7zm10 0v2.7A2 2 0 0 0 18 8V7zM6 20h12v1H6z"/></svg>';
 const MV={new:'NEW',up:'▲',down:'▼',same:'–'},n=v=>Number(v).toLocaleString('en-US'),sent=new Set(),mine=new Set(await get('/api/indie/mine').then(r=>r.liked).catch(()=>[]));let ch=null,order=d.items.map(x=>x.id).join(),lastMove=Date.now();
 /* rows */
 const html=items=>items.map(it=>`<div class="chart-row" data-id="${esc(it.id)}">${it.cover?`<img src="${esc(img(it.cover))}" alt="${esc(it.title+' by '+it.artist)}" loading="lazy">`:`<img class="cr-disc" src="gold-record.webp" alt="${esc(it.title+' by '+it.artist)}" loading="lazy">`}<div class="cr-t"><h3>${esc(it.title)}${it.rank===1?TROPHY:''}</h3><p>${esc(it.artist)}</p><small class="cr-pl"><b data-n="${it.plays}">${n(it.plays)}</b> plays${it.last?' · last week #'+it.last:''}</small><button class="cr-like${mine.has(it.id)?' on':''}" aria-pressed="${mine.has(it.id)}" aria-label="Like ${esc(it.title)}"><img src="heart.webp" alt=""><b data-n="${it.likes||0}">${n(it.likes||0)}</b></button></div><span class="cr-m ${it.move}">${MV[it.move]}</span><a class="cr-a" href="${esc(img(it.audio))}">Audio</a></div>`).join('');
 /* count up to the new number with a +N pop */
 const bump=(b,to)=>{const from=+b.dataset.n;if(to<=from)return;b.dataset.n=to;const t0=performance.now(),D=1200;const step=t=>{const k=Math.min(1,(t-t0)/D);b.textContent=n(Math.round(from+(to-from)*(1-Math.pow(1-k,3))));if(k<1)requestAnimationFrame(step)};requestAnimationFrame(step);
  const row=b.closest('.chart-row'),lk=!!b.closest('.cr-like'),pop=document.createElement('em');pop.className='cr-pop'+(lk?' lk':'');pop.textContent=(lk?'♥ +':'+')+n(to-from);if(lk){const h=b.closest('.cr-like');h.classList.remove('beat');void h.offsetWidth;h.classList.add('beat')}row.querySelector('.cr-t').appendChild(pop);setTimeout(()=>pop.remove(),1800);row.classList.remove('flash');void row.offsetWidth;row.classList.add('flash')};
 const listen=r=>{const id=r.dataset.id;if(!id||sent.has(id))return;sent.add(id);const b=r.querySelector('.cr-pl [data-n]');if(b)bump(b,+b.dataset.n+1);fetch(API+'/api/indie/play',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})}).catch(()=>{})};
 const draw=items=>{if(ch)ch.kill();$('#rpb').innerHTML=html(items);ch=chart(main,listen);
  $('#rpb').querySelectorAll('.cr-like').forEach(h=>h.onclick=e=>{e.stopPropagation();const id=h.closest('.chart-row').dataset.id,on=!mine.has(id),b=h.querySelector('[data-n]');
   on?mine.add(id):mine.delete(id);h.classList.toggle('on',on);h.setAttribute('aria-pressed',on);b.dataset.n=Math.max(0,+b.dataset.n+(on?1:-1));b.textContent=n(+b.dataset.n);if(on){h.classList.remove('beat');void h.offsetWidth;h.classList.add('beat')}
   fetch(API+'/api/indie/like',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,on})}).catch(()=>{})})};
 draw(d.items);
 /* live: new plays every 30 seconds; songs slide to their new spots at most every 10 minutes (never while a song is playing) */
 const tick=async()=>{if(!document.body.contains($('#rpb')))return clearInterval(iv);if(document.hidden)return;let nd;try{nd=await get('/api/indie')}catch(e){return}
  nd.items.forEach(it=>{const r=$('#rpb').querySelector(`.chart-row[data-id="${CSS.escape(it.id)}"]`);if(!r)return;const b=r.querySelector('.cr-pl [data-n]'),l=r.querySelector('.cr-like [data-n]');if(b)bump(b,it.plays);if(l)bump(l,it.likes||0)});
  const no=nd.items.map(x=>x.id).join();if(no===order||Date.now()-lastMove<6e5||(ch&&ch.busy()))return;
  const old={};$('#rpb').querySelectorAll('.chart-row').forEach(r=>old[r.dataset.id]=r.getBoundingClientRect().top);
  order=no;lastMove=Date.now();draw(nd.items);
  $('#rpb').querySelectorAll('.chart-row').forEach(r=>{const o=old[r.dataset.id],dy=o==null?40:o-r.getBoundingClientRect().top;if(!dy)return;r.animate([{transform:`translateY(${dy}px)`,opacity:o==null?0:1},{transform:'none',opacity:1}],{duration:900,easing:'cubic-bezier(.2,.8,.2,1)'});if(o!=null&&dy>0)r.classList.add('rose')})};
 const iv=setInterval(tick,30000)}
/* ---------- author page ---------- */
async function author(){const main=$('#main'),s=qs.get('s')||pathSlug('author');let a;try{a=(await get('/api/authors/'+encodeURIComponent(s||''))).author}catch(e){main.innerHTML='<div class="wrap shell"><div class="empty">Author not found.</div></div>';return}
 setMeta(a.name+' | RAPAECHELON - RAPMAG',a.bio||a.role||a.name,img(a.photo),'profile');
 ld({'@context':'https://schema.org','@type':'ProfilePage',mainEntity:{'@type':'Person',name:a.name,jobTitle:a.role||undefined,description:a.bio||undefined,image:a.photo?img(a.photo):undefined,sameAs:['website','instagram','x','facebook','youtube'].map(k=>a[k]).filter(Boolean)}});
 const L={website:'Website',instagram:'Instagram',x:'X',facebook:'Facebook',youtube:'YouTube'};
 main.innerHTML=`<div class="wrap shell"><header class="au">${a.photo?`<img src="${esc(img(a.photo))}" alt="${esc(a.name)}">`:`<div class="au-i">${esc(a.name.slice(0,1))}</div>`}<div><span class="c">AUTHOR</span><h1>${esc(a.name)}${a.verified?check:''}</h1><p class="au-r">${[a.role,a.beat,a.location].filter(Boolean).map(esc).join(' · ')}</p>${a.bio?`<p class="au-b">${esc(a.bio)}</p>`:''}<div class="social dark">${Object.keys(L).filter(k=>a[k]).map(k=>`<a href="${esc(a[k])}" target="_blank" rel="noopener">${L[k]}</a>`).join('')}</div></div></header>
 <div class="sh"><h1>Stories by ${esc(a.name)}</h1></div><section class="grid" id="g"></section><button class="more" id="mo" hidden>LOAD MORE STORIES</button></div>`;
 let off=0;const load=async()=>{const d=await get('/api/posts?limit=12&offset='+off+'&author='+encodeURIComponent(s));$('#g').insertAdjacentHTML('beforeend',d.posts.map(p=>card(p)).join(''));off+=d.posts.length;$('#mo').hidden=d.posts.length<12;if(!off)$('#g').innerHTML='<div class="empty">No stories yet.</div>';reveal()};$('#mo').onclick=load;return load()}

/* ---------- article + info pages ---------- */
async function article(){const main=$('#main'),isPage=document.body.dataset.page==='page',s=qs.get('s')||pathSlug(isPage?'page':'article');let d;try{d=await get('/api/posts/'+encodeURIComponent(s||''))}catch(e){main.innerHTML='<div class="wrap shell"><div class="empty">'+(isPage?'This page has not been written yet.':'This article was not found.')+'</div><a class="btn" href="./">Back home</a></div>';return}
 const p=d.post,url=location.href.split('#')[0];setMeta(p.title+' | RAPAECHELON - RAPMAG',p.dek||p.title,img(p.cover),'article');
 if(!isPage&&!document.querySelector('script[data-ld=article]'))ld({'@context':'https://schema.org','@type':'NewsArticle',headline:p.title,description:p.dek||'',image:p.cover?[img(p.cover)]:undefined,datePublished:(p.published_at||'').replace(' ','T')+'Z',dateModified:(p.updated_at||p.published_at||'').replace(' ','T')+'Z',author:{'@type':'Person',name:p.author,url:p.author_slug?new URL(alink(p.author_slug),document.baseURI).href:undefined},publisher:{'@type':'NewsMediaOrganization',name:'RAPAECHELON - RAPMAG',logo:{'@type':'ImageObject',url:new URL('logo.webp',document.baseURI).href}},articleSection:CN[p.category]||p.category,keywords:p.tags||'',mainEntityOfPage:url});
 main.innerHTML=`<article class="wrap story"><header class="st-head">${isPage?'':`<a class="c" href="index.html?c=${esc(p.category)}">${esc(CN[p.category]||p.category)}</a>`}<h1>${esc(p.title)}</h1>${isPage?'':`<div class="meta">${when(p.published_at)} · By ${by(p)}${p.id?`<button class="alk" data-pid="${p.id}" aria-label="Like this story"></button>`:''} · ${rt(p.body)}</div>`}</header>
 ${p.cover?`<figure class="st-cover"><img src="${esc(img(p.cover))}" alt="${esc(p.cover_alt||p.title)}"></figure>`:''}
 <div class="st-cols">${isPage?'':`<div class="share"><a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(p.title)}&url=${encodeURIComponent(url)}" target="_blank" rel="noopener" title="Share on X">X</a><a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}" target="_blank" rel="noopener" title="Share on Facebook">FB</a><button id="cp" title="Copy link">LINK</button></div>`}
 <div>${p.audio?`<div class="listen"><span>LISTEN TO THIS STORY</span><audio controls preload="none" src="${esc(img(p.audio))}"></audio></div>`:''}<div class="body">${fix(p.body)}</div>${p.tags&&!isPage?`<div class="tags">${p.tags.split(',').map(t=>t.trim()).filter(Boolean).map(t=>`<a href="index.html?q=${encodeURIComponent(t)}">${esc(t)}</a>`).join('')}</div>`:''}</div></div></article>
 ${!isPage&&d.related.length?`<section class="wrap related"><div class="sh"><h1>More ${esc(CN[p.category]||'')}</h1></div><div class="grid">${d.related.map(r=>card(r)).join('')}</div></section>`:''}`;
 chart(main);if($('#cp'))$('#cp').onclick=()=>{navigator.clipboard.writeText(url).then(()=>{$('#cp').textContent='COPIED';setTimeout(()=>$('#cp').textContent='LINK',1500)})};
 if(!isPage){const k='rm_v_'+p.slug;try{if(!sessionStorage.getItem(k)){sessionStorage.setItem(k,1);fetch(API+'/api/view/'+p.slug,{method:'POST'})}}catch(e){}
  addEventListener('scroll',()=>{const a=$('.story'),r=a.getBoundingClientRect(),h=a.offsetHeight-innerHeight;$('#prog').style.width=Math.min(100,Math.max(0,-r.top/h*100))+'%'},{passive:true})}reveal()}
/* New Music Friday chart: PLAY on a row with an uploaded audio file plays just the sound (waveform under the button) and runs on down the chart;
   rows with only a YouTube link open the small docked YouTube player instead */
const ytId=u=>{const m=String(u).match(/(?:youtu\.be\/|v=|shorts\/|embed\/|live\/)([\w-]{11})/);return m?m[1]:''};
function chart(root,onListen){const rows=[...root.querySelectorAll('.chart-row')].map(r=>({r,au:(r.querySelector('.cr-a')||{}).href||'',yt:ytId((r.querySelector('.cr-y')||{}).href||'')})).filter(x=>x.au||x.yt);if(!rows.length)return;rows[0].r.classList.add('top');
 const A=new Audio();A.preload='none';let cur=-1;
 const mark=i=>rows.forEach((x,j)=>{x.r.classList.toggle('on',j===i);x.r.classList.toggle('playing',j===i&&!!x.au&&!A.paused);const s=x.r.querySelector('.cr-p span');if(s)s.textContent=j===i&&x.au&&!A.paused?'PAUSE':'PLAY'});
 const closeMp=()=>{const mp=$('#mp');if(mp)mp.remove()};
 const yt=i=>{A.pause();const {r,yt:id}=rows[i],next=rows.slice(i+1).map(x=>x.yt).filter(Boolean).join(',');let mp=$('#mp');
  if(!mp){mp=document.createElement('div');mp.id='mp';document.body.appendChild(mp)}
  mp.innerHTML=`<div class="mp-h"><span>NEW MUSIC FRIDAY · FROM #${i+1}</span><button aria-label="Close player">✕</button></div><iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1&rel=0${next?'&playlist='+next:''}" title="${esc((r.querySelector('h3')||{}).textContent||'Song')}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
  mp.querySelector('button').onclick=()=>{closeMp();cur=-1;mark(-1)};cur=i;mark(i)};
 const play=i=>{const x=rows[i];if(!x.au)return yt(i);closeMp();
  if(cur===i&&A.src){A.paused?A.play():A.pause();return}
  cur=i;A.src=x.au;A.play().catch(()=>{});mark(i)};
 /* now-playing bar: cover (record spins), song, prev / play / next, progress */
 const np=document.createElement('div');np.id='np';np.hidden=true;np.innerHTML='<div class="np-bar"><i></i></div><div class="np-in"><img alt=""><div class="np-t"><b></b><span></span></div><button data-k="p" aria-label="Previous">⏮</button><button data-k="t" class="np-pp" aria-label="Play or pause"></button><button data-k="n" aria-label="Next">⏭</button></div>';document.body.appendChild(np);
 const nb=()=>{if(cur<0){np.hidden=true;document.body.classList.remove('has-np');return}const r=rows[cur].r,im=r.querySelector('img');np.hidden=false;document.body.classList.add('has-np');np.querySelector('img').src=im?im.src:'';np.querySelector('img').className=im&&im.classList.contains('cr-disc')?'disc':'';np.classList.toggle('on',!A.paused);np.querySelector('b').textContent='#'+(cur+1)+'  '+((r.querySelector('h3')||{}).textContent||'');np.querySelector('span').textContent=(r.querySelector('.cr-t p')||{}).textContent||'';np.querySelector('.np-pp').textContent=A.paused?'▶':'❚❚'};
 np.onclick=e=>{const k=(e.target.closest('[data-k]')||{}).dataset;if(!k)return;const au=rows.map((x,j)=>x.au?j:-1).filter(j=>j>-1),at=au.indexOf(cur);if(k.k==='t')play(cur);else if(k.k==='n'&&at<au.length-1)play(au[at+1]);else if(k.k==='p')at>0&&A.currentTime<3?play(au[at-1]):(A.currentTime=0)};
 A.addEventListener('timeupdate',()=>{np.querySelector('.np-bar i').style.width=(A.duration?A.currentTime/A.duration*100:0)+'%'});
 A.onplay=A.onpause=()=>{mark(cur);nb()};if(onListen)A.ontimeupdate=()=>{if(cur>-1&&A.currentTime>=10)onListen(rows[cur].r)};
 A.onended=()=>{const n=rows.findIndex((x,j)=>j>cur&&x.au);if(n>-1)play(n);else{cur=-1;mark(-1)}};
 rows.forEach(({r},i)=>{if(r.querySelector('.cr-p'))return;const w=document.createElement('div');w.className='cr-pw';
  w.innerHTML='<button class="cr-p" aria-label="Play '+esc((r.querySelector('h3')||{}).textContent||'song')+'"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg><span>PLAY</span></button><div class="cr-w" aria-hidden="true">'+'<i></i>'.repeat(14)+'</div>';
  w.querySelector('button').onclick=e=>{e.stopPropagation();play(i)};r.appendChild(w);if(onListen){r.classList.add('tap');r.onclick=e=>{if(!e.target.closest('a'))play(i)}}});
 return{busy:()=>cur>-1&&!A.paused,kill:()=>{A.pause();np.remove();document.body.classList.remove('has-np')}}}
function fix(h){return String(h||'').replace(/(<img[^>]*src=")(\/img\/[^"]+)"/g,(m,a,b)=>a+API+b+'" loading="lazy"')}

/* 404.html serves clean links the build has not made yet */
const route=page==='auto'?(pathSlug('author')?'author':pathSlug('page')?'page':pathSlug('article')?'article':'home'):page;if(page==='auto')document.body.dataset.page=route;
const BOOT=window.RM_BOOT;Promise.all([BOOT?Promise.resolve(SET=BOOT.settings||{}):get('/api/settings').then(d=>SET=d.settings||{},()=>{}),(BOOT?Promise.resolve({cats:BOOT.cats}):get('/api/cats')).then(d=>{if(d.cats&&d.cats.length){CATS=d.cats.map(c=>[c.slug,c.name]);CN=Object.fromEntries(CATS)}},()=>{})])
 .then(()=>{chrome();return route==='home'?home():route==='author'?author():(document.body.dataset.page=route,article())}).catch(()=>{$('#main').innerHTML='<div class="wrap shell"><div class="empty">Could not reach the RAPMAG server.</div></div>'})
/* ---------- article likes: hearts next to the byline (cards show the count, the story page has the button) ---------- */
;(function(){const N=v=>Number(v).toLocaleString('en-US');let t=0;const H='<img src="heart.webp" alt="" width="14" height="14">';
 const fill=async()=>{const els=[...document.querySelectorAll('.alc[data-pid]:not([data-f]),.alk[data-pid]:not([data-f])')];if(!els.length)return;els.forEach(e=>e.dataset.f=1);
  const ids=[...new Set(els.map(e=>e.dataset.pid))];for(let i=0;i<ids.length;i+=60){let d;try{d=await get('/api/likes?ids='+ids.slice(i,i+60).join(','))}catch(e){continue}const mine=new Set(d.mine.map(String));
   els.filter(e=>ids.slice(i,i+60).includes(e.dataset.pid)).forEach(e=>{const n=d.likes[e.dataset.pid];if(n==null)return;e.dataset.n=n;e.innerHTML=H+'<b>'+N(n)+'</b>';e.classList.add('in');
    if(e.classList.contains('alk')){const on=mine.has(e.dataset.pid);e.classList.toggle('on',on);e.setAttribute('aria-pressed',on);
     e.onclick=()=>{const on=!e.classList.contains('on');e.classList.toggle('on',on);e.setAttribute('aria-pressed',on);e.dataset.n=Math.max(0,+e.dataset.n+(on?1:-1));e.querySelector('b').textContent=N(e.dataset.n);if(on){e.classList.remove('beat');void e.offsetWidth;e.classList.add('beat')}
      fetch(API+'/api/likes/'+e.dataset.pid,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({on})}).catch(()=>{})}}})}};
 new MutationObserver(()=>{clearTimeout(t);t=setTimeout(fill,120)}).observe(document.body,{childList:true,subtree:true});setTimeout(fill,300)})();
})();

