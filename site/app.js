/* RAPAECHELON · RAPMAG public site, laid out like rapaechelon.com (big centred logo, section menu, featured partner banner,
   two-column story grid, black footer) in the MZPRD record-store type: Anton headlines, red accents, grain, white paper. */
(function(){
const API=window.RM_API,$=s=>document.querySelector(s),esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const CATS=[['breaking','Breaking'],['music','Music'],['entertainment','Entertainment']],CN=Object.fromEntries(CATS);
const img=u=>!u?'':/^https?:/.test(u)?u:API+u;
const get=p=>fetch(API+p).then(r=>r.ok?r.json():Promise.reject(r.status));
const when=d=>{if(!d)return'';const t=new Date(d.replace(' ','T')+'Z');return t.toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})};
const rt=h=>Math.max(1,Math.round(String(h||'').replace(/<[^>]+>/g,' ').split(/\s+/).filter(Boolean).length/230))+' min read';
const link=p=>p.category==='page'?'page.html?s='+encodeURIComponent(p.slug):'article.html?s='+encodeURIComponent(p.slug);
const ph=t=>'<div class="ph">'+esc((t||'RAPMAG').split(' ').slice(0,2).join(' '))+'</div>';
const qs=new URLSearchParams(location.search),page=document.body.dataset.page;let SET={};

/* ---------- chrome ---------- */
function chrome(){const cat=qs.get('c'),here=page==='home'&&!cat&&qs.get('q')==null;
 document.body.insertAdjacentHTML('afterbegin',`<div class="prog" id="prog"></div>
 <header class="mast"><div class="wrap"><a class="brand" href="index.html" aria-label="Rapaechelon home"><img src="${esc(SET.logo?img(SET.logo):'logo.webp')}" alt="RAPAECHELON - RAPMAG" width="2000" height="770"></a>
 <nav class="menu" id="nav"><a href="index.html"${here?' class="on"':''}>Home</a>${CATS.map(([k,n])=>`<a href="index.html?c=${k}"${cat===k?' class="on"':''}>${n}</a>`).join('')}<button class="sbtn" id="sb" aria-label="Search"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M21 21l-5-5"/></svg></button></nav></div></header>
 <div class="search" id="sr"><div class="wrap"><input id="si" placeholder="Search RAPMAG…" value="${esc(qs.get('q')||'')}"></div></div>`);
 document.body.insertAdjacentHTML('beforeend',`<footer class="foot"><div class="wrap"><div><a class="brand sm" href="index.html"><img src="logo.webp" alt="RAPAECHELON - RAPMAG" width="2000" height="770"></a><p>${esc(SET.tagline||'Music, entertainment, culture and breaking stories.')}</p>
 <div class="social">${SET.youtube?`<a href="${esc(SET.youtube)}" target="_blank" rel="noopener">YouTube</a>`:''}${SET.instagram?`<a href="${esc(SET.instagram)}" target="_blank" rel="noopener">Instagram</a>`:''}${SET.x?`<a href="${esc(SET.x)}" target="_blank" rel="noopener">X</a>`:''}</div></div>
 <div><h5>SECTIONS</h5><ul><li><a href="index.html">Home</a></li>${CATS.map(([k,n])=>`<li><a href="index.html?c=${k}">${n}</a></li>`).join('')}</ul></div>
 <div><h5>INFORMATION</h5><ul><li><a href="index.html?q=">Search</a></li><li><a href="page.html?s=about">About Rapaechelon</a></li><li><a href="page.html?s=editorial-standards">Editorial Standards</a></li><li><a href="page.html?s=corrections-policy">Corrections Policy</a></li></ul></div></div>
 <div class="wrap copy">© ${new Date().getFullYear()} RAPAECHELON - RAPMAG</div></footer>`);
 $('#sb').onclick=()=>{$('#sr').classList.toggle('on');$('#si').focus()};
 $('#si').onkeydown=e=>{if(e.key==='Enter')location.href='index.html?q='+encodeURIComponent(e.target.value.trim())}}
