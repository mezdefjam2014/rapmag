/* RAPMAG digital magazine engine: themes x layouts = designs, slot rendering, and the flip-book reader.
   Shared by the public site (reader + archive) and the back office (Magazine Maker). Pages are drawn at 1000 x 1294 and scaled. */
(function(){
const W=1000,H=1294;
const esc=v=>String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const API=window.RM_API||'';
const abs=u=>!u?'':/^(https?:|data:|blob:)/.test(u)?u:/^\/img\//.test(u)?API+u:u;

/* ---------- themes: only colors + type, so every layout works with every theme ---------- */
const THEMES={
 red:{name:'Black & Red',bg:'#0b0b0c',bg2:'#161618',ink:'#ffffff',mut:'#b9b9be',acc:'#e0242f',acc2:'#ffffff',hf:'Anton',sf:'Playfair Display',bf:'Source Serif 4',mag:'#ffffff',magInk:'#0b0b0c'},
 gold:{name:'Gold Noir',bg:'#0d0a05',bg2:'#1c150a',ink:'#fbf1d6',mut:'#c8b27a',acc:'#d6a73c',acc2:'#fff3c4',hf:'Anton',sf:'Playfair Display',bf:'Source Serif 4',mag:'#fbf1d6',magInk:'#0d0a05'},
 blue:{name:'Blue Night',bg:'#0c2a8a',bg2:'#0a1f66',ink:'#ffffff',mut:'#c7d3ff',acc:'#0b1a4d',acc2:'#ffd23f',hf:'Anton',sf:'Playfair Display',bf:'Source Serif 4',mag:'#ffffff',magInk:'#0b1a4d'},
 paper:{name:'Paper White',bg:'#f6f3ec',bg2:'#ffffff',ink:'#0c0c0e',mut:'#5d5d64',acc:'#e0242f',acc2:'#0c0c0e',hf:'Anton',sf:'Playfair Display',bf:'Source Serif 4',mag:'#0c0c0e',magInk:'#ffffff'},
 crimson:{name:'Crimson',bg:'#3a0508',bg2:'#5a0a10',ink:'#ffffff',mut:'#f0b7ba',acc:'#ff2d3a',acc2:'#ffd9db',hf:'Anton',sf:'Playfair Display',bf:'Source Serif 4',mag:'#ffffff',magInk:'#3a0508'},
 graffiti:{name:'Graffiti',bg:'#111214',bg2:'#1d1f22',ink:'#f4f4f4',mut:'#a9adb3',acc:'#39ff88',acc2:'#ff3ea5',hf:'Anton',sf:'Archivo Black',bf:'Inter',mag:'#f4f4f4',magInk:'#111214'},
 purple:{name:'Purple Haze',bg:'#1b0b2e',bg2:'#2a1146',ink:'#ffffff',mut:'#cdb8ef',acc:'#a64dff',acc2:'#ffcf3f',hf:'Anton',sf:'Playfair Display',bf:'Source Serif 4',mag:'#ffffff',magInk:'#1b0b2e'},
 sunset:{name:'Sunset',bg:'#f2552c',bg2:'#d63f1e',ink:'#ffffff',mut:'#ffe0d2',acc:'#1a0d08',acc2:'#ffd23f',hf:'Anton',sf:'Playfair Display',bf:'Source Serif 4',mag:'#ffffff',magInk:'#1a0d08'},
 ice:{name:'Ice',bg:'#eaf6f8',bg2:'#ffffff',ink:'#06232b',mut:'#4f6b72',acc:'#00a3b4',acc2:'#06232b',hf:'Anton',sf:'Playfair Display',bf:'Source Serif 4',mag:'#06232b',magInk:'#eaf6f8'},
 concrete:{name:'Concrete',bg:'#2b2c2e',bg2:'#3a3b3e',ink:'#f2f2f2',mut:'#b4b5b8',acc:'#ffb000',acc2:'#ffffff',hf:'Anton',sf:'Archivo Black',bf:'Inter',mag:'#f2f2f2',magInk:'#2b2c2e'},
 emerald:{name:'Emerald',bg:'#04281f',bg2:'#073a2d',ink:'#f2fff9',mut:'#9fd4bf',acc:'#18c37e',acc2:'#ffd23f',hf:'Bebas Neue',sf:'DM Serif Display',bf:'Source Serif 4',mag:'#f2fff9',magInk:'#04281f'},
 pink:{name:'Pink Money',bg:'#ffe3ee',bg2:'#ffffff',ink:'#2a0614',mut:'#8a4a63',acc:'#ff2f86',acc2:'#2a0614',hf:'Anton',sf:'DM Serif Display',bf:'Source Serif 4',mag:'#2a0614',magInk:'#ffe3ee'},
 mono:{name:'Black & White',bg:'#ffffff',bg2:'#f2f2f2',ink:'#000000',mut:'#555555',acc:'#000000',acc2:'#000000',hf:'Oswald',sf:'Playfair Display',bf:'Source Serif 4',mag:'#000000',magInk:'#ffffff'},
 royal:{name:'Royal',bg:'#14093a',bg2:'#1f0f55',ink:'#fff8e6',mut:'#c6b9f0',acc:'#e6b422',acc2:'#ffffff',hf:'Bebas Neue',sf:'Playfair Display',bf:'Source Serif 4',mag:'#fff8e6',magInk:'#14093a'},
 desert:{name:'Desert',bg:'#e9d8bd',bg2:'#f6ecdc',ink:'#2d1d0c',mut:'#7a6143',acc:'#b5481d',acc2:'#2d1d0c',hf:'Oswald',sf:'DM Serif Display',bf:'Source Serif 4',mag:'#2d1d0c',magInk:'#e9d8bd'},
 neon:{name:'Neon Blue',bg:'#050816',bg2:'#0c1230',ink:'#e8f4ff',mut:'#8aa6c8',acc:'#00d1ff',acc2:'#ff2fd1',hf:'Bebas Neue',sf:'Archivo Black',bf:'Inter',mag:'#e8f4ff',magInk:'#050816'},
 wine:{name:'Wine',bg:'#2a0a14',bg2:'#3d1020',ink:'#fbe9ee',mut:'#d7a3b2',acc:'#c9184a',acc2:'#f4c95d',hf:'Oswald',sf:'Playfair Display',bf:'Source Serif 4',mag:'#fbe9ee',magInk:'#2a0a14'},
 olive:{name:'Army',bg:'#2f3420',bg2:'#3c422a',ink:'#f1f0e4',mut:'#b9b99a',acc:'#e85d04',acc2:'#f1f0e4',hf:'Bebas Neue',sf:'Archivo Black',bf:'Inter',mag:'#f1f0e4',magInk:'#2f3420'},
 silver:{name:'Silver',bg:'#d9dde2',bg2:'#eef0f3',ink:'#111317',mut:'#5b616b',acc:'#3a57e8',acc2:'#111317',hf:'Oswald',sf:'DM Serif Display',bf:'Inter',mag:'#111317',magInk:'#d9dde2'},
 fire:{name:'Fire',bg:'#ffcc00',bg2:'#ffe066',ink:'#120c00',mut:'#5e4a00',acc:'#e0242f',acc2:'#120c00',hf:'Anton',sf:'Archivo Black',bf:'Inter',mag:'#120c00',magInk:'#ffcc00'}
};
const vars=t=>{const T=THEMES[t]||THEMES.red;return `--bg:${T.bg};--bg2:${T.bg2};--ink:${T.ink};--mut:${T.mut};--acc:${T.acc};--acc2:${T.acc2};--hf:'${T.hf}';--sf:'${T.sf}';--bf:'${T.bf}';--mag:${T.mag};--magInk:${T.magInk}`};

/* ---------- slot helpers ---------- */
let EDIT=false;
const tx=(v,k)=>esc(v[k]).replace(/\n/g,'<br>');
const paras=s=>String(s||'').split(/\n\s*\n|\r\n\s*\r\n/).map(p=>p.trim()).filter(Boolean).map(p=>`<p>${esc(p).replace(/\n/g,'<br>')}</p>`).join('');
const qa=s=>String(s||'').split(/\n+/).map(l=>l.trim()).filter(Boolean).map(l=>/^(q|question)\s*[:.-]/i.test(l)?`<p class="q">${esc(l.replace(/^(q|question)\s*[:.-]\s*/i,''))}</p>`:`<p>${esc(l.replace(/^(a|answer)\s*[:.-]\s*/i,''))}</p>`).join('');
const im=(v,k,cls,st)=>{const o=v[k];const u=o&&(o.u||(typeof o==='string'?o:''));
 if(!u)return EDIT?`<div class="mg-ph ${cls||''}" style="${st||''}" data-slot="${k}"><span>PHOTO</span></div>`:'';
 const x=o.x??50,y=o.y??50,z=o.z??1;return `<div class="mg-im ${cls||''}" style="${st||''}" data-slot="${k}"><img src="${esc(abs(u))}" alt="" style="object-position:${x}% ${y}%;transform:scale(${z});transform-origin:${x}% ${y}%" loading="lazy" draggable="false"></div>`};
const cut=(v,k,st)=>{const o=v[k],u=o&&o.u;if(!u)return EDIT?`<div class="mg-ph mg-cutph" style="${st}" data-slot="${k}"><span>COVER STAR<br><small>PNG cut-out</small></span></div>`:'';
 return `<img class="mg-cut" data-slot="${k}" src="${esc(abs(u))}" alt="" style="${st};transform:scale(${o.z??1});transform-origin:50% 100%;object-position:${o.x??50}% 100%" draggable="false">`};
const fit=(s,base,n)=>Math.round(base*Math.max(.42,Math.min(1,Math.sqrt((n||12)/Math.max(1,String(s||'').length)))));
/* the masthead: always at the top, always big. A logo uploaded in the Maker replaces the built one. */
/* the logo at the top: size and position can be moved per page (mh_s %, mh_x / mh_y px) */
let CURV={};
const MH=(d,top,w)=>{w=w||860;const l=(d&&d.logo&&d.logo.u)||'logo-mag.webp',sc=(+CURV.mh_s||100)/100,ww=Math.round(w*sc),x=+CURV.mh_x||0,y=+CURV.mh_y||0;
 return `<div class="mg-mh" data-slot="mh" style="top:${top+y}px;width:${ww}px;margin-left:${-ww/2+x}px"><img src="${esc(abs(l))}" alt="RAPMAG" style="width:100%;height:auto"></div>`};
const issue=(v,top)=>v.issue?`<div class="mg-iss" style="top:${top}px">${tx(v,'issue')}</div>`:'';
const foot=(v,t)=>`<div class="mg-handle"${t?` style="${t}"`:''}>${v.handle?tx(v,'handle'):'@RAPAECHELON · RAPAECHELON.COM'}</div>`;
const circ=(v,i,st,box)=>`<div class="mg-circ${box?' box':''}" style="${st}">${im(v,'p'+i,'cimg')}${v['p'+i+'n']?`<b>${tx(v,'p'+i+'n')}</b>`:EDIT?'<b>NAME</b>':''}</div>`;
const line=(v,i,st,al)=>(v['l'+i+'h']||v['l'+i]||EDIT)?`<div class="mg-line" style="${st};text-align:${al||'left'}"><small>${tx(v,'l'+i+'h')||(EDIT?'LABEL':'')}</small><b>${tx(v,'l'+i)||(EDIT?'Cover line':'')}</b></div>`:'';

/* ---------- slot lists (the Maker builds its form from these) ---------- */
const S={
 cover:[['issue','text','Issue line','SEASON 3 | ISSUE 9 | YEAR 2026'],['bg','img','Background photo'],['star','cut','Cover star (cut-out PNG, stands in front of the logo)'],['name','text','Main name','POLO SHAK'],['tag','text','Tagline','THE ULTIMATE COME UP'],['l1h','text','Cover line 1 label','TOP STORY'],['l1','text','Cover line 1','JADE CARMELI'],['l2h','text','Cover line 2 label','HOT ARTIST PICKS'],['l2','text','Cover line 2','GMB FAME'],['l3h','text','Cover line 3 label','HOT PRODUCERS'],['l3','text','Cover line 3','WORKSBYTR3Y'],['l4h','text','Cover line 4 label','THE TOP TEN'],['l4','text','Cover line 4','BEST HIP-HOP ALBUMS'],['p1','img','Small photo 1'],['p1n','text','Small photo 1 name','AY ROCK'],['p2','img','Small photo 2'],['p2n','text','Small photo 2 name','NAOMMI'],['p3','img','Small photo 3'],['p3n','text','Small photo 3 name','FELIX'],['p4','img','Small photo 4'],['p4n','text','Small photo 4 name','BEMO'],['badge','text','Badge','EXCLUSIVE!'],['handle','text','Bottom line','@RAPAECHELON']],
 story:[['kicker','text','Kicker','FEATURE'],['title','text','Headline','The Ultimate Come Up'],['dek','para','Subhead','How an independent artist built a city-wide following one show at a time.'],['by','text','Byline','By RAPMAG Staff'],['img1','img','Main photo'],['img2','img','Second photo'],['cap','text','Caption',''],['quote','para','Pull quote','“I never waited for permission.”'],['body','body','Article text (paste it in)','Paste the article here. Leave an empty line between paragraphs.'],['pg','text','Page number','']],
};
const SL=(base,keep)=>S[base].filter(x=>keep.includes(x[0]));

/* ---------- covers (10 layouts) ---------- */
const C=[];
const cov=(id,name,keep,html)=>C.push({id,fam:'cover',name,slots:SL('cover',keep),html});
const ALLC=['issue','bg','star','name','tag','l1h','l1','l2h','l2','l3h','l3','l4h','l4','p1','p1n','p2','p2n','p3','p3n','p4','p4n','badge','handle'];
cov('c-classic','Classic Star',ALLC.filter(k=>!/p3|p4/.test(k)),(v,d)=>`${im(v,'bg','full')}<div class="mg-shade"></div>${issue(v,22)}${MH(d,60)}
 ${cut(v,'star','position:absolute;left:150px;width:700px;bottom:0;height:1110px;object-fit:contain')}
 <div class="mg-name serif" style="top:640px;font-size:${fit(v.name,118,10)}px">${tx(v,'name')}</div><div class="mg-tag" style="top:${640+fit(v.name,118,10)+6}px">${tx(v,'tag')}</div>
 ${line(v,1,'left:40px;top:880px;width:300px')}${line(v,2,'right:40px;top:880px;width:300px','right')}${line(v,3,'right:40px;top:990px;width:300px','right')}${line(v,4,'left:40px;top:990px;width:300px')}
 ${circ(v,1,'left:46px;top:1080px')}${circ(v,2,'right:46px;top:1080px')}${v.badge?`<div class="mg-badge" style="right:190px;top:1110px">${tx(v,'badge')}</div>`:''}${foot(v)}`);
cov('c-giant','Giant Name Behind',['issue','bg','star','name','tag','p1','p1n','p2','p2n','p3','p3n','p4','p4n','badge','handle','l1h','l1'],(v,d)=>`${im(v,'bg','full')}<div class="mg-shade"></div>${issue(v,22)}${MH(d,60)}
 <div class="mg-giant" style="top:300px;font-size:${fit(v.name,330,6)}px">${tx(v,'name')}</div>
 ${cut(v,'star','position:absolute;left:120px;width:760px;bottom:150px;height:1000px;object-fit:contain')}
 ${v.tag?`<div class="mg-pill" style="top:690px">${tx(v,'tag')}</div>`:''}${line(v,1,'left:40px;top:900px;width:280px')}
 ${[1,2,3,4].map(i=>circ(v,i,`left:${40+i*0}px;left:${[40,265,505,740][i-1]}px;top:1080px`)).join('')}${v.badge?`<div class="mg-badge" style="right:40px;top:960px">${tx(v,'badge')}</div>`:''}${foot(v)}`);
cov('c-side','Side Stack',ALLC.filter(k=>!/p2|p3|p4/.test(k)),(v,d)=>`${im(v,'bg','full')}<div class="mg-shade l"></div>${issue(v,22)}${MH(d,60)}
 ${cut(v,'star','position:absolute;right:-40px;width:680px;bottom:0;height:1080px;object-fit:contain')}
 <div class="mg-name block" style="left:40px;top:430px;width:520px;text-align:left;font-size:${fit(v.name,120,9)}px">${tx(v,'name')}</div><div class="mg-tag" style="left:40px;width:520px;text-align:left;top:${440+fit(v.name,120,9)*2}px">${tx(v,'tag')}</div>
 ${[1,2,3,4].map(i=>line(v,i,`left:40px;top:${700+(i-1)*95}px;width:380px`)).join('')}${circ(v,1,'left:40px;top:1090px')}${v.badge?`<div class="mg-badge" style="left:230px;top:1120px">${tx(v,'badge')}</div>`:''}${foot(v)}`);
cov('c-row','Featuring Row',['issue','bg','star','name','tag','p1','p1n','p2','p2n','p3','p3n','p4','p4n','l1h','l1','handle'],(v,d)=>`${im(v,'bg','full')}<div class="mg-shade"></div>${issue(v,22)}${MH(d,60)}
 ${cut(v,'star','position:absolute;left:170px;width:660px;bottom:230px;height:930px;object-fit:contain')}
 <div class="mg-name block" style="top:650px;font-size:${fit(v.name,130,10)}px">${tx(v,'name')}</div><div class="mg-tag script" style="top:615px">${tx(v,'tag')}</div>
 <div class="mg-row"><div class="mg-rowh">${tx(v,'l1h')||'FEATURING'}${v.l1?': '+tx(v,'l1'):''}</div>${[1,2,3,4].map(i=>circ(v,i,'position:relative',1)).join('')}</div>${foot(v,'bottom:8px')}`);
cov('c-split','Split Box',['issue','bg','star','name','tag','l1h','l1','l2h','l2','l3h','l3','p1','p1n','handle'],(v,d)=>`<div class="full" style="background:var(--bg2)"></div>${im(v,'bg','','position:absolute;left:0;top:0;width:560px;height:100%')}${issue(v,22)}${MH(d,60)}
 ${cut(v,'star','position:absolute;left:-20px;width:640px;bottom:0;height:1060px;object-fit:contain')}
 <div class="mg-box" style="left:560px;top:420px;width:400px"><div class="mg-name block" style="position:static;text-align:left;font-size:${fit(v.name,96,9)}px">${tx(v,'name')}</div><div class="mg-tag" style="position:static;text-align:left;margin-top:10px">${tx(v,'tag')}</div></div>
 ${[1,2,3].map(i=>line(v,i,`left:600px;top:${760+(i-1)*95}px;width:360px`)).join('')}${circ(v,1,'right:40px;top:1060px')}${foot(v)}`);
cov('c-exclusive','Exclusive Ribbon',['issue','bg','star','name','tag','badge','l1h','l1','l2h','l2','p1','p1n','handle'],(v,d)=>`${im(v,'bg','full')}<div class="mg-shade"></div>${issue(v,22)}${MH(d,60)}
 ${cut(v,'star','position:absolute;left:130px;width:740px;bottom:0;height:1110px;object-fit:contain')}
 <div class="mg-ribbon" style="top:520px">${tx(v,'badge')||'EXCLUSIVE'}</div>
 <div class="mg-name serif" style="top:930px;font-size:${fit(v.name,120,10)}px">${tx(v,'name')}</div><div class="mg-tag" style="top:${940+fit(v.name,120,10)}px">${tx(v,'tag')}</div>
 ${line(v,1,'left:40px;top:640px;width:260px')}${line(v,2,'right:40px;top:640px;width:260px','right')}${circ(v,1,'right:46px;top:760px')}${foot(v)}`);
cov('c-duo','Duo',['issue','bg','star','star2','name','name2','tag','l1h','l1','handle'],(v,d)=>`${im(v,'bg','full')}<div class="mg-shade"></div>${issue(v,22)}${MH(d,60)}
 ${cut(v,'star','position:absolute;left:-30px;width:560px;bottom:0;height:1010px;object-fit:contain')}${cut(v,'star2','position:absolute;right:-30px;width:560px;bottom:0;height:1010px;object-fit:contain')}
 <div class="mg-name block" style="left:30px;width:440px;text-align:left;top:960px;font-size:${fit(v.name,80,9)}px">${tx(v,'name')}</div><div class="mg-name block" style="right:30px;left:auto;width:440px;text-align:right;top:960px;font-size:${fit(v.name2,80,9)}px">${tx(v,'name2')}</div>
 <div class="mg-pill" style="top:600px">${tx(v,'tag')||'VS'}</div>${line(v,1,'left:330px;width:340px;top:1110px','center')}${foot(v)}`);
cov('c-minimal','Minimal',['issue','bg','star','name','tag','handle'],(v,d)=>`${im(v,'bg','full')}<div class="mg-shade b"></div>${issue(v,22)}${MH(d,60)}
 ${cut(v,'star','position:absolute;left:100px;width:800px;bottom:0;height:1110px;object-fit:contain')}
 <div class="mg-name block" style="left:50px;width:900px;text-align:left;top:1010px;font-size:${fit(v.name,130,10)}px">${tx(v,'name')}</div><div class="mg-tag" style="left:50px;width:900px;text-align:left;top:${1020+fit(v.name,130,10)}px">${tx(v,'tag')}</div>${foot(v,'top:24px;bottom:auto;left:auto;right:30px;text-align:right')}`);
cov('c-chart','Chart Issue',['issue','bg','star','name','tag','chart','handle'],(v,d)=>`${im(v,'bg','full')}<div class="mg-shade l"></div>${issue(v,22)}${MH(d,60)}
 ${cut(v,'star','position:absolute;right:-60px;width:660px;bottom:0;height:1060px;object-fit:contain')}
 <div class="mg-chartbox" style="left:40px;top:420px;width:420px"><h4>THE INDIE CHARTS<br><span>TOP 10</span></h4>${chartRows(v,10,1)}</div>
 <div class="mg-name block" style="right:40px;left:auto;width:520px;text-align:right;top:1040px;font-size:${fit(v.name,96,9)}px">${tx(v,'name')}</div><div class="mg-tag" style="right:40px;left:auto;width:520px;text-align:right;top:${1046+fit(v.name,96,9)}px">${tx(v,'tag')}</div>${foot(v)}`);
cov('c-collage','Collage',['issue','bg','star','name','tag','p1','p1n','p2','p2n','p3','p3n','l1h','l1','handle'],(v,d)=>`${im(v,'bg','full')}<div class="mg-shade"></div>${issue(v,22)}${MH(d,60)}
 ${cut(v,'star','position:absolute;left:40px;width:620px;bottom:0;height:1050px;object-fit:contain')}
 ${[1,2,3].map(i=>`<div class="mg-tile" style="right:40px;top:${360+(i-1)*250}px">${im(v,'p'+i,'full')}<b>${tx(v,'p'+i+'n')||(EDIT?'NAME':'')}</b></div>`).join('')}
 <div class="mg-name block" style="left:40px;width:640px;text-align:left;top:1060px;font-size:${fit(v.name,104,10)}px">${tx(v,'name')}</div><div class="mg-tag" style="left:40px;width:640px;text-align:left;top:${1066+fit(v.name,104,10)}px">${tx(v,'tag')}</div>${line(v,1,'right:40px;top:1120px;width:250px','right')}${foot(v)}`);
/* extra slot names used by some covers */
C.forEach(c=>c.slots.unshift(['mh','logo','Logo at the top']));
C.find(c=>c.id==='c-duo').slots.splice(3,0,['star2','cut','Second cover star (cut-out PNG)'],['name2','text','Second name','GMB FAME']);
C.find(c=>c.id==='c-chart').slots.push(['chart','chart','Indie Charts (pulled from your chart)']);

function chartRows(v,n,small){const c=(v.chart&&v.chart.items)||[];if(!c.length)return EDIT?'<div class="mg-empty">Click PULL CHART to fill this from the Indie Charts.</div>':'';
 return `<ol class="mg-chart${small?' sm':''}">${c.slice(0,n).map((x,i)=>`<li><em>${i+1}</em><span><b>${esc(x.title)}</b><small>${esc(x.artist)}</small></span>${small?'':`<i>${Number(x.plays||0).toLocaleString('en-US')} plays</i>`}</li>`).join('')}</ol>`}

/* ---------- inside pages (15 layouts) ---------- */
const P=[];const STO=['kicker','title','dek','by','img1','img2','cap','quote','body','pg'];
const pg=(id,fam,name,keep,html,extra)=>P.push({id,fam,name,slots:SL('story',keep).concat(extra||[]),html});
const pnum=v=>`<div class="mg-pn">${v.pg?tx(v,'pg')+' · ':''}RAPMAG</div>`;
const head=(v,st,base)=>`<div class="mg-kick" style="${st||''}">${tx(v,'kicker')}</div><h2 class="mg-h" style="font-size:${fit(v.title,base||96,18)}px">${tx(v,'title')}</h2>`;
pg('p-contents','contents','Contents',['title','img1','pg'],(v)=>`<div class="mg-pad"><h2 class="mg-h" style="font-size:120px">${tx(v,'title')||'CONTENTS'}</h2><div class="mg-toc">${[1,2,3,4,5,6,7,8].map(i=>v['t'+i]||EDIT?`<div><em>${tx(v,'n'+i)||(EDIT?'00':'')}</em><b>${tx(v,'t'+i)||(EDIT?'Story title':'')}</b><small>${tx(v,'s'+i)}</small></div>`:'').join('')}</div></div>${im(v,'img1','','position:absolute;right:0;bottom:0;width:420px;height:560px')}${pnum(v)}`,
 [1,2,3,4,5,6,7,8].flatMap(i=>[['n'+i,'text','Item '+i+' page','0'+(i*4)],['t'+i,'text','Item '+i+' title',''],['s'+i,'text','Item '+i+' line','']]));
pg('p-opener','feature','Feature Opener',['kicker','title','dek','by','img1','pg'],(v)=>`${im(v,'img1','full')}<div class="mg-shade b"></div><div class="mg-pad" style="position:absolute;left:0;right:0;bottom:60px">${head(v,'',130)}<div class="mg-dek">${tx(v,'dek')}</div><div class="mg-by">${tx(v,'by')}</div></div>${pnum(v)}`);
pg('p-columns','feature','Feature Text + Quote',['kicker','title','quote','body','pg'],(v)=>`<div class="mg-pad">${head(v,'',72)}<div class="mg-body cols2" style="height:${v.quote?880:1010}px">${paras(v.body)}</div>${v.quote?`<div class="mg-quote">${tx(v,'quote')}</div>`:''}</div>${pnum(v)}`);
pg('p-photoleft','feature','Photo Left, Text Right',['kicker','title','dek','img1','cap','body','pg'],(v)=>`${im(v,'img1','','position:absolute;left:0;top:0;width:460px;height:100%')}${v.cap?`<div class="mg-cap" style="left:20px;bottom:20px;width:420px">${tx(v,'cap')}</div>`:''}<div class="mg-pad" style="margin-left:460px">${head(v,'',64)}<div class="mg-dek sm">${tx(v,'dek')}</div><div class="mg-body" style="height:820px">${paras(v.body)}</div></div>${pnum(v)}`);
pg('p-interview','interview','Interview Q&A',['kicker','title','dek','img1','body','pg'],(v)=>`<div class="mg-pad">${head(v,'',80)}<div class="mg-dek sm">${tx(v,'dek')}</div></div>${im(v,'img1','','position:absolute;right:50px;top:330px;width:330px;height:420px')}<div class="mg-body qa cols2" style="position:absolute;left:50px;right:50px;top:780px;height:430px">${qa(v.body)}</div>${pnum(v)}`);
pg('p-spotlight','spotlight','Artist Spotlight',['kicker','title','dek','img1','body','pg'],(v)=>`${im(v,'img1','','position:absolute;left:0;top:0;width:100%;height:640px')}<div class="mg-band"><div class="mg-kick">${tx(v,'kicker')||'ARTIST SPOTLIGHT'}</div><h2 class="mg-h" style="font-size:${fit(v.title,110,14)}px">${tx(v,'title')}</h2></div><div class="mg-pad" style="position:absolute;top:820px;left:0;right:0"><div class="mg-dek sm">${tx(v,'dek')}</div><div class="mg-body cols2" style="height:250px">${paras(v.body)}</div><div class="mg-soc">${['ig','tt','yt'].map(k=>v[k]?`<span>${esc(k.toUpperCase())} ${tx(v,k)}</span>`:'').join('')}</div></div>${pnum(v)}`,
 [['ig','text','Instagram','@'],['tt','text','TikTok','@'],['yt','text','YouTube','']]);
pg('p-chart','chart','Indie Charts Top 10',['kicker','title','img1','pg'],(v)=>`<div class="mg-pad"><div class="mg-kick">${tx(v,'kicker')||'RAPAECHELON'}</div><h2 class="mg-h" style="font-size:120px">${tx(v,'title')||'THE INDIE CHARTS'}</h2>${chartRows(v,10)}</div>${pnum(v)}`,[['chart','chart','Indie Charts (pulled from your chart)']]);
pg('p-fullphoto','photo','Full Photo + Caption',['img1','cap','pg'],(v)=>`${im(v,'img1','full')}${v.cap?`<div class="mg-cap" style="left:50px;bottom:60px;width:600px">${tx(v,'cap')}</div>`:''}${pnum(v)}`);
pg('p-briefs','news','News Briefs',['kicker','title','pg'],(v)=>`<div class="mg-pad">${head(v,'',90)}<div class="mg-briefs">${[1,2,3,4].map(i=>`<div>${im(v,'b'+i+'i','','height:190px;position:relative')}<b>${tx(v,'b'+i+'t')||(EDIT?'Brief headline':'')}</b><p>${tx(v,'b'+i+'p')}</p></div>`).join('')}</div></div>${pnum(v)}`,
 [1,2,3,4].flatMap(i=>[['b'+i+'i','img','Brief '+i+' photo'],['b'+i+'t','text','Brief '+i+' headline',''],['b'+i+'p','para','Brief '+i+' text','']]));
pg('p-model','spotlight','Model of the Month',['kicker','title','dek','img1','pg'],(v)=>`${im(v,'img1','full')}<div class="mg-shade l"></div><div class="mg-pad" style="position:absolute;left:0;top:60px;width:520px"><div class="mg-kick">${tx(v,'kicker')||'MODEL OF THE MONTH'}</div><h2 class="mg-h" style="font-size:${fit(v.title,120,10)}px">${tx(v,'title')}</h2><div class="mg-dek">${tx(v,'dek')}</div><div class="mg-stats">${[1,2,3].map(i=>v['st'+i]?`<div><small>${tx(v,'sl'+i)}</small><b>${tx(v,'st'+i)}</b></div>`:'').join('')}</div></div>${pnum(v)}`,
 [1,2,3].flatMap(i=>[['sl'+i,'text','Fact '+i+' label',['FROM','INSTAGRAM','BOOKING'][i-1]],['st'+i,'text','Fact '+i,'']]));
pg('p-producers','spotlight','Producer Picks (3)',['kicker','title','pg'],(v)=>`<div class="mg-pad">${head(v,'',96)}<div class="mg-three">${[1,2,3].map(i=>`<div>${im(v,'c'+i+'i','','height:360px;position:relative')}<b>${tx(v,'c'+i+'t')||(EDIT?'NAME':'')}</b><p>${tx(v,'c'+i+'p')}</p></div>`).join('')}</div></div>${pnum(v)}`,
 [1,2,3].flatMap(i=>[['c'+i+'i','img','Pick '+i+' photo'],['c'+i+'t','text','Pick '+i+' name',''],['c'+i+'p','para','Pick '+i+' text','']]));
pg('p-bigquote','feature','Big Quote',['quote','by','img1','pg'],(v)=>`${im(v,'img1','','position:absolute;right:0;top:0;width:50%;height:100%')}<div class="mg-pad" style="width:560px;position:absolute;top:240px"><div class="mg-bq">${tx(v,'quote')}</div><div class="mg-by">${tx(v,'by')}</div></div>${pnum(v)}`);
pg('p-ad','ad','Full Page Ad',['img1'],(v)=>`${im(v,'img1','full')}${v.link?`<a class="mg-adl" href="${esc(v.link)}" target="_blank" rel="noopener">${tx(v,'linkt')||'LEARN MORE'}</a>`:''}`,[['link','text','Ad link (https://…)',''],['linkt','text','Button text','LEARN MORE']]);
pg('p-twophoto','photo','Two Photos + Text',['kicker','title','img1','img2','body','pg'],(v)=>`${im(v,'img1','','position:absolute;left:0;top:0;width:50%;height:560px')}${im(v,'img2','','position:absolute;right:0;top:0;width:50%;height:560px')}<div class="mg-pad" style="position:absolute;top:580px;left:0;right:0">${head(v,'',72)}<div class="mg-body cols2" style="height:430px">${paras(v.body)}</div></div>${pnum(v)}`);
pg('p-back','back','Back Cover',['title','dek','img1'],(v,d)=>`${im(v,'img1','full')}<div class="mg-shade"></div>${MH(d,80,700)}<div class="mg-pad" style="position:absolute;left:0;right:0;bottom:120px;text-align:center"><div class="mg-kick">NEXT ISSUE</div><h2 class="mg-h" style="font-size:${fit(v.title,110,14)}px">${tx(v,'title')}</h2><div class="mg-dek">${tx(v,'dek')}</div></div>${foot(v)}`,[['handle','text','Bottom line','@RAPAECHELON']]);

pg('p-bighead','feature','Giant Headline + 3 Columns',['kicker','title','dek','by','body','pg'],(v)=>`<div class="mg-pad"><div class="mg-kick">${tx(v,'kicker')}</div><h2 class="mg-h" style="font-size:${fit(v.title,190,10)}px;border-bottom:8px solid var(--acc);padding-bottom:20px">${tx(v,'title')}</h2><div class="mg-dek">${tx(v,'dek')}</div><div class="mg-by" style="margin-bottom:20px">${tx(v,'by')}</div><div class="mg-body cols3" style="height:${560-Math.min(200,String(v.title||'').length*3)}px">${paras(v.body)}</div></div>${pnum(v)}`);
pg('p-sidebar','feature','Story + Fact Box',['kicker','title','img1','body','pg'],(v)=>`<div class="mg-pad">${head(v,'',80)}</div><div class="mg-body" style="position:absolute;left:60px;top:${280}px;width:560px;height:930px">${paras(v.body)}</div><div class="mg-side" style="position:absolute;right:50px;top:280px;width:290px">${im(v,'img1','','height:290px;position:relative;margin-bottom:16px')}<h4>${tx(v,'fh')||'FAST FACTS'}</h4>${[1,2,3,4,5].map(i=>v['f'+i]?`<p>${tx(v,'f'+i)}</p>`:EDIT?'<p>Fact</p>':'').join('')}</div>${pnum(v)}`,
 [['fh','text','Fact box title','FAST FACTS'],...[1,2,3,4,5].map(i=>['f'+i,'text','Fact '+i,''])]);
pg('p-grid4','photo','Four Photo Grid',['kicker','title','pg'],(v)=>`<div class="mg-pad" style="padding-bottom:0">${head(v,'',70)}</div><div class="mg-grid4">${[1,2,3,4].map(i=>`<div>${im(v,'g'+i,'full')}${v['g'+i+'c']?`<span>${tx(v,'g'+i+'c')}</span>`:''}</div>`).join('')}</div>${pnum(v)}`,
 [1,2,3,4].flatMap(i=>[['g'+i,'img','Photo '+i],['g'+i+'c','text','Photo '+i+' caption','']]));
pg('p-quoteover','feature','Photo + Quote Overlay',['quote','by','img1','pg'],(v)=>`${im(v,'img1','full')}<div class="mg-shade b"></div><div style="position:absolute;left:60px;right:60px;bottom:90px;z-index:3"><div class="mg-bq" style="font-size:${fit(v.quote,80,40)}px">${tx(v,'quote')}</div><div class="mg-by">${tx(v,'by')}</div></div>${pnum(v)}`);
pg('p-top5','news','Top 5 List',['kicker','title','pg'],(v)=>`<div class="mg-pad">${head(v,'',100)}<div class="mg-top5">${[1,2,3,4,5].map(i=>`<div><em>${i}</em><div>${im(v,'t'+i+'i','','width:150px;height:150px;position:relative;flex:none')}</div><span><b>${tx(v,'t'+i+'t')||(EDIT?'Item title':'')}</b><p>${tx(v,'t'+i+'p')}</p></span></div>`).join('')}</div></div>${pnum(v)}`,
 [1,2,3,4,5].flatMap(i=>[['t'+i+'i','img','#'+i+' photo'],['t'+i+'t','text','#'+i+' title',''],['t'+i+'p','para','#'+i+' text','']]));
pg('p-qatop','interview','Interview, Photo on Top',['kicker','title','dek','img1','body','pg'],(v)=>`${im(v,'img1','','position:absolute;left:0;top:0;width:100%;height:470px')}<div class="mg-pad" style="position:absolute;top:470px;left:0;right:0;padding-top:34px">${head(v,'',70)}<div class="mg-dek sm">${tx(v,'dek')}</div><div class="mg-body qa cols3" style="height:430px">${qa(v.body)}</div></div>${pnum(v)}`);
pg('p-events','news','Shows & Events',['kicker','title','img1','pg'],(v)=>`${im(v,'img1','','position:absolute;left:0;top:0;width:100%;height:330px')}<div class="mg-pad" style="position:absolute;top:330px;left:0;right:0;padding-top:34px">${head(v,'',90)}<div class="mg-ev">${[1,2,3,4,5,6].map(i=>v['e'+i+'t']||EDIT?`<div><em>${tx(v,'e'+i+'d')||(EDIT?'DEC 01':'')}</em><b>${tx(v,'e'+i+'t')||(EDIT?'Event':'')}</b><small>${tx(v,'e'+i+'p')}</small></div>`:'').join('')}</div></div>${pnum(v)}`,
 [1,2,3,4,5,6].flatMap(i=>[['e'+i+'d','text','Event '+i+' date',''],['e'+i+'t','text','Event '+i+' name',''],['e'+i+'p','text','Event '+i+' place','']]));
pg('p-review','spotlight','Album / Song Review',['kicker','title','dek','img1','body','pg'],(v)=>`<div class="mg-pad"><div style="display:flex;gap:40px;align-items:flex-end">${im(v,'img1','','width:400px;height:400px;position:relative;flex:none;box-shadow:0 20px 50px rgba(0,0,0,.4)')}<div><div class="mg-kick">${tx(v,'kicker')||'REVIEW'}</div><h2 class="mg-h" style="font-size:${fit(v.title,90,14)}px">${tx(v,'title')}</h2><div class="mg-stars">${'★'.repeat(Math.max(0,Math.min(5,+v.stars||0)))}<i>${'★'.repeat(5-Math.max(0,Math.min(5,+v.stars||0)))}</i></div><div class="mg-dek sm">${tx(v,'dek')}</div></div></div><div class="mg-body cols2" style="height:620px;margin-top:40px">${paras(v.body)}</div></div>${pnum(v)}`,
 [['stars','text','Stars (0 to 5)','4']]);
pg('p-letter','contents',"Editor's Letter",['kicker','title','img1','body','pg'],(v)=>`<div class="mg-pad"><div class="mg-kick">${tx(v,'kicker')||'FROM THE EDITOR'}</div><h2 class="mg-h" style="font-size:${fit(v.title,110,14)}px">${tx(v,'title')}</h2><div class="mg-body letter" style="height:760px">${paras(v.body)}</div><div class="mg-sig">${im(v,'img1','','width:120px;height:120px;border-radius:50%;position:relative;flex:none')}<div><b>${tx(v,'sig')||(EDIT?'Name':'')}</b><small>${tx(v,'role')}</small></div></div></div>${pnum(v)}`,
 [['sig','text','Signed by',''],['role','text','Title','Editor in Chief']]);
pg('p-ad2','ad','Two Half-Page Ads',[],(v)=>`${[1,2].map(i=>`<div style="position:absolute;left:0;right:0;top:${i===1?0:647}px;height:647px;border-bottom:${i===1?'6px solid var(--bg)':'0'}">${im(v,'a'+i,'full')}${v['a'+i+'l']?`<a class="mg-adl" style="bottom:30px;font-size:20px" href="${esc(v['a'+i+'l'])}" target="_blank" rel="noopener">${tx(v,'a'+i+'b')||'LEARN MORE'}</a>`:''}</div>`).join('')}`,
 [1,2].flatMap(i=>[['a'+i,'img','Ad '+i+' image'],['a'+i+'l','text','Ad '+i+' link (https://…)',''],['a'+i+'b','text','Ad '+i+' button','LEARN MORE']]));

P.find(x=>x.id==='p-back').slots.unshift(['mh','logo','Logo at the top']);
const ALL=[...C,...P],BY=Object.fromEntries(ALL.map(t=>[t.id,t]));
const FAMS={cover:'Covers',contents:'Contents',feature:'Features',interview:'Interviews',spotlight:'Spotlights',chart:'Charts',photo:'Photo',news:'News',ad:'Ads',back:'Back Cover'};

/* sample content so the picker shows real-looking designs */
const SAMPLE={issue:'SEASON 3 | ISSUE 9 | YEAR 2026',name:'POLO SHAK',name2:'GMB FAME',tag:'THE ULTIMATE COME UP',l1h:'TOP STORY',l1:'JADE CARMELI',l2h:'HOT ARTIST PICKS',l2:'GMB FAME',l3h:'HOT PRODUCERS',l3:'WORKSBYTR3Y',l4h:'THE TOP TEN',l4:'BEST ALBUMS OF 2026',p1n:'AY ROCK',p2n:'NAOMMI',p3n:'FELIX',p4n:'BEMO',badge:'EXCLUSIVE!',
 kicker:'FEATURE',title:'The Ultimate Come Up',dek:'How an independent artist built a city-wide following one show at a time.',by:'By RAPMAG Staff',quote:'“I never waited for permission.”',cap:'Backstage before the show.',
 body:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus.\n\nDonec ullamcorper nulla non metus auctor fringilla. Maecenas faucibus mollis interdum. Cras mattis consectetur purus sit amet fermentum.\n\nNullam quis risus eget urna mollis ornare vel eu leo. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.\n\nQ: How did it start?\nA: In my bedroom with a laptop.',
 t1:'Polo Shak',n1:'12',s1:'The ultimate come up',t2:'Indie Charts',n2:'24',s2:'Top 10 this month',t3:'Hot Producers',n3:'30',s3:'Who made the beats',b1t:'New tour dates',b1p:'Short news text goes here.',b2t:'Studio update',b2p:'Short news text goes here.',b3t:'Label news',b3p:'Short news text goes here.',b4t:'Video premiere',b4p:'Short news text goes here.',c1t:'WORKSBYTR3Y',c2t:'BEATZ',c3t:'KAYO',sl1:'FROM',st1:'ATLANTA',sl2:'INSTAGRAM',st2:'@MODEL'};

/* ---------- render one page ---------- */
const extrasHTML=(ex)=>(ex||[]).map((x,i)=>x.t==='img'?`<div class="mg-x" data-x="${i}" style="left:${x.x}%;top:${x.y}%;width:${x.w}%;height:${x.h||20}%;${x.round?'border-radius:50%;overflow:hidden;':''}">${x.u?`<img src="${esc(abs(x.u))}" alt="" style="width:100%;height:100%;object-fit:cover" draggable="false">`:EDIT?'<div class="mg-ph" style="position:absolute;inset:0"><span>IMAGE</span></div>':''}</div>`
 :`<div class="mg-x txt" data-x="${i}" style="left:${x.x}%;top:${x.y}%;width:${x.w}%;font-size:${x.size||40}px;color:${esc(x.color||'var(--ink)')};${x.bg?'background:'+esc(x.bg)+';padding:.15em .35em;':''}font-family:${x.font==='serif'?'var(--sf)':x.font==='body'?'var(--bf)':'var(--hf)'};text-align:${x.align||'left'}">${esc(x.text||'').replace(/\n/g,'<br>')}</div>`).join('');
/* every block on a page can be dragged and resized in the Maker: blocks get data-mv keys, moves live in v._mv {key:{x,y,s}} */
const MOV=['mg-name','mg-tag','mg-line','mg-circ','mg-badge','mg-iss','mg-pill','mg-ribbon','mg-box','mg-chartbox','mg-tile','mg-giant','mg-handle','mg-cut','mg-cutph','mg-row','mg-kick','mg-h','mg-dek','mg-by','mg-quote','mg-bq','mg-cap','mg-body','mg-side','mg-soc','mg-stars','mg-sig','mg-band','mg-adl'];
let RID=0;
function render(page,doc,opt){EDIT=!!(opt&&opt.edit);const t=BY[page.tpl]||P[0],v={...((opt&&opt.sample)?SAMPLE:{}),...(page.v||{})};CURV=v;
 let h;try{h=t.html(v,doc||{})}catch(e){h=`<div class="mg-pad">Page error: ${esc(e.message)}</div>`}
 const n={};h=h.replace(/<(\w+)([^>]*?) class="(mg-[a-z0-9]+)/g,(m,tag,pre,c)=>{if(!MOV.includes(c))return m;n[c]=(n[c]||0);return `<${tag}${pre} data-mv="${c}-${n[c]++}" class="${c}`});
 const id='mgr'+(++RID),M=v._mv||{};const css=Object.entries(M).map(([k,o])=>`.${id} [data-mv="${k}"]{translate:${o.x||0}px ${o.y||0}px;scale:${o.s||1}}`).join('');
 const r=`<div class="mg mg-pg ${id}${t.fam==='cover'?' cover':''}" style="${vars(page.theme)}">${css?`<style>${css}</style>`:''}${h}${extrasHTML(page.x)}</div>`;EDIT=false;return r}

/* ---------- styles + fonts ---------- */
const CSS=`.mg{position:relative;width:${W}px;height:${H}px;overflow:hidden;background:var(--bg);color:var(--ink);font-family:var(--bf);line-height:1.45;text-align:left;box-sizing:border-box}
.mg *{box-sizing:border-box;margin:0;padding:0}.mg img{display:block;max-width:none}
.mg .full{position:absolute;inset:0;width:100%;height:100%}
.mg .mg-im{overflow:hidden}.mg .mg-im img{width:100%;height:100%;object-fit:cover}.mg .mg-im.full{position:absolute;inset:0}
.mg .mg-ph{background:repeating-linear-gradient(45deg,rgba(128,128,128,.18) 0 18px,rgba(128,128,128,.08) 18px 36px);display:flex;align-items:center;justify-content:center;color:var(--mut);font:800 22px Inter,sans-serif;letter-spacing:.2em;text-align:center;outline:2px dashed rgba(128,128,128,.5);outline-offset:-2px}
.mg .mg-ph.full{position:absolute;inset:0}.mg .mg-cutph{position:absolute;opacity:.7}.mg .mg-cutph small{font-size:16px;letter-spacing:.1em}
.mg .mg-cut{position:absolute;z-index:3;pointer-events:none}
.mg .mg-shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.25),rgba(0,0,0,0) 30%,rgba(0,0,0,0) 55%,rgba(0,0,0,.75));z-index:1}
.mg .mg-shade.l{background:linear-gradient(90deg,rgba(0,0,0,.8),rgba(0,0,0,.1) 60%)}.mg .mg-shade.b{background:linear-gradient(180deg,rgba(0,0,0,0) 40%,rgba(0,0,0,.85))}
.mg .mg-mh{position:absolute;left:50%;z-index:2;text-align:center}
.mg .mh-row{display:flex;align-items:stretch;justify-content:center;font-family:'Archivo Black',Anton,sans-serif;line-height:.86;letter-spacing:-.02em}
.mg .mh-row>span{font-size:inherit;display:block;margin:0}.mg .mh-row>.mh-ae{font-size:.16em}
.mg .mh-rap{background:var(--acc);color:#fff;padding:.04em .08em .0em}.mg .mh-mag{background:var(--mag);color:var(--magInk);padding:.04em .08em .0em}
.mg .mh-ae{writing-mode:vertical-rl;transform:rotate(180deg);font-family:Inter,sans-serif;font-weight:900;letter-spacing:.12em;color:var(--mag);background:var(--acc);padding:0 .25em;display:flex;align-items:center;justify-content:center;line-height:1}
.mg .mh-tag{background:var(--acc);color:#fff;font-family:'Playfair Display',serif;font-weight:700;letter-spacing:.25em;padding:.12em 0;margin-top:.15em}
.mg .mg-iss{position:absolute;left:0;right:0;text-align:center;font:800 18px Inter,sans-serif;letter-spacing:.2em;z-index:2;color:var(--ink)}
.mg .mg-name{position:absolute;left:40px;right:40px;text-align:center;z-index:4;line-height:.95;color:var(--ink);text-shadow:0 4px 24px rgba(0,0,0,.55)}
.mg .mg-name.serif{font-family:var(--sf);font-weight:900;letter-spacing:.01em}.mg .mg-name.block{font-family:var(--hf);text-transform:uppercase}
.mg .mg-tag{position:absolute;left:40px;right:40px;text-align:center;z-index:4;font:900 26px Inter,sans-serif;letter-spacing:.14em;text-transform:uppercase;text-shadow:0 2px 12px rgba(0,0,0,.6)}
.mg .mg-tag.script{font-family:var(--sf);font-style:italic;font-weight:700;text-transform:none;letter-spacing:0;font-size:40px;color:var(--acc2)}
.mg .mg-line{position:absolute;z-index:4;text-shadow:0 2px 10px rgba(0,0,0,.6)}.mg .mg-line small{display:block;font:900 20px Inter,sans-serif;letter-spacing:.06em;color:var(--acc2);text-transform:uppercase}
.mg .mg-line b{display:block;font:500 34px var(--hf);letter-spacing:.03em;text-transform:uppercase;line-height:1.05}
.mg .mg-circ{position:absolute;z-index:4;width:150px;text-align:center}.mg .mg-circ .cimg{width:150px;height:150px;border-radius:50%;border:5px solid var(--ink);box-shadow:0 8px 30px rgba(0,0,0,.5)}
.mg .mg-circ.box .cimg{border-radius:0}.mg .mg-circ b{display:inline-block;margin-top:-16px;position:relative;background:var(--acc);color:#fff;font:900 18px Inter,sans-serif;letter-spacing:.06em;padding:4px 10px;text-transform:uppercase}
.mg .mg-badge{position:absolute;z-index:5;background:var(--acc);color:#fff;font:900 26px Inter,sans-serif;padding:10px 16px;transform:rotate(-6deg);text-transform:uppercase;box-shadow:0 6px 20px rgba(0,0,0,.4)}
.mg .mg-handle{position:absolute;left:40px;bottom:24px;z-index:5;font:800 18px Inter,sans-serif;letter-spacing:.12em}
.mg .mg-giant{position:absolute;left:0;right:0;text-align:center;font-family:var(--hf);line-height:.82;color:var(--ink);opacity:.92;text-transform:uppercase;z-index:1;letter-spacing:-.01em}
.mg .mg-pill{position:absolute;left:50%;transform:translateX(-50%);z-index:5;background:var(--acc);color:#fff;font:900 30px Inter,sans-serif;padding:8px 22px;letter-spacing:.08em;text-transform:uppercase;white-space:nowrap}
.mg .mg-row{position:absolute;left:0;right:0;bottom:50px;z-index:5;display:flex;justify-content:center;gap:40px;padding-top:44px}.mg .mg-row .mg-circ{position:relative}.mg .mg-rowh{position:absolute;top:0;left:0;right:0;text-align:center;font:900 22px Inter,sans-serif;letter-spacing:.12em}
.mg .mg-box{position:absolute;z-index:4;background:var(--acc);color:#fff;padding:30px}.mg .mg-box .mg-name,.mg .mg-box .mg-tag{color:#fff;text-shadow:none}
.mg .mg-ribbon{position:absolute;left:-40px;right:-40px;z-index:5;background:var(--acc);color:#fff;text-align:center;font:400 84px var(--hf);letter-spacing:.06em;transform:rotate(-5deg);padding:6px 0;box-shadow:0 10px 40px rgba(0,0,0,.4)}
.mg .mg-tile{position:absolute;z-index:4;width:250px;height:230px;border:5px solid var(--ink);overflow:hidden}.mg .mg-tile b{position:absolute;left:0;right:0;bottom:0;background:var(--acc);color:#fff;font:900 18px Inter,sans-serif;padding:5px 8px;text-transform:uppercase}
.mg .mg-chartbox{position:absolute;z-index:4;background:rgba(0,0,0,.6);padding:24px;border-top:8px solid var(--acc)}.mg .mg-chartbox h4{font:400 34px/1 var(--hf);margin-bottom:14px}.mg .mg-chartbox h4 span{color:var(--acc);font-size:60px}
.mg .mg-chart{list-style:none;margin-top:30px}.mg .mg-chart li{display:flex;align-items:center;gap:22px;padding:16px 0;border-bottom:2px solid rgba(128,128,128,.3)}
.mg .mg-chart em{font:400 70px/1 var(--hf);color:var(--acc);width:90px;font-style:normal}.mg .mg-chart span{flex:1}.mg .mg-chart b{display:block;font:800 30px Inter,sans-serif}.mg .mg-chart small{display:block;font:600 20px Inter,sans-serif;color:var(--mut);text-transform:uppercase;letter-spacing:.1em}.mg .mg-chart i{font:700 20px Inter,sans-serif;color:var(--mut);font-style:normal}
.mg .mg-chart.sm{margin-top:0}.mg .mg-chart.sm li{padding:6px 0;gap:12px}.mg .mg-chart.sm em{font-size:34px;width:44px}.mg .mg-chart.sm b{font-size:19px}.mg .mg-chart.sm small{font-size:13px}
.mg .mg-empty{font:600 20px Inter,sans-serif;color:var(--mut);padding:20px 0}
.mg .mg-pad{padding:70px 60px 0}.mg .mg-kick{font:900 20px Inter,sans-serif;letter-spacing:.3em;color:var(--acc);text-transform:uppercase;margin-bottom:10px}
.mg .mg-h{font-family:var(--hf);font-weight:400;line-height:.95;text-transform:uppercase;letter-spacing:.005em;margin-bottom:22px}
.mg .mg-dek{font:italic 600 32px/1.3 var(--sf);color:var(--ink);margin-bottom:18px}.mg .mg-dek.sm{font-size:26px}.mg .mg-by{font:800 18px Inter,sans-serif;letter-spacing:.2em;color:var(--mut);text-transform:uppercase}
.mg .mg-body{font-size:22px;line-height:1.55;overflow:hidden;color:var(--ink)}.mg .mg-body p{margin-bottom:.8em}.mg .mg-body.cols2{column-count:2;column-gap:44px;column-fill:auto}
.mg .mg-body>p:first-child::first-letter{font:400 3.4em/.8 var(--hf);float:left;margin:.06em .1em 0 0;color:var(--acc)}
.mg .mg-body.qa p{margin-bottom:.6em}.mg .mg-body.qa p.q{font-family:Inter,sans-serif;font-weight:900;color:var(--acc);font-size:.92em;text-transform:uppercase;letter-spacing:.04em}.mg .mg-body.qa>p:first-child::first-letter{font:inherit;float:none;margin:0;color:inherit}
.mg .mg-quote{margin-top:20px;border-top:6px solid var(--acc);padding-top:18px;font:italic 700 44px/1.15 var(--sf)}
.mg .mg-bq{font:italic 900 74px/1.05 var(--sf);margin-bottom:30px}.mg .mg-bq::before{content:'“';display:block;font-size:200px;line-height:.6;color:var(--acc)}
.mg .mg-cap{position:absolute;z-index:3;background:rgba(0,0,0,.65);color:#fff;font:600 20px Inter,sans-serif;padding:10px 14px}
.mg .mg-pn{position:absolute;right:30px;bottom:20px;font:800 14px Inter,sans-serif;letter-spacing:.25em;color:var(--mut);z-index:6}
.mg .mg-toc{margin-top:30px;width:520px}.mg .mg-toc div{display:grid;grid-template-columns:90px 1fr;padding:14px 0;border-bottom:2px solid rgba(128,128,128,.3)}.mg .mg-toc em{grid-row:span 2;font:400 56px/1 var(--hf);color:var(--acc);font-style:normal}.mg .mg-toc b{font:800 28px Inter,sans-serif}.mg .mg-toc small{font:500 20px var(--bf);color:var(--mut)}
.mg .mg-band{position:absolute;left:0;right:0;top:600px;background:var(--acc);color:#fff;padding:30px 60px 20px}.mg .mg-band .mg-kick{color:#fff}.mg .mg-band .mg-h{margin:0}
.mg .mg-soc{display:flex;gap:16px;margin-top:20px}.mg .mg-soc span{background:var(--bg2);border:2px solid var(--acc);padding:8px 14px;font:800 18px Inter,sans-serif}
.mg .mg-briefs{display:grid;grid-template-columns:1fr 1fr;gap:34px;margin-top:20px}.mg .mg-briefs b{display:block;font:800 28px/1.15 Inter,sans-serif;margin:14px 0 6px}.mg .mg-briefs p{font-size:20px;color:var(--mut);max-height:120px;overflow:hidden}
.mg .mg-three{display:grid;grid-template-columns:repeat(3,1fr);gap:28px;margin-top:20px}.mg .mg-three b{display:block;font:400 40px/1 var(--hf);margin:16px 0 8px;text-transform:uppercase}.mg .mg-three p{font-size:19px;color:var(--mut);max-height:420px;overflow:hidden}
.mg .mg-stats{display:flex;gap:30px;margin-top:30px}.mg .mg-stats small{display:block;font:800 16px Inter,sans-serif;letter-spacing:.2em;color:var(--acc)}.mg .mg-stats b{font:800 28px Inter,sans-serif}
.mg .mg-adl{position:absolute;left:50%;bottom:70px;transform:translateX(-50%);background:var(--acc);color:#fff;font:900 26px Inter,sans-serif;letter-spacing:.14em;padding:18px 34px;text-decoration:none;z-index:5}
.mg .mg-body.cols3{column-count:3;column-gap:34px;column-fill:auto;font-size:20px}
.mg .mg-side{background:var(--bg2);padding:20px;border-top:8px solid var(--acc)}.mg .mg-side h4{font:400 34px var(--hf);margin-bottom:10px}.mg .mg-side p{font:700 19px/1.35 Inter,sans-serif;padding:10px 0;border-bottom:2px solid rgba(128,128,128,.25)}
.mg .mg-grid4{position:absolute;left:30px;right:30px;top:260px;bottom:60px;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:16px}.mg .mg-grid4>div{position:relative;overflow:hidden;background:var(--bg2)}.mg .mg-grid4 span{position:absolute;left:0;bottom:0;background:rgba(0,0,0,.65);color:#fff;font:700 17px Inter,sans-serif;padding:8px 12px;z-index:2}
.mg .mg-top5>div{display:flex;gap:24px;align-items:center;padding:18px 0;border-bottom:2px solid rgba(128,128,128,.25)}.mg .mg-top5 em{font:400 110px/1 var(--hf);color:var(--acc);width:90px;font-style:normal;text-align:center}.mg .mg-top5 b{display:block;font:800 30px Inter,sans-serif}.mg .mg-top5 p{font-size:19px;color:var(--mut);max-height:84px;overflow:hidden}
.mg .mg-ev>div{display:grid;grid-template-columns:200px 1fr;padding:16px 0;border-bottom:2px solid rgba(128,128,128,.25)}.mg .mg-ev em{grid-row:span 2;font:400 44px/1 var(--hf);color:var(--acc);font-style:normal}.mg .mg-ev b{font:800 28px Inter,sans-serif}.mg .mg-ev small{font:600 19px Inter,sans-serif;color:var(--mut);text-transform:uppercase;letter-spacing:.08em}
.mg .mg-stars{font-size:52px;color:var(--acc);letter-spacing:.06em;margin-bottom:12px}.mg .mg-stars i{color:rgba(128,128,128,.35);font-style:normal}
.mg .mg-body.letter{font-size:24px;line-height:1.65}.mg .mg-sig{display:flex;gap:20px;align-items:center;margin-top:30px}.mg .mg-sig b{display:block;font:italic 700 40px var(--sf)}.mg .mg-sig small{font:800 16px Inter,sans-serif;letter-spacing:.2em;color:var(--mut);text-transform:uppercase}
.mg .mg-x{position:absolute;z-index:8;line-height:1.05}.mg .mg-x.txt{white-space:pre-wrap;text-shadow:0 2px 12px rgba(0,0,0,.35)}
/* flip-book */
.mgb{position:relative;user-select:none;-webkit-user-select:none;touch-action:pan-y;margin:0 auto}
.mgb-stage{position:relative;margin:0 auto;perspective:2600px}
.mgb-pg{position:absolute;top:0;overflow:hidden;background:#111;box-shadow:0 10px 40px rgba(0,0,0,.35)}.mgb-pg>.mg{transform-origin:0 0}
.mgb-leaf{position:absolute;top:0;transform-style:preserve-3d;z-index:5}.mgb-leaf>div{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;overflow:hidden}.mgb-leaf>.bk{transform:rotateY(180deg)}
.mgb-leaf>div::after{content:'';position:absolute;inset:0;pointer-events:none;background:linear-gradient(90deg,rgba(0,0,0,.25),rgba(0,0,0,0) 30%)}
.mgb-pg.l::after{content:'';position:absolute;inset:0;pointer-events:none;background:linear-gradient(270deg,rgba(0,0,0,.28),rgba(0,0,0,0) 12%)}.mgb-pg.r::after{content:'';position:absolute;inset:0;pointer-events:none;background:linear-gradient(90deg,rgba(0,0,0,.28),rgba(0,0,0,0) 12%)}
.mgb-ui{display:flex;align-items:center;justify-content:center;gap:14px;margin-top:16px;font:800 13px Inter,sans-serif;letter-spacing:.12em}
.mgb-ui button{background:#0c0c0e;color:#fff;border:0;padding:12px 18px;font:900 13px Inter,sans-serif;letter-spacing:.12em;cursor:pointer}.mgb-ui button:hover{background:#e0242f}.mgb-ui button[disabled]{opacity:.3;cursor:default}`;
let styled=0;function style(){if(styled)return;styled=1;const s=document.createElement('style');s.textContent=CSS;document.head.appendChild(s);
 const f=document.createElement('link');f.rel='stylesheet';f.href='https://fonts.googleapis.com/css2?family=Anton&family=Archivo+Black&family=Bebas+Neue&family=Oswald:wght@500;700&family=DM+Serif+Display:ital@0;1&family=Inter:wght@500;600;700;800;900&family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,600&display=swap';document.head.appendChild(f)}

/* a page shown at any size */
function mini(page,doc,w,opt){style();const k=w/W;return `<div class="mg-mini" style="width:${w}px;height:${Math.round(H*k)}px;overflow:hidden;position:relative"><div style="transform:scale(${k});transform-origin:0 0;width:${W}px;height:${H}px">${render(page,doc,opt)}</div></div>`}

/* ---------- flip-book ---------- */
function book(root,doc,opt){style();opt=opt||{};const pages=doc.pages||[];let mode,k,pw,ph,at=0,busy=0;
 root.innerHTML=`<div class="mgb"><div class="mgb-stage"></div><div class="mgb-ui"><button class="pv" aria-label="Previous page">‹ PREV</button><span class="ct"></span><button class="nx" aria-label="Next page">NEXT ›</button>${opt.full!==false?'<button class="fs" aria-label="Full screen">⛶</button>':''}</div></div>`;
 const st=root.querySelector('.mgb-stage'),ui=root.querySelector('.mgb-ui');
 const pgHTML=i=>i<0||i>=pages.length?'':render(pages[i],doc);
 const slot=(i,cls,left)=>`<div class="mgb-pg ${cls}" style="left:${left}px;width:${pw}px;height:${ph}px">${i>=0&&i<pages.length?`<div class="mg-wrap" style="transform:scale(${k});transform-origin:0 0;width:${W}px;height:${H}px">${pgHTML(i)}</div>`:''}</div>`;
 const size=()=>{const avW=Math.min(root.clientWidth||window.innerWidth,1500),avH=Math.max(320,(opt.maxH||window.innerHeight-170));mode=avW>=820&&pages.length>1?'spread':'single';
  const cols=mode==='spread'?2:1;k=Math.min(avW/cols/W,avH/H);pw=Math.round(W*k);ph=Math.round(H*k);st.style.width=pw*cols+'px';st.style.height=ph+'px'};
 /* spread view: s=0 shows the cover alone on the right; s=n shows pages 2n-1 and 2n */
 const L=s=>s===0?-1:2*s-1,R=s=>s===0?0:2*s,maxS=()=>Math.ceil((pages.length-1)/2);
 const draw=()=>{if(mode==='spread'){const s=at;st.innerHTML=(L(s)>=0?slot(L(s),'l',0):'')+(R(s)<pages.length?slot(R(s),'r',pw):'');ui.querySelector('.ct').textContent=s===0?'COVER':`${L(s)+1}${R(s)<pages.length?'–'+(R(s)+1):''} / ${pages.length}`}
  else{st.innerHTML=slot(at,'',0);ui.querySelector('.ct').textContent=at===0?'COVER':`${at+1} / ${pages.length}`}
  ui.querySelector('.pv').disabled=at===0;ui.querySelector('.nx').disabled=mode==='spread'?at>=maxS():at>=pages.length-1;
  [1,2,3].forEach(n=>{const i=mode==='spread'?R(at)+n:at+n;if(pages[i])(pages[i].v&&Object.values(pages[i].v)||[]).forEach(o=>{if(o&&o.u){const im=new Image();im.src=abs(o.u)}})})};
 const leaf=(front,back,left,origin,from,to,done)=>{const el=document.createElement('div');el.className='mgb-leaf';el.style.cssText=`left:${left}px;width:${pw}px;height:${ph}px;transform-origin:${origin};transform:rotateY(${from}deg);transition:transform .75s cubic-bezier(.3,.1,.25,1)`;
  el.innerHTML=`<div class="fr">${front}</div><div class="bk">${back}</div>`;st.appendChild(el);requestAnimationFrame(()=>requestAnimationFrame(()=>{el.style.transform=`rotateY(${to}deg)`}));setTimeout(()=>{done();busy=0},780)};
 const inner=i=>i>=0&&i<pages.length?`<div style="transform:scale(${k});transform-origin:0 0;width:${W}px;height:${H}px">${pgHTML(i)}</div>`:'';
 const go=dir=>{if(busy)return;if(mode==='spread'){const n=at+dir;if(n<0||n>maxS())return;busy=1;
   if(dir>0){st.innerHTML=(L(at)>=0?slot(L(at),'l',0):'')+(R(n)<pages.length?slot(R(n),'r',pw):'');leaf(inner(R(at)),inner(L(n)),pw,'0 50%',0,-180,()=>{at=n;draw()})}
   else{st.innerHTML=(L(n)>=0?slot(L(n),'l',0):'')+(R(at)<pages.length?slot(R(at),'r',pw):'');leaf(inner(L(at)),inner(R(n)),0,'100% 50%',0,180,()=>{at=n;draw()})}}
  else{const n=at+dir;if(n<0||n>=pages.length)return;busy=1;
   if(dir>0){st.innerHTML=slot(n,'',0);leaf(inner(at),'',0,'0 50%',0,-100,()=>{at=n;draw()})}
   else{st.innerHTML=slot(at,'',0);leaf(inner(n),'',0,'0 50%',-100,0,()=>{at=n;draw()})}}
  if(opt.onPage)opt.onPage(mode==='spread'?R(at+dir):at+dir)};
 ui.querySelector('.pv').onclick=()=>go(-1);ui.querySelector('.nx').onclick=()=>go(1);
 const fs=ui.querySelector('.fs');if(fs)fs.onclick=()=>{const b=root.querySelector('.mgb');if(document.fullscreenElement)document.exitFullscreen();else if(b.requestFullscreen)b.requestFullscreen().catch(()=>{})};
 st.onclick=e=>{if(e.target.closest('a'))return;const r=st.getBoundingClientRect();go(e.clientX-r.left>r.width/2?1:-1)};
 let sx=null;st.addEventListener('touchstart',e=>{sx=e.touches[0].clientX},{passive:true});st.addEventListener('touchend',e=>{if(sx==null)return;const dx=e.changedTouches[0].clientX-sx;sx=null;if(Math.abs(dx)>40){go(dx<0?1:-1)}},{passive:true});
 const kd=e=>{if(!document.body.contains(root))return document.removeEventListener('keydown',kd);if(e.target.closest&&e.target.closest('input,textarea,select'))return;if(e.key==='ArrowRight')go(1);if(e.key==='ArrowLeft')go(-1)};document.addEventListener('keydown',kd);
 const rs=()=>{if(!document.body.contains(root))return window.removeEventListener('resize',rs);const pageNow=mode==='spread'?R(at):at;size();at=mode==='spread'?Math.ceil(pageNow/2):pageNow;draw()};window.addEventListener('resize',rs);
 document.addEventListener('fullscreenchange',()=>setTimeout(rs,80));
 size();draw();return{go,goto:i=>{at=mode==='spread'?Math.ceil(i/2):i;draw()}}}

window.MAG={W,H,THEMES,TPL:ALL,BY,FAMS,SAMPLE,render,mini,book,style,abs,esc,count:()=>({covers:C.length*Object.keys(THEMES).length,pages:P.length*Object.keys(THEMES).length})};
})();
