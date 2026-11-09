/* Share anything made on the site to Instagram and the Facebook Page, with an auto caption, auto hashtags and a preview.
   The file goes to our API for a moment, Instagram / Facebook pick it up, then the API deletes it. */
(function(){
const API=()=>window.RM_API||'',tok=()=>{try{return localStorage.getItem('rm_tok')||''}catch(e){return ''}};
const call=async(p,o={})=>{const r=await fetch(API()+p,{...o,headers:{...(o.body instanceof FormData?{}:{'Content-Type':'application/json'}),Authorization:'Bearer '+tok()}});const d=await r.json().catch(()=>({}));if(r.status===401)throw new Error('Log in to the back office first, then try again.');if(!r.ok)throw new Error(d.error||'Something went wrong');return d};
const esc=t=>String(t==null?'':t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);
const wait=ms=>new Promise(r=>setTimeout(r,ms));

/* ---------- hashtags ---------- */
const BRAND=['RAPAECHELON'];
/* researched Nov 2026: Instagram caps posts and Reels at 5 hashtags (Dec 2025); Facebook works best with 1-3.
   Order that wins: brand, artist, format, topic, broad. Medium tags rotate so no two posts carry the same set. */
const BANK=window.IG_TAGS||{
 news:['RapNews','HipHopNews','MusicNews','HipHopCulture','RapCulture','HipHopDaily','HipHopHeads','EntertainmentNews'],
 drop:['NewMusic','NewRap','NewHipHop','OutNow','NewSingle','NewMusicFriday','RapMusic','HipHopMusic','NowPlaying'],
 indie:['UndergroundHipHop','IndieArtist','IndependentArtist','UndergroundRap','UpAndComing','EmergingArtist','IndieHipHop'],
 chart:['HipHopCharts','RapCharts','IndieCharts','MusicCharts','TopSongs','ChartUpdate'],
 video:['MusicVideo','NewMusicVideo','RapVideo','HipHopVideo','OfficialVideo'],
 beef:['RapBeef','HipHopBeef','DissTrack','HipHopDrama','PopCulture'],
 meme:['HipHopMemes','RapMemes','MusicMemes'],
 interview:['HipHopInterview','RapInterview','ArtistInterview','Exclusive','ArtistSpotlight'],
 album:['NewAlbum','AlbumRelease','AlbumOutNow','Mixtape','Tracklist'],
 mag:['CoverStory','HipHopMagazine','MusicMagazine','DigitalMagazine','OnTheCover'],
 reel:['HipHopReels','RapReels','MusicReels'],
 rip:['RIP','HipHopLegend','RestInPeace'],
 tour:['OnTour','LiveMusic','Concert'],
 fashion:['HipHopFashion','Streetwear'],
 legal:['RapNews','HipHopNews','CelebrityNews'],
 broad:['HipHop','Rap']
};
const AVOID=/^(followforfollow|f4f|like4like|l4l|likeforlike|tagsforlikes|followback|instagood|explorepage|fyp|memesdaily)$/i;
const LIMIT={ig:5,fb:3}; /* filled from the research */
const TOPIC=[['beef',/\b(beef|diss|feud|clap ?back|responds?|shots?|vs\.?|fight)\b/i],['rip',/\b(rip|dies|died|passed away|death|killed|shot dead|funeral|tribute)\b/i],['chart',/\b(chart|top ?\d+|#\s?\d|billboard|ranking|number one|no\. ?1)\b/i],
 ['album',/\b(album|ep|mixtape|tracklist|deluxe)\b/i],['video',/\b(video|visual)\b/i],['interview',/\b(interview|talks|sits down|opens up|speaks)\b/i],['meme',/\b(meme|lol|funny|reacts?|viral)\b/i],
 ['tour',/\b(tour|concert|festival|show|live)\b/i],['legal',/\b(court|arrest|charged|lawsuit|sued|trial|sentenced|jail|prison|indicted)\b/i],['fashion',/\b(fashion|outfit|drip|sneaker|collab)\b/i],['indie',/\b(indie|independent|underground|unsigned)\b/i]];
const tagify=s=>String(s||'').normalize('NFKD').replace(/[̀-ͯ]/g,'').replace(/&/g,'And').replace(/\$/g,'S').replace(/[^A-Za-z0-9 ]+/g,'').split(/\s+/).filter(Boolean).map(w=>w[0].toUpperCase()+w.slice(1)).join('');
/* split "Drake ft. Future & Metro" into names */
const names=s=>String(s||'').split(/\s*(?:,|&|\bx\b|\bft\.?|\bfeat\.?|\bfeaturing|\band\b|\bwith\b)\s*/i).map(x=>x.trim()).filter(x=>x&&x.length<=30&&!/^(song|artist) name$/i.test(x));
function buildTags(c,dest){const text=[c.title,c.dek,c.head,c.cap,c.category,c.section].join(' ');const out=[];const add=t=>{t=tagify(t);if(t&&t.length>1&&t.length<=25&&!AVOID.test(t)&&!out.some(x=>x.toLowerCase()===t.toLowerCase()))out.push(t)};
 const rot=a=>{if(!a||!a.length)return [];const k=Math.floor(Math.random()*a.length);return a.slice(k).concat(a.slice(0,k))};
 const base=c.type==='drop'?'drop':c.type==='mag'?'mag':'news';const topics=TOPIC.filter(([,r])=>r.test(text)).map(([k])=>k);if(c.type==='mag'&&/CHART/i.test(c.section||''))topics.unshift('chart');if(c.type==='mag'&&/INTERVIEW/i.test(c.section||''))topics.unshift('interview');if(c.video&&!topics.includes('video')&&c.type==='drop')topics.push('video');
 BRAND.forEach(add);names(c.artist).slice(0,dest==='fb'?1:2).forEach(add);
 if(dest==='fb'){add((BANK[topics[0]]||BANK[base])[0]);return out.slice(0,LIMIT.fb)}
 if(c.song&&!/^(intro|outro|love|home|money|why|hello)$/i.test(c.song)&&tagify(c.song.replace(/\(.*?\)/g,'')).length<=25)add(c.song.replace(/\(.*?\)/g,''));
 add(BANK[base][0]);topics.forEach(t=>add(rot(BANK[t])[0]));add(c.video?'HipHop':rot(BANK.broad)[0]);rot(BANK[base].slice(1)).forEach(add);
 return out.slice(0,LIMIT[dest]||5)}
/* ---------- captions: a strong first line, the story, a call to action ---------- */
function buildCaption(c,dest){const L=[],link=dest==='fb'&&c.link?c.link:'';
 if(c.type==='drop'){const a=names(c.artist).join(' & ');L.push(`🚨 NEW MUSIC: ${a?a+' - ':''}${c.song||''}`.trim());L.push('');L.push(a?`${a} just dropped${c.song?` "${c.song}"`:''}. Turn it up. 🔊`:'Out now. Turn it up. 🔊');L.push('');L.push('Rate it 1-10 in the comments 👇')}
 else if(c.type==='mag'){L.push(`📖 ${c.section?c.section+': ':''}${c.head||c.artist||c.title||'The new issue'}`);L.push('');L.push(`From ${c.title||'the new issue of RAPMAG'}.`);L.push('');L.push(link?'Read the full issue: '+link:'Read the full issue: link in bio 🔗')}
 else{const t=c.title||'';L.push(t?(/^[🚨📰🔥]/.test(t)?t:'🚨 '+t):'🚨 BREAKING');const d=c.dek||c.cap;if(d){L.push('');L.push(d)}L.push('');L.push(link?'Full story: '+link:c.type==='article'?'Full story: link in bio 🔗':'What do you think? 👇')}
 return L.join('\n')}
/* any picture becomes a JPG (Instagram only takes JPG) */
async function toJpg(blob){if(blob.type==='image/jpeg'||/^video/.test(blob.type))return blob;const im=new Image();const u=URL.createObjectURL(blob);im.src=u;await im.decode();const c=document.createElement('canvas');c.width=im.naturalWidth;c.height=im.naturalHeight;const x=c.getContext('2d');x.fillStyle='#000';x.fillRect(0,0,c.width,c.height);x.drawImage(im,0,0);URL.revokeObjectURL(u);return new Promise(r=>c.toBlob(b=>r(new File([b],'post.jpg',{type:'image/jpeg'})),'image/jpeg',.93))}

const IG={buildTags,buildCaption,tagify,
 status:()=>call('/api/admin/ig/status'),
 connect:async()=>{const d=await call('/api/admin/ig/connect');window.open(d.url,'_blank')},
 disconnect:()=>call('/api/admin/ig/disconnect',{method:'POST',body:'{}'}),
 post:async(blob,{caption='',kind='feed',name='post'},say=()=>{})=>{const fd=new FormData();fd.append('file',blob,name);fd.append('kind',kind);fd.append('caption',caption);
  say('Sending the file…');const c=await call('/api/admin/ig/post',{method:'POST',body:fd});
  for(let i=0;i<90;i++){say(i?'Instagram is getting it ready… ('+i*4+' s)':'Instagram is getting it ready…');const d=await call('/api/admin/ig/publish',{method:'POST',body:JSON.stringify(c)});if(d.posted)return d;await wait(4000)}
  throw new Error('Instagram is taking too long. Check your profile in a few minutes.')},
 postFb:async(blob,{caption='',name='post'})=>{const fd=new FormData();fd.append('file',blob,name);fd.append('caption',caption);return call('/api/admin/fb/post',{method:'POST',body:fd})},
 /* the share box. o: {h, w, name, caption, ctx:{type:'drop'|'news'|'article'|'mag'|'file', artist, song, title, dek, cap, category, section, head, link}} */
 panel:async(blob0,o={})=>{const vid=/^video/.test(blob0.type);const blob=await toJpg(blob0).catch(()=>blob0);const url=URL.createObjectURL(blob);const c={...(o.ctx||{}),video:vid};
  const tall=o.h&&o.h/(o.w||1080)>1.3;let kind=tall&&!vid?'story':'feed';const on={ig:true,fb:false};
  const T={ig:buildTags(c,'ig'),fb:buildTags(c,'fb')},C={ig:o.caption||buildCaption(c,'ig'),fb:buildCaption(c,'fb')};let tab='ig';
  const m=document.createElement('div');m.className='igp';
  m.innerHTML=`<div class="igp-pn"><button class="igp-xx" aria-label="Close">×</button><h3>SHARE IT</h3><div class="igp-who">Checking the connections…</div>
  <div class="igp-cols"><div class="igp-pv">${vid?`<video src="${url}" controls playsinline loop></video>`:`<img src="${url}">`}</div>
  <div class="igp-ed"><div class="igp-dest"><label><input type="checkbox" data-on="ig" checked> INSTAGRAM</label><span class="igp-k"><button data-k="feed">${vid?'REEL':'POST'}</button><button data-k="story">STORY</button></span><label><input type="checkbox" data-on="fb"> FACEBOOK PAGE</label></div>
  <div class="igp-tabs"><button data-t="ig">INSTAGRAM TEXT</button><button data-t="fb">FACEBOOK TEXT</button></div>
  <textarea class="igp-cap" placeholder="Caption"></textarea>
  <div class="igp-hl"><b>HASHTAGS</b> <span class="igp-cnt"></span><button class="igp-auto">↻ AUTO CAPTION + HASHTAGS</button></div>
  <div class="igp-tags"></div><input class="igp-add" placeholder="+ add a hashtag and press Enter">
  <div class="igp-look"><b>HOW IT WILL LOOK</b><div class="igp-mock"></div></div></div></div>
  <div class="igp-act"><button class="igp-go">POST NOW</button><button class="igp-x">CLOSE</button></div><div class="igp-st"></div></div>`;
  document.body.appendChild(m);const $=s=>m.querySelector(s),st=h=>$('.igp-st').innerHTML=h;
  const full=d=>C[d].trim()+(T[d].length?'\n\n'+T[d].map(t=>'#'+t).join(' '):'');
  const draw=()=>{m.querySelectorAll('[data-k]').forEach(b=>b.classList.toggle('on',b.dataset.k===kind));m.querySelectorAll('[data-t]').forEach(b=>b.classList.toggle('on',b.dataset.t===tab));
   const story=tab==='ig'&&kind==='story';$('.igp-cap').value=C[tab];$('.igp-cap').disabled=story;$('.igp-cap').placeholder=story?'Instagram Stories have no caption.':'Caption';
   $('.igp-tags').innerHTML=T[tab].map((t,i)=>`<span class="igp-tag">#${esc(t)}<button data-x="${i}">×</button></span>`).join('');
   $('.igp-cnt').textContent=`${T[tab].length} of ${LIMIT[tab]} (${tab==='ig'?'Instagram':'Facebook'} works best with ${LIMIT[tab]} or fewer)`;
   $('.igp-mock').innerHTML=story?'<i>No caption on a Story.</i>':`<b>${tab==='ig'?'rapaechelon':'RAPAECHELON'}</b> ${esc(full(tab)).replace(/\n/g,'<br>').replace(/#(\w+)/g,'<span>#$1</span>')}`;
   const warn=on.ig&&kind==='feed'&&!vid&&tall?'<p class="igp-w">This picture is Story size (9:16). Instagram posts must be 4:5 or wider, so pick STORY or render the POST 4:5 size.</p>':'';st(warn)};
  m.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{kind=b.dataset.k;draw()});m.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{tab=b.dataset.t;draw()});
  m.querySelectorAll('[data-on]').forEach(b=>b.onchange=()=>{on[b.dataset.on]=b.checked;if(b.checked){tab=b.dataset.on;draw()}});
  $('.igp-cap').oninput=()=>{C[tab]=$('.igp-cap').value;$('.igp-mock').innerHTML=`<b>rapaechelon</b> ${esc(full(tab)).replace(/\n/g,'<br>').replace(/#(\w+)/g,'<span>#$1</span>')}`};
  $('.igp-tags').onclick=e=>{const b=e.target.closest('[data-x]');if(b){T[tab].splice(+b.dataset.x,1);draw()}};
  $('.igp-add').onkeydown=e=>{if(e.key!=='Enter'&&e.key!==',')return;e.preventDefault();String($('.igp-add').value).split(/[\s,#]+/).map(tagify).filter(Boolean).forEach(t=>{if(!T[tab].includes(t))T[tab].push(t)});$('.igp-add').value='';draw()};
  $('.igp-auto').onclick=()=>{T[tab]=buildTags(c,tab);C[tab]=buildCaption(c,tab);draw()};
  const close=()=>{URL.revokeObjectURL(url);m.remove()};$('.igp-x').onclick=$('.igp-xx').onclick=close;draw();
  let S={};try{S=await IG.status();$('.igp-who').innerHTML=`Instagram: <b>${S.connected?'@'+esc(S.username):'not connected'}</b> · Facebook Page: <b>${S.fb?'connected':'not connected'}</b>${!S.connected||!S.fb?' · <a href="admin.html#dist" target="_blank">set up</a>':''}`}catch(e){$('.igp-who').textContent=e.message}
  $('.igp-go').onclick=async()=>{if(!on.ig&&!on.fb)return st('Tick Instagram or Facebook.');if(on.ig&&kind==='feed'&&!vid&&tall)return st('<p class="igp-w">Pick STORY for this tall picture, or untick Instagram.</p>');
   if(on.ig&&!S.connected)return st('Instagram is not connected yet. <a href="admin.html#dist" target="_blank">Connect it</a>.');if(on.fb&&!S.fb)return st('The Facebook Page is not connected yet.');
   $('.igp-go').disabled=true;const res={};const show=()=>st(Object.entries(res).map(([k,v])=>`<div>${k==='ig'?'Instagram':'Facebook'}: ${v}</div>`).join(''));const nm=o.name||(vid?'video.mp4':'post.jpg');
   await Promise.all([on.ig&&IG.post(blob,{caption:kind==='story'?'':full('ig'),kind,name:nm},t=>{res.ig=esc(t);show()}).then(d=>res.ig=`<b>posted!</b> ${d.link?`<a href="${esc(d.link)}" target="_blank">see it</a>`:''}`,e=>res.ig='could not post: '+esc(e.message)),
    on.fb&&(res.fb='sending…',IG.postFb(blob,{caption:full('fb'),name:nm}).then(d=>res.fb=`<b>posted!</b> <a href="${esc(d.link)}" target="_blank">see it</a>`,e=>res.fb='could not post: '+esc(e.message)))]);
   show();$('.igp-go').disabled=false;$('.igp-go').textContent='POST AGAIN'}}
};
window.IG=IG;
const css=document.createElement('style');css.textContent=`.igp{position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:300;display:grid;place-items:center;padding:12px}
.igp-pn{position:relative;background:#141414;border:1px solid #333;width:min(900px,100%);max-height:96vh;overflow:auto;padding:22px;color:#fff;font:14px Inter,system-ui,sans-serif;box-sizing:border-box}
.igp-xx{position:absolute;right:10px;top:6px;background:none;border:0;color:#fff;font-size:30px;cursor:pointer}
.igp h3{font:400 32px Anton,sans-serif;margin:0 0 4px;letter-spacing:.03em}.igp-who{color:#aaa;margin-bottom:14px;font-size:13px}.igp a{color:#ff5c66}
.igp-cols{display:grid;grid-template-columns:minmax(0,300px) 1fr;gap:20px}@media(max-width:720px){.igp-cols{grid-template-columns:1fr}}
.igp-pv img,.igp-pv video{width:100%;max-height:60vh;object-fit:contain;background:#000;display:block}
.igp-dest{display:flex;gap:10px;align-items:center;flex-wrap:wrap;font:800 12px Inter,sans-serif;letter-spacing:.1em}.igp-dest label{display:flex;gap:6px;align-items:center;cursor:pointer}.igp-dest input{accent-color:#e11d2a;width:16px;height:16px}
.igp-k{display:inline-flex;gap:4px;margin-right:8px}.igp-k button,.igp-tabs button{background:#222;color:#bbb;border:1px solid #333;font:800 11px Inter,sans-serif;letter-spacing:.12em;padding:8px 12px;cursor:pointer}.igp-k button.on,.igp-tabs button.on{background:#e11d2a;border-color:#e11d2a;color:#fff}
.igp-tabs{display:flex;gap:4px;margin:14px 0 6px}
.igp textarea{width:100%;min-height:120px;background:#0b0b0b;border:1px solid #333;color:#fff;padding:10px;font:14px Inter,sans-serif;box-sizing:border-box}.igp textarea:disabled{opacity:.4}
.igp-hl{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:10px 0 6px;font-size:12px}.igp-hl b{letter-spacing:.12em}.igp-cnt{color:#888}.igp-auto{margin-left:auto;background:#222;color:#fff;border:1px solid #444;font:800 11px Inter,sans-serif;letter-spacing:.1em;padding:7px 10px;cursor:pointer}
.igp-tags{display:flex;flex-wrap:wrap;gap:6px}.igp-tag{background:#2a1215;border:1px solid #e11d2a66;color:#ff8a92;padding:5px 4px 5px 10px;font:700 13px Inter,sans-serif;display:inline-flex;align-items:center;gap:2px}.igp-tag button{background:none;border:0;color:#fff;cursor:pointer;font-size:15px;padding:0 4px}
.igp-add{width:100%;margin-top:8px;background:#0b0b0b;border:1px solid #333;color:#fff;padding:9px;font:13px Inter,sans-serif;box-sizing:border-box}
.igp-look{margin-top:12px;font-size:12px}.igp-look b{letter-spacing:.12em}.igp-mock{background:#fff;color:#111;padding:12px;margin-top:6px;font:14px/1.45 system-ui,sans-serif;max-height:180px;overflow:auto}.igp-mock span{color:#00376b}
.igp-act{display:flex;gap:8px;justify-content:center;margin-top:16px}.igp-act button{border:0;font:800 13px Inter,sans-serif;letter-spacing:.14em;padding:14px 24px;cursor:pointer;color:#fff;background:#e11d2a}.igp-act .igp-x{background:#333}.igp-act button:disabled{opacity:.4;cursor:default}
.igp-st{color:#ccc;min-height:20px;text-align:center;margin-top:10px;line-height:1.7}.igp-w{color:#e8a33a;margin:6px 0}`;
document.head.appendChild(css);
})();
