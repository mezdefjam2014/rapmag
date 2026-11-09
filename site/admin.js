/* RAPMAG back office: articles (rich editor, scheduling, alt text, auto excerpt, SEO checklist, related-story links, audio, YouTube/Vimeo),
   authors, categories, media library, social distribution (Facebook Page + X), site settings. Files go to Cloudflare R2 through the API. */
(function(){
const API=window.RM_API,$=s=>document.querySelector(s),app=$('#app'),esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const SITE=location.href.replace(/admin\.html.*$/,''),PRETTY=!!window.RM_PRETTY,artUrl=s=>SITE+(PRETTY?'article/'+s+'/':'article.html?s='+s);
let TOKEN='';try{TOKEN=localStorage.getItem('rm_tok')||''}catch(e){}
let CATS=[],AUTHORS=[];
const img=u=>!u?'':/^https?:/.test(u)?u:API+u;
async function api(p,o){o=o||{};const r=await fetch(API+p,{...o,headers:{...(o.body instanceof FormData?{}:{'Content-Type':'application/json'}),Authorization:'Bearer '+TOKEN,...(o.headers||{})}});const d=await r.json().catch(()=>({}));if(r.status===401&&p!=='/api/admin/login'){logout();throw new Error('Logged out')}if(!r.ok)throw new Error(d.error||('Error '+r.status));return d}
function logout(){TOKEN='';try{localStorage.removeItem('rm_tok')}catch(e){}login()}
const up=t=>{const u=$('#up');u.style.display=t?'block':'none';u.textContent=t||''};
/* photos: very large ones are shrunk to 2000px before upload, and an 800px copy is made for the story cards (fast home page) */
const canv=(img,w)=>{const s=Math.min(1,w/img.naturalWidth),c=document.createElement('canvas');c.width=Math.round(img.naturalWidth*s);c.height=Math.round(img.naturalHeight*s);c.getContext('2d').drawImage(img,0,0,c.width,c.height);return c};
const blob=(c,t,q)=>new Promise(r=>c.toBlob(r,t,q));
async function prep(f){if(!/^image\/(jpeg|png|webp)$/.test(f.type))return{main:f};const u=URL.createObjectURL(f),img=new Image();img.src=u;try{await img.decode()}catch(e){return{main:f}}finally{setTimeout(()=>URL.revokeObjectURL(u),5000)}
 let main=f;if(img.naturalWidth>2000||f.size>1.5e6){const b=await blob(canv(img,2000),'image/webp',.86);if(b&&b.size<f.size)main=new File([b],f.name.replace(/\.[^.]+$/,'')+'.webp',{type:'image/webp'})}
 const t=img.naturalWidth>800?await blob(canv(img,800),'image/webp',.82):null;return{main,thumb:t}}
async function upload(f){{const T={ogg:'audio/ogg',mp3:'audio/mpeg',m4a:'audio/mp4',wav:'audio/wav'},e=(f.name.match(/\.(\w+)$/)||[])[1];if(e&&T[e.toLowerCase()]&&!/^audio\//.test(f.type))f=new File([f],f.name,{type:T[e.toLowerCase()]})}if(!/^(image|audio)\//.test(f.type))throw new Error('Images or audio only');up('Uploading '+f.name+'…');
 try{const {main,thumb}=/^image\//.test(f.type)?await prep(f):{main:f},fd=new FormData();fd.append('file',main);const d=await api('/api/admin/upload',{method:'POST',body:fd});
  if(thumb){const t=new FormData();t.append('file',new File([thumb],'thumb.webp',{type:'image/webp'}));t.append('thumb_of',d.key);await api('/api/admin/upload',{method:'POST',body:t}).catch(()=>{})}return d}finally{up('')}}
const pick=(acc,multi)=>new Promise(res=>{const i=document.createElement('input');i.type='file';i.accept=acc||'image/*';i.multiple=multi!==false;i.onchange=()=>res([...i.files]);i.click()});
/* own confirm box: the in-app browser silently blocks window.confirm, which made every delete do nothing */
const confirmBox=(t,yes)=>new Promise(res=>{const m=document.createElement('div');m.className='modal';m.style.zIndex=200;m.innerHTML=`<div class="pn" style="width:min(460px,92vw)"><div style="font:500 15px/1.55 Inter,sans-serif;white-space:pre-line">${esc(t)}</div><div style="display:flex;gap:8px;justify-content:flex-end;margin-top:20px"><button class="b" data-n>CANCEL</button><button class="b r" data-y>${esc(yes||'DELETE')}</button></div></div>`;document.body.appendChild(m);
 const done=v=>{m.remove();removeEventListener('keydown',k);res(v)},k=e=>{if(e.key==='Escape')done(false);if(e.key==='Enter')done(true)};addEventListener('keydown',k);m.onclick=e=>{if(e.target===m||e.target.closest('[data-n]'))done(false);else if(e.target.closest('[data-y]'))done(true)};m.querySelector('[data-y]').focus()});
async function loadMeta(){const [c,a]=await Promise.all([api('/api/admin/categories'),api('/api/admin/authors')]);CATS=c.cats;AUTHORS=a.authors}
const catName=s=>s==='page'?'Page':((CATS.find(c=>c.slug===s)||{}).name||s);
const localDT=s=>{if(!s)return'';const d=new Date(s.replace(' ','T')+'Z'),z=n=>String(n).padStart(2,'0');return d.getFullYear()+'-'+z(d.getMonth()+1)+'-'+z(d.getDate())+'T'+z(d.getHours())+':'+z(d.getMinutes())};
const isFuture=s=>s&&new Date(s.replace(' ','T')+'Z')>new Date();

/* ---------- shell ---------- */
function shell(on,title,extra){if(on!=='new'&&location.hash!=='#'+on)history.pushState(null,'',location.pathname+location.search+'#'+on);app.innerHTML=`<div class="topnav">${[['list','ARTICLES'],['new','+ NEW'],['authors','AUTHORS'],['cats','CATEGORIES'],['media','MEDIA'],['indie','INDIE CHARTS'],['dist','DISTRIBUTION'],['settings','SETTINGS']].map(([k,t])=>`<button class="b${k===on?' on':''}${k==='new'?' r':''}" data-go="${k}">${t}</button>`).join('')}<a class="b" href="./" target="_blank">VIEW SITE ↗</a><button class="b" data-go="out">LOG OUT</button></div>
 <div class="ah"><h1>${title}</h1>${extra||''}</div><div id="pg"></div>`;
 app.querySelector('.topnav').onclick=e=>{const b=e.target.closest('[data-go]');if(!b)return;({list,new:()=>edit(null),authors,cats,media:()=>library(),indie,dist,settings,out:logout})[b.dataset.go]()};return $('#pg')}

/* ---------- login ---------- */
function login(){app.innerHTML=`<div class="login"><img src="logo.webp" alt="RAPAECHELON - RAPMAG" style="width:220px;background:#000;padding:10px"><h1 style="margin-top:30px">BACK OFFICE</h1><div class="pn" style="margin-top:20px"><label>PASSWORD</label><input type="password" id="pw" autocomplete="current-password"><button class="b r" id="go" style="width:100%;margin-top:16px">LOG IN</button><div class="st" id="ms"></div></div></div>`;
 const go=async()=>{$('#ms').textContent='Checking…';try{const d=await api('/api/admin/login',{method:'POST',body:JSON.stringify({password:$('#pw').value})});TOKEN=d.token;try{localStorage.setItem('rm_tok',TOKEN)}catch(e){}await loadMeta();route()}catch(e){$('#ms').textContent=e.message}};
 $('#go').onclick=go;$('#pw').onkeydown=e=>{if(e.key==='Enter')go()};$('#pw').focus()}

/* ---------- articles ---------- */
async function list(){const pg=shell('list','ARTICLES');pg.innerHTML=`<input type="text" id="q" placeholder="Search articles"><div class="lst" id="ls" style="margin-top:14px"><div class="st">Loading…</div></div>`;
 const d=await api('/api/admin/posts'),draw=()=>{const q=$('#q').value.toLowerCase(),L=d.posts.filter(p=>!q||p.title.toLowerCase().includes(q));
  $('#ls').innerHTML=L.length?L.map(p=>{const st=p.status==='published'&&isFuture(p.published_at)?'scheduled':p.status;return`<div class="row" data-id="${p.id}"><div class="t">${p.cover?`<img src="${esc(img(p.cover))}">`:''}</div><div><b>${esc(p.title)}</b><small>${esc(catName(p.category))} · ${esc(p.author)} · ${st==='scheduled'?'goes live '+new Date(p.published_at.replace(' ','T')+'Z').toLocaleString():p.published_at?'published '+p.published_at.slice(0,10):'edited '+String(p.updated_at).slice(0,10)}${p.featured?' · ★ COVER STORY':''} · ${p.views} views${p.social_fb&&p.social_fb!=='failed'?' · FB ✓':''}${p.social_x&&p.social_x!=='failed'?' · X ✓':''}</small></div><span class="pill ${st}">${st}</span></div>`}).join(''):'<div class="st">No articles yet. Click + NEW.</div>';
  document.querySelectorAll('.row').forEach(r=>r.onclick=()=>edit(+r.dataset.id))};$('#q').oninput=draw;draw()}

const CHECKS=[['Headline','Between 30 and 110 characters',v=>v.title.length>=30&&v.title.length<=110],['Clean link','Short slug made of words',v=>{const s=v.slug||v.title.toLowerCase().replace(/[^a-z0-9]+/g,'-');return s.length>0&&s.length<=80}],['Excerpt / description','50 to 300 characters',v=>v.dek.length>=50&&v.dek.length<=300],['Featured image','Add a cover image',v=>!!v.cover],['Image alt text','Describe the cover image',v=>!v.cover||v.cover_alt.trim().length>=5],['Author','Pick an author',v=>!!+v.author_id],['Category','Pick a section',v=>!!v.category],['Article depth','At least 300 words',v=>wc(v.body)>=300],['Source / link','Link at least one source or story',v=>/<a\s/i.test(v.body)],['No SEO notes in the story','Remove writing like “keyword:” or “SEO”',v=>!/\b(seo|meta description|keywords?:)\b/i.test(v.body.replace(/<[^>]+>/g,' '))]];
const wc=h=>String(h||'').replace(/<[^>]+>/g,' ').split(/\s+/).filter(Boolean).length;
async function edit(id){{const h=id?'#edit-'+id:'#new';if(location.hash!==h)history.pushState(null,'',location.pathname+location.search+h)}if(!CATS.length)await loadMeta();
 let P={title:'',dek:'',body:'',cover:'',cover_alt:'',category:(CATS[0]||{}).slug||'breaking',tags:'',author_id:(AUTHORS[0]||{}).id||'',audio:'',status:'draft',featured:0,slug:'',published_at:null};
 if(id)P=(await api('/api/admin/posts/'+id)).post;
 const DK='rm_draft_'+(id||'new');let saved=null;try{saved=JSON.parse(localStorage.getItem(DK)||'null')}catch(e){}
 const live=P.status==='published'&&!isFuture(P.published_at),sched=P.status==='published'&&isFuture(P.published_at);
 const pg=shell(id?'list':'new',id?'EDIT ARTICLE':'NEW ARTICLE',`<button class="b" id="pv">PREVIEW</button><button class="b" id="sd">SAVE DRAFT</button><button class="b" id="sc">SCHEDULE</button><button class="b r" id="pb">${live?'UPDATE':'PUBLISH NOW'}</button>`);
 pg.innerHTML=`${saved&&saved.t>Date.parse((P.updated_at||'1970-01-01').replace(' ','T')+'Z')?`<div class="pn" style="margin-bottom:14px;border-color:#e8c36a">You have unsaved changes from ${new Date(saved.t).toLocaleString()}. <button class="b" id="rs" style="margin-left:10px">RESTORE</button></div>`:''}
 <div class="ed"><div><textarea class="ttl" id="tt" rows="1" placeholder="HEADLINE">${esc(P.title)}</textarea><textarea class="dk" id="dk" rows="2" placeholder="Excerpt: fills itself from your first paragraph until you edit it">${esc(P.dek)}</textarea>
 <div class="tb" id="tb"><button data-c="h2" title="Heading">H2</button><button data-c="h3" title="Small heading">H3</button><button data-c="p" title="Paragraph">¶</button><span class="sp"></span><button data-c="bold" title="Bold"><b>B</b></button><button data-c="italic" title="Italic"><i>I</i></button><button data-c="link" title="Link to any web address">LINK</button><button data-c="rel" title="Highlight words, then link them to another RAPMAG story">RAPMAG STORY</button><button data-c="find" title="Highlight words, then search the web for a source">FIND SOURCE</button><span class="sp"></span><button data-c="blockquote" title="Quote">❝</button><button data-c="ul" title="List">• LIST</button><button data-c="ol" title="Numbered">1. LIST</button><span class="sp"></span><button data-c="img" title="Insert image">+ IMAGE</button><button data-c="lib" title="From media library">MEDIA</button><button data-c="vid" title="YouTube or Vimeo video">VIDEO</button><button data-c="song" title="New Music Friday: add a song to the chart (ranked in the order you add them)">+ SONG</button><span class="sp"></span><button data-c="clear" title="Clear formatting">CLEAR</button></div>
 <div class="body edit" id="bd" contenteditable="true">${abs(P.body)}</div>
 <div class="tool"><div class="toolh"><button class="b" id="fl">Find Link for Highlighted Text</button><span>Highlight text in the article, then search.</span></div><div id="flr"></div></div>
 <div class="tool"><div class="toolh"><button class="b" id="fr">Find Related RAPMAG Story</button><span>Highlight article text first.</span></div><div id="frr"></div></div></div>
 <aside><div class="pn"><label>COVER IMAGE</label><div class="cov" id="cv">${P.cover?`<img src="${esc(img(P.cover))}">`:'CLICK OR DROP AN IMAGE'}</div><div style="display:flex;gap:6px;margin-top:6px"><button class="b" id="cvl" style="flex:1">FROM MEDIA</button><button class="b" id="cvx">REMOVE</button></div>
 <label>IMAGE ALT TEXT (what the picture shows; auto-filled if left empty)</label><input type="text" id="alt" value="${esc(P.cover_alt||'')}" placeholder="e.g. Rapper performing on stage in New York">
 <label>SECTION</label><select id="ct">${CATS.map(c=>`<option value="${c.slug}"${P.category===c.slug?' selected':''}>${esc(c.name)}${c.visible?'':' (hidden)'}</option>`).join('')}<option value="page"${P.category==='page'?' selected':''}>Page (About, Contact…)</option></select>
 <label>AUTHOR</label><select id="au">${AUTHORS.map(a=>`<option value="${a.id}"${+P.author_id===a.id?' selected':''}>${esc(a.name)}${a.active?'':' (off)'}</option>`).join('')}</select>
 <label>TAGS (fill themselves until you edit them)</label><input type="text" id="tg" value="${esc(P.tags)}" placeholder="made from the names and topics in your story"><div class="sug" id="sug"></div>
 <label>LINK (slug)</label><input type="text" id="sl" value="${esc(P.slug)}" placeholder="made from the headline">
 <label class="chk"><input type="checkbox" id="ft"${P.featured?' checked':''}> COVER STORY (leads the home page)</label>
 <label>ARTICLE AUDIO (optional)</label><div id="aud">${P.audio?`<audio controls src="${esc(img(P.audio))}" style="width:100%"></audio>`:''}</div><div style="display:flex;gap:6px;margin-top:6px"><button class="b" id="aup" style="flex:1">${P.audio?'REPLACE AUDIO':'UPLOAD AUDIO'}</button>${P.audio?'<button class="b" id="aux">REMOVE</button>':''}</div>
 <label>SCHEDULE (date &amp; time)</label><input type="datetime-local" id="wh" value="${sched?localDT(P.published_at):''}"><div class="hint">Scheduled stories stay off the site until this time, then go live by themselves.</div>
 <div class="st" id="ms">${live?'Live on the site.':sched?'Scheduled: goes live '+new Date(P.published_at.replace(' ','T')+'Z').toLocaleString()+'.':'Draft: only you can see it.'}</div>
 ${id?`<div style="display:flex;gap:6px;margin-top:16px">${P.status==='published'?'<button class="b" id="up2" style="flex:1">UNPUBLISH</button>':''}<button class="b d" id="dl" style="flex:1">DELETE</button></div>${live?`<a class="b" style="display:block;text-align:center;margin-top:6px" target="_blank" href="${esc(P.category==='page'?SITE+(PRETTY?'page/'+P.slug+'/':'page.html?s='+P.slug):artUrl(P.slug))}">OPEN LIVE ARTICLE ↗</a>`:''}`:''}</div>
 <div class="pn seo"><div class="seoh"><b>SEO READINESS</b><span id="sco"></span></div><div id="chk"></div><div class="hint">Guidance only. It does not block publishing.</div></div></aside></div>`;
 const bd=$('#bd'),ms=t=>$('#ms').textContent=t,grow=()=>{const t=$('#tt');t.style.height='auto';t.style.height=t.scrollHeight+'px'};$('#tt').addEventListener('input',grow);$('#tt').addEventListener('keydown',e=>{if(e.key==='Enter')e.preventDefault()});setTimeout(grow);
 const val=()=>({id:P.id,title:$('#tt').value.trim(),dek:$('#dk').value.trim(),body:tidy(bd.innerHTML),cover:P.cover,cover_alt:$('#alt').value.trim()||(P.cover&&$('#tt').value.trim()?'Photo for: '+$('#tt').value.trim():''),category:$('#ct').value,tags:$('#tg').value,author_id:+$('#au').value||'',slug:$('#sl').value.trim(),featured:$('#ft').checked,audio:P.audio||''});
 /* excerpt fills itself from the first paragraph until it is edited by hand */
 /* tags fill themselves from the names and topics in the story until edited by hand; suggestions can be clicked in */
 let tagManual=!!P.tags;$('#tg').addEventListener('input',()=>tagManual=!!$('#tg').value.trim());
 const autoTags=()=>{const L=suggestTags($('#tt').value,bd.innerText,(CATS.find(c=>c.slug===$('#ct').value)||{}).name);if(!tagManual)$('#tg').value=L.slice(0,6).join(', ');const have=$('#tg').value.toLowerCase().split(',').map(x=>x.trim());
  $('#sug').innerHTML=L.filter(t=>!have.includes(t.toLowerCase())).slice(0,8).map(t=>`<button type="button" data-t="${esc(t)}">+ ${esc(t)}</button>`).join('')};
 $('#sug').onclick=e=>{const b=e.target.closest('[data-t]');if(!b)return;const v=$('#tg').value.trim();$('#tg').value=(v?v+', ':'')+b.dataset.t;tagManual=true;autoTags();auto()};
 let dekManual=!!P.dek;$('#dk').addEventListener('input',()=>dekManual=!!$('#dk').value.trim());
 const autoDek=()=>{if(dekManual)return;const t=(bd.querySelector('p')||{}).textContent||'';$('#dk').value=t.trim().replace(/\s+/g,' ').slice(0,220).replace(/\s+\S*$/,t.length>220?'…':'')};
 const seo=()=>{const v=val();let n=0;$('#chk').innerHTML=CHECKS.map(([t,h,f])=>{const ok=f(v);n+=ok;return`<div class="ck ${ok?'ok':''}"><i>${ok?'✓':'!'}</i><span><b>${t}</b><small>${h}</small></span></div>`}).join('');$('#sco').textContent=n+'/'+CHECKS.length;$('#sco').className=n>=8?'good':n>=5?'mid':'low'};
 let tm;const auto=()=>{autoDek();autoTags();seo();clearTimeout(tm);tm=setTimeout(()=>{try{localStorage.setItem(DK,JSON.stringify({t:Date.now(),v:val()}))}catch(e){}},800)};app.addEventListener('input',auto);app.addEventListener('change',auto);seo();autoTags();
 if($('#rs'))$('#rs').onclick=()=>{const v=saved.v;$('#tt').value=v.title;$('#dk').value=v.dek;bd.innerHTML=abs(v.body);P.cover=v.cover;$('#alt').value=v.cover_alt||'';$('#ct').value=v.category;$('#tg').value=v.tags;if(v.author_id)$('#au').value=v.author_id;$('#sl').value=v.slug;$('#ft').checked=v.featured;P.audio=v.audio||'';setCover(v.cover);$('#rs').parentNode.remove();seo()};
 const save=async(status,when)=>{const v=val();if(!v.title){ms('Add a headline first.');$('#tt').focus();return}ms('Saving…');try{const d=await api('/api/admin/posts',{method:'POST',body:JSON.stringify({...v,status,publish_at:when||null})});try{localStorage.removeItem(DK)}catch(e){}ms(status!=='published'?'Draft saved.':when?'Scheduled.':'Published. It is live now.');edit(d.post.id)}catch(e){ms(e.message)}};
 $('#sd').onclick=()=>save('draft');$('#pb').onclick=()=>save('published',live?null:new Date().toISOString());
 $('#sc').onclick=()=>{const w=$('#wh').value;if(!w){ms('Pick a date and time in SCHEDULE first.');$('#wh').focus();return}const d=new Date(w);if(d<=new Date()){ms('Pick a time in the future.');return}save('published',d.toISOString())};
 if($('#up2'))$('#up2').onclick=()=>save('draft');
 if($('#dl'))$('#dl').onclick=async()=>{if(!await confirmBox('Delete this article for good?\n\nIts cover, audio and story images are deleted from storage too, unless another article, author or the site settings still use them.'))return;ms('Deleting…');const r=await api('/api/admin/posts/'+id,{method:'DELETE'});try{localStorage.removeItem(DK)}catch(e){}await list();const n=document.createElement('div');n.className='pn';n.style.cssText='margin-bottom:14px;border-color:#137a3a';n.textContent='Article deleted. '+r.removed+' file(s) removed from storage'+(r.kept?', '+r.kept+' kept because something else still uses them.':'.');$('#pg').prepend(n)};
 /* cover + audio */
 const setCover=u=>{P.cover=u||'';$('#cv').innerHTML=u?`<img src="${esc(img(u))}">`:'CLICK OR DROP AN IMAGE';auto()};
 $('#cv').onclick=async()=>{const [f]=await pick('image/*',false);if(f)try{setCover((await upload(f)).url)}catch(e){ms(e.message)}};$('#cvx').onclick=()=>setCover('');$('#cvl').onclick=()=>library(u=>setCover(u));
 dropZone($('#cv'),async fs=>{try{setCover((await upload(fs[0])).url)}catch(e){ms(e.message)}});
 $('#aup').onclick=async()=>{const [f]=await pick('audio/*',false);if(!f)return;try{P.audio=(await upload(f)).url;$('#aud').innerHTML=`<audio controls src="${esc(img(P.audio))}" style="width:100%"></audio>`;ms('Audio added. Save to keep it.');auto()}catch(e){ms(e.message)}};
 if($('#aux'))$('#aux').onclick=()=>{P.audio='';$('#aud').innerHTML='';ms('Audio removed. Save to keep it.')};
 /* body toolbar */
 let range=null;bd.addEventListener('keyup',keep);bd.addEventListener('mouseup',keep);bd.addEventListener('blur',keep);function keep(){const s=getSelection();if(s.rangeCount&&bd.contains(s.anchorNode))range=s.getRangeAt(0).cloneRange()}
 const restore=()=>{bd.focus();if(range){const s=getSelection();s.removeAllRanges();s.addRange(range)}};
 const selText=()=>range?range.toString().trim():'';
 const insertFig=(u,alt)=>{restore();document.execCommand('insertHTML',false,`<figure><img src="${esc(u)}" alt="${esc(alt||'')}"><figcaption contenteditable="true"></figcaption></figure><p><br></p>`);auto()};
 $('#tb').onmousedown=e=>{if(e.target.closest('button'))e.preventDefault()};
 $('#tb').onclick=async e=>{const b=e.target.closest('button');if(!b)return;const c=b.dataset.c;restore();
  if(['h2','h3','p','blockquote'].includes(c))document.execCommand('formatBlock',false,c);
  else if(c==='bold'||c==='italic')document.execCommand(c);
  else if(c==='ul')document.execCommand('insertUnorderedList');else if(c==='ol')document.execCommand('insertOrderedList');
  else if(c==='link'){const u=prompt('Link address (https://…)');if(u&&/^https?:\/\//.test(u))document.execCommand('createLink',false,u)}
  else if(c==='rel'){$('#fr').click();return}
  else if(c==='find'){$('#fl').click();return}
  else if(c==='clear'){document.execCommand('removeFormat');document.execCommand('formatBlock',false,'p')}
  else if(c==='img'){const fs=await pick();for(const f of fs)try{const d=await upload(f);insertFig(img(d.url),f.name.replace(/\.[^.]+$/,''))}catch(er){ms(er.message)}}
  else if(c==='lib')library(u=>insertFig(img(u)));
  else if(c==='song'){songForm(h=>{restore();document.execCommand('insertHTML',false,h+'<p><br></p>');auto()});return}
  else if(c==='vid'){const u=prompt('YouTube or Vimeo link')||'',y=u.match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/),v=u.match(/vimeo\.com\/(?:video\/)?(\d+)/);const src=y?'https://www.youtube-nocookie.com/embed/'+y[1]:v?'https://player.vimeo.com/video/'+v[1]:'';if(src)document.execCommand('insertHTML',false,`<iframe src="${src}" allowfullscreen></iframe><p><br></p>`);else if(u)ms('That is not a YouTube or Vimeo link.')}
  auto()};
 bd.addEventListener('paste',async e=>{const fs=[...(e.clipboardData||{}).files||[]].filter(f=>/^image\//.test(f.type));if(fs.length){e.preventDefault();keep();for(const f of fs)try{insertFig(img((await upload(f)).url))}catch(er){ms(er.message)}}
  else{const h=e.clipboardData.getData('text/html');if(h){e.preventDefault();document.execCommand('insertHTML',false,tidy(h))}}});
 dropZone(bd,async fs=>{for(const f of fs)try{insertFig(img((await upload(f)).url),f.name.replace(/\.[^.]+$/,''))}catch(er){ms(er.message)}});
 /* find link / related story panels: results appear under the editor, click one to link the highlighted words */
 const linkTo=(u,box)=>{restore();if(!selText()){ms('Highlight the words to link first.');return}document.execCommand('createLink',false,u);box.innerHTML='<div class="st">Linked.</div>';auto()};
 const res=(box,list,empty)=>{box.innerHTML=list.length?list.map((r,i)=>`<button class="hit" data-i="${i}"><b>${esc(r.title)}</b><small>${esc(r.site)}</small>${r.snippet?`<span>${esc(r.snippet)}</span>`:''}</button>`).join(''):`<div class="st">${empty}</div>`;box.onclick=e=>{const h=e.target.closest('.hit');if(h)linkTo(list[+h.dataset.i].url,box)}};
 $('#fl').onmousedown=$('#fr').onmousedown=e=>e.preventDefault();
 $('#fl').onclick=async()=>{const t=selText(),box=$('#flr');if(!t){box.innerHTML='<div class="st">Highlight some words in the article first.</div>';return}box.innerHTML='<div class="st">Searching the web for “'+esc(t)+'”…</div>';
  try{const d=await api('/api/admin/link-search?q='+encodeURIComponent(t));res(box,d.results.map(r=>({...r,site:(r.url.match(/^https?:\/\/(?:www\.)?([^/]+)/)||[])[1]||''})),'No results. Try other words.');box.insertAdjacentHTML('afterbegin','<h4>Results for “'+esc(t)+'”</h4>')}
  catch(e){box.innerHTML=/not connected/.test(e.message)?'<div class="st">Web search is not connected yet. Add a Tavily or Brave Search key on the Cloudflare API (TAVILY_API_KEY or BRAVE_API_KEY).</div>':'<div class="st">'+esc(e.message)+'</div>'}};
 $('#fr').onclick=async()=>{const t=selText(),box=$('#frr');if(!t){box.innerHTML='<div class="st">Highlight some words in the article first.</div>';return}box.innerHTML='<div class="st">Looking through RAPMAG stories…</div>';
  const d=await api('/api/admin/related?q='+encodeURIComponent(t));res(box,d.posts.filter(p=>p.slug!==P.slug).map(p=>({title:p.title,url:artUrl(p.slug),site:catName(p.category)+' · '+String(p.published_at).slice(0,10)})),'No RAPMAG stories match. Try other words.');box.insertAdjacentHTML('afterbegin','<h4>RAPMAG stories for “'+esc(t)+'”</h4>')};
 $('#pv').onclick=()=>preview(val())}
async function related(q,onPick){const m=modal(`<h1 style="font-size:30px">LINK TO A RAPMAG STORY</h1>`,`<input type="text" id="rq" value="${esc(q)}"><div class="lst" id="rl" style="margin-top:12px"></div>`);
 const run=async()=>{const d=await api('/api/admin/related?q='+encodeURIComponent(m.querySelector('#rq').value));m.querySelector('#rl').innerHTML=d.posts.map(p=>`<div class="row" style="grid-template-columns:1fr auto" data-s="${esc(p.slug)}"><div><b>${esc(p.title)}</b><small>${esc(catName(p.category))} · ${String(p.published_at).slice(0,10)}</small></div><span class="pill published">USE</span></div>`).join('')||'<div class="st">No matching stories. Try other words.</div>'};
 m.querySelector('#rq').oninput=()=>{clearTimeout(m.t);m.t=setTimeout(run,300)};m.querySelector('#rl').onclick=e=>{const r=e.target.closest('[data-s]');if(r){onPick(artUrl(r.dataset.s));m.remove()}};run()}
function modal(head,body){const m=document.createElement('div');m.className='modal';m.innerHTML=`<div class="pn"><div class="ah" style="margin:0 0 10px">${head}<button class="b" data-x>CLOSE</button></div>${body}</div>`;document.body.appendChild(m);m.onclick=e=>{if(e.target===m||e.target.closest('[data-x]'))m.remove()};return m}
/* keep only clean story markup; store image links as /img/... so they follow the API host */
/* names and topics: repeated capitalised phrases (people, places, brands) plus key words of the headline */
const STOP=new Set('the a an and or but of in on at to for from with by as is are was were be been it its this that these those he she they we you i his her their our your not no new after before into than then now once instead starting beginning however meanwhile according following earlier later still even only many some several both each another other there here if so because although though since until despite fans just also more most very will would can could has have had do does did says said how why what who when where which while amid during first last year years week day today tonight report reportedly'.split(' '));
const MONTH=/^(January|February|March|April|May|June|July|August|September|October|November|December|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)$/;
function suggestTags(title,text,cat){
 /* names come from the story text (headlines are Title Case, so every word looks like a name); a name found in the headline ranks first */
 const body=String(text||'').replace(/[“”"‘’]/g,' '),tl=String(title||'').toLowerCase(),score={};
 for(const m of body.matchAll(/\b([A-Z][\w'&-]*(?:[ \t]+(?:of|the|de|&|[A-Z][\w'&-]*|\d+)){0,3})/g)){let w=m[1].replace(/'s$/,'').replace(/[&-]+$/,'').trim().split(/[ \t]+/);
  while(w.length&&STOP.has(w[0].toLowerCase()))w.shift();while(w.length&&STOP.has(w[w.length-1].toLowerCase()))w.pop();const t=w.join(' ');
  if(t.length<3||/^\d+$/.test(t)||MONTH.test(w[0])||/ing$/i.test(w[0])||/^(One|Two|Three|Creators|Fans|Users|Viewers)$/.test(t))continue;score[t]=(score[t]||0)+1+(tl.includes(t.toLowerCase())?3:0)+(w.length>1?1:0)}
 /* headline-only names (e.g. a brand never repeated in the text): uppercase tokens like P-Star or UA, and the first words before ':' */
 for(const m of String(title||'').matchAll(/\b([A-Z][a-z]*-[A-Z][\w-]*|[A-Z]{2,}\d*)\b/g))if(!score[m[1]])score[m[1]]=2;
 const L=Object.entries(score).filter(([t,n])=>n>=2).sort((a,b)=>b[1]-a[1]).map(x=>x[0]).filter((t,i,a)=>!a.some(o=>o!==t&&o.toLowerCase().split(' ').includes(t.toLowerCase())));
 if(cat&&!L.some(t=>t.toLowerCase()===cat.toLowerCase()))L.push(cat);return L}
function tidy(h){const d=document.createElement('div');d.innerHTML=h;d.querySelectorAll('script,style,meta,link,form,input,button').forEach(n=>n.remove());
 d.querySelectorAll('*').forEach(n=>{[...n.attributes].forEach(a=>{const k=a.name;if(!(['href','src','alt','allowfullscreen'].includes(k)))n.removeAttribute(k)});if(n.tagName==='A')n.setAttribute('target','_blank'),n.setAttribute('rel','noopener')});
 d.querySelectorAll('img').forEach(i=>{const s=i.getAttribute('src')||'';if(s.startsWith(API+'/img/'))i.setAttribute('src',s.slice(API.length))});
 d.querySelectorAll('figcaption').forEach(f=>{if(!f.textContent.trim())f.remove()});
 return d.innerHTML.replace(/<p><br><\/p>\s*$/,'').trim()}
function abs(h){return String(h||'').replace(/(<img[^>]*src=")(\/img\/[^"]+)"/g,(m,a,b)=>a+API+b+'"')}

/* ---------- authors ---------- */
async function authors(sel){await loadMeta();const pg=shell('authors','AUTHORS','<button class="b r" id="na">+ NEW AUTHOR</button>');
 const cur=AUTHORS.find(a=>a.id===sel)||(sel===0?{id:0,name:'',active:1}:AUTHORS[0])||{id:0,name:'',active:1};
 pg.innerHTML=`<div class="ed"><div class="pn">${AUTHORS.map(a=>`<div class="row" data-a="${a.id}" style="grid-template-columns:56px 1fr auto${a.id===cur.id?';border-color:var(--ink)':''}"><div class="t" style="width:56px;height:56px;border-radius:50%">${a.photo?`<img src="${esc(img(a.photo))}">`:''}</div><div><b>${esc(a.name)}${a.verified?' ✔':''}</b><small>${esc(a.role||'')} · ${a.n} article(s)</small></div><span class="pill ${a.active?'published':'draft'}">${a.active?'ACTIVE':'OFF'}</span></div>`).join('')}</div>
 <div class="pn"><b style="font:400 24px Anton,sans-serif">${cur.id?'EDIT AUTHOR':'NEW AUTHOR'}</b><div class="hint">Changes update the public author page and the byline on all of this author's stories.</div>
 <label>PHOTO</label><div class="cov" id="ph" style="aspect-ratio:1;width:140px;border-radius:50%">${cur.photo?`<img src="${esc(img(cur.photo))}">`:'UPLOAD'}</div>
 ${[['name','DISPLAY NAME'],['role','ROLE / TITLE'],['beat','REPORTING BEAT'],['location','LOCATION'],['website','WEBSITE'],['instagram','INSTAGRAM'],['x','X / TWITTER'],['facebook','FACEBOOK'],['youtube','YOUTUBE']].map(([k,t])=>`<label>${t}</label><input type="text" data-f="${k}" value="${esc(cur[k]||'')}">`).join('')}
 <label>BIO</label><textarea data-f="bio" rows="5">${esc(cur.bio||'')}</textarea>
 <label class="chk"><input type="checkbox" id="vf"${cur.verified?' checked':''}> VERIFIED CHECK MARK</label><label class="chk"><input type="checkbox" id="ac"${cur.active!==0?' checked':''}> ACTIVE (shown on the site)</label>
 <div style="display:flex;gap:6px;margin-top:16px"><button class="b r" id="sv" style="flex:1">SAVE AUTHOR</button>${cur.id?'<button class="b d" id="dla">DELETE</button>':''}</div><div class="st" id="ms"></div></div></div>`;
 let photo=cur.photo||'';$('#na').onclick=()=>authors(0);pg.querySelectorAll('[data-a]').forEach(r=>r.onclick=()=>authors(+r.dataset.a));
 $('#ph').onclick=async()=>{const [f]=await pick('image/*',false);if(f){photo=(await upload(f)).url;$('#ph').innerHTML=`<img src="${esc(img(photo))}">`}};
 $('#sv').onclick=async()=>{const b={id:cur.id,photo,verified:$('#vf').checked,active:$('#ac').checked};pg.querySelectorAll('[data-f]').forEach(i=>b[i.dataset.f]=i.value.trim());try{await api('/api/admin/authors',{method:'POST',body:JSON.stringify(b)});await loadMeta();authors(cur.id||(AUTHORS[AUTHORS.length-1]||{}).id)}catch(e){$('#ms').textContent=e.message}};
 if($('#dla'))$('#dla').onclick=async()=>{if(!await confirmBox('Delete this author?'))return;try{await api('/api/admin/authors/'+cur.id,{method:'DELETE'});authors()}catch(e){$('#ms').textContent=e.message}}}

/* ---------- categories ---------- */
async function cats(){await loadMeta();const pg=shell('cats','CATEGORIES');
 pg.innerHTML=`<div class="pn" style="max-width:820px"><div style="display:flex;gap:8px"><input type="text" id="nc" placeholder="New category name"><button class="b r" id="ad">ADD CATEGORY</button></div><div class="lst" style="margin-top:16px">${CATS.map(c=>`<div class="row" style="grid-template-columns:1fr 70px auto auto auto;cursor:default" data-c="${esc(c.slug)}"><div><input type="text" data-n value="${esc(c.name)}"><small>/${esc(c.slug)} · ${c.n} article(s)</small></div><input type="text" data-o value="${c.sort}" title="Menu order"><label class="chk" style="margin:0"><input type="checkbox" data-v${c.visible?' checked':''}> VISIBLE</label><button class="b" data-s>SAVE</button><button class="b d" data-d>DELETE</button></div>`).join('')}</div><div class="st" id="ms"></div><div class="hint">Renaming keeps the same link. Hidden categories disappear from the menu but keep their articles.</div></div>`;
 const ms=t=>$('#ms').textContent=t;
 $('#ad').onclick=async()=>{try{await api('/api/admin/categories',{method:'POST',body:JSON.stringify({name:$('#nc').value})});cats()}catch(e){ms(e.message)}};
 pg.querySelectorAll('[data-c]').forEach(r=>{const s=r.dataset.c;r.querySelector('[data-s]').onclick=async()=>{try{await api('/api/admin/categories',{method:'POST',body:JSON.stringify({old:s,name:r.querySelector('[data-n]').value,visible:r.querySelector('[data-v]').checked,sort:r.querySelector('[data-o]').value})});ms('Saved.');loadMeta()}catch(e){ms(e.message)}};
  r.querySelector('[data-d]').onclick=async()=>{if(!await confirmBox('Delete this category?'))return;try{await api('/api/admin/categories/'+s,{method:'DELETE'});cats()}catch(e){ms(e.message)}}})}

/* ---------- social distribution ---------- */
async function dist(){const pg=shell('dist','SOCIAL DISTRIBUTION');const d=await api('/api/admin/posts'),livePosts=d.posts.filter(p=>p.status==='published'&&!isFuture(p.published_at)&&p.category!=='page');
 pg.innerHTML=`<div class="ed"><div class="pn"><b style="font:400 24px Anton,sans-serif">POST AN ARTICLE</b><div class="hint">Send any live article to your Facebook Page and/or X. Automatic posting is switched on in SETTINGS.</div>
 <label>LIVE ARTICLE</label><select id="pa">${livePosts.map(p=>`<option value="${p.id}">${esc(p.title)}${p.social_fb&&p.social_fb!=='failed'?' · FB ✓':''}${p.social_x&&p.social_x!=='failed'?' · X ✓':''}</option>`).join('')||'<option value="">No live articles yet</option>'}</select>
 <div style="display:flex;gap:6px;margin-top:14px"><button class="b" data-t="fb">POST TO FACEBOOK</button><button class="b" data-t="x">POST TO X</button><button class="b r" data-t="both">POST TO BOTH</button></div><div class="st" id="pr"></div></div>
 <div class="pn"><b style="font:400 24px Anton,sans-serif">CONNECTIONS</b><div id="cn" class="st">Checking…</div><button class="b" id="tc" style="margin-top:10px">TEST AGAIN</button>
 <div class="hint" style="margin-top:16px">To connect, these keys are added as secrets on the Cloudflare API (never in the site code):<br><b>Facebook Page:</b> FB_PAGE_ID, FB_PAGE_TOKEN (a long-lived Page access token).<br><b>X:</b> X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_SECRET (an X developer app with write access; X charges for posting through its API).</div></div></div>`;
 const test=async()=>{$('#cn').textContent='Checking…';const r=await api('/api/admin/social/test');$('#cn').innerHTML=`Facebook Page: <b>${esc(r.facebook)}</b><br>X: <b>${esc(r.x)}</b><br>Instant Google pages (GitHub): <b>${esc(r.instant)}</b>`};$('#tc').onclick=test;test();
 pg.querySelectorAll('[data-t]').forEach(b=>b.onclick=async()=>{const id=+$('#pa').value;if(!id)return;const t=b.dataset.t;$('#pr').textContent='Posting…';try{const r=await api('/api/admin/social/post',{method:'POST',body:JSON.stringify({id,fb:t!=='x',x:t!=='fb'})});$('#pr').innerHTML=Object.entries(r.result).map(([k,v])=>`${k==='x'?'X':'Facebook'}: <b>${esc(v)}</b>`).join('<br>')}catch(e){$('#pr').textContent=e.message}})}

/* ---------- settings ---------- */
async function settings(){let S={};try{S=(await (await fetch(API+'/api/settings')).json()).settings||{}}catch(e){}
 const pg=shell('settings','SITE SETTINGS','<button class="b r" id="sv">SAVE</button>');
 const F=[['tagline','FOOTER TAGLINE','Music, entertainment, culture and breaking stories.'],['promo_label','BANNER LABEL','Featured partner'],['promo_link','BANNER LINK','https://www.youtube.com/@TheRapMag'],['youtube','YOUTUBE LINK','https://www.youtube.com/@…'],['instagram','INSTAGRAM LINK','https://instagram.com/…'],['x','X / TWITTER LINK','https://x.com/…'],['facebook','FACEBOOK LINK','https://facebook.com/…'],['site_url','OFFICIAL WEBSITE ADDRESS (used for Google, sitemaps and social links)','https://mezdefjam2014.github.io/rapmag'],['adsense_id','GOOGLE ADSENSE PUBLISHER ID','ca-pub-0000000000000000']];
 const pic=(k,t,h)=>`<label>${t}</label><div class="cov" data-k="${k}" style="aspect-ratio:${h}">${S[k]?`<img src="${esc(img(S[k]))}" style="object-fit:contain;background:#000">`:'CLICK OR DROP AN IMAGE'}</div><button class="b" data-x="${k}" style="margin-top:6px">REMOVE</button>`;
 const tg=(k,t)=>`<label class="chk"><input type="checkbox" data-c="${k}"${S[k]==='1'?' checked':''}> ${t}</label>`;
 pg.innerHTML=`<div class="ed"><div class="pn">${pic('logo','LOGO (big in the black header; empty = the RAPMAG logo)','4/1')}${pic('promo_image','FEATURED PARTNER BANNER (top of the home page)','6/1')}
 <b style="display:block;margin-top:24px;font:400 22px Anton,sans-serif">SOCIAL AUTO-PUBLISH</b><div class="hint">New articles are posted once when they go live (scheduled ones too). Needs the connections on the DISTRIBUTION screen.</div>
 ${tg('auto_fb','AUTO-POST NEW ARTICLES TO FACEBOOK')}${tg('auto_x','AUTO-POST NEW ARTICLES TO X')}${tg('social_excerpt','INCLUDE THE EXCERPT ON FACEBOOK')}${tg('social_category','INCLUDE THE CATEGORY AS A HASHTAG')}
 <label>SOCIAL HASHTAG (word only, # is added)</label><input type="text" data-f="social_hashtag" value="${esc(S.social_hashtag||'')}" placeholder="RAPMAG"></div>
 <div class="pn">${F.map(([k,t,ph])=>`<label>${t}</label><input type="text" data-f="${k}" value="${esc(S[k]||'')}" placeholder="${esc(ph)}">`).join('')}<div class="hint">AdSense: paste only your ca-pub-… ID. The site loads the AdSense script and writes ads.txt on the next build. Google only accepts ads.txt at the root of your own domain, so ads approval needs a custom domain.</div><div class="st" id="ms"></div></div></div>`;
 const setPic=(k,u)=>{S[k]=u||'';const el=pg.querySelector('.cov[data-k="'+k+'"]');el.innerHTML=u?`<img src="${esc(img(u))}" style="object-fit:contain;background:#000">`:'CLICK OR DROP AN IMAGE'};
 pg.querySelectorAll('.cov[data-k]').forEach(el=>{const k=el.dataset.k;el.onclick=async()=>{const [f]=await pick('image/*',false);if(f)setPic(k,(await upload(f)).url)};dropZone(el,async fs=>setPic(k,(await upload(fs[0])).url))});
 pg.querySelectorAll('[data-x]').forEach(b=>b.onclick=()=>setPic(b.dataset.x,''));
 $('#sv').onclick=async()=>{const b={logo:S.logo||'',promo_image:S.promo_image||''};pg.querySelectorAll('[data-f]').forEach(i=>b[i.dataset.f]=i.value.trim());pg.querySelectorAll('[data-c]').forEach(i=>b[i.dataset.c]=i.checked?'1':'');
  if(b.adsense_id&&!/^ca-pub-\d{10,20}$/.test(b.adsense_id)){$('#ms').textContent='The AdSense ID should look like ca-pub-1234567890123456.';return}$('#ms').textContent='Saving…';try{await api('/api/admin/settings',{method:'POST',body:JSON.stringify(b)});$('#ms').textContent='Saved. The site updates within a minute (Google pages within the hour).'}catch(e){$('#ms').textContent=e.message}}}

/* ---------- media ---------- */
function dropZone(el,fn){el.addEventListener('dragover',e=>{e.preventDefault();el.classList.add('drop')});el.addEventListener('dragleave',()=>el.classList.remove('drop'));el.addEventListener('drop',e=>{e.preventDefault();el.classList.remove('drop');const fs=[...e.dataTransfer.files].filter(f=>/^image\//.test(f.type));if(fs.length)fn(fs)})}
async function library(onPick){const m=modal(`<h1 style="font-size:30px">MEDIA</h1><button class="b r" id="mu">UPLOAD</button>`,`<div class="st">${onPick?'Click an image to use it.':'Every image you uploaded, stored in Cloudflare.'}</div><div class="lib" id="ml"><div class="st">Loading…</div></div>`);
 const load=async()=>{const d=await api('/api/admin/images');m.querySelector('#ml').innerHTML=d.images.map(i=>`<div data-u="${esc(i.url)}" title="${esc(i.key)}"><img src="${esc(img(i.url))}" loading="lazy"><button data-del="${esc(i.key)}">DELETE</button></div>`).join('')||'<div class="st">No images yet.</div>'};
 m.querySelector('#mu').onclick=async()=>{for(const f of await pick())await upload(f).catch(e=>alert(e.message));load()};
 m.querySelector('#ml').onclick=async e=>{const del=e.target.closest('[data-del]');if(del){e.stopPropagation();const k=del.dataset.del,u=(await api('/api/admin/images/usage?key='+encodeURIComponent(k))).used;if(await confirmBox(u.length?'This image is still used by:\n\n'+u.join('\n')+'\n\nDelete it from storage anyway? Those places will show a broken image.':'Delete this image from storage for good?')){await api('/api/admin/images/'+encodeURIComponent(k),{method:'DELETE'});load()}return}const t=e.target.closest('[data-u]');if(t&&onPick){onPick(t.dataset.u);m.remove()}};load()}
function preview(v){const w=window.open('','_blank');if(!w)return;const b=v.body.replace(/(<img[^>]*src=")(\/img\/[^"]+)"/g,(m,a,c)=>a+API+c+'"'),au=(AUTHORS.find(a=>a.id===+v.author_id)||{}).name||'';
 w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Preview: ${esc(v.title)}</title><base href="${SITE}"><link rel="stylesheet" href="style.css?v=24"></head><body><div class="bar" style="display:block!important">PREVIEW · NOT PUBLISHED YET</div><article class="wrap story"><header class="st-head"><span class="c">${esc(catName(v.category))}</span><h1>${esc(v.title)}</h1><p class="dek">${esc(v.dek)}</p><div class="meta">By ${esc(au)}</div></header>${v.cover?`<figure class="st-cover"><img src="${esc(img(v.cover))}" alt="${esc(v.cover_alt)}"></figure>`:''}<div class="st-cols"><div>${v.audio?`<div class="listen"><span>LISTEN TO THIS STORY</span><audio controls src="${esc(img(v.audio))}"></audio></div>`:''}<div class="body">${b}</div></div></div></article></body></html>`);w.document.close()}
/* every tab has its own address (admin.html#indie, #edit-12 ...), so reloading stays on the same tab */
function route(){const h=location.hash.slice(1),m=h.match(/^edit-(\d+)$/);if(m)return edit(+m[1]);if(h==='new')return edit(null);
 return ({authors,cats,media:()=>library(),indie,dist,settings}[h]||list)()}
window.onpopstate=()=>{if(TOKEN)route()};
TOKEN?loadMeta().then(route).catch(()=>login()):login();

/* New Music Friday chart: one song row (YouTube link, title, artist, chart move). Rank = order in the story; cover comes from YouTube. */
function songForm(done){let aud='';const f=(id,l,ph)=>`<label>${l}</label><input type="text" id="${id}" placeholder="${ph}">`;
 const m=modal(`<h1 style="font-size:30px">ADD SONG</h1>`,`<div style="min-width:min(520px,80vw)"><div style="display:grid;grid-template-columns:120px 1fr;gap:16px;align-items:end"><div id="scv" style="aspect-ratio:1;background:#111;color:#777;display:grid;place-items:center;font:700 10px Inter,sans-serif;letter-spacing:.14em;background-size:cover;background-position:center">NO VIDEO</div><div>${f('sy','YouTube link (for the cover image)','https://youtu.be/…')}</div></div>
 <label>Song audio (MP3) — plays with no video</label><div style="display:flex;gap:10px;align-items:center"><button class="b" id="sau">UPLOAD AUDIO</button><span class="st" id="sas" style="margin:0">No audio: PLAY will open the YouTube player instead.</span></div>
 ${f('st2','Song title','e.g. Pushin P')}${f('sa','Artist','e.g. Gunna feat. Future')}<label>Chart move</label><select id="sm"><option value="new">NEW</option><option value="up">▲ UP</option><option value="down">▼ DOWN</option><option value="same">— SAME</option><option value="re">RE-ENTRY</option></select>
 <div class="st" id="sms">Songs are ranked in the order you add them: first song = #1. Only upload audio you have the rights to post (artist or label promo copies).</div><button class="b r" id="sok" style="margin-top:10px">ADD TO CHART</button></div>`);
 const q=s=>m.querySelector(s),vid=()=>{const x=q('#sy').value.match(/(?:youtu\.be\/|v=|shorts\/|embed\/|live\/)([\w-]{11})/);return x?x[1]:''};
 q('#sy').oninput=()=>{const v=vid();q('#scv').style.backgroundImage=v?`url(https://i.ytimg.com/vi/${v}/hqdefault.jpg)`:'';q('#scv').textContent=v?'':'NO VIDEO'};
 q('#sau').onclick=async()=>{const [fl]=await pick('audio/*',false);if(!fl)return;q('#sas').textContent='Uploading…';try{aud=(await upload(fl)).url;q('#sas').textContent='Audio added: '+fl.name}catch(e){q('#sas').textContent=e.message}};
 q('#sok').onclick=()=>{const v=vid(),t=q('#st2').value.trim(),a=q('#sa').value.trim(),mv=q('#sm').value;
  if(!v&&!aud){q('#sms').textContent='Add a YouTube link or upload the song audio.';return}if(!t||!a){q('#sms').textContent='Add the song title and the artist.';return}
  const lab={new:'NEW',up:'▲',down:'▼',same:'—',re:'RE'}[mv];
  done(`<div class="chart-row">${v?`<img src="https://i.ytimg.com/vi/${v}/hqdefault.jpg" alt="${esc(t+' by '+a)}">`:'<span class="cr-noimg"></span>'}<div class="cr-t"><h3>${esc(t)}</h3><p>${esc(a)}</p></div><span class="cr-m ${mv}">${lab}</span>${aud?`<a class="cr-a" href="${esc(img(aud))}">Audio</a>`:''}${v?`<a class="cr-y" href="https://www.youtube.com/watch?v=${v}" target="_blank" rel="noopener">YouTube</a>`:''}</div>`);m.remove()}}

/* ---------- Indie Charts: your songs, ranked by plays + the plays you add; lock a song to a spot; removing a song erases its files ---------- */
async function indie(){const pg=shell('indie','INDIE CHARTS','<button class="b" id="icadd">+ ADD SONGS</button><button class="b" id="icrst">NEW WEEK</button><button class="b r" id="icsv">SAVE</button>');pg.innerHTML='<div class="st">Loading…</div>';
 let d,dirty=0;const load=async()=>{d=await api('/api/admin/indie');d.songs=d.items.map(x=>({...x}));dirty=0;draw()};
 const earned=b=>b.got!=null?b.got:0,auto=x=>(x.boosts||[]).reduce((n,b)=>n+earned(b),0),N=v=>Number(v).toLocaleString(),
  left=ms=>{ms=Math.max(0,ms);const d=Math.floor(ms/864e5),h=Math.floor(ms%864e5/36e5),m=Math.ceil(ms%36e5/6e4);return d?d+'d '+h+'h':h?h+'h '+m+'m':m+'m'};
 const fromName=n=>{const b=n.replace(/\.[^.]+$/,'').replace(/^\d+\s*-\s*/,''),i=b.lastIndexOf(' - ');return i>0?{title:b.slice(0,i).trim(),artist:b.slice(i+3).trim()}:{title:b.trim(),artist:''}};
 const draw=()=>{const S=d.songs,opt=v=>'<option value="0">AUTO</option>'+Array.from({length:20},(_,i)=>`<option value="${i+1}"${+v===i+1?' selected':''}>LOCK #${i+1}</option>`).join('');
  pg.innerHTML=`<div class="st" style="margin-top:0">Songs rank by <b>plays</b> (one per visitor per song per day, after 10 seconds of listening) <b>+ the plays you add</b>. LOCK puts a song at a spot no matter the plays. The top 20 show on the site. REMOVE takes a song off and erases its files from storage when you SAVE. NEW WEEK starts the plays over and saves this week's ranks for the ▲▼ arrows.${dirty?' <b style="color:var(--red)">Unsaved changes. Click SAVE.</b>':''}</div><div class="st" id="icm"></div>
  ${S.length?S.map((x,i)=>`<div class="rp-row ic-row${i>=20?' off':''}" data-i="${i}"><b class="rp-n">${x.rank||'–'}</b>${x.cover?`<img src="${esc(img(x.cover))}" data-a="cover" title="Change cover">`:'<img src="gold-record.webp" data-a="cover" title="Gold record (default). Click to use your own cover." style="border-radius:50%;background:transparent">'}
   <div class="rp-t"><input type="text" data-f="title" value="${esc(x.title)}" placeholder="Title"><input type="text" data-f="artist" value="${esc(x.artist)}" placeholder="Artist"><small>REAL ${N(x.real||0)} · ADDED ${N(+x.bonus||0)} · AUTOPLAY ${N(auto(x))} · <b>TOTAL ${N((x.real||0)+(+x.bonus||0)+auto(x))}</b></small>${(x.boosts||[]).map((b,j)=>`<div class="ic-bo"><span style="width:${Math.round(earned(b)/b.a*100)}%"></span><em>AUTOPLAY ${N(earned(b))} / ${N(b.a)} · ${Date.now()>=b.e?'DONE':left(b.e-Date.now())+' left'}</em><button class="b" data-a="bstop" data-j="${j}" title="Stop it here and keep the plays it already added">STOP</button></div>`).join('')}</div>
   <div class="rp-b"><label class="ic-l">ADDED PLAYS<input type="number" min="0" data-f="bonus" value="${+x.bonus||0}"></label><select data-f="lock">${opt(x.lock)}</select><button class="b" data-a="boost" title="Add plays over time">AUTOPLAY</button><button class="b" data-a="play" title="Listen">▶</button><button class="b" data-a="del">REMOVE</button></div></div>`).join(''):'<div class="st">No songs yet. Click + ADD SONGS and pick your audio files (you can pick 20 at once).</div>'}`;
 };
 pg.oninput=e=>{const f=e.target.dataset.f,r=e.target.closest('.ic-row');if(!f||!r)return;const x=d.songs[+r.dataset.i];x[f]=f==='bonus'||f==='lock'?Math.max(0,+e.target.value||0):e.target.value;if(!dirty){dirty=1;const m=pg.querySelector('.st');if(m)m.insertAdjacentHTML('beforeend',' <b style="color:var(--red)">Unsaved changes. Click SAVE.</b>')}};
 pg.onchange=e=>{if(e.target.dataset.f==='lock')draw()};
 pg.onclick=async e=>{const b=e.target.closest('[data-a]');if(!b)return;const i=+b.closest('.ic-row').dataset.i,x=d.songs[i],a=b.dataset.a;
  if(a==='play'){let au=$('#ica');if(!au){au=new Audio();au.id='ica';document.body.appendChild(au)}if(au.dataset.i==i&&!au.paused){au.pause();return}au.dataset.i=i;au.src=img(x.audio);au.play();return}
  if(a==='del'){if(!confirm('Remove "'+x.title+'"? Its audio and cover are erased from storage when you click SAVE.'))return;d.songs.splice(i,1);dirty=1;draw()}
  if(a==='bstop'){const j=+b.dataset.j,bo=x.boosts[j];x.bonus=(+x.bonus||0)+earned(bo);x.boosts.splice(j,1);dirty=1;draw();return}
  if(a==='boost'){const P=[['1 hour',1],['6 hours',6],['12 hours',12],['1 day',24],['3 days',72],['7 days',168],['14 days',336],['30 days',720]];let hrs=24;
   const m=modal(`<h1 style="font-size:30px">AUTOPLAY</h1>`,`<div style="min-width:min(460px,80vw)"><div class="st" style="margin-top:0"><b>${esc(x.title)}</b> gets these plays a little at a time, so it climbs the chart smoothly.</div>
   <label>How many plays</label><input type="number" id="bpa" min="1" step="100" value="10000">
   <label>Spread over</label><div class="ic-dur">${P.map(([l,h])=>`<button class="b${h===24?' r':''}" data-h="${h}">${l.toUpperCase()}</button>`).join('')}</div>
   <div class="ic-cus"><span>or exactly</span><input type="number" id="bpn" min="1" value="1"><select id="bpu"><option value="1">HOURS</option><option value="24" selected>DAYS</option></select></div>
   <div class="st" id="bpm"></div><button class="b r" id="bpok" style="margin-top:10px">START AUTOPLAY</button></div>`);
   const q=t=>m.querySelector(t),sum=()=>{const a=Math.round(+q('#bpa').value||0);q('#bpm').textContent=a>0?`${N(a)} plays over ${hrs>=24&&hrs%24===0?hrs/24+' day(s)':hrs+' hour(s)'}: about ${N(Math.max(1,Math.round(a/hrs)))} plays an hour on average, busier some hours and slower others, like real listeners. Starts when you click SAVE.`:'Type how many plays.'};
   m.querySelectorAll('[data-h]').forEach(k=>k.onclick=()=>{hrs=+k.dataset.h;m.querySelectorAll('[data-h]').forEach(o=>o.classList.toggle('r',o===k));sum()});
   const cus=()=>{hrs=Math.max(1,+q('#bpn').value||1)*+q('#bpu').value;m.querySelectorAll('[data-h]').forEach(o=>o.classList.toggle('r',+o.dataset.h===hrs));sum()};q('#bpn').oninput=q('#bpu').onchange=cus;q('#bpa').oninput=sum;sum();
   q('#bpok').onclick=()=>{const a=Math.round(+q('#bpa').value||0);if(a<1){sum();return}x.boosts=x.boosts||[];x.boosts.push({a,s:0,e:hrs*36e5,n:1});dirty=1;m.remove();draw()};return}
  if(a==='cover'){const [fl]=await pick('image/*',false);if(!fl)return;try{x.cover=(await upload(fl)).url;dirty=1;draw()}catch(er){ms(er.message)}}};
 $('#icadd').onclick=async()=>{const fs=await pick('audio/*',true);if(!fs||!fs.length)return;let k=0;
  for(const fl of fs){$('#icm').textContent=`Uploading ${++k} of ${fs.length}: ${fl.name}…`;try{const u=await upload(fl),t=fromName(fl.name);d.songs.push({id:'s'+Date.now().toString(36)+Math.random().toString(36).slice(2,6),...t,cover:'',audio:u.url,bonus:0,lock:0,real:0})}catch(er){ms(fl.name+': '+er.message)}}
  dirty=1;draw();$('#icm').textContent=`Added ${k} song(s). Check the titles, then click SAVE.`};
 $('#icsv').onclick=async()=>{const t=Date.now();d.songs.forEach(x=>(x.boosts||[]).forEach(b=>{if(b.n){b.s=t;b.e=t+b.e;delete b.n}}));try{await api('/api/admin/indie',{method:'POST',body:JSON.stringify({songs:d.songs})});await load();ms('Indie Charts saved. It shows on the site right away.')}catch(er){ms(er.message)}};
 $('#icrst').onclick=async()=>{if(dirty){ms('Click SAVE first.');return}if(!confirm('Start a new week? All plays and added plays go back to 0, and this week\'s ranks are kept for the ▲▼ arrows.'))return;try{await api('/api/admin/indie/reset',{method:'POST',body:'{}'});await load();ms('New week started.')}catch(er){ms(er.message)}};
 try{await load()}catch(er){pg.innerHTML=`<div class="st">${esc(er.message)}</div>`}}

})();
