/* Studio extras: music, auto zoom, shake, split screen, stickers, ending lines, story from a link,
   both sizes, batch render, favourite layouts, keyboard shortcuts, phone view, background remover, spell check */
(()=>{
const $=s=>document.querySelector(s),H=(t,h)=>{const d=document.createElement(t);d.innerHTML=h;return d};
const NX=window.NX={music:null,fx:{zoom:false,shake:false},m2:null,sticker:'',ending:''};
const LS={get(k,d){try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
window.NXo=()=>({...(NX.music?{audio:{file:NX.music}}:{}),fx:NX.fx,...(NX.m2&&NFIT==='split'?{media2:NX.m2}:{})});
const STK={'':'','🔥 HOT':'#f97316','🚨 BREAKING':'#e11d2a','NEW':'#16a34a','● LIVE':'#e11d2a','EXCLUSIVE':'#f5b301','👀 LOOK':'#7c3aed','💯':'#000','W':'#16a34a','L':'#e11d2a','JUST IN':'#1d4ed8'};
const END=['','WHO\'S BETTER? COMMENT 👇','DROP YOUR TAKE BELOW 👇','AGREE OR NAH? 👇','RATE IT 1-10 👇','TAG A FRIEND WHO NEEDS TO SEE THIS','TAG SOMEONE WHO SAID THIS WAS FAKE','SEND THIS TO YOUR GROUP CHAT'];
const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);
window.NXover=()=>{let h='';const p=typeof P==='function'&&P();
 if(NX.sticker){const c=STK[NX.sticker]||'#e11d2a',dark=c==='#f5b301';h+=`<div style="position:absolute;right:40px;top:${p?170:250}px;rotate:8deg;background:${c};color:${dark?'#000':'#fff'};font:400 ${p?54:66}px/1 Anton;padding:10px 26px;border-radius:14px;border:5px solid #fff;box-shadow:0 10px 30px rgba(0,0,0,.6);z-index:5">${esc(NX.sticker)}</div>`}
 if(NX.ending)h+=`<div style="position:absolute;left:0;right:0;bottom:${p?14:24}px;text-align:center;z-index:5"><span style="display:inline-block;background:#fff;color:#000;font:800 ${p?24:28}px Inter;letter-spacing:.06em;padding:8px 20px;border-radius:40px">${esc(NX.ending)}</span></div>`;
 return h};
const css=`.nx{background:#141418;border:1px solid #2a2a31;border-radius:14px;padding:14px;margin:0 0 18px;display:flex;flex-wrap:wrap;gap:10px;align-items:center}
.nx h4{width:100%;margin:0;font:800 13px Inter;letter-spacing:.18em;color:#f5b301}.nx label,.nx button,.nx select{background:#22222a;border:1px solid #33333c;color:#fff;border-radius:9px;padding:9px 12px;font:700 12px Inter;cursor:pointer}
.nx button.on,.nx label.on{background:#e11d2a;border-color:#e11d2a}.nx input[type=text]{background:#0c0c10;border:1px solid #33333c;color:#fff;border-radius:9px;padding:9px 12px;font:600 12px Inter;min-width:220px;flex:1}
.nx small{color:#999;font:500 11px Inter}.star{position:absolute;top:8px;right:8px;z-index:9;background:rgba(0,0,0,.7);border:0;border-radius:50%;width:34px;height:34px;font-size:17px;cursor:pointer;color:#fff}.star.on{color:#f5b301}
.it{position:relative}.ph-m{position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:99;display:grid;place-items:center}.ph-f{width:380px;height:780px;border:12px solid #111;border-radius:48px;background:#000;position:relative;overflow:hidden;box-shadow:0 0 0 2px #444}
.ph-ui{position:absolute;left:0;right:0;color:#fff;font:600 12px Inter;padding:10px 14px;z-index:3}.kb{position:fixed;inset:0;background:rgba(0,0,0,.8);z-index:99;display:grid;place-items:center}.kb div{background:#141418;border-radius:14px;padding:22px 28px;color:#fff;font:500 14px/2 Inter}.kb b{display:inline-block;min-width:70px;background:#333;border-radius:6px;text-align:center;margin-right:12px}`;
{const st=document.createElement('style');st.textContent=css;document.head.appendChild(st)}

/* ---------- NEWS extras panel ---------- */
const ng=$('#ng');if(ng){
 const box=H('div',`<h4>EXTRAS</h4>
<label id="nxm">🎵 ADD MUSIC<input type="file" accept="audio/*" hidden></label><small id="nxmn">No music. A photo plus music makes a video.</small><button id="nxmc" hidden>✕ MUSIC</button>
<button id="nxz">🔍 AUTO ZOOM</button><button id="nxs">💥 SHAKE ON HIT</button>
<label id="nx2">🎬 2ND PHOTO/VIDEO FOR SPLIT<input type="file" accept="image/*,video/*" hidden></label>
<select id="nxst">${Object.keys(STK).map(k=>`<option value="${k}">${k?'STICKER: '+k:'STICKER: none'}</option>`).join('')}</select>
<select id="nxe">${END.map(k=>`<option value="${esc(k)}">${k?'ENDING: '+esc(k):'ENDING LINE: none'}</option>`).join('')}</select>
<input type="text" id="nxl" placeholder="🔗 Paste a news link to fill the title, caption and photo"><button id="nxlg">GET STORY</button>
<button id="nxph">📱 PHONE VIEW</button><button id="nxboth">⬇ BOTH SIZES (9:16 + 4:5)</button><button id="nxadd">+ ADD TO BATCH</button><button id="nxrun">▶ RENDER BATCH (0)</button><button id="nxkb">⌨ SHORTCUTS</button>`);
 box.className='nx';ng.parentNode.insertBefore(box,ng);
 const redraw=()=>{try{ndraw()}catch(e){}};
 $('#nxm input').onchange=ev=>{const f=ev.target.files[0];ev.target.value='';if(!f)return;NX.music=f;$('#nxmn').textContent='🎵 '+f.name+' (plays under the video, 30 s)';$('#nxmc').hidden=false;$('#nxm').classList.add('on')};
 $('#nxmc').onclick=()=>{NX.music=null;$('#nxmn').textContent='No music.';$('#nxmc').hidden=true;$('#nxm').classList.remove('on')};
 const tog=(id,k)=>$(id).onclick=()=>{NX.fx[k]=!NX.fx[k];$(id).classList.toggle('on',NX.fx[k])};tog('#nxz','zoom');tog('#nxs','shake');
 $('#nx2 input').onchange=ev=>{const f=ev.target.files[0];ev.target.value='';if(!f)return;if(NX.m2)URL.revokeObjectURL(NX.m2.url);NX.m2={url:URL.createObjectURL(f),video:/^video\//.test(f.type)};$('#nx2').classList.add('on');
  const b=document.querySelector('[data-nfit="split"]');if(b&&NFIT!=='split')b.click();else redraw()};
 $('#nxst').onchange=ev=>{NX.sticker=ev.target.value;redraw()};$('#nxe').onchange=ev=>{NX.ending=ev.target.value;redraw()};
 /* story from a link */
 $('#nxlg').onclick=async()=>{const u=$('#nxl').value.trim();if(!/^https?:\/\//.test(u))return say('Paste a full link that starts with https://');const API=window.RM_API||'';$('#nxlg').textContent='LOADING…';
  try{const r=await fetch(API+'/api/og?url='+encodeURIComponent(u));const d=await r.json();if(!r.ok||!d.title)throw new Error(d.error||'no story found');
   nt.value=d.title;ncap.value=d.desc||'';
   if(d.image){try{const bl=await fetch(API+'/api/og/img?url='+encodeURIComponent(d.image)).then(x=>{if(!x.ok)throw 0;return x.blob()});if(NM)URL.revokeObjectURL(NM);NM=URL.createObjectURL(bl);NMV=0;NPOSTER='';window._ntrim&&_ntrim.clear()}catch(e){say('Got the story, but not its photo. Add one yourself.')}}
   redraw();say('Story filled in. Check the title before you render.')}
  catch(e){say('Could not read that link: '+(e.message||e))}finally{$('#nxlg').textContent='GET STORY'}};
 /* batch + both sizes */
 const job=async lbl=>{const f=NT()[NSEL][2],keep=async u=>u?URL.createObjectURL(await fetch(u).then(r=>r.blob())):u;
  const media={url:await keep(NM),video:NMV},m2=NX.m2&&NFIT==='split'?{...NX.m2,url:await keep(NX.m2.url)}:null;
  return {html:f(NSEL),H:NH(),name:(lbl||'')+nt.value,o:{media,...(m2?{media2:m2}:{}),...(NX.music?{audio:{file:NX.music}}:{}),fx:{...NX.fx},S:{...ns(NSEL)},still:!NMV&&!NX.music,start:window._ntrim&&_ntrim.start,end:window._ntrim&&_ntrim.end}}};
 const BATCH=[];const cnt=()=>$('#nxrun').textContent=`▶ RENDER BATCH (${BATCH.length})`;
 $('#nxadd').onclick=async()=>{if(!NM)return say('Add a photo or video first.');BATCH.push(await job());cnt();say(`Added "${NT()[NSEL][0]}" to the batch (${BATCH.length}). Change things and add more.`)};
 $('#nxrun').onclick=()=>{if(!BATCH.length)return say('Add designs with + ADD TO BATCH first.');renderMany(BATCH.splice(0),'batch '+nt.value);cnt()};
 $('#nxboth').onclick=async()=>{if(!NM)return say('Add a photo or video first.');const was=NSZ,jobs=[];for(const z of ['story','post']){NSZ=z;jobs.push(await job(z==='story'?'9x16 ':'4x5 '))}NSZ=was;renderMany(jobs,nt.value)};
 $('#nxph').onclick=()=>phone(()=>{NLIVE=1;const h=NT()[NSEL][2](NSEL);NLIVE=0;return h},NH(),true);
 $('#nxkb').onclick=help;
}
/* ---------- DROP extras ---------- */
const g=$('#g');if(g){
 const box=H('div',`<h4>EXTRAS</h4><button id="dxbg">✂ REMOVE BACKGROUND FROM A PHOTO</button><small id="dxbgn">Pick a normal photo of the artist and it cuts them out for the designs (first time takes ~30 s to load).</small><input type="file" id="dxbgf" accept="image/*" hidden>
<button id="dxz">🔍 AUTO ZOOM</button><button id="dxs">💥 SHAKE ON HIT</button><button id="dxph">📱 PHONE VIEW</button><button id="dxkb">⌨ SHORTCUTS</button>`);
 box.className='nx';g.parentNode.insertBefore(box,g);
 $('#dxbg').onclick=()=>$('#dxbgf').click();
 $('#dxbgf').onchange=async ev=>{const f=ev.target.files[0];ev.target.value='';if(!f)return;const n=$('#dxbgn');n.textContent='Loading the cut-out tool…';
  try{const m=await import('https://esm.sh/@imgly/background-removal@1.4.5');n.textContent='Cutting out the person…';
   const bl=await m.removeBackground(f,{progress:(k,c,t)=>{if(t)n.textContent=`Loading the cut-out tool… ${Math.round(c/t*100)}%`}});ART=URL.createObjectURL(bl);draw();n.textContent='Done. The cut-out is in every design.'}
  catch(e){n.textContent='Could not cut it out: '+(e.message||e)}};
 const tog=(id,k)=>$(id).onclick=()=>{NX.fx[k]=!NX.fx[k];document.querySelectorAll(`#nx${k[0]},#dx${k[0]}`).forEach(b=>b.classList.toggle('on',NX.fx[k]))};tog('#dxz','zoom');tog('#dxs','shake');
 $('#dxph').onclick=()=>phone(()=>fx(TT()[SEL][2],true),1920,false);$('#dxkb').onclick=help;
}
/* ---------- phone view: the design inside a phone with Instagram-style buttons ---------- */
function phone(mk,h,news){const m=H('div','');m.className='ph-m';const k=356/1080;
 m.innerHTML=`<div><div class="ph-f"><div class="ph-ui" style="top:0;display:flex;gap:8px;align-items:center;background:linear-gradient(rgba(0,0,0,.5),transparent)"><span style="width:28px;height:28px;border-radius:50%;background:#e11d2a;display:inline-block"></span><b>rapaechelon</b> <span style="opacity:.6">2h</span></div>
<div style="position:absolute;left:0;top:${h<1920?110:0}px;width:1080px;height:${h}px;transform:scale(${k});transform-origin:0 0" class="v ph-v">${mk()}</div>
<div class="ph-ui" style="bottom:0;display:flex;gap:16px;font-size:20px;background:linear-gradient(transparent,rgba(0,0,0,.6))">♡ 💬 ➤<span style="margin-left:auto">🔖</span></div></div>
<p style="text-align:center;color:#aaa;font:600 13px Inter">How it looks on a phone. Click anywhere to close.</p></div>`;
 document.body.appendChild(m);m.onclick=()=>m.remove();
 if(news)m.querySelectorAll('.md').forEach(x=>{const S=ns(NSEL),el=x.querySelector('img,video');if(el&&!x.hasAttribute('data-n2')&&!x.dataset.fit){el.style.objectPosition=S.x+'% '+S.y+'%';el.style.transform=`scale(${S.z})`;el.style.transformOrigin=S.x+'% '+S.y+'%'}});
 else try{placeIn(m.querySelector('.ph-v'),st(SEL))}catch(e){}}
/* ---------- favourite layouts: a star on every card, starred ones move to the front ---------- */
const FAV=new Set(LS.get('stu_fav',[]));
const stars=grid=>{if(!grid)return;grid.querySelectorAll('.it').forEach(it=>{const n=(it.querySelector('b')||{}).textContent;if(!n||it.querySelector('.star'))return;const on=FAV.has(n);it.style.order=on?-1:0;
  const b=H('div',`<button class="star${on?' on':''}" title="Favourite">${on?'★':'☆'}</button>`).firstChild;it.appendChild(b);
  b.onclick=ev=>{ev.stopPropagation();FAV.has(n)?FAV.delete(n):FAV.add(n);LS.set('stu_fav',[...FAV]);const o=FAV.has(n);b.classList.toggle('on',o);b.textContent=o?'★':'☆';it.style.order=o?-1:0}})};
[g,ng].forEach(x=>{if(!x)return;stars(x);new MutationObserver(()=>stars(x)).observe(x,{childList:true})});
/* ---------- keyboard shortcuts ---------- */
function help(){const m=H('div',`<div><b>R</b>Render the picked design<br><b>P</b>Preview it<br><b>V</b>Phone view<br><b>← →</b>Pick the design before / after<br><b>S</b>Star the picked design<br><b>B</b>Add to batch (News)<br><b>?</b>This list<br><small style="color:#999">Click anywhere to close</small></div>`);m.className='kb';document.body.appendChild(m);m.onclick=()=>m.remove()}
addEventListener('keydown',ev=>{if(ev.ctrlKey||ev.metaKey||ev.altKey||/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName))return;
 const news=$('#t-news')&&!$('#t-news').hidden,drop=$('#t-drop')&&!$('#t-drop').hidden;if(!news&&!drop)return;const pre=news?'n':'d',k=ev.key.toLowerCase(),c=s=>{const x=$(s);if(x){ev.preventDefault();x.click()}};
 if(k==='r')c('#'+pre+'render');else if(k==='p')c('#'+pre+'prev');else if(k==='v')c(news?'#nxph':'#dxph');else if(k==='b'&&news)c('#nxadd');else if(k==='?')help();
 else if(k==='s')c((news?'#ng':'#g')+' .it.sel .star');
 else if(k==='arrowright'||k==='arrowleft'){const L=[...document.querySelectorAll((news?'#ng':'#g')+' .it')].sort((a,b)=>(+a.style.order||0)-(+b.style.order||0)),i=L.findIndex(x=>x.classList.contains('sel')),n=L[i+(k==='arrowright'?1:-1)];if(n){ev.preventDefault();n.click();n.scrollIntoView({block:'nearest'})}}});
/* ---------- spell check on every text box ---------- */
document.querySelectorAll('input.tx,#ds,#da,textarea').forEach(x=>{x.spellcheck=true;x.lang='en'});
})();
