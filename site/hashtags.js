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
  niche:B('rapbeefs diss_track beefseason pickaside whowon smoke hiphopwar responsetrack')},
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
/* tags made from the post itself */
function subj(c){const out=[],add=t=>{t=tagOf(t);if(t.length>2&&t.length<=30&&!/^\d+$/.test(t))out.push(t)};
 const names=[c.artist,c.who].filter(Boolean).flatMap(a=>String(a).split(/\s*(?:,|&|\bft\.?|\bfeat\.?|\bx\b|\band\b)\s*/i)).filter(Boolean);
 names.forEach(n=>{add(n);add(n+'music');add(n+'fans')});
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
 const take=(arr,n)=>shuf(arr).filter(t=>!used.has(t)&&used.add(t)).slice(0,n);
 /* TOP 5: 1 subject, 1 big, 2 mid, 1 niche (what works with Instagram's 5-tag limit) */
 const top5=[...(S[0]?[S[0]]:[]).filter(t=>used.add(t)),...take(k.big,1),...take(k.mid,2),...take(k.niche,1)];
 if(top5.length<5)top5.push(...take([...k.mid,...k.niche,...k.big],5-top5.length));
 const u2=new Set(top5),t2=(arr,n)=>shuf(arr).filter(t=>!u2.has(t)&&u2.add(t)).slice(0,n);
 const set30=[...top5,...t2(S,6),...t2(k.big,4),...t2(k.mid,9),...t2(k.niche,6)].slice(0,30);
 return {kind,top5,set30,groups:{'FROM THIS POST':S,'BIG REACH':k.big,'STRONG':k.mid,'EASIER TO RANK':k.niche,'YOUR BRAND':K.brand.big.concat(K.brand.mid)}}}
const fmt=a=>a.map(t=>'#'+t).join(' ');
const KN={rap:'RAP',rnb:'R&B',album:'ALBUM',video:'MUSIC VIDEO',beats:'BEATS',general:'NEWS',beef:'BEEF',legal:'COURT / CRIME',rip:'RIP',hurt:'SOMEONE HURT',wild:'WILD VIDEO',funnyvid:'FUNNY VIDEO',tour:'TOUR / SHOWS',gossip:'CELEB GOSSIP',local:'LOCAL NEWS',shock:'SHOCKING NEWS',game:'VIDEO GAMES',history:'HIP-HOP HISTORY',indie:'INDEPENDENT ARTIST'};
const css=`.ht{margin-top:14px;border-top:1px solid #333;padding-top:12px;font:500 13px Inter,sans-serif;color:#ddd;text-align:left}.ht h4{margin:0 0 6px;font:900 12px Inter,sans-serif;letter-spacing:.14em;color:#e11d2a}.ht .row{display:flex;gap:8px;align-items:flex-start;margin:6px 0}.ht .tx{flex:1;background:#111;border:1px solid #2a2a2a;border-radius:6px;padding:8px;line-height:1.6;word-break:break-word}.ht button{background:#e11d2a;color:#fff;border:0;border-radius:6px;font:800 11px Inter,sans-serif;letter-spacing:.1em;padding:8px 10px;cursor:pointer}.ht button.ok{background:#2a7}.ht select{background:#111;color:#ddd;border:1px solid #333;border-radius:6px;padding:6px;font:600 12px Inter,sans-serif}.ht small{color:#888}.ht .g{margin-top:8px}.ht .g b{display:block;font:800 10px Inter,sans-serif;letter-spacing:.14em;color:#999;margin:8px 0 2px}.ht .chip{display:inline-block;margin:2px;padding:3px 7px;border-radius:12px;background:#1b1b1b;border:1px solid #2c2c2c;cursor:pointer}.ht .chip.on{background:#2a7;border-color:#2a7;color:#fff}`;
function copy(txt,btn){const done=()=>{const o=btn.textContent;btn.textContent='COPIED';btn.classList.add('ok');setTimeout(()=>{btn.textContent=o;btn.classList.remove('ok')},1200)};
 (navigator.clipboard?navigator.clipboard.writeText(txt):Promise.reject()).then(done,()=>{const t=document.createElement('textarea');t.value=txt;document.body.appendChild(t);t.select();document.execCommand('copy');t.remove();done()})}
/* draws the hashtag box into el */
function panel(el,c){if(!document.getElementById('ht-css')){const s=document.createElement('style');s.id='ht-css';s.textContent=css;document.head.appendChild(s)}
 let kind=kindFor(c||{});const w=document.createElement('div');w.className='ht';el.appendChild(w);
 const draw=()=>{const r=make(c,kind);
  w.innerHTML=`<h4># HASHTAGS</h4><div class="row"><select>${Object.keys(KN).map(k=>`<option value="${k}"${k===kind?' selected':''}>${KN[k]}</option>`).join('')}</select><button data-x="new">NEW MIX</button></div>
  <small>Instagram: 5 per post. YouTube and TikTok: use the longer set. Tap tags below to build your own.</small>
  <div class="row"><div class="tx" data-t="5">${fmt(r.top5)}</div><button data-c="5">COPY 5</button></div>
  <div class="row"><div class="tx" data-t="30">${fmt(r.set30)}</div><button data-c="30">COPY 30</button></div>
  <div class="row"><div class="tx" data-t="mine"><small>Your picks show here</small></div><button data-c="mine">COPY MINE</button></div>
  <div class="g">${Object.entries(r.groups).filter(([,a])=>a.length).map(([n,a])=>`<b>${n}</b>${a.map(t=>`<span class="chip">#${t}</span>`).join('')}`).join('')}</div>`;
  const mine=[];const mt=w.querySelector('[data-t=mine]');
  w.querySelector('select').onchange=e=>{kind=e.target.value;draw()};w.querySelector('[data-x=new]').onclick=draw;
  w.querySelectorAll('.chip').forEach(ch=>ch.onclick=()=>{const t=ch.textContent,i=mine.indexOf(t);if(i<0)mine.push(t);else mine.splice(i,1);ch.classList.toggle('on',i<0);mt.innerHTML=mine.length?mine.join(' ')+(mine.length>5?' <small>(over 5: fine for YouTube/TikTok, too many for Instagram)</small>':''):'<small>Your picks show here</small>'});
  w.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{const k=b.dataset.c,txt=k==='mine'?mine.join(' '):fmt(k==='5'?r.top5:r.set30);if(txt)copy(txt,b)})};
 draw();return w}
window.HASH={make,panel,K,subj,kindFor};
})();
