/* RAPAECHELON hashtag picker. Big, proven tags per kind of post, mixed with tags made from the post itself
   (artist, song, city, game). Instagram allows 5 per post now, so the TOP 5 set comes first. */
(()=>{
const B=s=>s.trim().split(/\s+/);
/* each kind: big = huge reach, mid = strong but less crowded, niche = where a post can actually rank */
const K={
 brand:{big:B('rapaechelon'),mid:B('rapaechelonnews rapaechelonmusic'),niche:[]},
 rap:{big:B('hiphop rap music rapper trap newmusic hiphopmusic rapmusic'),
  mid:B('newrap hiphopculture rapper rappers hiphopnews undergroundhiphop hiphopartist rapartist rapgame newhiphop trapmusic hiphopheads rapverse spotify applemusic soundcloud musicvideo newsong newrelease nowplaying'),
  niche:B('newhiphopmusic hiphopdaily rapdaily hiphoplife realhiphop dopemusic barsonbars lyricist freestyle bars punchlines rapbattle drill drillmusic melodicrap rapsnippet snippet studiosession hiphopvibes rapvibes hiphopjunkie hiphopforever newmusicfriday musicdiscovery')},
 rnb:{big:B('rnb music rnbmusic singer newmusic soul'),
  mid:B('rnbsinger rnbvibes rnbsoul neosoul randb rnbartist newrnb soulmusic slowjams singersongwriter vocals lovesongs rnbclassics'),
  niche:B('rnbmusiclover rnblovers rnbdaily rnbculture rnbplaylist latenightvibes sangin vocalist toosmooth bedroompop alternativernb rnbnow')},
 album:{big:B('newalbum album music hiphop newmusic'),
  mid:B('albumout albumrelease newalbumalert tracklist albumreview albumcover outnow streamnow mixtape ep deluxe'),
  niche:B('albumoftheyear aoty tracklistreveal albumdrop listeningparty fulllength coverart newprojectout')},
 video:{big:B('musicvideo hiphop rap newmusic video'),
  mid:B('newvideo officialvideo musicvideos videoshoot behindthescenes bts videodirector hiphopvideo rapvideo outnow'),
  niche:B('videooftheday newmusicvideo musicvideoshoot visuals onset directedby cinematography premiere')},
 beats:{big:B('beats producer music hiphop typebeat'),
  mid:B('beatmaker instrumental producers beatmakers flstudio musicproducer trapbeats hiphopbeats beatsforsale studio'),
  niche:B('typebeats beatstars producerlife makingbeats cookup beatcookup 808 sampling mpc boombap lofi lofibeats drillbeats beattape producergrind')},
 general:{big:B('news hiphop entertainment celebrity breakingnews'),
  mid:B('hiphopnews entertainmentnews celebritynews musicnews rapnews trending viral explorepage headlines'),
  niche:B('hiphopdaily rapupdates musicupdates culturenews dailynews newsupdate whatshappening')},
 beef:{big:B('hiphop rap beef drama'),
  mid:B('rapbeef hiphopbeef diss disstrack hiphopdrama rapdrama shots response clapback'),
  niche:B('rapbeefs disstracks beefseason pickaside whowon smoke hiphopwar responsetrack')},
 legal:{big:B('news hiphop crime court'),
  mid:B('hiphopnews breakingnews courtcase legalnews crimenews rapnews arrested lawandorder trial'),
  niche:B('courtroom courtupdate legaltrouble trialupdate caseupdate developingstory')},
 rip:{big:B('rip ripforever restinpeace hiphop'),
  mid:B('restinpower ripLegend gonetoosoon legend legendsneverdie forevermissed hiphoplegend tribute'),
  niche:B('longlive restinparadise prayersup condolences prayforthefamily foreverinourhearts honoringalegend')},
 hurt:{big:B('news prayers breakingnews'),
  mid:B('prayersup prayforhim speedyrecovery getwellsoon staystrong hiphopnews'),
  niche:B('healingvibes prayingforyou recoverystrong keepfighting strengthandhealing')},
 wild:{big:B('viral wild crazy trending explore'),
  mid:B('viralvideos wildvideos crazyvideos explorepage fyp foryou caughtoncamera unbelievable omg'),
  niche:B('onlyinamerica cantmakethisup wtf wildstories shocking viralnow insane caughtonvideo')},
 funnyvid:{big:B('funny comedy lol viral memes'),
  mid:B('funnyvideos funnyvideo comedyvideos humor lmao hilarious funnymemes reels viralreels'),
  niche:B('laughoutloud cantstoplaughing funnyaf dying lolz relatable comedyreels hoodcomedy')},
 tour:{big:B('tour concert livemusic hiphop music'),
  mid:B('ontour tourdates concerts livestage showtime festival soldout tickets onstage'),
  niche:B('tourlife tourdiaries concertvibes liveperformance festivalseason ticketsonsale rollingloud')},
 gossip:{big:B('celebrity gossip entertainment news tea'),
  mid:B('celebritygossip celebritynews hollywood spillthetea hollywoodnews drama messy relationships popculture'),
  niche:B('teatime hollywoodgossip celebritydrama shaderoom roomies messytea tealeaks whosgotthetea')},
 local:{big:B('news localnews breakingnews community'),
  mid:B('local citynews communitynews neighborhood happeningnow update'),
  niche:B('supportlocal localupdate localstories hometown')},
 shock:{big:B('breakingnews shocking viral news'),
  mid:B('breaking shockingnews unbelievable trendingnews developingstory justin'),
  niche:B('cantbelieveit whoa jawdropping crazynews mustwatch')},
 game:{big:B('gaming gamer videogames games gamingnews'),
  mid:B('gamers gamingcommunity gamerlife gamingworld gamersunite videogamenews gamingtalk gamerz'),
  niche:B('gamingclips gamenews gamingmemes gamerguy gamergirl gamingculture newgame upcominggames gamedev indiegames')},
 history:{big:B('hiphop hiphophistory oldschool classic'),
  mid:B('hiphopculture hiphoplegends goldenera 90shiphop oldschoolhiphop throwback tbt classichiphop boombap'),
  niche:B('realhiphop hiphopheads 80shiphop 2000shiphop onthisday hiphoparchive culturehistory classicalbum')},
 indie:{big:B('independentartist newmusic hiphop music rap'),
  mid:B('indieartist unsignedartist upandcoming supportindependentartists undergroundhiphop newartist emergingartist'),
  niche:B('independenthiphop unsignedhype indierap supportlocalartists newartistalert grindmode independentmusic diy artistontherise')}
};
K.drop=K.rap;
/* cities and places that show up in hip-hop stories */
const CITY={atlanta:'atlanta atl atlantahiphop atlrapper',houston:'houston htx houstonrap',chicago:'chicago chiraq chicagorap drill',newyork:'newyork nyc nyhiphop bronx brooklyn',nyc:'nyc newyork nyhiphop',brooklyn:'brooklyn nyc brooklyndrill',bronx:'bronx nyc',harlem:'harlem nyc',losangeles:'losangeles la lahiphop westcoast',la:'la losangeles westcoast',compton:'compton westcoast',detroit:'detroit detroitrap',memphis:'memphis memphisrap',miami:'miami miamirap',neworleans:'neworleans nola',dallas:'dallas dfw',philly:'philly philadelphia',philadelphia:'philadelphia philly',baltimore:'baltimore',dc:'dc dmv washingtondc',bayarea:'bayarea oakland',oakland:'oakland bayarea',toronto:'toronto the6ix canadianhiphop',london:'london ukrap ukdrill grime',nashville:'nashville',charlotte:'charlotte',stlouis:'stlouis',lasvegas:'lasvegas vegas',phoenix:'phoenix',florida:'florida floridarap',texas:'texas texasrap',california:'california cali westcoast',georgia:'georgia atl',ohio:'ohio'};
const GAMES={gta:'gta gta6 gtavi rockstargames gtaonline',gta6:'gta6 gtavi rockstargames',callofduty:'callofduty cod warzone',cod:'callofduty cod warzone',fortnite:'fortnite fortniteclips',nba2k:'nba2k 2k',madden:'madden maddennfl',minecraft:'minecraft',fifa:'eafc fifa',eafc:'eafc fifa',roblox:'roblox',pokemon:'pokemon',zelda:'zelda nintendo',halo:'halo xbox',playstation:'playstation ps5',xbox:'xbox xboxseriesx',nintendo:'nintendo nintendoswitch',switch:'nintendoswitch nintendo'};
const tagOf=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/&/g,'and').replace(/[^a-z0-9]/g,'');
const STOP=new Set('the a an and of in on at to for is are was were be with by from his her their its this that new after over just says said gets got has have had into out up down off why how what who when again delayed arrested dead dies died drops dropped released release killed shot fans furious facing charged sued sues responds reacts announces confirms leaked leaks back first last big more not no all'.split(' '));
const LIL=new Set('young lil little baby big king queen the'.split(' '));
const SMALL=new Set('the a an and or but of in on at to for is are was were be been being with by from his her him he she they them their its it this that these those as just so very than then into onto out up down off over after before about why how what who when where which while new says said gets got has have had will would could should can may might not no all more most some any our your my we you i us me im its'.split(' '));
const FILL=new Set('again still now finally officially reportedly allegedly facing faces fans furious angry upset reacts react reaction responds response spotted together years year days day weeks week months month price after amid during live video watch breaking update news report shows show seen claims claim viral huge major big crazy wild people everyone today tonight yesterday'.split(' '));
const ACT=new Set('arrested arrest charged sued jailed released freed dead dies died killed shot delayed delay drops dropped announces announced cancelled canceled leaked leaks signs signed wins won loses lost beef diss disses responds fires sentenced trial engaged married split breakup pregnant hospitalized injured robbed banned'.split(' '));
/* hashtags made from the title: name + what happened (#youngthugarrested, #gta6delayed), key words, and word pairs */
function titleTags(c,skip,names){const t=String(c.title||c.head||'').replace(/(\b[A-Za-z]+)\s+(\d{1,2})\b/g,'$1$2'),out=[],seen=new Set(skip);
 const nw=new Set((names||[]).flatMap(n=>String(n).toLowerCase().replace(/(\b[a-z]+)\s+(\d{1,2})\b/g,'$1$2').split(/[^a-z0-9]+/)).filter(Boolean));
 const ws=t.split(/[^A-Za-z0-9']+/).map(w=>w.replace(/'/g,'').toLowerCase()).filter(Boolean);
 const keep=ws.map(l=>SMALL.has(l)||/^\d+$/.test(l)||l.length<3||nw.has(l)||FILL.has(l.replace(/\d+$/,''))?null:l);
 const add=x=>{x=tagOf(x);if(x.length>=4&&x.length<=26&&!seen.has(x)){seen.add(x);out.push(x)}};
 const main=(names||[]).map(tagOf).filter(Boolean)[0];
 if(main){const act=keep.find(w=>w&&ACT.has(w));if(act)add(main+act);const k2=keep.find(w=>w&&!FILL.has(w)&&!ACT.has(w)&&w.length>=4);if(k2&&!act)add(main+k2)}
 for(let i=0;i<keep.length-1;i++)if(keep[i]&&keep[i+1]&&!FILL.has(keep[i])&&!FILL.has(keep[i+1]))add(keep[i]+keep[i+1]);
 keep.forEach(w=>{if(w&&w.length>=4&&!FILL.has(w))add(w)});
 return out.slice(0,12)}
/* tags made from the post itself */
function subj(c){const out=[],add=t=>{t=tagOf(t);if(t.length>2&&t.length<=30&&!/^\d+$/.test(t))out.push(t)};
 const names=[c.names,c.artist,c.who].filter(Boolean).flatMap(a=>String(a).split(/\s*(?:,|&|\bft\.?|\bfeat\.?|\bx\b|\band\b)\s*/i)).filter(Boolean);
 names.forEach(n=>{add(n);if(c.type!=='drop')add(n+'news');if(!GAMES[tagOf(n).replace(/\d+$/,'')]){add(n+'music');add(n+'fans')};const p=n.trim().split(/\s+/);if(p.length>1&&p[0].length>=5&&!LIL.has(p[0].toLowerCase()))add(p[0])});
 if(c.song){add(c.song);if(names[0])add(names[0]+c.song)}
 const txt=[c.title,c.head,c.cap,c.song].filter(Boolean).join(' ').toLowerCase(),flat=tagOf(txt);
 /* capitalised names in a headline, e.g. YOUNG THUG -> #youngthug (only short runs) */
 const words=String(c.title||c.head||'').split(/[^A-Za-z0-9$']+/).filter(Boolean);
 for(let i=0;i<words.length-1;i++){const a=words[i],b=words[i+1];if(!STOP.has(a.toLowerCase())&&!STOP.has(b.toLowerCase())&&/^[A-Z]/.test(a)&&/^[A-Z]/.test(b)&&words.length<=14&&i<3){add(a+b);break}}
 if(!out.length&&words[0]&&words[0].length>3&&/^[A-Z]/.test(words[0])&&!STOP.has(words[0].toLowerCase()))add(words[0]);
 Object.keys(CITY).forEach(k=>{const re=k.length<=3?new RegExp('\\b'+k+'\\b'):null;if(re?re.test(txt):flat.includes(k))CITY[k].split(' ').forEach(add)});
 Object.keys(GAMES).forEach(k=>{if(flat.includes(k))GAMES[k].split(' ').forEach(add)});
 const y=txt.match(/\b20[2-3]\d\b/);if(y)add('hiphop'+y[0]);
 return [...new Set(out)]}
function kindFor(c){if(c.type==='drop'){const s=String(c.song||'').toLowerCase();return /beat|instrumental|type beat/.test(s)?'beats':'rap'}
 const t=[c.title,c.head,c.cap].filter(Boolean).join(' ');
 if(window.CMT&&CMT.kindOf){try{const k=CMT.kindOf(t);if(K[k])return k}catch(e){}}return 'general'}
const shuf=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
/* o: ctx from the Studio. returns {kind, top5, set30, groups} */
function make(c,kind){c=c||{};kind=kind||kindFor(c);const k=K[kind]||K.general,S=subj(c),used=new Set();
 const NM=[c.names,c.artist,c.who].filter(Boolean).join(',')?S.filter(t=>{const nn=[c.names,c.artist,c.who].filter(Boolean).join(',').split(/\s*(?:,|&|\bft\.?|\bfeat\.?|\bx\b|\band\b)\s*/i).map(tagOf);return nn.some(n=>n&&(t===n||t.startsWith(n)||n.startsWith(t)))}):S.slice(0,1);
 const TT=titleTags(c,S,[c.names,c.artist,c.who].filter(Boolean).join(',').split(/\s*(?:,|&|\bft\.?|\bfeat\.?|\bx\b|\band\b)\s*/i).filter(Boolean)),RS=S.filter(t=>!NM.includes(t));
 const take=(arr,n)=>shuf(arr).filter(t=>!used.has(t)&&used.add(t)).slice(0,n);
 /* TOP 5: 1 subject, 1 big, 2 mid, 1 niche (what works with Instagram's 5-tag limit) */
 const lead=(NM[0]||S[0]);const top5=[...(lead?[lead]:[]).filter(t=>used.add(t)),...TT.slice(0,1).filter(t=>!used.has(t)&&used.add(t)),...take(k.big,1),...take(k.mid,TT.length?1:2),...take(k.niche,1)];
 if(top5.length<5)top5.push(...take([...k.mid,...k.niche,...k.big],5-top5.length));
 const u2=new Set(top5),t2=(arr,n)=>shuf(arr).filter(t=>!u2.has(t)&&u2.add(t)).slice(0,n);
 const set30=[...top5,...NM.filter(t=>!u2.has(t)&&u2.add(t)).slice(0,4),...TT.filter(t=>!u2.has(t)&&u2.add(t)).slice(0,5),...t2(RS,4),...t2(k.big,4),...t2(k.mid,8),...t2(k.niche,6)].slice(0,30);
 return {kind,top5,set30,groups:{'NAMES':NM,'FROM THE TITLE':TT,'PLACES / GAMES / SONG':RS,'BIG REACH':k.big,'STRONG':k.mid,'EASIER TO RANK':k.niche,'YOUR BRAND':K.brand.big.concat(K.brand.mid)}}}
const fmt=a=>a.map(t=>'#'+t).join(' ');
const KN={rap:'RAP',rnb:'R&B',album:'ALBUM',video:'MUSIC VIDEO',beats:'BEATS',general:'NEWS',beef:'BEEF',legal:'COURT / CRIME',rip:'RIP',hurt:'SOMEONE HURT',wild:'WILD VIDEO',funnyvid:'FUNNY VIDEO',tour:'TOUR / SHOWS',gossip:'CELEB GOSSIP',local:'LOCAL NEWS',shock:'SHOCKING NEWS',game:'VIDEO GAMES',history:'HIP-HOP HISTORY',indie:'INDEPENDENT ARTIST'};
const css=`.ht{margin-top:14px;border-top:1px solid #333;padding-top:12px;font:500 13px Inter,sans-serif;color:#ddd;text-align:left}.ht h4{margin:0 0 6px;font:900 12px Inter,sans-serif;letter-spacing:.14em;color:#e11d2a}.ht .row{display:flex;gap:8px;align-items:flex-start;margin:6px 0}.ht .tx{flex:1;background:#111;border:1px solid #2a2a2a;border-radius:6px;padding:8px;line-height:1.6;word-break:break-word}.ht button{background:#e11d2a;color:#fff;border:0;border-radius:6px;font:800 11px Inter,sans-serif;letter-spacing:.1em;padding:8px 10px;cursor:pointer}.ht button.ok{background:#2a7}.ht .hn{flex:1;background:#111;color:#fff;border:1px solid #444;border-radius:6px;padding:8px;font:700 13px Inter,sans-serif}.ht select{background:#111;color:#ddd;border:1px solid #333;border-radius:6px;padding:6px;font:600 12px Inter,sans-serif}.ht small{color:#888}.ht .g{margin-top:8px}.ht .g b{display:block;font:800 10px Inter,sans-serif;letter-spacing:.14em;color:#999;margin:8px 0 2px}.ht .chip{display:inline-block;margin:2px;padding:3px 7px;border-radius:12px;background:#1b1b1b;border:1px solid #2c2c2c;cursor:pointer}.ht .chip.on{background:#2a7;border-color:#2a7;color:#fff}`;
function copy(txt,btn){const done=()=>{const o=btn.textContent;btn.textContent='COPIED';btn.classList.add('ok');setTimeout(()=>{btn.textContent=o;btn.classList.remove('ok')},1200)};
 (navigator.clipboard?navigator.clipboard.writeText(txt):Promise.reject()).then(done,()=>{const t=document.createElement('textarea');t.value=txt;document.body.appendChild(t);t.select();document.execCommand('copy');t.remove();done()})}
/* draws the hashtag box into el */
function panel(el,c){if(!document.getElementById('ht-css')){const s=document.createElement('style');s.id='ht-css';s.textContent=css;document.head.appendChild(s)}
 c={...(c||{})};let kind=kindFor(c);const ht=document.createElement('div');ht.className='ht';el.appendChild(ht);
 let guess='';if(!c.artist&&window.CMT&&CMT.whoOf)try{guess=CMT.whoOf(c.title||'')||''}catch(e){}
 c.names=c.artist?'':guess;
 ht.innerHTML=`<h4># HASHTAGS</h4><div class="row"><input class="hn" placeholder="WHO IS IT ABOUT? e.g. Young Thug, Gunna" value="${String(c.artist||guess).replace(/"/g,'&quot;')}"></div><div class="row"><select>${Object.keys(KN).map(k=>`<option value="${k}"${k===kind?' selected':''}>${KN[k]}</option>`).join('')}</select><button data-x="new">NEW MIX</button></div><div class="hb"></div>`;
 const w=ht.querySelector('.hb');let nt;
 ht.querySelector('.hn').oninput=e=>{clearTimeout(nt);nt=setTimeout(()=>{c.names=e.target.value;c.artist='';c.who='';draw()},250)};
 ht.querySelector('select').onchange=e=>{kind=e.target.value;draw()};ht.querySelector('[data-x=new]').onclick=()=>draw();
 const draw=()=>{const r=make(c,kind);
  w.innerHTML=`<small>Instagram: 5 per post. YouTube and TikTok: use the longer set. Tap tags below to build your own.</small>
  <div class="row"><div class="tx" data-t="5">${fmt(r.top5)}</div><button data-c="5">COPY 5</button></div>
  <div class="row"><div class="tx" data-t="30">${fmt(r.set30)}</div><button data-c="30">COPY 30</button></div>
  <div class="row"><div class="tx" data-t="mine"><small>Your picks show here</small></div><button data-c="mine">COPY MINE</button></div>
  <div class="g">${Object.entries(r.groups).filter(([,a])=>a.length).map(([n,a])=>`<b>${n}</b>${a.map(t=>`<span class="chip">#${t}</span>`).join('')}`).join('')}</div>`;
  const mine=[];const mt=w.querySelector('[data-t=mine]');
  w.querySelectorAll('.chip').forEach(ch=>ch.onclick=()=>{const t=ch.textContent,i=mine.indexOf(t);if(i<0)mine.push(t);else mine.splice(i,1);ch.classList.toggle('on',i<0);mt.innerHTML=mine.length?mine.join(' ')+(mine.length>5?' <small>(over 5: fine for YouTube/TikTok, too many for Instagram)</small>':''):'<small>Your picks show here</small>'});
  w.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{const k=b.dataset.c,txt=k==='mine'?mine.join(' '):fmt(k==='5'?r.top5:r.set30);if(txt)copy(txt,b)})};
 draw();return ht}
window.HASH={make,panel,K,subj,kindFor,titleTags};
})();
