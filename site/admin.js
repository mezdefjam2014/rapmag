/* RAPMAG back office: log in, list articles, write/edit with a rich editor, upload images to Cloudflare R2 (cover, inline, paste, drag and drop), media library */
(function(){
const API=window.RM_API,$=s=>document.querySelector(s),app=$('#app'),esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const CATS=[['breaking','Breaking'],['music','Music'],['entertainment','Entertainment'],['page','Page (About, Editorial Standards…)']];
let TOKEN='';try{TOKEN=localStorage.getItem('rm_tok')||''}catch(e){}
const img=u=>!u?'':/^https?:/.test(u)?u:API+u;
async function api(p,o){o=o||{};const r=await fetch(API+p,{...o,headers:{...(o.body instanceof FormData?{}:{'Content-Type':'application/json'}),Authorization:'Bearer '+TOKEN,...(o.headers||{})}});const d=await r.json().catch(()=>({}));if(r.status===401&&p!=='/api/admin/login'){logout();throw new Error('Logged out')}if(!r.ok)throw new Error(d.error||('Error '+r.status));return d}
function logout(){TOKEN='';try{localStorage.removeItem('rm_tok')}catch(e){}login()}
const up=t=>{const u=$('#up');u.style.display=t?'block':'none';u.textContent=t||''};
async function upload(f){if(!/^image\//.test(f.type))throw new Error('Images only');up('Uploading '+f.name+'…');const fd=new FormData();fd.append('file',f);try{return await api('/api/admin/upload',{method:'POST',body:fd})}finally{up('')}}
const pick=()=>new Promise(res=>{const i=document.createElement('input');i.type='file';i.accept='image/*';i.multiple=true;i.onchange=()=>res([...i.files]);i.click()});

/* ---------- login ---------- */
function login(){app.innerHTML=`<div class="login"><a class="logo"><b>RAPAECHELON</b><i>RAPMAG</i></a><h1 style="margin-top:30px">BACK OFFICE</h1><div class="pn" style="margin-top:20px"><label>PASSWORD</label><input type="password" id="pw" autocomplete="current-password"><button class="b r" id="go" style="width:100%;margin-top:16px">LOG IN</button><div class="st" id="ms"></div></div></div>`;
 const go=async()=>{$('#ms').textContent='Checking…';try{const d=await api('/api/admin/login',{method:'POST',body:JSON.stringify({password:$('#pw').value})});TOKEN=d.token;try{localStorage.setItem('rm_tok',TOKEN)}catch(e){}list()}catch(e){$('#ms').textContent=e.message}};
 $('#go').onclick=go;$('#pw').onkeydown=e=>{if(e.key==='Enter')go()};$('#pw').focus()}

/* ---------- list ---------- */
async function list(){app.innerHTML=`<div class="ah"><h1>ARTICLES</h1><a class="b" href="index.html" target="_blank">VIEW SITE</a><button class="b" id="lib">MEDIA</button><button class="b" id="set">SETTINGS</button><button class="b r" id="nw">+ NEW ARTICLE</button><button class="b" id="lo">LOG OUT</button></div><input type="text" id="q" placeholder="Search articles"><div class="lst" id="ls" style="margin-top:14px"><div class="st">Loading…</div></div>`;
 $('#nw').onclick=()=>edit(null);$('#set').onclick=settings;$('#lo').onclick=logout;$('#lib').onclick=()=>library();
 const d=await api('/api/admin/posts'),draw=()=>{const q=$('#q').value.toLowerCase(),L=d.posts.filter(p=>!q||p.title.toLowerCase().includes(q));
  $('#ls').innerHTML=L.length?L.map(p=>`<div class="row" data-id="${p.id}"><div class="t">${p.cover?`<img src="${esc(img(p.cover))}">`:''}</div><div><b>${esc(p.title)}</b><small>${esc((CATS.find(c=>c[0]===p.category)||[0,p.category])[1])} · ${esc(p.author)} · ${p.published_at?'published '+p.published_at.slice(0,10):'edited '+String(p.updated_at).slice(0,10)}${p.featured?' · ★ COVER STORY':''} · ${p.views} views</small></div><span class="pill ${p.status}">${p.status}</span></div>`).join(''):'<div class="st">No articles yet. Click + NEW ARTICLE.</div>';
  document.querySelectorAll('.row').forEach(r=>r.onclick=()=>edit(+r.dataset.id))};$('#q').oninput=draw;draw()}

/* ---------- editor ---------- */
async function edit(id){let P={title:'',dek:'',body:'',cover:'',category:'breaking',tags:'',author:'RAPMAG Staff',status:'draft',featured:0,slug:''};
 if(id)P=(await api('/api/admin/posts/'+id)).post;
 const DK='rm_draft_'+(id||'new');let saved=null;try{saved=JSON.parse(localStorage.getItem(DK)||'null')}catch(e){}
 app.innerHTML=`<div class="ah"><button class="b" id="bk">&larr; ARTICLES</button><h1 style="font-size:28px">${id?'EDIT':'NEW'} ARTICLE</h1><button class="b" id="pv">PREVIEW</button><button class="b" id="sd">SAVE DRAFT</button><button class="b r" id="pb">${P.status==='published'?'UPDATE':'PUBLISH'}</button></div>
 ${saved&&saved.t>Date.parse((P.updated_at||'1970-01-01').replace(' ','T')+'Z')?`<div class="pn" style="margin-bottom:14px;border-color:#e8c36a">You have unsaved changes from ${new Date(saved.t).toLocaleString()}. <button class="b" id="rs" style="margin-left:10px">RESTORE</button></div>`:''}
 <div class="ed"><div><textarea class="ttl" id="tt" rows="1" placeholder="HEADLINE">${esc(P.title)}</textarea><textarea class="dk" id="dk" rows="2" placeholder="Standfirst: one or two lines that sell the story">${esc(P.dek)}</textarea>
 <div class="tb" id="tb"><button data-c="h2" title="Heading">H2</button><button data-c="h3" title="Small heading">H3</button><button data-c="p" title="Paragraph">¶</button><span class="sp"></span><button data-c="bold" title="Bold"><b>B</b></button><button data-c="italic" title="Italic"><i>I</i></button><button data-c="link" title="Link">LINK</button><span class="sp"></span><button data-c="blockquote" title="Pull quote">❝</button><button data-c="ul" title="List">• LIST</button><button data-c="ol" title="Numbered">1. LIST</button><span class="sp"></span><button data-c="img" title="Insert image">+ IMAGE</button><button data-c="lib" title="From media library">MEDIA</button><button data-c="yt" title="YouTube video">YOUTUBE</button><span class="sp"></span><button data-c="clear" title="Clear formatting">CLEAR</button></div>
 <div class="body edit" id="bd" contenteditable="true">${abs(P.body)}</div></div>
 <aside class="pn" style="position:sticky;top:10px"><label>COVER IMAGE</label><div class="cov" id="cv">${P.cover?`<img src="${esc(img(P.cover))}">`:'CLICK OR DROP AN IMAGE'}</div><div style="display:flex;gap:6px;margin-top:6px"><button class="b" id="cvl" style="flex:1">FROM MEDIA</button><button class="b" id="cvx">REMOVE</button></div>
 <label>SECTION</label><select id="ct">${CATS.map(([k,n])=>`<option value="${k}"${P.category===k?' selected':''}>${n}</option>`).join('')}</select>
 <label>TAGS (comma separated)</label><input type="text" id="tg" value="${esc(P.tags)}" placeholder="drill, new york, debut album">
 <label>AUTHOR</label><input type="text" id="au" value="${esc(P.author)}"><label>LINK (slug)</label><input type="text" id="sl" value="${esc(P.slug)}" placeholder="made from the headline">
 <label class="chk"><input type="checkbox" id="ft"${P.featured?' checked':''}> COVER STORY (big hero on the home page)</label>
 <div class="st" id="ms">${P.status==='published'?'Live on the site.':'Draft: only you can see it.'}</div>
 ${id?`<div style="display:flex;gap:6px;margin-top:16px">${P.status==='published'?'<button class="b" id="up2" style="flex:1">UNPUBLISH</button>':''}<button class="b d" id="dl" style="flex:1">DELETE</button></div>${P.status==='published'?`<a class="b" style="display:block;text-align:center;margin-top:6px" target="_blank" href="article.html?s=${esc(P.slug)}">OPEN LIVE ARTICLE</a>`:''}`:''}</aside></div>`;
 const bd=$('#bd'),ms=t=>$('#ms').textContent=t,grow=()=>{const t=$('#tt');t.style.height='auto';t.style.height=t.scrollHeight+'px'};$('#tt').addEventListener('input',grow);$('#tt').addEventListener('keydown',e=>{if(e.key==='Enter')e.preventDefault()});setTimeout(grow);
 const val=()=>({id:P.id,title:$('#tt').value.trim(),dek:$('#dk').value.trim(),body:tidy(bd.innerHTML),cover:P.cover,category:$('#ct').value,tags:$('#tg').value,author:$('#au').value.trim()||'RAPMAG Staff',slug:$('#sl').value.trim(),featured:$('#ft').checked});
 let tm;const auto=()=>{clearTimeout(tm);tm=setTimeout(()=>{try{localStorage.setItem(DK,JSON.stringify({t:Date.now(),v:val()}))}catch(e){}},800)};app.addEventListener('input',auto);
 if($('#rs'))$('#rs').onclick=()=>{const v=saved.v;$('#tt').value=v.title;$('#dk').value=v.dek;bd.innerHTML=abs(v.body);P.cover=v.cover;$('#ct').value=v.category;$('#tg').value=v.tags;$('#au').value=v.author;$('#sl').value=v.slug;$('#ft').checked=v.featured;setCover(v.cover);$('#rs').parentNode.remove()};
 const save=async status=>{const v=val();if(!v.title){ms('Add a headline first.');$('#tt').focus();return}ms('Saving…');try{const d=await api('/api/admin/posts',{method:'POST',body:JSON.stringify({...v,status})});try{localStorage.removeItem(DK)}catch(e){}ms(status==='published'?'Published. It is live now.':'Draft saved.');if(!id||status!==P.status)edit(d.post.id);else{P=d.post;$('#sl').value=P.slug}}catch(e){ms(e.message)}};
 $('#sd').onclick=()=>save('draft');$('#pb').onclick=()=>save('published');$('#bk').onclick=list;if($('#up2'))$('#up2').onclick=()=>save('draft');
 if($('#dl'))$('#dl').onclick=async()=>{if(!confirmBox('Delete this article for good?'))return;await api('/api/admin/posts/'+id,{method:'DELETE'});try{localStorage.removeItem(DK)}catch(e){}list()};
 /* cover */
 const setCover=u=>{P.cover=u||'';$('#cv').innerHTML=u?`<img src="${esc(img(u))}">`:'CLICK OR DROP AN IMAGE';auto()};
 $('#cv').onclick=async()=>{const [f]=await pick();if(f)try{setCover((await upload(f)).url)}catch(e){ms(e.message)}};$('#cvx').onclick=()=>setCover('');$('#cvl').onclick=()=>library(u=>setCover(u));
 dropZone($('#cv'),async fs=>{try{setCover((await upload(fs[0])).url)}catch(e){ms(e.message)}});
 /* body toolbar */
 let range=null;bd.addEventListener('keyup',keep);bd.addEventListener('mouseup',keep);bd.addEventListener('blur',keep);function keep(){const s=getSelection();if(s.rangeCount&&bd.contains(s.anchorNode))range=s.getRangeAt(0).cloneRange()}
 const restore=()=>{bd.focus();if(range){const s=getSelection();s.removeAllRanges();s.addRange(range)}};
 const insertFig=(u,alt)=>{restore();document.execCommand('insertHTML',false,`<figure><img src="${esc(u)}" alt="${esc(alt||'')}"><figcaption contenteditable="true"></figcaption></figure><p><br></p>`);auto()};
 $('#tb').onmousedown=e=>{if(e.target.closest('button'))e.preventDefault()};
 $('#tb').onclick=async e=>{const b=e.target.closest('button');if(!b)return;const c=b.dataset.c;restore();
  if(['h2','h3','p','blockquote'].includes(c))document.execCommand('formatBlock',false,c);
  else if(c==='bold'||c==='italic')document.execCommand(c);
  else if(c==='ul')document.execCommand('insertUnorderedList');else if(c==='ol')document.execCommand('insertOrderedList');
  else if(c==='link'){const u=prompt('Link address (https://…)');if(u&&/^https?:\/\//.test(u))document.execCommand('createLink',false,u)}
  else if(c==='clear'){document.execCommand('removeFormat');document.execCommand('formatBlock',false,'p')}
  else if(c==='img'){const fs=await pick();for(const f of fs)try{const d=await upload(f);insertFig(img(d.url),f.name.replace(/\.[^.]+$/,''))}catch(er){ms(er.message)}}
  else if(c==='lib')library(u=>insertFig(img(u)));
  else if(c==='yt'){const u=prompt('YouTube link');const m=u&&u.match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/);if(m)document.execCommand('insertHTML',false,`<iframe src="https://www.youtube-nocookie.com/embed/${m[1]}" allowfullscreen></iframe><p><br></p>`)}
  auto()};
 /* paste / drop images straight into the story */
 bd.addEventListener('paste',async e=>{const fs=[...(e.clipboardData||{}).files||[]].filter(f=>/^image\//.test(f.type));if(fs.length){e.preventDefault();keep();for(const f of fs)try{insertFig(img((await upload(f)).url))}catch(er){ms(er.message)}}
  else{const h=e.clipboardData.getData('text/html');if(h){e.preventDefault();document.execCommand('insertHTML',false,tidy(h))}}});
 dropZone(bd,async fs=>{for(const f of fs)try{insertFig(img((await upload(f)).url),f.name.replace(/\.[^.]+$/,''))}catch(er){ms(er.message)}});
 $('#pv').onclick=()=>preview(val())}
/* keep only clean story markup; store image links as /img/... so they follow the API host */
function tidy(h){const d=document.createElement('div');d.innerHTML=h;d.querySelectorAll('script,style,meta,link,form,input,button').forEach(n=>n.remove());
 d.querySelectorAll('*').forEach(n=>{[...n.attributes].forEach(a=>{const k=a.name;if(!(['href','src','alt','allowfullscreen'].includes(k)))n.removeAttribute(k)});if(n.tagName==='A')n.setAttribute('target','_blank'),n.setAttribute('rel','noopener')});
 d.querySelectorAll('img').forEach(i=>{const s=i.getAttribute('src')||'';if(s.startsWith(API+'/img/'))i.setAttribute('src',s.slice(API.length))});
 d.querySelectorAll('figcaption').forEach(f=>{if(!f.textContent.trim())f.remove()});
 return d.innerHTML.replace(/<p><br><\/p>\s*$/,'').trim()}
function abs(h){return String(h||'').replace(/(<img[^>]*src=")(\/img\/[^"]+)"/g,(m,a,b)=>a+API+b+'"')}
async function settings(){let S={};try{S=(await (await fetch(API+'/api/settings')).json()).settings||{}}catch(e){}
 const F=[['tagline','FOOTER TAGLINE','Music, entertainment, culture and breaking stories.'],['promo_label','BANNER LABEL','Featured partner'],['promo_link','BANNER LINK','https://www.youtube.com/@TheRapMag'],['youtube','YOUTUBE LINK','https://www.youtube.com/@…'],['instagram','INSTAGRAM LINK','https://instagram.com/…'],['x','X / TWITTER LINK','https://x.com/…']];
 const pic=(k,t,h)=>`<label>${t}</label><div class="cov" data-k="${k}" style="aspect-ratio:${h}">${S[k]?`<img src="${esc(img(S[k]))}" style="object-fit:contain;background:#000">`:'CLICK OR DROP AN IMAGE'}</div><button class="b" data-x="${k}" style="margin-top:6px">REMOVE</button>`;
 app.innerHTML=`<div class="ah"><button class="b" id="bk">&larr; ARTICLES</button><h1 style="font-size:28px">SITE SETTINGS</h1><button class="b r" id="sv">SAVE</button></div>
 <div class="ed"><div class="pn">${pic('logo','LOGO (shown big in the black header; leave empty for the RAPAECHELON wordmark)','4/1')}${pic('promo_image','FEATURED PARTNER BANNER (top of the home page)','6/1')}</div>
 <div class="pn">${F.map(([k,t,ph])=>`<label>${t}</label><input type="text" data-f="${k}" value="${esc(S[k]||'')}" placeholder="${esc(ph)}">`).join('')}<div class="st" id="ms"></div></div></div>`;
 $('#bk').onclick=list;
 const setPic=(k,u)=>{S[k]=u||'';const el=app.querySelector('.cov[data-k="'+k+'"]');el.innerHTML=u?`<img src="${esc(img(u))}" style="object-fit:contain;background:#000">`:'CLICK OR DROP AN IMAGE'};
 app.querySelectorAll('.cov[data-k]').forEach(el=>{const k=el.dataset.k;el.onclick=async()=>{const [f]=await pick();if(f)setPic(k,(await upload(f)).url)};dropZone(el,async fs=>setPic(k,(await upload(fs[0])).url))});
 app.querySelectorAll('[data-x]').forEach(b=>b.onclick=()=>setPic(b.dataset.x,''));
 $('#sv').onclick=async()=>{const b={logo:S.logo||'',promo_image:S.promo_image||''};app.querySelectorAll('[data-f]').forEach(i=>b[i.dataset.f]=i.value.trim());$('#ms').textContent='Saving…';try{await api('/api/admin/settings',{method:'POST',body:JSON.stringify(b)});$('#ms').textContent='Saved. The site updates within a minute.'}catch(e){$('#ms').textContent=e.message}}}
function dropZone(el,fn){el.addEventListener('dragover',e=>{e.preventDefault();el.classList.add('drop')});el.addEventListener('dragleave',()=>el.classList.remove('drop'));el.addEventListener('drop',e=>{e.preventDefault();el.classList.remove('drop');const fs=[...e.dataTransfer.files].filter(f=>/^image\//.test(f.type));if(fs.length)fn(fs)})}
function confirmBox(t){return window.confirm(t)}
async function library(onPick){const m=document.createElement('div');m.className='modal';m.innerHTML=`<div class="pn"><div class="ah" style="margin:0"><h1 style="font-size:30px">MEDIA</h1><button class="b r" id="mu">UPLOAD</button><button class="b" id="mx">CLOSE</button></div><div class="st">${onPick?'Click an image to use it.':'Every image you uploaded, stored in Cloudflare.'}</div><div class="lib" id="ml"><div class="st">Loading…</div></div></div>`;document.body.appendChild(m);
 const close=()=>m.remove();m.onclick=e=>{if(e.target===m)close()};m.querySelector('#mx').onclick=close;
 const load=async()=>{const d=await api('/api/admin/images');m.querySelector('#ml').innerHTML=d.images.map(i=>`<div data-u="${esc(i.url)}" title="${esc(i.key)}"><img src="${esc(img(i.url))}" loading="lazy"><button data-del="${esc(i.key)}">DELETE</button></div>`).join('')||'<div class="st">No images yet.</div>'};
 m.querySelector('#mu').onclick=async()=>{for(const f of await pick())await upload(f).catch(e=>alert(e.message));load()};
 m.querySelector('#ml').onclick=async e=>{const del=e.target.closest('[data-del]');if(del){e.stopPropagation();if(confirmBox('Delete this image from storage? Articles using it will show a broken image.')){await api('/api/admin/images/'+encodeURIComponent(del.dataset.del),{method:'DELETE'});load()}return}const t=e.target.closest('[data-u]');if(t&&onPick){onPick(t.dataset.u);close()}};load()}
function preview(v){const w=window.open('','_blank');if(!w)return;const b=v.body.replace(/(<img[^>]*src=")(\/img\/[^"]+)"/g,(m,a,c)=>a+API+c+'"');
 w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Preview: ${esc(v.title)}</title><link rel="stylesheet" href="style.css?v=2"></head><body><div class="bar">PREVIEW · NOT PUBLISHED YET</div><section class="art-hero"><div class="bgi" style="background-image:url('${esc(img(v.cover))}')"></div><div class="wrap"><span class="eye">${esc(v.category)}</span><h1>${esc(v.title)}</h1><p class="dek">${esc(v.dek)}</p><div class="meta"><span>By ${esc(v.author)}</span></div></div></section><div class="wrap art"><div></div><article><div class="body">${b}</div></article></div></body></html>`);w.document.close()}
TOKEN?list().catch(()=>login()):login();
})();
