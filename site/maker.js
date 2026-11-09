/* Magazine Maker (back office): issues list, page editor with templates x themes, slots, free boxes, undo/redo, autosave, preview, publish, delete.
   Uses admin.js helpers (api, upload, pick, shell, askBox, confirmBox, ms, esc, $) and mag.js (MAG). */
window.RMMakerInit=function(H){const {api,upload,pick,shell,askBox,confirmBox,ms,esc,$,API}=H;
async function mags(){const pg=shell('mags','MAGAZINE','<button class="b r" id="mgnew">+ NEW ISSUE</button>');pg.innerHTML='<div class="st">Loading…</div>';
 await magLib();let L;try{L=(await api('/api/admin/mags')).mags}catch(e){pg.innerHTML='<div class="st">'+esc(e.message)+'</div>';return}
 const full=await Promise.all(L.map(m=>api('/api/admin/mags/'+m.id).then(r=>r.mag).catch(()=>m)));
 const C=MAG.count();
 pg.innerHTML=`<div class="mk-help"><b>How it works:</b> make an issue, fill the pages from ${C.covers} cover designs and ${C.pages} page designs, and it saves by itself while you work. Nothing shows on the site until you click <b>PUBLISH</b>. Readers see the newest issue on top and every past issue underneath.</div>
  ${full.length?`<div class="mk-list">${full.map(m=>`<div class="mk-card" data-id="${m.id}"><div class="mk-cv">${m.doc&&m.doc.pages&&m.doc.pages[0]?MAG.mini(m.doc.pages[0],m.doc,180,{edit:1}):''}</div><div class="mk-ci"><b>${esc(m.title)}</b><small>${esc(m.label||'')}</small>
   <span class="mk-st ${m.status}">${m.status==='published'?'LIVE':'DRAFT'}</span><small>${(m.doc&&m.doc.pages||[]).length} pages · saved ${esc(String(m.updated_at||'').slice(0,16))}</small>
   <div class="mk-cb"><button class="b r" data-a="edit">EDIT</button>${m.status==='published'?`<a class="b" target="_blank" href="./?c=magazine&m=${encodeURIComponent(m.slug)}">VIEW ↗</a><button class="b" data-a="unpub">UNPUBLISH</button>`:`<button class="b" data-a="pub">PUBLISH</button>`}<button class="b d" data-a="del">DELETE</button></div></div></div>`).join('')}</div>`:'<div class="st">No issues yet. Click + NEW ISSUE.</div>'}`;
 $('#mgnew').onclick=async()=>{const t=await askBox('Name this issue (example: Polo Shak: The Ultimate Come Up)','');if(!t)return;const lb=await askBox('Issue line on the cover','SEASON 1 | ISSUE 1 | YEAR '+new Date().getFullYear());
  const doc={pages:[{tpl:'c-classic',theme:'red',v:{issue:lb||'',name:t.toUpperCase().slice(0,30)}},{tpl:'p-contents',theme:'red',v:{title:'CONTENTS'}},{tpl:'p-back',theme:'red',v:{}}]};
  try{const r=await api('/api/admin/mags',{method:'POST',body:JSON.stringify({title:t,label:lb||'',doc})});maker(r.id)}catch(e){ms(e.message)}};
 pg.querySelectorAll('.mk-card').forEach(c=>c.onclick=async e=>{const b=e.target.closest('[data-a]');const id=+c.dataset.id,m=full.find(x=>x.id===id);if(!b){if(!e.target.closest('a'))maker(id);return}
  const a=b.dataset.a;if(a==='edit')return maker(id);
  if(a==='del'){if(!(await confirmBox(`Delete "${m.title}" for good?\nIts pages and the photos only it uses are erased from Cloudflare. This can't be undone.`,'DELETE ISSUE')))return;try{await api('/api/admin/mags/'+id,{method:'DELETE'});ms('Issue deleted.');mags()}catch(er){ms(er.message)}return}
  try{await api('/api/admin/mags/'+id,{method:'POST',body:JSON.stringify({status:a==='pub'?'published':'draft'})});ms(a==='pub'?'Published. It is live on the Magazine page.':'Unpublished. It is hidden from the site.');mags()}catch(er){ms(er.message)}})}

/* free background remover: IMG.LY's AI cut-out model runs in this browser (no account, no fees, photos never leave your computer until the PNG is uploaded).
   The model downloads once (about 40 MB) the first time, then the browser keeps it. Returns the uploaded PNG's url, or null. */
let BGM=null;
async function bgCut(src){const m=document.createElement('div');m.className='modal';m.style.zIndex=300;
 m.innerHTML=`<div class="pn" style="width:min(520px,92vw);text-align:center"><b style="font:400 26px Anton,sans-serif">REMOVING BACKGROUND</b><div class="bgc-prev"></div><div class="bgc-bar"><i></i></div><div class="st" id="bgst">Starting…</div><div class="bgc-act" hidden><button class="b" id="bgno">CANCEL</button><button class="b r" id="bgok">USE THIS CUT-OUT</button></div></div>`;
 document.body.appendChild(m);const st=t=>m.querySelector('#bgst').textContent=t,bar=k=>m.querySelector('.bgc-bar i').style.width=Math.round(k*100)+'%';
 try{if(!BGM){st('Loading the AI cut-out tool… (first time only, about 40 MB)');BGM=await import('https://esm.sh/@imgly/background-removal@1.4.5')}
  let input=src;if(typeof src==='string'){st('Getting the photo…');input=await fetch(src,{mode:'cors'}).then(r=>{if(!r.ok)throw new Error('Could not load the photo');return r.blob()})}
  const prev=URL.createObjectURL(input);m.querySelector('.bgc-prev').innerHTML=`<img src="${prev}" alt="">`;
  const blob=await BGM.removeBackground(input,{output:{format:'image/png',quality:1},progress:(key,cur,tot)=>{if(/fetch/.test(key)){st('Downloading the AI model… (first time only)');bar(tot?cur/tot:0)}else{st('Cutting out the person…');bar(.95)}}});
  bar(1);const out=URL.createObjectURL(blob);m.querySelector('.bgc-prev').innerHTML=`<img src="${prev}" alt="Before"><img src="${out}" alt="After" class="cut">`;st('Done. Check the cut-out (right), then use it.');
  m.querySelector('.bgc-act').hidden=false;const ok=await new Promise(r=>{m.querySelector('#bgok').onclick=()=>r(1);m.querySelector('#bgno').onclick=()=>r(0)});
  if(!ok){m.remove();return null}st('Uploading…');const name=(src.name||'photo').replace(/\.[^.]+$/,'')+'-cutout.png';const r=await upload(new File([blob],name,{type:'image/png'}));m.remove();ms('Background removed.');return r.url}
 catch(e){st('Could not remove the background: '+(e.message||e));const a=m.querySelector('.bgc-act');a.hidden=false;a.querySelector('#bgok').remove();await new Promise(r=>m.querySelector('#bgno').onclick=r);m.remove();return null}}

const magLib=()=>window.MAG?Promise.resolve():new Promise((ok,no)=>{const s=document.createElement('script');s.src='mag.js?v=5';s.onload=()=>{MAG.style();ok()};s.onerror=no;document.head.appendChild(s)});

async function maker(id){const pg=shell('mags','MAGAZINE');history.replaceState(null,'',location.pathname+location.search+'#mag-'+id);pg.innerHTML='<div class="st">Loading…</div>';
 await magLib();let M;try{M=(await api('/api/admin/mags/'+id)).mag}catch(e){pg.innerHTML='<div class="st">'+esc(e.message)+'</div>';return}
 const D=M.doc&&M.doc.pages?M.doc:{pages:[]};if(!D.pages.length)D.pages.push({tpl:'c-classic',theme:'red',v:{}});
 let sel=0,tab='content',saving=0,dirty=0,saveT=0,lastKey='',lastAt=0;const undo=[],redo=[],snap=()=>JSON.stringify({D,title:M.title,label:M.label});
 const restore=j=>{const o=JSON.parse(j);D.pages=o.D.pages;D.logo=o.D.logo;M.title=o.title;M.label=o.label;sel=Math.min(sel,D.pages.length-1)};
 /* every edit goes through change(): undo snapshot, redraw, autosave */
 const change=(fn,key,soft)=>{const now=Date.now();if(!(key&&key===lastKey&&now-lastAt<900)){undo.push(snap());if(undo.length>150)undo.shift();redo.length=0}lastKey=key||'';lastAt=now;fn();dirty=1;queue();if(soft)drawCanvas(),drawPages(true);else draw()};
 const queue=()=>{clearTimeout(saveT);status('Not saved yet…');saveT=setTimeout(save,1800)};
 const save=async()=>{clearTimeout(saveT);if(saving){saveT=setTimeout(save,800);return}saving=1;status('Saving…');
  try{await api('/api/admin/mags/'+id,{method:'POST',body:JSON.stringify({title:M.title,label:M.label,doc:D})});dirty=0;status('Saved '+new Date().toLocaleTimeString([],{hour:'numeric',minute:'2-digit'}))}catch(e){status('Not saved: '+e.message);ms(e.message)}saving=0};
 const status=t=>{const s=pg.querySelector('#mksv');if(s)s.textContent=t};
 const page=()=>D.pages[sel],tpl=()=>MAG.BY[page().tpl]||MAG.TPL[0];
 window.onbeforeunload=()=>dirty?'Your last changes are still saving.':undefined;

 pg.innerHTML=`<div class="mk-top"><button class="b" id="mkback">‹ ISSUES</button><input id="mkt" value="${esc(M.title)}" aria-label="Issue name"><input id="mkl" value="${esc(M.label||'')}" aria-label="Issue line" placeholder="SEASON | ISSUE | YEAR">
  <span class="mk-st ${M.status}" id="mkstat">${M.status==='published'?'LIVE':'DRAFT'}</span><span id="mksv" class="mk-sv">Saved</span>
  <button class="b" id="mkun" title="Undo (Ctrl+Z)">↶ UNDO</button><button class="b" id="mkre" title="Redo (Ctrl+Y)">↷ REDO</button><button class="b" id="mksave">SAVE DRAFT</button><button class="b" id="mkpv">PREVIEW</button><button class="b r" id="mkpub">${M.status==='published'?'UNPUBLISH':'PUBLISH'}</button></div>
  <div class="mk"><div class="mk-pages" id="mkp"></div><div class="mk-canvas"><div class="mk-warn" id="mkw"></div><div id="mkc"></div></div><div class="mk-side"><div class="mk-tabs">${[['content','CONTENT'],['design','DESIGN'],['extras','ADD BOXES']].map(([k,t])=>`<button data-t="${k}">${t}</button>`).join('')}</div><div id="mks"></div></div></div>`;
 const P=pg.querySelector('#mkp'),CV=pg.querySelector('#mkc'),SD=pg.querySelector('#mks');

 /* ---- page list ---- */
 let dragFrom=-1;
 const drawPages=keepScroll=>{const sc=P.scrollTop;P.innerHTML=D.pages.map((p,i)=>`<div class="mk-pt${i===sel?' on':''}" data-i="${i}" draggable="true"><div class="mk-pn">${i===0?'COVER':i+1}</div>${MAG.mini(p,D,104,{edit:1})}<div class="mk-pb"><button data-p="up" title="Move up">↑</button><button data-p="dn" title="Move down">↓</button><button data-p="cp" title="Copy page">⧉</button><button data-p="rm" title="Delete page">✕</button></div></div>`).join('')+`<button class="b r mk-add" id="mkadd">+ ADD PAGE</button>`;
  if(keepScroll)P.scrollTop=sc;
  P.querySelectorAll('.mk-pt').forEach(el=>{const i=+el.dataset.i;
   el.onclick=async e=>{const b=e.target.closest('[data-p]');if(!b){sel=i;draw();return}const a=b.dataset.p;
    if(a==='up'&&i>0)change(()=>{D.pages.splice(i-1,0,D.pages.splice(i,1)[0]);sel=i-1});
    if(a==='dn'&&i<D.pages.length-1)change(()=>{D.pages.splice(i+1,0,D.pages.splice(i,1)[0]);sel=i+1});
    if(a==='cp')change(()=>{D.pages.splice(i+1,0,JSON.parse(JSON.stringify(D.pages[i])));sel=i+1});
    if(a==='rm'){if(D.pages.length<2)return ms('An issue needs at least one page.');if(await confirmBox('Delete page '+(i+1)+'? (UNDO brings it back.)','DELETE PAGE'))change(()=>{D.pages.splice(i,1);sel=Math.max(0,Math.min(sel,D.pages.length-1))})}};
   el.ondragstart=e=>{dragFrom=i;e.dataTransfer.effectAllowed='move'};el.ondragover=e=>{e.preventDefault();el.classList.add('dg')};el.ondragleave=()=>el.classList.remove('dg');
   el.ondrop=e=>{e.preventDefault();el.classList.remove('dg');if(dragFrom<0||dragFrom===i)return;const f=dragFrom;dragFrom=-1;change(()=>{D.pages.splice(i,0,D.pages.splice(f,1)[0]);sel=i})}});
  P.querySelector('#mkadd').onclick=async()=>{const c=await picker(page().theme||'red',sel===0&&D.pages.length===1?'feature':'feature');if(c)change(()=>{D.pages.splice(sel+1,0,{tpl:c.tpl,theme:c.theme,v:{}});sel=sel+1})}};

 /* ---- canvas: the page at working size; click a slot to edit it, drag the free boxes ---- */
 let k0=1;const drawCanvas=()=>{const w=Math.min(CV.parentElement.clientWidth-20,640),k=w/MAG.W;
  k0=k;CV.innerHTML=`<div class="mk-tip">Drag anything on the page to move it. Hold <b>Shift</b> and scroll on it to make it bigger or smaller.</div><div class="mk-stage" style="width:${w}px;height:${Math.round(MAG.H*k)}px"><div style="transform:scale(${k});transform-origin:0 0;width:${MAG.W}px;height:${MAG.H}px">${MAG.render(page(),D,{edit:1})}</div></div>`;
  CV.querySelectorAll('[data-slot]').forEach(el=>el.onclick=e=>{e.stopPropagation();tab='content';drawSide();const f=SD.querySelector(`[data-k="${el.dataset.slot}"]`);if(f){f.scrollIntoView({block:'center',behavior:'smooth'});f.classList.add('flash');setTimeout(()=>f.classList.remove('flash'),900)}});
  CV.querySelectorAll('[data-mv]').forEach(el=>{if(el.closest('.mg-x'))return;el.classList.add('mk-mv');
   el.onpointerdown=e=>{if(e.button)return;e.preventDefault();e.stopPropagation();const v=page().v||(page().v={}),k=el.dataset.mv,M=v._mv=v._mv||{},o=M[k]||{x:0,y:0,s:1},sx=e.clientX,sy=e.clientY,ox=o.x||0,oy=o.y||0;let moved=0;el.setPointerCapture(e.pointerId);
    el.onpointermove=ev=>{const dx=(ev.clientX-sx)/k0,dy=(ev.clientY-sy)/k0;if(!moved&&Math.abs(dx)+Math.abs(dy)<6)return;if(!moved){undo.push(snap());redo.length=0;moved=1}o.x=Math.round(ox+dx);o.y=Math.round(oy+dy);M[k]=o;el.style.translate=o.x+'px '+o.y+'px'};
    el.onpointerup=()=>{el.onpointermove=null;el.onpointerup=null;if(moved){dirty=1;queue();drawPages(true)}else{const sl=el.querySelector('[data-slot]')||el.closest('[data-slot]')||el;const key=sl.dataset&&sl.dataset.slot||(k.startsWith('mg-name')?'name':k.startsWith('mg-tag')?'tag':'');if(key){tab='content';drawSide();const f=SD.querySelector(`[data-k="${key}"]`);if(f){f.scrollIntoView({block:'center',behavior:'smooth'});f.classList.add('flash');setTimeout(()=>f.classList.remove('flash'),900)}}}}};
   el.onwheel=e=>{if(!e.shiftKey)return;e.preventDefault();const v=page().v||(page().v={}),k=el.dataset.mv,M=v._mv=v._mv||{},o=M[k]||{x:0,y:0,s:1};o.s=Math.max(.3,Math.min(3,Math.round(((o.s||1)*(e.deltaY<0?1.05:.95))*100)/100));M[k]=o;el.style.scale=o.s;dirty=1;queue();clearTimeout(el._wt);el._wt=setTimeout(()=>drawPages(true),400)}});
  CV.querySelectorAll('.mg-x').forEach(el=>{el.onpointerdown=e=>{e.preventDefault();const i=+el.dataset.x,x=page().x[i],sx=e.clientX,sy=e.clientY,ox=x.x,oy=x.y;let moved=0;el.setPointerCapture(e.pointerId);
   const mv=ev=>{const dx=(ev.clientX-sx)/(MAG.W*k)*100,dy=(ev.clientY-sy)/(MAG.H*k)*100;if(!moved&&Math.abs(dx)+Math.abs(dy)<.4)return;if(!moved){undo.push(snap());redo.length=0;moved=1}x.x=Math.round((ox+dx)*10)/10;x.y=Math.round((oy+dy)*10)/10;el.style.left=x.x+'%';el.style.top=x.y+'%'};
   const up=()=>{el.onpointermove=null;el.onpointerup=null;if(moved){dirty=1;queue();drawPages(true);if(tab==='extras')drawSide()}else{tab='extras';drawSide();const f=SD.querySelector(`[data-xi="${i}"]`);if(f)f.scrollIntoView({block:'center',behavior:'smooth'})}};el.onpointermove=mv;el.onpointerup=up}});
  fitCheck()};
 /* text that doesn't fit: say so, and offer to move the rest onto a new page */
 const fitCheck=()=>{const W=pg.querySelector('#mkw'),b=CV.querySelector('.mg-body');W.innerHTML='';if(!b||!page().v||!page().v.body)return;if(b.scrollHeight<=b.clientHeight+4&&b.scrollWidth<=b.clientWidth+4)return;
  W.innerHTML=`<b>The article text doesn't all fit on this page.</b> <button class="b r" id="mksplit">CONTINUE ON NEXT PAGE</button>`;
  W.querySelector('#mksplit').onclick=()=>{const ps=String(page().v.body).split(/\n\s*\n/).map(x=>x.trim()).filter(Boolean);let n=ps.length;
   while(n>1){b.innerHTML=ps.slice(0,n).map(p=>'<p>'+esc(p)+'</p>').join('');if(b.scrollHeight<=b.clientHeight+4&&b.scrollWidth<=b.clientWidth+4)break;n--}
   if(n>=ps.length)return;change(()=>{page().v.body=ps.slice(0,n).join('\n\n');D.pages.splice(sel+1,0,{tpl:'p-columns',theme:page().theme,v:{body:ps.slice(n).join('\n\n'),pg:''}});});ms('The rest of the article moved to a new page after this one.')}};

 /* ---- side panel ---- */
 const imgCtl=(k,o,lab,cutout)=>`<div class="mk-f" data-k="${k}"><label>${esc(lab)}</label>${o&&o.u?`<div class="mk-img"><img src="${esc(MAG.abs(o.u))}" alt=""><div><button class="b" data-up="${k}">REPLACE</button><button class="b r" data-cut="${k}">✂ REMOVE BACKGROUND</button><button class="b d" data-rmimg="${k}">REMOVE</button></div></div>
  <div class="mk-sl"><span>LEFT ↔ RIGHT</span><input type="range" min="0" max="100" value="${o.x??50}" data-im="${k}" data-ax="x"></div>${cutout?'':`<div class="mk-sl"><span>UP ↕ DOWN</span><input type="range" min="0" max="100" value="${o.y??50}" data-im="${k}" data-ax="y"></div>`}<div class="mk-sl"><span>ZOOM</span><input type="range" min="1" max="${cutout?1.6:3}" step=".02" value="${o.z??1}" data-im="${k}" data-ax="z"></div>`
  :`<button class="b" data-up="${k}">+ UPLOAD PHOTO</button><button class="b r" data-upcut="${k}">+ UPLOAD &amp; REMOVE BACKGROUND</button>${cutout?'<div class="hint">Upload any photo and click REMOVE BACKGROUND, or use a PNG that is already cut out. The person then stands in front of the logo.</div>':''}`}</div>`;
 const drawSide=()=>{pg.querySelectorAll('.mk-tabs [data-t]').forEach(b=>b.classList.toggle('on',b.dataset.t===tab));const p=page(),t=tpl(),v=p.v||(p.v={});
  if(tab==='content'){SD.innerHTML=`<div class="mk-tn">${esc(t.name)} <small>${esc((MAG.THEMES[p.theme]||{}).name||'')}</small></div>`+t.slots.map(([k,ty,lab])=>{
    if(ty==='img')return imgCtl(k,v[k],lab);if(ty==='cut')return imgCtl(k,v[k],lab,1);
    if(ty==='logo')return `<div class="mk-f" data-k="${k}"><label>${esc(lab)}</label>${[['mh_s','SIZE',40,140,100],['mh_x','LEFT ↔ RIGHT',-300,300,0],['mh_y','UP ↕ DOWN',-60,500,0]].map(([f,n,a,b,d])=>`<div class="mk-sl"><span>${n}</span><input type="range" min="${a}" max="${b}" value="${v[f]??d}" data-v="${f}"></div>`).join('')}<button class="b" data-mhreset>RESET LOGO</button></div>`;
    if(ty==='chart')return `<div class="mk-f" data-k="${k}"><label>${esc(lab)}</label><button class="b r" data-chart="${k}">${v[k]?'UPDATE FROM THE CHART':'PULL CHART'}</button>${v[k]?`<div class="hint">Saved ${esc(v[k].at||'')} · #1 ${esc((v[k].items[0]||{}).title||'')}</div>`:''}</div>`;
    if(ty==='body')return `<div class="mk-f" data-k="${k}"><label>${esc(lab)}</label><textarea data-v="${k}" rows="12" placeholder="Paste the article. Empty line = new paragraph.">${esc(v[k]||'')}</textarea><button class="b" data-import>IMPORT AN ARTICLE FROM THE SITE</button></div>`;
    if(ty==='para')return `<div class="mk-f" data-k="${k}"><label>${esc(lab)}</label><textarea data-v="${k}" rows="3">${esc(v[k]||'')}</textarea></div>`;
    return `<div class="mk-f" data-k="${k}"><label>${esc(lab)}</label><input type="text" data-v="${k}" value="${esc(v[k]||'')}"></div>`}).join('')}
  if(tab==='design'){SD.innerHTML=`<div class="mk-tn">${esc(t.name)}</div><button class="b r" id="mkchg" style="width:100%">CHANGE TEMPLATE</button><div class="hint">Your words and photos carry over to the new template.</div>
    <label class="mk-lb">THEME (colors + type)</label><div class="mk-th">${Object.entries(MAG.THEMES).map(([k,T])=>`<button data-th="${k}" class="${p.theme===k?'on':''}" title="${esc(T.name)}"><i style="background:${T.bg}"></i><i style="background:${T.acc}"></i><i style="background:${T.ink}"></i><span>${esc(T.name)}</span></button>`).join('')}</div>
    <button class="b" id="mkall" style="width:100%;margin-top:8px">USE THIS THEME ON EVERY PAGE</button>
    <label class="mk-lb">MASTHEAD LOGO (whole issue)</label>${D.logo&&D.logo.u?`<div class="mk-img"><img src="${esc(MAG.abs(D.logo.u))}" alt="" style="background:#333"><div><button class="b" id="mklogo">REPLACE</button><button class="b d" id="mklogorm">USE SITE LOGO</button></div></div>`:`<button class="b" id="mklogo">+ UPLOAD YOUR LOGO (PNG)</button><div class="hint">Until you upload one, the RAPMAG logo from the website is used.</div>`}
    <label class="mk-lb">MOVED ITEMS</label><button class="b" id="mkmvreset" style="width:100%">PUT EVERYTHING BACK IN PLACE</button><label class="mk-lb">START OVER</label><button class="b d" id="mkreset">CLEAR THIS PAGE</button>`}
  if(tab==='extras'){const X=p.x||[];SD.innerHTML=`<div class="hint" style="margin-top:0">Add your own text or photos anywhere. Drag them on the page to move them.</div><div class="mk-xb"><button class="b r" data-add="txt">+ TEXT</button><button class="b r" data-add="img">+ PHOTO</button><button class="b r" data-add="round">+ ROUND PHOTO</button></div>`+
   X.map((x,i)=>`<div class="mk-xf" data-xi="${i}"><div class="mk-xh"><b>${x.t==='img'?'PHOTO':'TEXT'} ${i+1}</b><button class="b d" data-xrm="${i}">REMOVE</button></div>
    ${x.t==='img'?(x.u?`<div class="mk-img"><img src="${esc(MAG.abs(x.u))}" alt=""><div><button class="b" data-xup="${i}">REPLACE</button><button class="b r" data-xcut="${i}">✂ REMOVE BACKGROUND</button></div></div>`:`<button class="b" data-xup="${i}">+ UPLOAD PHOTO</button>`)
    :`<textarea data-xv="${i}" data-xk="text" rows="2">${esc(x.text||'')}</textarea><div class="mk-row"><label>SIZE<input type="range" min="12" max="220" value="${x.size||40}" data-xv="${i}" data-xk="size"></label><label>COLOR<input type="color" value="${/^#/.test(x.color||'')?x.color:'#ffffff'}" data-xv="${i}" data-xk="color"></label><label>BOX<input type="color" value="${/^#/.test(x.bg||'')?x.bg:'#e0242f'}" data-xv="${i}" data-xk="bg"></label><label class="chk"><input type="checkbox" data-xv="${i}" data-xk="hasbg"${x.bg?' checked':''}> BOX ON</label></div>
     <div class="mk-row"><label>FONT<select data-xv="${i}" data-xk="font">${[['head','Block'],['serif','Serif'],['body','Body']].map(([a,b])=>`<option value="${a}"${(x.font||'head')===a?' selected':''}>${b}</option>`).join('')}</select></label><label>ALIGN<select data-xv="${i}" data-xk="align">${['left','center','right'].map(a=>`<option${(x.align||'left')===a?' selected':''}>${a}</option>`).join('')}</select></label></div>`}
    <div class="mk-row"><label>WIDTH<input type="range" min="5" max="100" value="${x.w}" data-xv="${i}" data-xk="w"></label>${x.t==='img'?`<label>HEIGHT<input type="range" min="3" max="100" value="${x.h||20}" data-xv="${i}" data-xk="h"></label>`:''}</div></div>`).join('')}
  bindSide()};
 const bindSide=()=>{const p=page(),v=p.v;
  SD.querySelectorAll('[data-v]').forEach(f=>f.oninput=()=>change(()=>{v[f.dataset.v]=f.value},'v'+sel+f.dataset.v,1));
  SD.querySelectorAll('[data-up]').forEach(b=>b.onclick=async()=>{const k=b.dataset.up,[fl]=await pick('image/*',false);if(!fl)return;try{const r=await upload(fl);change(()=>{v[k]={u:r.url,x:50,y:50,z:1}})}catch(e){ms(e.message)}});
  SD.querySelectorAll('[data-cut]').forEach(b=>b.onclick=async()=>{const k=b.dataset.cut,o=v[k];const u=await bgCut(MAG.abs(o.u));if(u)change(()=>{v[k]={...o,u}})});
  SD.querySelectorAll('[data-upcut]').forEach(b=>b.onclick=async()=>{const k=b.dataset.upcut,[fl]=await pick('image/*',false);if(!fl)return;const u=await bgCut(fl);if(u)change(()=>{v[k]={u,x:50,y:50,z:1}})});
  SD.querySelectorAll('[data-xcut]').forEach(b=>b.onclick=async()=>{const x=p.x[+b.dataset.xcut];const u=await bgCut(MAG.abs(x.u));if(u)change(()=>{x.u=u})});
  const mr=SD.querySelector('[data-mhreset]');if(mr)mr.onclick=()=>change(()=>{delete v.mh_s;delete v.mh_x;delete v.mh_y});
  SD.querySelectorAll('[data-rmimg]').forEach(b=>b.onclick=()=>change(()=>{delete v[b.dataset.rmimg]}));
  SD.querySelectorAll('[data-im]').forEach(r=>r.oninput=()=>change(()=>{v[r.dataset.im][r.dataset.ax]=+r.value},'im'+sel+r.dataset.im+r.dataset.ax,1));
  SD.querySelectorAll('[data-chart]').forEach(b=>b.onclick=async()=>{try{const d=await fetch(API+'/api/indie').then(r=>r.json());change(()=>{v[b.dataset.chart]={at:new Date().toLocaleDateString(),items:d.items.slice(0,20).map(x=>({title:x.title,artist:x.artist,plays:x.plays}))}});ms('Chart pulled. It stays as it is now, even when the chart changes.')}catch(e){ms('Could not load the chart.')}});
  const im=SD.querySelector('[data-import]');if(im)im.onclick=()=>importArticle(v);
  const q=x=>SD.querySelector(x);
  if(q('#mkchg'))q('#mkchg').onclick=async()=>{const c=await picker(p.theme,MAG.BY[p.tpl]&&MAG.BY[p.tpl].fam==='cover'?'cover':'all');if(c)change(()=>{p.tpl=c.tpl;p.theme=c.theme})};
  SD.querySelectorAll('[data-th]').forEach(b=>b.onclick=()=>change(()=>{p.theme=b.dataset.th}));
  if(q('#mkall'))q('#mkall').onclick=()=>change(()=>{D.pages.forEach(x=>x.theme=p.theme)});
  if(q('#mklogo'))q('#mklogo').onclick=async()=>{const [fl]=await pick('image/*',false);if(!fl)return;try{const r=await upload(fl);change(()=>{D.logo={u:r.url}})}catch(e){ms(e.message)}};
  if(q('#mklogorm'))q('#mklogorm').onclick=()=>change(()=>{delete D.logo});
  if(q('#mkmvreset'))q('#mkmvreset').onclick=()=>change(()=>{delete p.v._mv});
  if(q('#mkreset'))q('#mkreset').onclick=async()=>{if(await confirmBox('Clear every word and photo on this page? (UNDO brings it back.)','CLEAR PAGE'))change(()=>{p.v={};p.x=[]})};
  SD.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>change(()=>{p.x=p.x||[];const a=b.dataset.add;p.x.push(a==='txt'?{t:'txt',text:'NEW TEXT',x:10,y:45,w:60,size:60,color:'#ffffff',font:'head'}:{t:'img',x:35,y:35,w:30,h:a==='round'?23:25,round:a==='round'})}));
  SD.querySelectorAll('[data-xrm]').forEach(b=>b.onclick=()=>change(()=>{p.x.splice(+b.dataset.xrm,1)}));
  SD.querySelectorAll('[data-xup]').forEach(b=>b.onclick=async()=>{const [fl]=await pick('image/*',false);if(!fl)return;try{const r=await upload(fl);change(()=>{p.x[+b.dataset.xup].u=r.url})}catch(e){ms(e.message)}});
  SD.querySelectorAll('[data-xv]').forEach(f=>{const ev=f.type==='checkbox'||f.tagName==='SELECT'?'onchange':'oninput';f[ev]=()=>{const x=p.x[+f.dataset.xv],k=f.dataset.xk;
   change(()=>{if(k==='hasbg')x.bg=f.checked?(SD.querySelector(`[data-xv="${f.dataset.xv}"][data-xk="bg"]`).value):'';else if(k==='bg'){if(x.bg)x.bg=f.value}else x[k]=['size','w','h'].includes(k)?+f.value:f.value},'x'+sel+f.dataset.xv+k,1)}})};

 /* paste an article from the site into this page */
 const importArticle=async v=>{let L;try{L=(await api('/api/admin/posts')).posts}catch(e){return ms(e.message)}
  const m=document.createElement('div');m.className='modal';m.innerHTML=`<div class="pn" style="width:min(640px,94vw)"><b style="font:800 13px Inter,sans-serif;letter-spacing:.12em">PICK AN ARTICLE</b><input type="text" id="aq" placeholder="Search…" style="width:100%;margin:10px 0;padding:10px"><div id="al" style="max-height:55vh;overflow:auto"></div><div style="text-align:right;margin-top:10px"><button class="b" id="ax">CANCEL</button></div></div>`;document.body.appendChild(m);
  const list=q=>m.querySelector('#al').innerHTML=L.filter(p=>p.category!=='page'&&(!q||p.title.toLowerCase().includes(q.toLowerCase()))).slice(0,80).map(p=>`<button class="mk-ai" data-id="${p.id}">${esc(p.title)}<small>${esc(String(p.published_at||p.updated_at||'').slice(0,10))}</small></button>`).join('');list('');
  m.querySelector('#aq').oninput=e=>list(e.target.value);m.querySelector('#ax').onclick=()=>m.remove();m.onclick=e=>{if(e.target===m)m.remove()};
  m.querySelector('#al').onclick=async e=>{const b=e.target.closest('[data-id]');if(!b)return;let a;try{a=(await api('/api/admin/posts/'+b.dataset.id)).post}catch(er){return ms(er.message)}m.remove();
   const div=document.createElement('div');div.innerHTML=String(a.body||'').replace(/<\/(p|h\d|li|blockquote)>/gi,'\n\n').replace(/<br\s*\/?>/gi,'\n');const text=(div.textContent||'').replace(/\n{3,}/g,'\n\n').trim();
   const slots=tpl().slots.map(s=>s[0]);change(()=>{if(slots.includes('title'))v.title=a.title;if(slots.includes('dek')&&a.dek)v.dek=a.dek;if(slots.includes('body'))v.body=text;if(slots.includes('by')&&a.author)v.by='By '+a.author;if(slots.includes('img1')&&a.cover&&!v.img1)v.img1={u:a.cover,x:50,y:50,z:1}});ms('Article added. Check the page, and use CONTINUE ON NEXT PAGE if it runs long.')}};

 /* ---- template picker: every layout in the chosen theme ---- */
 const picker=(theme,fam)=>new Promise(res=>{let th=theme||'red',f=fam||'all';const m=document.createElement('div');m.className='modal';
  const C=MAG.count();m.innerHTML=`<div class="pn mk-pick"><div class="mk-ph"><b>PICK A DESIGN</b><small>${C.covers} cover designs · ${C.pages} page designs</small><button class="b" id="pkx">CLOSE</button></div>
   <div class="mk-fams">${[['all','All pages'],...Object.entries(MAG.FAMS)].map(([k,n])=>`<button data-f="${k}">${esc(n)}</button>`).join('')}</div>
   <div class="mk-th sm">${Object.entries(MAG.THEMES).map(([k,T])=>`<button data-th="${k}" title="${esc(T.name)}"><i style="background:${T.bg}"></i><i style="background:${T.acc}"></i><span>${esc(T.name)}</span></button>`).join('')}</div><div class="mk-grid" id="pkg"></div></div>`;
  document.body.appendChild(m);const done=v=>{m.remove();res(v)};m.querySelector('#pkx').onclick=()=>done(null);m.onclick=e=>{if(e.target===m)done(null)};
  const draw=()=>{m.querySelectorAll('[data-f]').forEach(b=>b.classList.toggle('on',b.dataset.f===f));m.querySelectorAll('[data-th]').forEach(b=>b.classList.toggle('on',b.dataset.th===th));
   const list=MAG.TPL.filter(t=>f==='all'?t.fam!=='cover':t.fam===f);m.querySelector('#pkg').innerHTML=list.map(t=>`<button class="mk-gi" data-tpl="${t.id}">${MAG.mini({tpl:t.id,theme:th,v:{}},D,150,{sample:1,edit:1})}<span>${esc(t.name)}</span></button>`).join('')};
  m.querySelector('.mk-fams').onclick=e=>{const b=e.target.closest('[data-f]');if(b){f=b.dataset.f;draw()}};m.querySelector('.mk-th').onclick=e=>{const b=e.target.closest('[data-th]');if(b){th=b.dataset.th;draw()}};
  m.querySelector('#pkg').onclick=e=>{const b=e.target.closest('[data-tpl]');if(b)done({tpl:b.dataset.tpl,theme:th})};draw()});

 const draw=()=>{drawPages(true);drawCanvas();drawSide()};
 pg.querySelector('.mk-tabs').onclick=e=>{const b=e.target.closest('[data-t]');if(b){tab=b.dataset.t;drawSide()}};
 pg.querySelector('#mkt').oninput=e=>change(()=>{M.title=e.target.value},'title',1);pg.querySelector('#mkl').oninput=e=>change(()=>{M.label=e.target.value},'label',1);
 const doUndo=()=>{if(!undo.length)return ms('Nothing to undo.');redo.push(snap());restore(undo.pop());dirty=1;queue();syncTop();draw()},doRedo=()=>{if(!redo.length)return ms('Nothing to redo.');undo.push(snap());restore(redo.pop());dirty=1;queue();syncTop();draw()};
 const syncTop=()=>{pg.querySelector('#mkt').value=M.title;pg.querySelector('#mkl').value=M.label||''};
 pg.querySelector('#mkun').onclick=doUndo;pg.querySelector('#mkre').onclick=doRedo;
 const kd=e=>{if(!document.body.contains(pg)||!pg.querySelector('.mk'))return document.removeEventListener('keydown',kd);const tg=e.target.tagName;if((e.ctrlKey||e.metaKey)&&!/INPUT|TEXTAREA/.test(tg)){if(e.key==='z'&&!e.shiftKey){e.preventDefault();doUndo()}if(e.key==='y'||(e.key==='z'&&e.shiftKey)){e.preventDefault();doRedo()}}if((e.ctrlKey||e.metaKey)&&e.key==='s'){e.preventDefault();save()}};document.addEventListener('keydown',kd);
 pg.querySelector('#mksave').onclick=async()=>{await save();ms('Draft saved.')};
 pg.querySelector('#mkback').onclick=async()=>{if(dirty)await save();window.onbeforeunload=null;mags()};
 pg.querySelector('#mkpv').onclick=()=>{const m=document.createElement('div');m.className='modal mk-pvm';m.innerHTML=`<div class="mk-pvb"><button class="b" id="pvx">CLOSE PREVIEW</button><div id="pvbook"></div></div>`;document.body.appendChild(m);
  m.querySelector('#pvx').onclick=()=>m.remove();MAG.book(m.querySelector('#pvbook'),D,{maxH:window.innerHeight-140,full:false}).goto(sel)};
 pg.querySelector('#mkpub').onclick=async()=>{const pub=M.status!=='published';if(pub&&!(await confirmBox('Publish "'+M.title+'"? It goes live on the Magazine page right away.','PUBLISH')))return;
  clearTimeout(saveT);try{await api('/api/admin/mags/'+id,{method:'POST',body:JSON.stringify({title:M.title,label:M.label,doc:D,status:pub?'published':'draft'})});dirty=0;M.status=pub?'published':'draft';
   pg.querySelector('#mkstat').textContent=pub?'LIVE':'DRAFT';pg.querySelector('#mkstat').className='mk-st '+M.status;pg.querySelector('#mkpub').textContent=pub?'UNPUBLISH':'PUBLISH';status('Saved');ms(pub?'Published. It is live on the Magazine page.':'Unpublished. Hidden from the site.')}catch(e){ms(e.message)}};
 let rt;window.addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(()=>{if(document.body.contains(CV))drawCanvas()},200)});
 draw()}
return {mags,maker}};
