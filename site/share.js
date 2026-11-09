/* Share box for anything made on the site: preview, an auto caption and auto hashtags (researched), then EMAIL IT,
   COPY or SAVE. Nothing is uploaded: the file stays on this computer. */
(function(){
const esc=t=>String(t==null?'':t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);

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

/* Gmail draft with a real attachment. Uses Google's own sign-in in this browser; the file goes from this computer
   straight to your Gmail drafts. Nothing is sent and nothing passes through our server. */
const b64=s=>btoa(unescape(encodeURIComponent(s)));
let GTOK=null;
const gsi=()=>window.google&&google.accounts?Promise.resolve():new Promise((ok,no)=>{const x=document.createElement('script');x.src='https://accounts.google.com/gsi/client';x.onload=ok;x.onerror=()=>no(new Error('Google sign-in did not load'));document.head.appendChild(x)});
async function gtoken(){if(GTOK&&GTOK.exp>Date.now())return GTOK.t;await gsi();return new Promise((ok,no)=>{const c=google.accounts.oauth2.initTokenClient({client_id:window.RM_GCID,scope:'https://www.googleapis.com/auth/gmail.compose',
  callback:r=>{if(r.error||!r.access_token)return no(new Error(r.error_description||r.error||'Google said no'));GTOK={t:r.access_token,exp:Date.now()+(+r.expires_in-60)*1000};ok(GTOK.t)},error_callback:e=>no(new Error(e.message||'Sign-in was closed'))});c.requestAccessToken({prompt:''})})}
async function gmailDraft(blob,name,to,subj,text,say){const t=await gtoken();say('Attaching the file…');
 const data=await new Promise(r=>{const fr=new FileReader();fr.onload=()=>r(String(fr.result).split(',')[1]);fr.readAsDataURL(blob)});
 const bd='rm'+Date.now(),L='\r\n',wrap=x=>x.replace(/.{76}/g,'$&'+L);
 const mime=[(to?'To: '+to+L:'')+'Subject: =?UTF-8?B?'+b64(subj)+'?='+L+'MIME-Version: 1.0'+L+'Content-Type: multipart/mixed; boundary="'+bd+'"'+L,
  '--'+bd+L+'Content-Type: text/plain; charset="UTF-8"'+L+'Content-Transfer-Encoding: base64'+L+L+wrap(b64(text))+L,
  '--'+bd+L+'Content-Type: '+(blob.type||'application/octet-stream')+'; name="'+name+'"'+L+'Content-Disposition: attachment; filename="'+name+'"'+L+'Content-Transfer-Encoding: base64'+L+L,wrap(data),L+'--'+bd+'--'+L];
 say('Saving the draft in Gmail…');const r=await fetch('https://gmail.googleapis.com/upload/gmail/v1/users/me/drafts?uploadType=media',{method:'POST',headers:{Authorization:'Bearer '+t,'Content-Type':'message/rfc822'},body:new Blob(mime)}),d=await r.json().catch(()=>({}));
 if(!r.ok){if(r.status===401)GTOK=null;throw new Error((d.error&&d.error.message)||'Gmail said no')}return d.message.id}
const LS=(k,v)=>{try{if(v===undefined)return localStorage.getItem(k)||'';localStorage.setItem(k,v)}catch(e){return ''}};
const SHARE={buildTags,buildCaption,tagify,
 /* blob: the finished picture or video. o: {h, w, name, ctx:{type:'drop'|'news'|'article'|'mag'|'file', artist, song, title, dek, cap, category, section, head, link}} */
 panel:async(blob0,o={})=>{const vid=/^video/.test(blob0.type);const blob=vid?blob0:await toJpg(blob0).catch(()=>blob0);const url=URL.createObjectURL(blob);const c={...(o.ctx||{}),video:vid};
  const ext=vid?(/mp4/.test(blob.type)?'mp4':'webm'):'jpg',name=(o.name||'rapaechelon-post').replace(/\.[a-z0-9]+$/i,'')+'.'+ext;
  const T={ig:buildTags(c,'ig'),fb:buildTags(c,'fb')},C={ig:buildCaption(c,'ig'),fb:buildCaption(c,'fb')};let tab='ig';
  const m=document.createElement('div');m.className='igp';
  m.innerHTML=`<div class="igp-pn"><button class="igp-xx" aria-label="Close">×</button><h3>SHARE IT</h3><div class="igp-who">Caption and hashtags are made for you. Change anything, then email it to yourself or copy it.</div>
  <div class="igp-cols"><div class="igp-pv">${vid?`<video src="${url}" controls playsinline loop></video>`:`<img src="${url}">`}</div>
  <div class="igp-ed"><div class="igp-tabs"><button data-t="ig">FOR INSTAGRAM</button><button data-t="fb">FOR FACEBOOK</button></div>
  <textarea class="igp-cap" placeholder="Caption"></textarea>
  <div class="igp-hl"><b>HASHTAGS</b> <span class="igp-cnt"></span><button class="igp-auto">↻ NEW CAPTION + HASHTAGS</button></div>
  <div class="igp-tags"></div><input class="igp-add" placeholder="+ add a hashtag and press Enter">
  <div class="igp-look"><b>HOW IT WILL LOOK</b><div class="igp-mock"></div></div>
  <div class="igp-to"><b>EMAIL TO</b><input type="email" class="igp-em" placeholder="your@email.com (remembered on this computer)"></div></div></div>
  <div class="igp-act"><button class="igp-go">✉ MAKE THE EMAIL</button><button class="igp-cp">COPY CAPTION</button><a class="igp-sv" href="${url}" download="${name}">SAVE FILE</a><button class="igp-x">CLOSE</button></div><div class="igp-st"></div></div>`;
  document.body.appendChild(m);const $=s=>m.querySelector(s),st=h=>$('.igp-st').innerHTML=h;
  const full=d=>C[d].trim()+(T[d].length?'\n\n'+T[d].map(t=>'#'+t).join(' '):'');
  const mock=()=>$('.igp-mock').innerHTML=`<b>rapaechelon</b> ${esc(full(tab)).replace(/\n/g,'<br>').replace(/#(\w+)/g,'<span>#$1</span>')}`;
  const draw=()=>{m.querySelectorAll('[data-t]').forEach(b=>b.classList.toggle('on',b.dataset.t===tab));$('.igp-cap').value=C[tab];
   $('.igp-tags').innerHTML=T[tab].map((t,i)=>`<span class="igp-tag">#${esc(t)}<button data-x="${i}">×</button></span>`).join('');
   $('.igp-cnt').textContent=`${T[tab].length} of ${LIMIT[tab]} (${tab==='ig'?'Instagram allows 5':'Facebook works best with 3 or fewer'})`;mock()};
  m.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{tab=b.dataset.t;draw()});
  $('.igp-cap').oninput=()=>{C[tab]=$('.igp-cap').value;mock()};
  $('.igp-tags').onclick=e=>{const b=e.target.closest('[data-x]');if(b){T[tab].splice(+b.dataset.x,1);draw()}};
  $('.igp-add').onkeydown=e=>{if(e.key!=='Enter'&&e.key!==',')return;e.preventDefault();String($('.igp-add').value).split(/[\s,#]+/).map(tagify).filter(Boolean).forEach(t=>{if(!T[tab].includes(t)&&!AVOID.test(t))T[tab].push(t)});if(tab==='ig'&&T.ig.length>5)st('<p class="igp-w">Instagram only allows 5 hashtags. Remove one.</p>');$('.igp-add').value='';draw()};
  $('.igp-auto').onclick=()=>{T[tab]=buildTags(c,tab);C[tab]=buildCaption(c,tab);draw()};
  $('.igp-em').value=LS('rm_mailto');$('.igp-em').onchange=()=>LS('rm_mailto',$('.igp-em').value.trim());
  const copy=async()=>{try{await navigator.clipboard.writeText(full(tab));return true}catch(e){const t=$('.igp-cap');t.value=full(tab);t.select();document.execCommand('copy');t.value=C[tab];return true}};
  $('.igp-cp').onclick=async()=>{await copy();st('Caption and hashtags copied. Paste them into Instagram or Facebook.')};
  /* phones: the share sheet attaches the file to the email for you. computers: the file is saved, the email opens with the caption */
  $('.igp-go').onclick=async()=>{const text=full(tab),subj='RAPAECHELON '+(c.type==='drop'?'drop':c.type==='mag'?'magazine page':'post')+(c.title||c.song?': '+(c.title||c.song):''),f=new File([blob],name,{type:blob.type});
   if(navigator.canShare&&navigator.canShare({files:[f]})&&/Android|iPhone|iPad/i.test(navigator.userAgent)){await navigator.share({files:[f],title:subj,text}).catch(()=>{});return}
   const to0=$('.igp-em').value.trim();if(to0)LS('rm_mailto',to0);
   if(window.RM_GCID){$('.igp-go').disabled=true;try{st('Asking Gmail…');const id=await gmailDraft(blob,name,to0,subj,text,t=>st(esc(t)));
     window.open('https://mail.google.com/mail/#drafts?compose='+encodeURIComponent(id),'_blank');
     st(`<b>Draft ready in Gmail</b> with the ${vid?'video':'picture'} attached, plus the caption and hashtags. It opened in a new tab. Nothing was sent: press Send there when you are ready.`)}
    catch(e){st('<p class="igp-w">Could not make the Gmail draft: '+esc(e.message||e)+'</p>')}$('.igp-go').disabled=false;return}
   const notReady=true;
   const a=document.createElement('a');a.href=url;a.download=name;a.click();await copy();
   const to=$('.igp-em').value.trim();window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subj)}&body=${encodeURIComponent(text+'\n\n(Attached: '+name+')')}`,'_blank');
   st((notReady?'<p class="igp-w">Attaching for you is not switched on yet (Gmail is not linked), so the file was saved to Downloads for you to drag in.</p>':'')+`Gmail opened in a new tab with the caption and hashtags. <b>${esc(name)}</b> was saved to your Downloads, so drag it into the email to attach it. (Email apps don't let a website attach files by itself.)`)};
  const close=()=>{URL.revokeObjectURL(url);m.remove()};$('.igp-x').onclick=$('.igp-xx').onclick=close;m.onclick=e=>{if(e.target===m)close()};draw()}
};
window.SHARE=SHARE;
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
.igp-to{margin-top:12px;font-size:12px}.igp-to b{letter-spacing:.12em;display:block;margin-bottom:6px}.igp-em{width:100%;background:#0b0b0b;border:1px solid #333;color:#fff;padding:9px;font:13px Inter,sans-serif;box-sizing:border-box}
.igp-act .igp-cp,.igp-act .igp-sv{background:#2b2b2b}.igp-sv{border:0;font:800 13px Inter,sans-serif;letter-spacing:.14em;padding:14px 24px;color:#fff;text-decoration:none;display:inline-block}.igp-act{flex-wrap:wrap}
.igp-st{color:#ccc;min-height:20px;text-align:center;margin-top:10px;line-height:1.7}.igp-w{color:#e8a33a;margin:6px 0}`;
document.head.appendChild(css);
})();