function promo(){return SET.promo_image?`<aside class="promo"><span>${esc(SET.promo_label||'Featured partner')}</span>${SET.promo_link?`<a href="${esc(SET.promo_link)}" target="_blank" rel="sponsored noopener">`:'<div>'}<img src="${esc(img(SET.promo_image))}" alt="Advertisement">${SET.promo_link?'</a>':'</div>'}</aside>`:''}
function card(p,lead){return`<article class="card rv${lead?' lead':''}"><a class="im" href="${link(p)}" aria-label="${esc(p.title)}">${p.cover?`<img src="${esc(img(p.cover))}" alt="${esc(p.title)}" loading="lazy">`:ph(p.title)}</a>
 <a class="c" href="index.html?c=${esc(p.category)}">${esc(CN[p.category]||p.category)}</a><h2><a href="${link(p)}">${esc(p.title)}</a></h2>${lead&&p.dek?`<p>${esc(p.dek)}</p>`:''}<div class="meta">${when(p.published_at)} · By ${esc(p.author)}</div></article>`}
function reveal(){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -40px'});document.querySelectorAll('.rv:not(.in)').forEach(el=>io.observe(el))}
function ld(o){const s=document.createElement('script');s.type='application/ld+json';s.textContent=JSON.stringify(o);document.head.appendChild(s)}
function setMeta(t,d,im,type){document.title=t;let c=document.querySelector('link[rel=canonical]');if(!c){c=document.createElement('link');c.rel='canonical';document.head.appendChild(c)}c.href=location.href.split('#')[0];const m=(n,v,a)=>{if(!v)return;let el=document.querySelector(`meta[${a||'name'}="${n}"]`);if(!el){el=document.createElement('meta');el.setAttribute(a||'name',n);document.head.appendChild(el)}el.content=v};m('description',d);m('og:title',t,'property');m('og:description',d,'property');m('og:image',im||new URL('og.jpg',location.href).href,'property');m('og:type',type||'website','property');m('og:url',location.href,'property');m('og:site_name','RAPAECHELON - RAPMAG','property');m('twitter:card','summary_large_image')}

/* ---------- home / section / search ---------- */
async function home(){const main=$('#main'),cat=qs.get('c'),q=qs.get('q');let off=0;const N=12;
 const head=!cat&&q==null?'<h1 class="vh">RAPAECHELON - RAPMAG: Hip-Hop, Rap &amp; Entertainment News</h1>':cat?`<div class="sh"><h1>${esc(CN[cat]||cat)}</h1></div>`:q!=null?`<div class="sh"><h1>${q?'Search: '+esc(q):'Search'}</h1></div>`:'';
 setMeta(cat?CN[cat]+' News | RAPAECHELON - RAPMAG':q!=null?'Search | RAPAECHELON - RAPMAG':'RAPAECHELON - RAPMAG | Hip-Hop, Rap & Entertainment News',cat?'The latest '+CN[cat].toLowerCase()+' stories in hip-hop and rap from RAPAECHELON - RAPMAG.':'RAPAECHELON - RAPMAG: breaking hip-hop and rap news, new music and entertainment stories, updated daily.');
 main.innerHTML=`<div class="wrap shell">${promo()}${head}<section class="grid" id="g" aria-label="Published articles"></section><button class="more" id="mo" hidden>LOAD MORE STORIES</button></div>`;
 const load=async()=>{const d=await get('/api/posts?limit='+N+'&offset='+off+(cat?'&cat='+cat:'')+(q?'&q='+encodeURIComponent(q):''));
  $('#g').insertAdjacentHTML('beforeend',d.posts.map((p,i)=>card(p,!cat&&q==null&&off===0&&i===0)).join(''));off+=d.posts.length;$('#mo').hidden=d.posts.length<N;
  if(!off)$('#g').innerHTML='<div class="empty">No stories here yet.</div>';reveal()};$('#mo').onclick=load;return load()}

/* ---------- article + info pages ---------- */
async function article(){const main=$('#main'),s=qs.get('s'),isPage=page==='page';let d;try{d=await get('/api/posts/'+encodeURIComponent(s||''))}catch(e){main.innerHTML='<div class="wrap shell"><div class="empty">'+(isPage?'This page has not been written yet. Create it in the back office (section: Page, link: '+esc(s)+').':'This article was not found.')+'</div><a class="btn" href="index.html">Back home</a></div>';return}
 const p=d.post,url=location.href;setMeta(p.title+' | RAPAECHELON - RAPMAG',p.dek||p.title,img(p.cover),'article');
 if(!isPage)ld({'@context':'https://schema.org','@type':'NewsArticle',headline:p.title,description:p.dek||'',image:p.cover?[img(p.cover)]:undefined,datePublished:(p.published_at||'').replace(' ','T')+'Z',dateModified:(p.updated_at||p.published_at||'').replace(' ','T')+'Z',author:{'@type':'Person',name:p.author},publisher:{'@type':'NewsMediaOrganization',name:'RAPAECHELON - RAPMAG',logo:{'@type':'ImageObject',url:new URL('logo.webp',location.href).href}},articleSection:CN[p.category]||p.category,keywords:p.tags||'',mainEntityOfPage:location.href});
 main.innerHTML=`<article class="wrap story"><header class="st-head">${isPage?'':`<a class="c" href="index.html?c=${esc(p.category)}">${esc(CN[p.category]||p.category)}</a>`}<h1>${esc(p.title)}</h1>${p.dek?`<p class="dek">${esc(p.dek)}</p>`:''}${isPage?'':`<div class="meta">${when(p.published_at)} · By ${esc(p.author)} · ${rt(p.body)}</div>`}</header>
 ${p.cover?`<figure class="st-cover"><img src="${esc(img(p.cover))}" alt="${esc(p.title)}"></figure>`:''}
 <div class="st-cols">${isPage?'<div></div>':`<div class="share"><a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(p.title)}&url=${encodeURIComponent(url)}" target="_blank" rel="noopener" title="Share on X">X</a><a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}" target="_blank" rel="noopener" title="Share on Facebook">FB</a><button id="cp" title="Copy link">LINK</button></div>`}
 <div><div class="body">${fix(p.body)}</div>${p.tags&&!isPage?`<div class="tags">${p.tags.split(',').map(t=>t.trim()).filter(Boolean).map(t=>`<a href="index.html?q=${encodeURIComponent(t)}">${esc(t)}</a>`).join('')}</div>`:''}</div></div></article>
 ${!isPage&&d.related.length?`<section class="wrap related"><div class="sh"><h1>More ${esc(CN[p.category]||'')}</h1></div><div class="grid">${d.related.map(r=>card(r)).join('')}</div></section>`:''}`;
 if($('#cp'))$('#cp').onclick=()=>{navigator.clipboard.writeText(url).then(()=>{$('#cp').textContent='COPIED';setTimeout(()=>$('#cp').textContent='LINK',1500)})};
 if(!isPage){const k='rm_v_'+p.slug;try{if(!sessionStorage.getItem(k)){sessionStorage.setItem(k,1);fetch(API+'/api/view/'+p.slug,{method:'POST'})}}catch(e){}
  addEventListener('scroll',()=>{const a=$('.story'),r=a.getBoundingClientRect(),h=a.offsetHeight-innerHeight;$('#prog').style.width=Math.min(100,Math.max(0,-r.top/h*100))+'%'},{passive:true})}reveal()}
function fix(h){return String(h||'').replace(/(<img[^>]*src=")(\/img\/[^"]+)"/g,(m,a,b)=>a+API+b+'" loading="lazy"')}

get('/api/settings').then(d=>SET=d.settings||{},()=>{}).then(()=>{chrome();return page==='home'?home():article()}).catch(()=>{$('#main').innerHTML='<div class="wrap shell"><div class="empty">Could not reach the RAPMAG server.</div></div>'})
})();
