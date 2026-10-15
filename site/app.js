/* RAPAECHELON · RAPMAG public site: shared header/footer, home, category, search and article pages, all fed by the Cloudflare API */
(function(){
const API=window.RM_API,$=s=>document.querySelector(s),esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const CATS=[['news','News'],['new-music','New Music'],['interviews','Interviews'],['reviews','Reviews'],['culture','Culture'],['producers','Producers']],CN=Object.fromEntries(CATS);
const img=u=>!u?'':/^https?:/.test(u)?u:API+u;
const get=p=>fetch(API+p).then(r=>r.ok?r.json():Promise.reject(r.status));
const when=d=>{if(!d)return'';const t=new Date(d.replace(' ','T')+'Z');return t.toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'})};
const rt=h=>Math.max(1,Math.round(String(h||'').replace(/<[^>]+>/g,' ').split(/\s+/).filter(Boolean).length/230))+' min read';
const link=p=>'article.html?s='+encodeURIComponent(p.slug);
const ph=t=>'<div class="ph">'+esc((t||'RAPMAG').split(' ').slice(0,2).join(' '))+'</div>';
const qs=new URLSearchParams(location.search),page=document.body.dataset.page;

/* ---------- chrome ---------- */
function chrome(){const cat=qs.get('c');
 document.body.insertAdjacentHTML('afterbegin',`<div class="prog" id="prog"></div><div class="bar">Hip hop news, new music, interviews and culture &nbsp;·&nbsp; Updated daily</div>
 <header class="head"><div class="wrap"><a class="logo" href="index.html"><b>RAPAECHELON</b><i>RAPMAG</i></a>
 <nav class="nav" id="nav">${CATS.map(([k,n])=>`<a href="index.html?c=${k}"${cat===k?' class="on"':''}>${n}</a>`).join('')}</nav>
 <button class="sbtn mbtn" id="mb" aria-label="Menu"><svg viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18"/></svg></button>
 <button class="sbtn" id="sb" aria-label="Search"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M21 21l-5-5"/></svg></button></div></header>
 <div class="search" id="sr"><input id="si" placeholder="Search RAPMAG…" value="${esc(qs.get('q')||'')}"></div><div class="tick" id="tk"><span class="lab">LATEST</span><div class="run" id="tkr"></div></div>`);
 document.body.insertAdjacentHTML('beforeend',`<footer class="foot"><div class="wrap"><div><a class="logo" href="index.html"><b>RAPAECHELON</b><i>RAPMAG</i></a><p>The culture, covered properly. Hip hop news, new music, interviews, reviews and the producers behind the sound.</p></div>
 <div><h5>SECTIONS</h5><ul>${CATS.map(([k,n])=>`<li><a href="index.html?c=${k}">${n}</a></li>`).join('')}</ul></div><div><h5>RAPMAG</h5><ul><li><a href="index.html">Home</a></li><li><a href="index.html?q=">Search</a></li></ul></div></div>
 <div class="wrap copy">© ${new Date().getFullYear()} Rapaechelon · RAPMAG</div></footer>`);
 $('#sb').onclick=()=>{$('#sr').classList.toggle('on');$('#si').focus()};$('#mb').onclick=()=>$('#nav').classList.toggle('open');
 $('#si').onkeydown=e=>{if(e.key==='Enter')location.href='index.html?q='+encodeURIComponent(e.target.value.trim())};
 get('/api/posts?limit=12').then(d=>{const a=d.posts.map(p=>`<a href="${link(p)}">${esc(p.title)}</a>`).join('');$('#tkr').innerHTML=a+a}).catch(()=>$('#tk').remove())}
function card(p,big){return`<a class="card rv${big?' big':''}" href="${link(p)}"><div class="im">${p.cover?`<img src="${esc(img(p.cover))}" alt="${esc(p.title)}" loading="lazy">`:ph(p.title)}<span class="c">${esc(CN[p.category]||p.category)}</span></div><h3>${esc(p.title)}</h3>${p.dek?`<p>${esc(p.dek)}</p>`:''}<div class="meta"><span>${esc(p.author)}</span><span>${when(p.published_at)}</span></div></a>`}
function reveal(){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -40px'});document.querySelectorAll('.rv:not(.in)').forEach(el=>io.observe(el))}
function setMeta(t,d,im){document.title=t;const m=(n,v,a)=>{if(!v)return;let el=document.querySelector(`meta[${a||'name'}="${n}"]`);if(!el){el=document.createElement('meta');el.setAttribute(a||'name',n);document.head.appendChild(el)}el.content=v};m('description',d);m('og:title',t,'property');m('og:description',d,'property');m('og:image',im,'property');m('twitter:card','summary_large_image')}

/* ---------- home / category / search ---------- */
async function home(){const main=$('#main'),cat=qs.get('c'),q=qs.get('q');let off=0;
 if(cat||q!=null){setMeta((cat?CN[cat]:'Search')+' | RAPAECHELON · RAPMAG','Hip hop '+(cat?CN[cat]:'search')+' on RAPMAG');
  main.innerHTML=`<section class="sec"><div class="wrap"><div class="sh"><h2>${cat?esc(CN[cat]||cat):'Search: '+esc(q||'everything')}</h2></div><div class="grid" id="g"></div><button class="more" id="mo" hidden>LOAD MORE</button></div></section>`;
  const load=async()=>{const d=await get('/api/posts?limit=16&offset='+off+(cat?'&cat='+cat:'')+(q?'&q='+encodeURIComponent(q):''));off+=d.posts.length;$('#g').insertAdjacentHTML('beforeend',d.posts.map(p=>card(p)).join(''));$('#mo').hidden=d.posts.length<16;if(!off)$('#g').innerHTML='<div class="empty">Nothing here yet.</div>';reveal()};$('#mo').onclick=load;return load()}
 setMeta('RAPAECHELON · RAPMAG | Hip Hop News, New Music & Culture','Hip hop news, new music, interviews, reviews and culture from RAPAECHELON · RAPMAG.');
 const [d,t]=await Promise.all([get('/api/posts?limit=24'),get('/api/trending').catch(()=>({posts:[]}))]),P=d.posts;
 if(!P.length){main.innerHTML='<section class="sec"><div class="wrap"><div class="empty">No articles yet. Write the first one in the back office.</div></div></section>';return}
 const f=P[0],rest=P.slice(1),tr=t.posts.length?t.posts:P.slice(0,5);
 main.innerHTML=`<section class="hero"><div class="bgi" style="background-image:url('${esc(img(f.cover))}')"></div><div class="wrap"><span class="eye">${f.featured?'Cover story':'Latest'} · ${esc(CN[f.category]||f.category)}</span><h1>${esc(f.title)}</h1>${f.dek?`<p>${esc(f.dek)}</p>`:''}<div class="meta"><span>${esc(f.author)}</span><span>${when(f.published_at)}</span></div><a class="btn" href="${link(f)}">Read the story &rarr;</a></div></section>
 <section class="sec"><div class="wrap two"><div><div class="sh"><h2>Top stories</h2></div>${rest[0]?card(rest[0],true):''}<div class="grid" style="grid-template-columns:repeat(2,minmax(0,1fr));margin-top:30px">${rest.slice(1,3).map(p=>card(p)).join('')}</div></div>
 <aside><div class="sh"><h2>Trending</h2></div><div class="trend">${tr.map(p=>`<a href="${link(p)}"><span><b>${esc(p.title)}</b><small>${esc(CN[p.category]||p.category)} · ${when(p.published_at)}</small></span></a>`).join('')}</div></aside></div></section>
 <section class="sec"><div class="wrap"><div class="sh"><h2>Latest</h2></div><div class="grid">${rest.slice(3,11).map(p=>card(p)).join('')||'<div class="empty">More soon.</div>'}</div></div></section>
 ${CATS.map(([k,n])=>{const L=P.filter(p=>p.category===k).slice(0,4);return L.length?`<section class="sec"><div class="wrap"><div class="sh"><h2>${n}</h2><a href="index.html?c=${k}">ALL ${n.toUpperCase()} &rarr;</a></div><div class="grid">${L.map(p=>card(p)).join('')}</div></div></section>`:''}).join('')}`;reveal()}

/* ---------- article ---------- */
async function article(){const main=$('#main'),s=qs.get('s');let d;try{d=await get('/api/posts/'+encodeURIComponent(s||''))}catch(e){main.innerHTML='<section class="sec"><div class="wrap"><div class="empty">This article was not found.</div><a class="btn" href="index.html">Back home</a></div></section>';return}
 const p=d.post,url=location.href;setMeta(p.title+' | RAPMAG',p.dek||p.title,img(p.cover));
 main.innerHTML=`<section class="art-hero"><div class="bgi" style="background-image:url('${esc(img(p.cover))}')"></div><div class="wrap"><a class="eye" href="index.html?c=${esc(p.category)}">${esc(CN[p.category]||p.category)}</a><h1>${esc(p.title)}</h1>${p.dek?`<p class="dek">${esc(p.dek)}</p>`:''}<div class="meta"><span>By ${esc(p.author)}</span><span>${when(p.published_at)}</span><span>${rt(p.body)}</span></div></div></section>
 <div class="wrap art"><div class="share"><a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(p.title)}&url=${encodeURIComponent(url)}" target="_blank" rel="noopener" title="Share on X">X</a><a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}" target="_blank" rel="noopener" title="Share on Facebook">FB</a><button id="cp" title="Copy link">LINK</button></div>
 <article><div class="body">${fix(p.body)}</div>${p.tags?`<div class="tags">${p.tags.split(',').map(t=>t.trim()).filter(Boolean).map(t=>`<a href="index.html?q=${encodeURIComponent(t)}">${esc(t)}</a>`).join('')}</div>`:''}</article><aside class="side"></aside></div>
 ${d.related.length?`<section class="sec" style="border-top:1px solid var(--line)"><div class="wrap"><div class="sh"><h2>More ${esc(CN[p.category]||'')}</h2></div><div class="grid">${d.related.map(r=>card(r)).join('')}</div></div></section>`:''}`;
 $('#cp').onclick=()=>{navigator.clipboard.writeText(url).then(()=>{$('#cp').textContent='COPIED';setTimeout(()=>$('#cp').textContent='LINK',1500)})};
 const k='rm_v_'+p.slug;try{if(!sessionStorage.getItem(k)){sessionStorage.setItem(k,1);fetch(API+'/api/view/'+p.slug,{method:'POST'})}}catch(e){}
 addEventListener('scroll',()=>{const a=$('.art'),r=a.getBoundingClientRect(),h=a.offsetHeight-innerHeight;$('#prog').style.width=Math.min(100,Math.max(0,-r.top/h*100))+'%'},{passive:true});reveal()}
/* images inside the body point at /img/...; make them absolute for the API host and lazy */
function fix(h){return String(h||'').replace(/(<img[^>]*src=")(\/img\/[^"]+)"/g,(m,a,b)=>a+API+b+'" loading="lazy"')}

chrome();(page==='article'?article():home()).catch(e=>{$('#main').innerHTML='<section class="sec"><div class="wrap"><div class="empty">Could not reach the RAPMAG server.</div></div></section>'})
})();
