/* Post straight to Instagram from the back office or the Studio.
   The file goes to our API for a moment, Instagram picks it up, then the API deletes it. */
(function(){
const API=()=>window.RM_API||'',tok=()=>{try{return localStorage.getItem('rm_tok')||''}catch(e){return ''}};
const call=async(p,o={})=>{const r=await fetch(API()+p,{...o,headers:{...(o.body instanceof FormData?{}:{'Content-Type':'application/json'}),Authorization:'Bearer '+tok()}});const d=await r.json().catch(()=>({}));if(r.status===401)throw new Error('Log in to the back office first, then try again.');if(!r.ok)throw new Error(d.error||'Something went wrong');return d};
const esc=t=>String(t==null?'':t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const IG={
 status:()=>call('/api/admin/ig/status'),
 connect:async()=>{const d=await call('/api/admin/ig/connect');window.open(d.url,'_blank')},
 disconnect:()=>call('/api/admin/ig/disconnect',{method:'POST',body:'{}'}),
 /* blob: JPG or MP4. kind: feed | story (a video on feed posts as a Reel) */
 post:async(blob,{caption='',kind='feed',name='post'},say=()=>{})=>{const fd=new FormData();fd.append('file',blob,name);fd.append('kind',kind);fd.append('caption',caption);
  say('Sending the file…');const c=await call('/api/admin/ig/post',{method:'POST',body:fd});
  for(let i=0;i<90;i++){say(i?'Instagram is getting it ready… ('+i*4+' s)':'Instagram is getting it ready…');const d=await call('/api/admin/ig/publish',{method:'POST',body:JSON.stringify(c)});if(d.posted)return d;await wait(4000)}
  throw new Error('Instagram is taking too long. Check your profile in a few minutes.')},
 /* the in-page post box */
 panel:async(blob,o={})=>{const vid=/^video/.test(blob.type),url=URL.createObjectURL(blob);const m=document.createElement('div');m.className='igp';
  const tall=o.h&&o.h/(o.w||1080)>1.3;let kind=tall&&!vid?'story':'feed';
  m.innerHTML=`<div class="igp-pn"><h3>POST TO INSTAGRAM</h3><div class="igp-who">Checking the connection…</div>
  <div class="igp-pv">${vid?`<video src="${url}" controls playsinline></video>`:`<img src="${url}">`}</div>
  <div class="igp-k"><button data-k="feed">${vid?'REEL':'POST'}</button><button data-k="story">STORY</button></div>
  <textarea placeholder="Caption (hashtags, link in bio…)">${esc(o.caption||'')}</textarea><small class="igp-n"></small>
  <div class="igp-act"><button class="igp-go">POST NOW</button><button class="igp-x">CLOSE</button></div><p class="igp-st"></p></div>`;
  document.body.appendChild(m);const $=s=>m.querySelector(s),st=t=>$('.igp-st').innerHTML=t;
  const sk=()=>{m.querySelectorAll('[data-k]').forEach(b=>b.classList.toggle('on',b.dataset.k===kind));$('textarea').style.display=kind==='story'?'none':'';
   $('.igp-n').textContent=kind==='story'?'Stories have no caption.':(!vid&&tall?'This picture is tall (Story size). Instagram posts need 4:5 or wider, so use STORY, or render the POST 4:5 size.':'')};
  m.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{kind=b.dataset.k;sk()});sk();
  const close=()=>{URL.revokeObjectURL(url);m.remove()};$('.igp-x').onclick=close;
  try{const s=await IG.status();$('.igp-who').innerHTML=s.connected?`Posting as <b>@${esc(s.username)}</b>`:`Instagram is not connected yet. <a href="admin.html#dist" target="_blank">Connect it in the back office</a>.`;if(!s.connected)$('.igp-go').disabled=true}
  catch(e){$('.igp-who').textContent=e.message;$('.igp-go').disabled=true}
  $('.igp-go').onclick=async()=>{if(kind==='feed'&&!vid&&tall)return st('Pick STORY for this tall picture.');$('.igp-go').disabled=true;
   try{const d=await IG.post(blob,{caption:$('textarea').value,kind,name:o.name||(vid?'video.mp4':'post.jpg')},t=>st(esc(t)));st(`Posted! ${d.link?`<a href="${esc(d.link)}" target="_blank">See it on Instagram</a>`:''}`)}
   catch(e){st('Could not post: '+esc(e.message));$('.igp-go').disabled=false}}}
};
window.IG=IG;
/* styles for the post box, shared by the back office and the Studio */
const css=document.createElement('style');css.textContent=`.igp{position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:300;display:grid;place-items:center;padding:16px}
.igp-pn{background:#141414;border:1px solid #333;width:min(460px,100%);max-height:94vh;overflow:auto;padding:22px;color:#fff;font:14px Inter,system-ui,sans-serif;text-align:center}
.igp h3{font:400 30px Anton,sans-serif;margin:0 0 8px;letter-spacing:.03em}.igp-who{color:#bbb;margin-bottom:10px}.igp-who a,.igp-st a{color:#ff5c66}
.igp-pv img,.igp-pv video{max-width:100%;max-height:40vh;background:#000}.igp-k{display:flex;gap:6px;justify-content:center;margin:12px 0}
.igp-k button{background:#222;color:#bbb;border:1px solid #333;font:800 12px Inter,sans-serif;letter-spacing:.12em;padding:10px 18px;cursor:pointer}.igp-k button.on{background:#e11d2a;border-color:#e11d2a;color:#fff}
.igp textarea{width:100%;min-height:110px;background:#0b0b0b;border:1px solid #333;color:#fff;padding:10px;font:14px Inter,sans-serif;box-sizing:border-box}.igp-n{display:block;color:#e8a33a;margin-top:6px}
.igp-act{display:flex;gap:8px;justify-content:center;margin-top:12px}.igp-act button{border:0;font:800 13px Inter,sans-serif;letter-spacing:.14em;padding:13px 20px;cursor:pointer;color:#fff;background:#e11d2a}.igp-act .igp-x{background:#333}.igp-act button:disabled{opacity:.4;cursor:default}.igp-st{color:#ccc;min-height:20px}`;
document.head.appendChild(css);
})();
