/* RAPAECHELON Studio renderer.
   Everything happens in this browser tab: audio / video files are read locally, the design is drawn frame by frame
   on a canvas and recorded straight to a video file. Nothing is uploaded or stored on the server. */
(function(){
const MAXMB=24;            /* aim under 25 MB */
let DSONG='SONG NAME',DART='ARTIST NAME',COVER=null,DMEDIA=null; /* drop inputs */
window.STU={get song(){return DSONG},get art(){return DART},get cover(){return COVER}};
const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);
/* fill the drop design with the real song, artist and cover */
window.fx=(h,live)=>{h=h.replace(/SONG NAME/g,esc(DSONG)).replace(/ARTIST NAME/g,esc(DART));if(COVER)h=h.replace(/class="cover" style="/g,`class="cover has" style="background:url(${COVER}) center/cover;`);
 if(DMEDIA&&DMEDIA.video)h=h.replace(/<div class="vid" style="([^"]*)">YOUR VIDEO<\/div>/g,`<div class="vid md" data-media="1" style="$1">${live||!DMEDIA.poster?`<video src="${DMEDIA.url}" ${live?'autoplay':'preload="metadata"'} muted loop playsinline style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"></video>`:`<img src="${DMEDIA.poster}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">`}</div>`);return h};
/* one still frame of a video, so the design grid does not have to play 20 videos at once */
window.stuPoster=url=>new Promise(res=>{const v=document.createElement('video');v.muted=true;v.playsInline=true;v.preload='auto';v.src=url;let done=0;const end=d=>{if(done)return;done=1;v.removeAttribute('src');v.load();res(d)};
 v.onloadedmetadata=()=>{v.currentTime=Math.min(1,(v.duration||2)/2)};v.onseeked=()=>{try{const k=Math.min(1,720/Math.max(v.videoWidth,v.videoHeight)),c=document.createElement('canvas');c.width=v.videoWidth*k;c.height=v.videoHeight*k;c.getContext('2d').drawImage(v,0,0,c.width,c.height);end(c.toDataURL('image/jpeg',.8))}catch(e){end('')}};v.onerror=()=>end('');setTimeout(()=>end(''),6000)});
const load=(src,ok,no)=>{const x=document.createElement('script');x.src=src;x.onload=ok;x.onerror=no;document.head.appendChild(x)};
const lib=()=>window.htmlToImage?Promise.resolve():new Promise((ok,no)=>load('https://cdn.jsdelivr.net/npm/html-to-image@1.11.11/dist/html-to-image.js',ok,no));
const zipLib=()=>window.JSZip?Promise.resolve():new Promise((ok,no)=>load('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',ok,no));
const pickType=()=>['video/mp4;codecs=avc1.640028,mp4a.40.2','video/mp4;codecs=avc1,mp4a','video/mp4','video/webm;codecs=vp9,opus','video/webm'].find(t=>window.MediaRecorder&&MediaRecorder.isTypeSupported(t));
/* the fonts have to be packed into the picture, or the video falls back to a plain font */
let FONTCSS=null;async function fontCSS(){if(FONTCSS!=null)return FONTCSS;try{const l=[...document.querySelectorAll('link[href*="fonts.googleapis"]')].map(x=>x.href);let out='';
 for(const h of l){const css=await fetch(h).then(r=>r.text());const blocks=css.split('/*').filter(b=>/^\s*latin\s*\*\//.test(b)).map(b=>b.replace(/^\s*latin\s*\*\//,''));
  for(let b of blocks){const m=b.match(/url\((https:[^)]+)\)/);if(!m)continue;const blob=await fetch(m[1]).then(r=>r.blob());const du=await new Promise(r=>{const fr=new FileReader();fr.onload=()=>r(fr.result);fr.readAsDataURL(blob)});out+=b.replace(m[1],du)}}
 FONTCSS=out}catch(e){FONTCSS=''}return FONTCSS}
/* in-page message instead of browser pop-ups */
window.say=t=>{const m=document.createElement('div');m.className='toast';m.textContent=t;document.body.appendChild(m);setTimeout(()=>m.remove(),3500)};
/* ---------- the trimmer: preview with sound, START and END points that loop ---------- */
const fmt=t=>{t=Math.max(0,t||0);return Math.floor(t/60)+':'+String(Math.floor(t%60)).padStart(2,'0')+'.'+Math.floor((t%1)*10)};
window.Trim=function(box){let el=null,A=0,B=0,looping=false;
 const T={get start(){return A},get end(){return B},get has(){return !!el},clear,set};
 function clear(){if(el){el.pause();el.removeAttribute('src');el.load()}el=null;box.innerHTML='';box.hidden=true}
 function set(media){clear();if(!media)return;box.hidden=false;
  box.innerHTML=`<div class="tr-pl"></div><div class="tr-row"><span>START <b class="tr-a">0:00.0</b></span><input type="range" class="tr-sa" min="0" step="0.1" value="0"><button class="tr-btn" data-s="a">SET START HERE</button></div>
  <div class="tr-row"><span>END <b class="tr-b">0:00.0</b></span><input type="range" class="tr-sb" min="0" step="0.1" value="0"><button class="tr-btn" data-s="b">SET END HERE</button></div>
  <div class="tr-row"><button class="tr-btn r tr-play">▶ PLAY THE CUT</button><label class="tr-lp"><input type="checkbox" class="tr-loop" checked> LOOP IT</label><span class="tr-len"></span></div>`;
  el=document.createElement(media.video?'video':'audio');el.src=media.url;el.controls=true;el.playsInline=true;el.preload='auto';box.querySelector('.tr-pl').appendChild(el);
  const sa=box.querySelector('.tr-sa'),sb=box.querySelector('.tr-sb'),show=()=>{box.querySelector('.tr-a').textContent=fmt(A);box.querySelector('.tr-b').textContent=fmt(B);box.querySelector('.tr-len').textContent='Clip: '+fmt(B-A)+(B-A>60?' (long clips make bigger files)':'');sa.value=A;sb.value=B};
  let D=30;el.onloadedmetadata=()=>{D=isFinite(el.duration)?el.duration:30;sa.max=sb.max=D;A=0;B=D;show()};
  /* the markers go exactly where you put them; only if they would cross does the other one move out of the way */
  const setA=t=>{A=Math.max(0,Math.min(t,D-.2));if(B<A+.2)B=D;show()},setB=t=>{B=Math.min(D,Math.max(t,.2));if(A>B-.2)A=0;show()};
  sa.oninput=()=>{looping=false;setA(+sa.value);el.currentTime=A};sb.oninput=()=>{looping=false;setB(+sb.value);el.currentTime=B};
  box.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{looping=false;const t=el.currentTime;b.dataset.s==='a'?setA(t):setB(t)});
  box.querySelector('.tr-play').onclick=()=>{looping=true;el.currentTime=A;el.play()};
  el.onseeking=()=>{if(looping&&(el.currentTime>B+.5||el.currentTime<A-.5))looping=false};
  el.ontimeupdate=()=>{if(looping&&el.currentTime>=B&&el.currentTime<B+.6){if(box.querySelector('.tr-loop').checked)el.currentTime=A;else{el.pause();looping=false}}}}
 clear();return T};
/* ---------- big preview: the design up close, playing with sound between START and END ---------- */
window.previewDesign=(html,H,o={})=>{const m=document.createElement('div');m.className='pv';const k=Math.min((innerHeight-130)/H,(innerWidth-32)/1080);
 m.innerHTML=`<div class="pv-pn"><div class="pv-fr" style="width:${1080*k}px;height:${H*k}px"><div class="v" style="width:1080px;height:${H}px;transform:scale(${k});transform-origin:0 0">${html}</div></div>
 <div class="pv-act"><button class="go pv-ok">THAT'S THE ONE: RENDER</button><button class="rs pv-x">CLOSE</button></div></div>`;document.body.appendChild(m);
 const root=m.querySelector('.v');if(o.place)o.place(root);
 const A=o.start||0,B=o.end||0;let au=null;const vids=[...root.querySelectorAll('video')];
 if(o.audio){au=new Audio(o.audio.url);au.currentTime=A;au.play().catch(()=>{});vids.forEach(v=>v.muted=true)}
 else{vids.forEach((v,i)=>{v.muted=i!==vids.length-1;v.loop=false;v.currentTime=A;v.play().catch(()=>{})})} /* only one copy plays sound */
 const iv=setInterval(()=>{if(!B)return;if(au&&au.currentTime>=B)au.currentTime=A;vids.forEach(v=>{if(v.currentTime>=B||v.ended){v.currentTime=A;v.play().catch(()=>{})}})},100);
 const close=()=>{clearInterval(iv);if(au)au.pause();vids.forEach(v=>v.pause());m.remove()};
 m.querySelector('.pv-x').onclick=close;m.onclick=e=>{if(e.target===m)close()};m.querySelector('.pv-ok').onclick=()=>{close();o.go&&o.go()}};
/* ---------- the progress box ---------- */
function box(title){const m=document.createElement('div');m.className='rb';m.innerHTML=`<div class="rb-pn"><h3>${title}</h3><div class="rb-bar"><i></i></div><p class="rb-st">Getting ready…</p><div class="rb-out"></div><button class="rb-x">CLOSE</button></div>`;document.body.appendChild(m);
 const B={m,stopped:0,st:t=>m.querySelector('.rb-st').textContent=t,bar:k=>m.querySelector('.rb-bar i').style.width=Math.round(k*100)+'%',out:h=>m.querySelector('.rb-out').innerHTML=h};m.querySelector('.rb-x').onclick=()=>{B.stopped=1;m.remove()};return B}
/* draw an image/video into a box like object-fit:cover with the user's position and zoom */
function cover(ctx,src,r,S,filter){const sw=src.videoWidth||src.naturalWidth||src.width,sh=src.videoHeight||src.naturalHeight||src.height;if(!sw||!sh)return;
 const k=Math.max(r.w/sw,r.h/sh),dw=sw*k,dh=sh*k,px=(S.x??50)/100,py=(S.y??50)/100,z=S.z||1;
 ctx.save();ctx.beginPath();ctx.rect(r.x,r.y,r.w,r.h);ctx.clip();if(filter)ctx.filter=filter;
 const ox=r.x+(r.w-dw)*px,oy=r.y+(r.h-dh)*py,cx=r.x+r.w*px,cy=r.y+r.h*py;ctx.translate(cx,cy);ctx.scale(z,z);ctx.translate(-cx,-cy);ctx.drawImage(src,ox,oy,dw,dh);ctx.restore()}
/* the audio wave, drawn live from the music */
function wave(ctx,w,an,data){const n=w.n,bw=16,gap=10,tot=n*bw+(n-1)*gap,sx=w.x+(w.w-tot)/2;an.getByteFrequencyData(data);ctx.fillStyle=w.color;
 for(let i=0;i<n;i++){const v=data[Math.floor(3+i*(data.length*.55)/n)]/255,h=Math.max(bw,w.h*(.15+.85*v));const x=sx+i*(bw+gap),y=w.y+(w.h-h)/2;ctx.beginPath();ctx.roundRect?ctx.roundRect(x,y,bw,h,8):ctx.rect(x,y,bw,h);ctx.fill()}}
/* ---------- core: one design -> {blob,ext}. o: {media:{url,video}, audio:{file}, start, end, S, still, place} ---------- */
async function core(html,H,o,B){await lib();B.st((o.label||'')+'Laying out the design…');
 const off=document.createElement('div');off.style.cssText=`position:fixed;left:-20000px;top:0;width:1080px;height:${H}px;overflow:hidden`;off.innerHTML=`<div class="v" style="transform:none;position:relative;width:1080px;height:${H}px">${html}</div>`;document.body.appendChild(off);
 let medias,waves,overlay;
 try{if(o.place)o.place(off);
  await Promise.all([...off.querySelectorAll('img')].map(i=>i.complete?0:new Promise(r=>{i.onload=i.onerror=r})));await document.fonts.ready;
  const root=off.firstElementChild,R0=root.getBoundingClientRect(),rect=el=>{const r=el.getBoundingClientRect();return {x:r.left-R0.left,y:r.top-R0.top,w:r.width,h:r.height}};
  medias=[...root.querySelectorAll('.md')].map(el=>({...rect(el),filter:el.style.filter||'',el}));
  waves=[...root.querySelectorAll('.wave')].map(el=>({...rect(el),n:el.children.length,color:getComputedStyle(el).color,el}));
  medias.forEach(m=>{m.el.style.visibility='hidden'});root.style.background='transparent';waves.forEach(w=>{w.el.style.visibility='hidden'});root.querySelectorAll('video').forEach(v=>v.remove());
  root.querySelectorAll('*').forEach(e=>{e.style.animation='none'});
  B.st((o.label||'')+'Drawing the words and logo…');const fc=await fontCSS();overlay=await htmlToImage.toCanvas(root,{width:1080,height:H,pixelRatio:1,cacheBust:false,...(fc?{fontEmbedCSS:fc}:{})})}finally{off.remove()}
 const cv=document.createElement('canvas');cv.width=1080;cv.height=H;const ctx=cv.getContext('2d');
 let img=null,vid=null;if(o.media&&o.media.url){if(o.media.video){vid=document.createElement('video');vid.src=o.media.url;vid.playsInline=true;vid.preload='auto';await new Promise((ok,no)=>{vid.onloadedmetadata=ok;vid.onerror=()=>no(new Error('Could not read that video'))})}
  else{img=new Image();img.src=o.media.url;await img.decode()}}
 const frame=()=>{ctx.fillStyle='#000';ctx.fillRect(0,0,1080,H);medias.forEach(m=>{const src=vid||img;if(src)cover(ctx,src,m,o.S||{},m.filter)});ctx.drawImage(overlay,0,0)};
 if(o.still||(!vid&&!o.audio)){frame();return {blob:await new Promise(r=>cv.toBlob(r,'image/jpeg',.93)),ext:'jpg'}}
 /* sound: from the audio file, or from the video's own sound */
 const AC=new (window.AudioContext||window.webkitAudioContext)(),dest=AC.createMediaStreamDestination(),an=AC.createAnalyser();an.fftSize=256;an.smoothingTimeConstant=.75;const data=new Uint8Array(an.frequencyBinCount);an.connect(dest);
 let start=Math.max(0,o.start||0),dur=Math.max(.5,(o.end||start+30)-start),srcNode=null;
 try{if(o.audio){B.st((o.label||'')+'Reading the song…');const buf=await AC.decodeAudioData(await o.audio.file.arrayBuffer());start=Math.min(start,Math.max(0,buf.duration-1));dur=Math.min(dur,buf.duration-start);srcNode=AC.createBufferSource();srcNode.buffer=buf;srcNode.connect(an)}
  else if(vid){start=Math.min(start,Math.max(0,vid.duration-.5));dur=Math.min(dur,vid.duration-start);AC.createMediaElementSource(vid).connect(an)}
  let vs=start;if(vid){if(o.audio){vid.muted=true;vs=Math.min(o.vstart||0,Math.max(0,vid.duration-.5))}vid.currentTime=vs;await new Promise(r=>vid.onseeked=r)}
  const type=pickType();if(!type)throw new Error('This browser cannot record video. Use Chrome or Edge.');
  /* quality: as high as fits under 25 MB for this length */
  const vbps=Math.max(1.5e6,Math.min(8e6,Math.floor((MAXMB*8e6)/dur)-160e3));
  const stream=new MediaStream([...cv.captureStream(30).getVideoTracks(),...dest.stream.getAudioTracks()]);
  const rec=new MediaRecorder(stream,{mimeType:type,videoBitsPerSecond:vbps,audioBitsPerSecond:128000});const chunks=[];rec.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};
  frame();await AC.resume();rec.start(500);if(srcNode)srcNode.start(0,start,dur);if(vid)await vid.play();const t0=performance.now();
  B.st((o.label||'')+'Recording… keep this tab open (it takes as long as the clip).');
  await new Promise(res=>{const tick=()=>{if(B.stopped)return res();const t=(performance.now()-t0)/1000;
   if(vid&&!o.audio&&vid.currentTime>=start+dur-.03)vid.pause();
   if(vid&&o.audio&&(vid.ended||vid.currentTime>=vid.duration-.05)){vid.currentTime=vs;vid.play()} /* a short video loops under a longer song */
   frame();waves.forEach(w=>wave(ctx,w,an,data));B.bar(Math.min(1,((o.done||0)+Math.min(1,t/dur))/(o.total||1)));if(t>=dur)return res();requestAnimationFrame(tick)};tick()});
  rec.stop();await new Promise(r=>rec.onstop=r);
  return {blob:new Blob(chunks,{type:type.split(';')[0]}),ext:type.includes('mp4')?'mp4':'webm'}}
 finally{if(vid){vid.pause();vid.removeAttribute('src');vid.load()}if(srcNode)try{srcNode.stop()}catch(e){};AC.close()}}
const slug=s=>String(s||'post').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,40)||'post';
const resHTML=(r,u)=>r.ext==='jpg'?`<img src="${u}">`:`<video src="${u}" controls playsinline></video>`;
/* one design, with its own result box */
window.renderDesign=async(html,H,o)=>{const B=box(o.still||(!o.audio&&!(o.media&&o.media.video))?'MAKING YOUR PICTURE':'MAKING YOUR VIDEO');
 try{const r=await core(html,H,o,B);if(B.stopped)return;const mb=(r.blob.size/1048576).toFixed(1),u=URL.createObjectURL(r.blob),name=`rapaechelon-${slug(o.name)}.${r.ext}`;B.bar(1);
  B.st(`Done: ${mb} MB${r.blob.size>25*1048576?' (over 25 MB, use a shorter cut)':''}.`);
  B.out(`${resHTML(r,u)}<div class="rb-act"><a class="rb-dl" href="${u}" download="${name}">SAVE ${r.ext==='jpg'?'PICTURE':'VIDEO'}</a><button class="rb-sh">SHARE</button><button class="rb-ig">✉ SHARE / EMAIL</button></div>${r.ext==='webm'?'<small>This browser saves WEBM. Use Chrome or Edge for MP4.</small>':''}`);
  B.m.querySelector('.rb-ig').onclick=()=>window.SHARE?SHARE.panel(r.blob,{h:H,name,ctx:o.ctx||{}}):say('The share box did not load. Refresh the page.');
  if(o.share)B.m.querySelector('.rb-ig').click(); /* RENDER + EMAIL: straight to the share box when it is done */
  B.m.querySelector('.rb-sh').onclick=async()=>{const f=new File([r.blob],name,{type:r.blob.type});if(navigator.canShare&&navigator.canShare({files:[f]}))await navigator.share({files:[f]}).catch(()=>{});else B.st('Sharing works on phones. On a computer, click SAVE.')}}
 catch(e){B.st('Could not make it: '+(e.message||e))}};
