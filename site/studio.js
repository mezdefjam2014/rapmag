/* RAPAECHELON Studio renderer.
   Everything happens in this browser tab: the audio / video files are read locally, the design is drawn frame by frame
   on a canvas and recorded straight to a video file. Nothing is uploaded or stored on the server. */
(function(){
const MAXMB=24;            /* aim under 25 MB */
let DSONG='SONG NAME',DART='ARTIST NAME',COVER=null,DMEDIA=null; /* drop inputs */
window.STU={get song(){return DSONG},get art(){return DART},get cover(){return COVER}};
/* fill the drop design with the real song, artist and cover */
window.fx=h=>{h=h.replace(/SONG NAME/g,esc(DSONG)).replace(/ARTIST NAME/g,esc(DART));if(COVER)h=h.replace(/class="cover" style="/g,`class="cover has" style="background:url(${COVER}) center/cover;`);
 if(DMEDIA&&DMEDIA.video)h=h.replace(/<div class="vid" style="([^"]*)">YOUR VIDEO<\/div>/g,`<div class="vid md" data-media="1" style="$1"><video src="${DMEDIA.url}" autoplay muted loop playsinline style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"></video></div>`);return h};
const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);
const lib=()=>window.htmlToImage?Promise.resolve():new Promise((ok,no)=>{const x=document.createElement('script');x.src='https://cdn.jsdelivr.net/npm/html-to-image@1.11.11/dist/html-to-image.js';x.onload=ok;x.onerror=no;document.head.appendChild(x)});
/* the fonts have to be packed into the picture, or the video falls back to a plain font */
let FONTCSS=null;async function fontCSS(){if(FONTCSS!=null)return FONTCSS;try{const l=[...document.querySelectorAll('link[href*="fonts.googleapis"]')].map(x=>x.href);let out='';
 for(const h of l){const css=await fetch(h).then(r=>r.text());const blocks=css.split('/*').filter(b=>/^\s*latin\s*\*\//.test(b)).map(b=>b.replace(/^\s*latin\s*\*\//,''));
  for(let b of blocks){const m=b.match(/url\((https:[^)]+)\)/);if(!m)continue;const blob=await fetch(m[1]).then(r=>r.blob());const du=await new Promise(r=>{const fr=new FileReader();fr.onload=()=>r(fr.result);fr.readAsDataURL(blob)});out+=b.replace(m[1],du)}}
 FONTCSS=out}catch(e){FONTCSS=''}return FONTCSS}
const pickType=()=>['video/mp4;codecs=avc1.640028,mp4a.40.2','video/mp4;codecs=avc1,mp4a','video/mp4','video/webm;codecs=vp9,opus','video/webm'].find(t=>window.MediaRecorder&&MediaRecorder.isTypeSupported(t));
/* the progress box */
function box(title){const m=document.createElement('div');m.className='rb';m.innerHTML=`<div class="rb-pn"><h3>${title}</h3><div class="rb-bar"><i></i></div><p class="rb-st">Getting ready…</p><div class="rb-out"></div><button class="rb-x">CLOSE</button></div>`;document.body.appendChild(m);
 m.querySelector('.rb-x').onclick=()=>{m.remove();if(m.stop)m.stop()};return {m,st:t=>m.querySelector('.rb-st').textContent=t,bar:k=>m.querySelector('.rb-bar i').style.width=Math.round(k*100)+'%',out:h=>m.querySelector('.rb-out').innerHTML=h}}
/* draw an image/video into a box like object-fit:cover with the user's position and zoom */
function cover(ctx,src,r,S,filter){const sw=src.videoWidth||src.naturalWidth||src.width,sh=src.videoHeight||src.naturalHeight||src.height;if(!sw||!sh)return;
 const k=Math.max(r.w/sw,r.h/sh),dw=sw*k,dh=sh*k,px=(S.x??50)/100,py=(S.y??50)/100,z=S.z||1;
 ctx.save();ctx.beginPath();ctx.rect(r.x,r.y,r.w,r.h);ctx.clip();if(filter)ctx.filter=filter;
 const ox=r.x+(r.w-dw)*px,oy=r.y+(r.h-dh)*py,cx=r.x+r.w*px,cy=r.y+r.h*py;ctx.translate(cx,cy);ctx.scale(z,z);ctx.translate(-cx,-cy);ctx.drawImage(src,ox,oy,dw,dh);ctx.restore()}
/* the audio wave, drawn live from the music */
function wave(ctx,w,an,data){const n=w.n,bw=16,gap=10,tot=n*bw+(n-1)*gap,sx=w.x+(w.w-tot)/2;an.getByteFrequencyData(data);ctx.fillStyle=w.color;
 for(let i=0;i<n;i++){const v=data[Math.floor(3+i*(data.length*.55)/n)]/255,h=Math.max(bw,w.h*(.15+.85*v));const x=sx+i*(bw+gap),y=w.y+(w.h-h)/2;ctx.beginPath();ctx.roundRect?ctx.roundRect(x,y,bw,h,8):ctx.rect(x,y,bw,h);ctx.fill()}}
/* main: html of one design (full size), height, options */
window.renderDesign=async(html,H,o)=>{const B=box(o.still?'MAKING YOUR PICTURE':'MAKING YOUR VIDEO');let stopped=0;B.m.stop=()=>{stopped=1};
 try{await lib();B.st('Laying out the design…');
  const off=document.createElement('div');off.style.cssText=`position:fixed;left:-20000px;top:0;width:1080px;height:${H}px;overflow:hidden`;off.innerHTML=`<div class="v" style="transform:none;position:relative;width:1080px;height:${H}px">${html}</div>`;document.body.appendChild(off);
  if(o.place)o.place(off);
  await Promise.all([...off.querySelectorAll('img')].map(i=>i.complete?0:new Promise(r=>{i.onload=i.onerror=r})));await document.fonts.ready;
  const root=off.firstElementChild,R0=root.getBoundingClientRect(),rect=el=>{const r=el.getBoundingClientRect();return {x:r.left-R0.left,y:r.top-R0.top,w:r.width,h:r.height}};
  const medias=[...root.querySelectorAll('.md')].map(el=>({...rect(el),filter:el.style.filter||'',el}));
  const waves=[...root.querySelectorAll('.wave')].map(el=>({...rect(el),n:el.children.length,color:getComputedStyle(el).color,el}));
  medias.forEach(m=>{m.el.style.visibility='hidden'});root.style.background='transparent';waves.forEach(w=>{w.el.style.visibility='hidden'});root.querySelectorAll('video').forEach(v=>v.remove());
  /* freeze moving parts (ticker etc.) at a nice spot */
  root.querySelectorAll('*').forEach(e=>{e.style.animation='none'});
  B.st('Drawing the words and logo…');const fc=await fontCSS();const overlay=await htmlToImage.toCanvas(root,{width:1080,height:H,pixelRatio:1,cacheBust:false,...(fc?{fontEmbedCSS:fc}:{})});off.remove();
  const cv=document.createElement('canvas');cv.width=1080;cv.height=H;const ctx=cv.getContext('2d');
  /* media: a picture or a video */
  let img=null,vid=null;if(o.media){if(o.media.video){vid=document.createElement('video');vid.src=o.media.url;vid.muted=false;vid.playsInline=true;vid.crossOrigin='anonymous';await new Promise((ok,no)=>{vid.onloadedmetadata=ok;vid.onerror=()=>no(new Error('Could not read that video'))})}
   else{img=new Image();img.src=o.media.url;await img.decode()}}
  const frame=()=>{ctx.fillStyle='#000';ctx.fillRect(0,0,1080,H);medias.forEach(m=>{const src=vid||img;if(src)cover(ctx,src,m,o.S||{},m.filter)});ctx.drawImage(overlay,0,0)};
  if(o.still){frame();if(an0())0;const b=await new Promise(r=>cv.toBlob(r,'image/jpeg',.93));done(b,'jpg');return}
  function an0(){}
  /* sound: from the audio file, or from the video's own sound */
  const AC=new (window.AudioContext||window.webkitAudioContext)(),dest=AC.createMediaStreamDestination(),an=AC.createAnalyser();an.fftSize=256;an.smoothingTimeConstant=.75;const data=new Uint8Array(an.frequencyBinCount);an.connect(dest);
  let dur=o.len||15,start=o.start||0,srcNode=null;
  if(o.audio){B.st('Reading the song…');const buf=await AC.decodeAudioData(await o.audio.file.arrayBuffer());start=Math.min(start,Math.max(0,buf.duration-1));dur=Math.min(dur,buf.duration-start);srcNode=AC.createBufferSource();srcNode.buffer=buf;srcNode.connect(an)}
  else if(vid){start=Math.min(start,Math.max(0,vid.duration-1));dur=Math.min(dur,vid.duration-start);try{AC.createMediaElementSource(vid).connect(an)}catch(e){}}
  if(vid){vid.currentTime=start;await new Promise(r=>vid.onseeked=r);if(o.audio)vid.muted=true;vid.loop=true}
  /* pick a quality that keeps the file under 25 MB */
  const type=pickType();if(!type)throw new Error('This browser cannot record video. Use Chrome or Edge.');
  const vbps=Math.max(1.2e6,Math.min(9e6,Math.floor((MAXMB*8e6)/dur)-160e3));
  const stream=new MediaStream([...cv.captureStream(30).getVideoTracks(),...dest.stream.getAudioTracks()]);
  const rec=new MediaRecorder(stream,{mimeType:type,videoBitsPerSecond:vbps,audioBitsPerSecond:128000});const chunks=[];rec.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};
  frame();await AC.resume();rec.start(500);if(srcNode)srcNode.start(0,start,dur);if(vid)vid.play();const t0=performance.now();
  B.st('Recording… keep this tab open (it takes as long as the clip).');
  await new Promise(res=>{const tick=()=>{if(stopped)return res();const t=(performance.now()-t0)/1000;frame();waves.forEach(w=>wave(ctx,w,an,data));B.bar(Math.min(1,t/dur));if(t>=dur)return res();requestAnimationFrame(tick)};tick()});
  rec.stop();await new Promise(r=>rec.onstop=r);if(vid)vid.pause();if(srcNode)try{srcNode.stop()}catch(e){};AC.close();if(stopped)return;
  done(new Blob(chunks,{type:type.split(';')[0]}),type.includes('mp4')?'mp4':'webm');
  function done(b,ext){const mb=(b.size/1048576).toFixed(1),u=URL.createObjectURL(b),name=`rapaechelon-${(o.name||'post').toLowerCase().replace(/[^a-z0-9]+/g,'-').slice(0,40)}.${ext}`;B.bar(1);
   B.st(`Done: ${mb} MB${b.size>25*1048576?' (over 25 MB, try a shorter clip)':''}.`);
   B.out(`${ext==='jpg'?`<img src="${u}">`:`<video src="${u}" controls playsinline></video>`}<div class="rb-act"><a class="rb-dl" href="${u}" download="${name}">SAVE ${ext==='jpg'?'PICTURE':'VIDEO'}</a><button class="rb-sh">SHARE</button></div>${ext==='webm'?'<small>This browser saves WEBM. Instagram takes it, or open the Studio in Chrome for MP4.</small>':''}`);
   B.m.querySelector('.rb-sh').onclick=async()=>{const f=new File([b],name,{type:b.type});if(navigator.canShare&&navigator.canShare({files:[f]}))await navigator.share({files:[f]}).catch(()=>{});else B.st('Sharing works on phones. On a computer, click SAVE.')}}
 }catch(e){B.st('Could not make it: '+(e.message||e))}};
/* inputs on the Drop tab */
window.addEventListener('DOMContentLoaded',()=>{});
window.stuInit=()=>{const $=s=>document.querySelector(s);
 $('#ds').oninput=()=>{DSONG=$('#ds').value||'SONG NAME';redraw()};$('#da').oninput=()=>{DART=$('#da').value||'ARTIST NAME';redraw()};
 $('#dc').onchange=()=>{const f=$('#dc').files[0];if(f){COVER=URL.createObjectURL(f);redraw()}};
 $('#dm').onchange=()=>{const f=$('#dm').files[0];if(!f)return;DMEDIA={file:f,url:URL.createObjectURL(f),video:/^video\//.test(f.type)};$('#dmn').textContent=f.name+' ('+(f.size/1048576).toFixed(1)+' MB, stays on this computer)';redraw()};
 let rt;const redraw=()=>{clearTimeout(rt);rt=setTimeout(()=>draw(),200)};
 $('#drender').onclick=()=>{if(!DMEDIA)return alert('Add the song (MP3/OGG/WAV) or a video (MP4) first.');const [n,,h]=TT()[SEL];
  renderDesign(fx(h),1920,{name:DART+' '+DSONG,len:+$('#dl').value,start:+$('#dst').value||0,audio:DMEDIA.video?null:DMEDIA,media:DMEDIA.video?DMEDIA:null,S:{x:50,y:50,z:1},place:r=>placeIn(r,st(SEL))})};
 $('#nrender').onclick=()=>{const [n,,f]=NT()[NSEL];if(!NM)return alert('Add a photo or video first.');renderDesign(f(NSEL),NH(),{name:nt.value,len:+$('#nl').value,start:+$('#nst').value||0,media:{url:NM,video:NMV},S:ns(NSEL),still:!NMV})};
};
})();