/* many designs (carousel): renders one after another, then one ZIP with everything */
window.renderMany=async(jobs,title)=>{const B=box('MAKING YOUR CAROUSEL');const out=[];
 try{for(let i=0;i<jobs.length;i++){if(B.stopped)return;const j=jobs[i];const r=await core(j.html,j.H,{...j.o,label:`Slide ${i+1} of ${jobs.length}: `,done:i,total:jobs.length},B);out.push({...r,name:`${String(i+1).padStart(2,'0')}-${slug(j.name)}.${r.ext}`})}
  if(B.stopped)return;B.bar(1);B.st('Packing them together…');await zipLib();const z=new JSZip();out.forEach(f=>z.file(f.name,f.blob));const zb=await z.generateAsync({type:'blob'});
  const tot=out.reduce((a,f)=>a+f.blob.size,0);B.st(`Done: ${out.length} files, ${(tot/1048576).toFixed(1)} MB in all.`);
  B.out(`<div class="rb-act"><a class="rb-dl" href="${URL.createObjectURL(zb)}" download="rapaechelon-carousel-${slug(title)}.zip">DOWNLOAD ALL (ZIP)</a><button class="rb-sh">SHARE ALL</button></div><div class="rb-grid">${out.map(f=>{const u=URL.createObjectURL(f.blob);return `<div>${resHTML(f,u)}<a href="${u}" download="${f.name}">SAVE ${f.name.slice(0,2)} · ${(f.blob.size/1048576).toFixed(1)} MB</a></div>`}).join('')}</div>`);
  B.m.querySelector('.rb-sh').onclick=async()=>{const fs=out.map(f=>new File([f.blob],f.name,{type:f.blob.type}));if(navigator.canShare&&navigator.canShare({files:fs}))await navigator.share({files:fs}).catch(()=>{});else B.st('Sharing works on phones. On a computer, click DOWNLOAD ALL.')}}
 catch(e){B.st('Could not make it: '+(e.message||e))}};
/* ---------- wiring for The Drop and News ---------- */
const fresh=inp=>{const f=inp.files[0];inp.value='';return f}; /* lets you pick the same file again */
window.stuFresh=fresh;
window.stuInit=()=>{const $=s=>document.querySelector(s);let rt;const redraw=()=>{clearTimeout(rt);rt=setTimeout(()=>draw(),200)};
 $('#ds').oninput=()=>{DSONG=$('#ds').value||'SONG NAME';redraw()};$('#da').oninput=()=>{DART=$('#da').value||'ARTIST NAME';redraw()};
 $('#dc').onchange=()=>{const f=fresh($('#dc'));if(f){if(COVER)URL.revokeObjectURL(COVER);COVER=URL.createObjectURL(f);redraw()}};
 const dtrim=Trim($('#dtrim'));
 $('#dm').onchange=()=>{const f=fresh($('#dm'));if(!f)return;if(DMEDIA)URL.revokeObjectURL(DMEDIA.url);DMEDIA={file:f,url:URL.createObjectURL(f),video:/^video\//.test(f.type)};$('#dmn').textContent=f.name+' ('+(f.size/1048576).toFixed(1)+' MB, stays on this computer)';dtrim.set(DMEDIA);const M=DMEDIA;if(M.video)stuPoster(M.url).then(p=>{if(DMEDIA===M){M.poster=p;redraw()}});else redraw()};
 $('#dclr').onclick=()=>{if(DMEDIA)URL.revokeObjectURL(DMEDIA.url);DMEDIA=null;COVER=null;dtrim.clear();$('#dmn').textContent='Cleared. Add a new song or video.';redraw()};
 const dgo=share=>{if(!DMEDIA)return say('Add the song (MP3/OGG/WAV) or a video (MP4) first.');const [n,,h]=TT()[SEL];
  renderDesign(fx(h),1920,{share:share===true,name:DART+' '+DSONG,ctx:{type:'drop',artist:DART!=='ARTIST NAME'?DART:'',song:DSONG!=='SONG NAME'?DSONG:''},start:dtrim.start,end:dtrim.end,audio:DMEDIA.video?null:DMEDIA,media:DMEDIA.video?DMEDIA:null,S:{x:50,y:50,z:1},place:r=>placeIn(r,st(SEL))})};
 $('#drender').onclick=()=>dgo();$('#demail').onclick=()=>dgo(true);
 $('#dprev').onclick=()=>{const [,,h]=TT()[SEL];previewDesign(fx(h,true),1920,{place:r=>placeIn(r,st(SEL)),audio:DMEDIA&&!DMEDIA.video?DMEDIA:null,start:dtrim.start,end:dtrim.end,go:dgo})};
 const ntrim=Trim($('#ntrim'));window._ntrim=ntrim;
 $('#nclr').onclick=()=>{if(NM)URL.revokeObjectURL(NM);NM=null;NMV=0;NPOSTER='';ntrim.clear();ndraw()};
 const ngo=share=>{const [,,f]=NT()[NSEL];if(!NM)return say('Add a photo or video first.');renderDesign(f(NSEL),NH(),{share:share===true,name:nt.value,ctx:{type:'news',title:nt.value,cap:ncap.value},start:ntrim.start,end:ntrim.end,media:{url:NM,video:NMV},S:ns(NSEL),still:!NMV})};
 $('#nrender').onclick=()=>ngo();$('#nemail').onclick=()=>ngo(true);
 $('#nprev').onclick=()=>{const [,,f]=NT()[NSEL];NLIVE=1;const html=f(NSEL);NLIVE=0;previewDesign(html,NH(),{place:r=>r.querySelectorAll('.md').forEach(m=>{const S=ns(NSEL),el=m.querySelector('img,video');if(el){el.style.objectPosition=S.x+'% '+S.y+'%';el.style.transform=`scale(${S.z})`;el.style.transformOrigin=S.x+'% '+S.y+'%'}}),start:ntrim.start,end:ntrim.end,go:ngo})};
};
/* ---------- CAROUSEL: a cover slide plus 2-10 slides, each with its own picture/video, sound and cut ---------- */
function carInit(){const $=s=>document.querySelector(s),list=$('#cslides');const SL=[];let CD=0;
 const opts=()=>NT().map(([n],i)=>`<option value="${i}"${i===CD?' selected':''}>${n}</option>`).join('');$('#cdes').innerHTML=opts();$('#cdes').onchange=()=>CD=+$('#cdes').value;
 const slide=(cov)=>{const s={vis:null,au:null};const d=document.createElement('div');d.className='cs';
  d.innerHTML=`<div class="cs-h"><b class="cs-n"></b>${cov?'':'<button class="rs cs-del">REMOVE</button>'}</div>
  <input class="tx cs-t" placeholder="${cov?'Cover title, e.g. THE BEST 5 BEATS TUPAC HAD':'Title, e.g. #5 CALIFORNIA LOVE'}"><input class="tx cs-c" placeholder="Caption (optional)">
  <div class="cs-b"><label class="up">+ PICTURE OR VIDEO<input type="file" class="cs-v" accept="image/*,video/*" hidden></label><label class="up gr">+ SOUND (optional)<input type="file" class="cs-a" accept="audio/*,.ogg,.mp3,.wav,.m4a" hidden></label><button class="rs cs-clr">CLEAR</button><small class="cs-f">No picture or video yet.</small></div><div class="trim cs-tr" hidden></div>`;
  s.el=d;s.cov=cov;s.trim=Trim(d.querySelector('.cs-tr'));
  const note=()=>{d.querySelector('.cs-f').textContent=[s.vis?s.vis.file.name:'No picture or video yet.',s.au?'♪ '+s.au.file.name:''].filter(Boolean).join('  ·  ');s.trim.set(s.au||(s.vis&&s.vis.video?s.vis:null))};
  const pick=(inp,k)=>inp.onchange=()=>{const f=fresh(inp);if(!f)return;if(s[k])URL.revokeObjectURL(s[k].url);s[k]={file:f,url:URL.createObjectURL(f),video:/^video\//.test(f.type)};note()};
  pick(d.querySelector('.cs-v'),'vis');pick(d.querySelector('.cs-a'),'au');
  d.querySelector('.cs-clr').onclick=()=>{['vis','au'].forEach(k=>{if(s[k])URL.revokeObjectURL(s[k].url);s[k]=null});note()};
  if(!cov)d.querySelector('.cs-del').onclick=()=>{if(SL.length<=3)return say('A carousel needs at least 2 slides after the cover.');SL.splice(SL.indexOf(s),1);d.remove();num()};
  list.appendChild(d);SL.push(s);num();return s};
 const num=()=>SL.forEach((s,i)=>s.el.querySelector('.cs-n').textContent=s.cov?'COVER':'SLIDE '+i);
 slide(true);slide();slide();
 $('#cadd').onclick=()=>{if(SL.length>=11)return say('10 slides is the most.');slide()};
 /* build the design html for one slide using the News design the user picked */
 const job=(s,i)=>{const keep=[NM,NMV,nt.value,ncap.value];NM=s.vis?s.vis.url:null;NMV=s.vis?s.vis.video:0;nt.value=s.el.querySelector('.cs-t').value||'';ncap.value=s.el.querySelector('.cs-c').value||'';
  const html=NT()[CD][2](CD);[NM,NMV,nt.value,ncap.value]=keep;
  const has=s.au||(s.vis&&s.vis.video);return {html,H:NH(),name:nt.value&&0||s.el.querySelector('.cs-t').value||(s.cov?'cover':'slide-'+i),o:{media:s.vis,audio:s.au,start:s.trim.start,end:s.trim.end,S:ns(CD),still:!has}}};
 $('#cprev').onclick=()=>{let i=0;const go=()=>{const s=SL[i],j=job(s,i);previewDesign(j.html,j.H,{audio:s.au,start:s.trim.start,end:s.trim.end,go:i<SL.length-1?()=>{i++;go()}:null});const ok=document.querySelector('.pv-ok');ok.textContent=i<SL.length-1?'NEXT SLIDE ▶':'LAST SLIDE';if(i>=SL.length-1)ok.onclick=()=>document.querySelector('.pv-x').click()};go()};
 $('#crender').onclick=()=>{const miss=SL.findIndex(s=>!s.vis);if(miss>=0)return say((miss?'Slide '+miss:'The cover')+' needs a picture or video.');
  renderMany(SL.map(job),SL[0].el.querySelector('.cs-t').value||'carousel')}}
})();
