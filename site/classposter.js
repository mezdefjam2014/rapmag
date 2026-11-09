/* NEXT UP class poster: one designed picture for the whole monthly class (1080 x 1350).
   classPoster({month:'2026-11', style:'lineup'|'yearbook'|'cover', picks:[{artist,title,cover,photo,heat}]}) -> Promise<canvas>
   Used on the public Next Up page, for the download, and for the preview in the back office. */
(function(){
const W=1080,H=1350,RED='#e11d2a',MONTHS=['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];
const src=u=>!u?'':/^https?:|^data:|^blob:/.test(u)?u:(window.RM_API||'')+u;
const pic=u=>new Promise(r=>{if(!u)return r(null);const i=new Image();i.crossOrigin='anonymous';i.onload=()=>r(i);i.onerror=()=>r(null);i.src=u});
const sp=(x,v)=>{try{x.letterSpacing=v+'px'}catch(e){}};
/* text that shrinks until it fits the width */
function fit(x,t,font,size,max,min){let z=size;do{x.font=font.replace('%',z);z-=2}while(x.measureText(t).width>max&&z>(min||18));return z+2}
/* photo into a box like object-fit:cover, keeping the top (faces) in view */
function cover(x,im,dx,dy,dw,dh,fy){if(!im)return;const k=Math.max(dw/im.width,dh/im.height),w=im.width*k,h=im.height*k;x.save();x.beginPath();x.rect(dx,dy,dw,dh);x.clip();x.drawImage(im,dx+(dw-w)/2,dy+(dh-h)*(fy==null?.25:fy),w,h);x.restore()}
function logoAt(x,logo,cx,y,w){if(!logo)return 0;const h=w*logo.height/logo.width;x.drawImage(logo,cx-w/2,y,w,h);return h}
const monthTxt=m=>{const [y,mm]=String(m).split('-');return MONTHS[+mm-1]+' '+y};

/* ---------- 1. LINEUP: tall portraits side by side, giant outlined NEXT UP behind ---------- */
function lineup(x,c,P,logo){const n=P.length;x.fillStyle='#070707';x.fillRect(0,0,W,H);
 let g=x.createRadialGradient(W/2,640,80,W/2,640,900);g.addColorStop(0,'rgba(225,29,42,.5)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,W,H);
 /* diagonal texture */
 x.save();x.globalAlpha=.05;x.strokeStyle='#fff';x.lineWidth=2;for(let i=-H;i<W;i+=26){x.beginPath();x.moveTo(i,0);x.lineTo(i+H,H);x.stroke()}x.restore();
 logoAt(x,logo,W/2,44,300);
 x.textAlign='center';x.font='400 372px Anton,sans-serif';x.lineWidth=3;x.strokeStyle='rgba(255,255,255,.1)';x.strokeText('NEXT UP',W/2,1180);
 x.font='400 168px Anton,sans-serif';{const a=x.measureText('NEXT ').width,b=x.measureText('UP').width,l=(W-a-b)/2;x.textAlign='left';x.fillStyle='#fff';x.fillText('NEXT',l,424);x.fillStyle=RED;x.fillText('UP',l+a,424);x.textAlign='center'}
 const lab='CLASS OF '+monthTxt(c.month);x.font='800 30px Inter,sans-serif';sp(x,8);const lw=x.measureText(lab).width+64;x.fillStyle=RED;x.fillRect((W-lw)/2,196,lw,60);x.fillStyle='#fff';x.fillText(lab,W/2+4,237);sp(x,0);
 const gap=n>4?12:18,M=44,tw=Math.min(400,(W-M*2-gap*(n-1))/n),tot=tw*n+gap*(n-1),x0=(W-tot)/2,th=n<=2?660:n===3?650:630;
 P.forEach((p,i)=>{const tx=x0+i*(tw+gap),ty=466+(i%2?40:0);
  x.fillStyle='#1b1b1b';x.fillRect(tx,ty,tw,th);x.save();x.filter='grayscale(1) contrast(1.15)';cover(x,p.im,tx,ty,tw,th);x.restore();
  const s=x.createLinearGradient(0,ty+th*.45,0,ty+th);s.addColorStop(0,'rgba(0,0,0,0)');s.addColorStop(.75,'rgba(0,0,0,.92)');s.addColorStop(1,'#000');x.fillStyle=s;x.fillRect(tx,ty+th*.45,tw,th*.55+1);
  x.fillStyle=RED;x.fillRect(tx,ty,tw,8);
  x.textAlign='left';x.font='400 '+(n>4?54:66)+'px Anton,sans-serif';x.fillStyle=RED;x.fillText(String(i+1).padStart(2,'0'),tx+14,ty+(n>4?68:82));
  /* the name runs up the tile when the tiles are narrow, across when they are wide */
  const nm=p.artist.toUpperCase();
  if(n>=4){x.save();x.translate(tx+tw-18,ty+th-22);x.rotate(-Math.PI/2);x.textAlign='left';const z=fit(x,nm,'400 %px Anton,sans-serif',Math.min(96,tw*.58),th*.62,34);x.fillStyle='#fff';x.fillText(nm,0,0);x.restore();
   x.textAlign='left';x.font='800 15px Inter,sans-serif';sp(x,2);x.fillStyle='#ddd';let t=(p.title||'').toUpperCase();while(t.length>3&&x.measureText(t).width>tw-70)t=t.slice(0,-2);if(t!==(p.title||'').toUpperCase())t+='…';x.save();x.translate(tx+22,ty+th-22);x.rotate(-Math.PI/2);x.fillText(t,0,0);x.restore();sp(x,0)}
  else{x.textAlign='center';fit(x,nm,'400 %px Anton,sans-serif',86,tw-28,30);x.fillStyle='#fff';x.fillText(nm,tx+tw/2,ty+th-58);
   x.font='800 18px Inter,sans-serif';sp(x,3);x.fillStyle=RED;let t=(p.title||'').toUpperCase();while(t.length>3&&x.measureText(t).width>tw-30)t=t.slice(0,-2);x.fillText(t,tx+tw/2+1,ty+th-24);sp(x,0)}});
 x.textAlign='center';x.fillStyle='#fff';x.font='800 22px Inter,sans-serif';sp(x,6);x.fillText('THE ARTISTS RUNNING HOTTEST ON THE INDIE CHARTS',W/2+3,1238);
 x.fillStyle=RED;x.fillRect(W/2-60,1260,120,5);x.fillStyle='#bbb';x.font='800 24px Inter,sans-serif';x.fillText('RAPAECHELON.COM',W/2+3,1308);sp(x,0)}

/* ---------- 2. YEARBOOK: paper page, tilted photos, a superlative for each artist ---------- */
const SUPER=['MOST LIKELY TO GO PLATINUM','BEST PEN IN THE CLASS','HARDEST WORKER','CROWD FAVORITE','ONE TO WATCH','BEST ON STAGE','MOST LIKELY TO GO VIRAL','SMOOTHEST FLOW','CLASS LEGEND','NEVER MISSES'];
function yearbook(x,c,P,logo){const n=P.length;x.fillStyle='#efe8d8';x.fillRect(0,0,W,H);
 /* paper grain */
 x.save();x.globalAlpha=.05;for(let i=0;i<2600;i++){x.fillStyle=i%2?'#000':'#fff';x.fillRect((i*7919)%W,(i*104729)%H,2,2)}x.restore();
 x.fillStyle='#0a0a0a';x.fillRect(0,0,W,190);logoAt(x,logo,W/2,30,290);
 x.textAlign='left';x.fillStyle='#0a0a0a';x.font='400 190px Anton,sans-serif';x.fillText('NEXT UP',52,378);
 x.fillStyle=RED;x.fillRect(56,398,700,10);
 x.font='800 26px Inter,sans-serif';sp(x,7);x.fillStyle='#0a0a0a';x.fillText('CLASS OF',760,270);sp(x,0);
 const mt=monthTxt(c.month).split(' ');x.fillStyle=RED;fit(x,mt[0],'400 %px Anton,sans-serif',84,270,40);x.fillText(mt[0],756,346);x.fillStyle='#0a0a0a';x.font='400 54px Anton,sans-serif';x.fillText(mt[1],758,400);
 /* rows: 1-3 in one row, 4 = 2+2, 5 = 3+2, 6 = 3+3 ... */
 const rows=n<=3?[n]:n===4?[2,2]:[Math.ceil(n/2),Math.floor(n/2)],top=440,area=H-top-96,rh=area/rows.length;let k=0;
 rows.forEach((cnt,ri)=>{const cellW=(W-80)/Math.max(cnt,rows.length>1?3:cnt),S=Math.min(cellW-34,rh-150,n===1?520:n===2?400:330),tot=cnt*cellW,sx=(W-tot)/2;
  for(let j=0;j<cnt;j++,k++){const p=P[k],cx=sx+j*cellW+cellW/2,cy=top+ri*rh+Math.max(18,(rh-S-140)/2)+S/2,rot=((k%2?1:-1)*(1.6+(k%3)*.5))*Math.PI/180;
   x.save();x.translate(cx,cy);x.rotate(rot);x.shadowColor='rgba(0,0,0,.35)';x.shadowBlur=18;x.shadowOffsetY=8;x.fillStyle='#fff';x.fillRect(-S/2-12,-S/2-12,S+24,S+24);x.shadowColor='transparent';
   x.fillStyle='#222';x.fillRect(-S/2,-S/2,S,S);x.filter='grayscale(1) contrast(1.1)';cover(x,p.im,-S/2,-S/2,S,S);x.filter='none';
   /* tape */
   x.fillStyle='rgba(225,29,42,.85)';x.save();x.translate(0,-S/2-12);x.rotate(-.06);x.fillRect(-58,-14,116,28);x.restore();x.restore();
   x.textAlign='center';x.fillStyle='#0a0a0a';fit(x,p.artist.toUpperCase(),'400 %px Anton,sans-serif',n<=2?64:48,cellW-24,24);x.fillText(p.artist.toUpperCase(),cx,cy+S/2+66);
   x.font='800 '+(n<=2?19:15)+'px Inter,sans-serif';sp(x,2);x.fillStyle=RED;let s=SUPER[k%SUPER.length];while(x.measureText(s).width>cellW-16&&s.length>4)s=s.slice(0,-2);x.fillText(s,cx+1,cy+S/2+96);sp(x,0);
   x.font='italic 600 '+(n<=2?20:16)+'px Georgia,serif';x.fillStyle='#444';let t='"'+(p.title||'')+'"';while(x.measureText(t).width>cellW-16&&t.length>5)t=t.slice(0,-3)+'…"';x.fillText(t,cx,cy+S/2+122)}});
 x.fillStyle='#0a0a0a';x.fillRect(0,H-70,W,70);x.textAlign='center';x.fillStyle='#fff';x.font='800 22px Inter,sans-serif';sp(x,6);x.fillText('RAPAECHELON.COM  ·  THE INDIE CHARTS',W/2+3,H-27);sp(x,0)}

/* ---------- 3. COVER: magazine cover, #1 pick full bleed, the rest of the class along the bottom ---------- */
function coverStyle(x,c,P,logo){const n=P.length,a=P[0];x.fillStyle='#0a0a0a';x.fillRect(0,0,W,H);cover(x,a.im,0,0,W,H,.2);
 let g=x.createLinearGradient(0,0,0,360);g.addColorStop(0,'rgba(0,0,0,.92)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,W,360);
 g=x.createLinearGradient(0,560,0,H);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(.5,'rgba(0,0,0,.86)');g.addColorStop(1,'#000');x.fillStyle=g;x.fillRect(0,560,W,H-560);
 logoAt(x,logo,W/2,34,520);
 const base=n>1?880:1010;
 x.textAlign='left';x.font='800 28px Inter,sans-serif';sp(x,8);const lab='CLASS OF '+monthTxt(c.month),lw=x.measureText(lab).width+44;x.fillStyle=RED;x.fillRect(56,base-246,lw,54);x.fillStyle='#fff';x.fillText(lab,78,base-209);sp(x,0);
 x.font='400 196px Anton,sans-serif';x.fillStyle='#fff';x.fillText('NEXT',52,base-22);const nw=x.measureText('NEXT ').width;x.fillStyle=RED;x.fillText('UP',52+nw,base-22);
 x.fillStyle='#fff';fit(x,a.artist.toUpperCase(),'400 %px Anton,sans-serif',92,W-112,36);x.fillText(a.artist.toUpperCase(),56,base+74);
 x.font='800 22px Inter,sans-serif';sp(x,4);x.fillStyle='#ddd';x.fillText(('LEADS THE CLASS'+(a.title?'  ·  '+a.title:'')).toUpperCase().slice(0,60),58,base+112);sp(x,0);
 if(n>1){const R=P.slice(1),m=R.length,cw=(W-112)/m,D=Math.min(170,cw-26),cy=base+238;
  R.forEach((p,i)=>{const cx=56+cw*i+cw/2;x.save();x.beginPath();x.arc(cx,cy,D/2,0,7);x.clip();x.fillStyle='#222';x.fillRect(cx-D/2,cy-D/2,D,D);cover(x,p.im,cx-D/2,cy-D/2,D,D);x.restore();
   x.beginPath();x.arc(cx,cy,D/2+4,0,7);x.lineWidth=5;x.strokeStyle=RED;x.stroke();
   x.textAlign='center';x.fillStyle='#fff';fit(x,p.artist.toUpperCase(),'400 %px Anton,sans-serif',40,cw-14,18);x.fillText(p.artist.toUpperCase(),cx,cy+D/2+50)})}
 x.textAlign='center';x.fillStyle='#bbb';x.font='800 20px Inter,sans-serif';sp(x,6);x.fillText('RAPAECHELON.COM',W/2+3,H-28);sp(x,0)}

const STYLES={lineup,yearbook,cover:coverStyle};
window.CLASS_STYLES=[['lineup','LINEUP','Tall portraits side by side'],['yearbook','YEARBOOK','Paper page, tilted photos, superlatives'],['cover','MAG COVER','Top pick full page, class along the bottom']];
window.classPoster=async c=>{const cv=document.createElement('canvas');cv.width=W;cv.height=H;const x=cv.getContext('2d');
 await Promise.all([document.fonts.load('400 90px Anton'),document.fonts.load('800 30px Inter')]).catch(()=>{});
 const logo=await pic('logo.webp'),P=await Promise.all((c.picks||[]).slice(0,10).map(async p=>({...p,artist:p.artist||'',im:await pic(src(p.photo||p.cover))||await pic('gold-record.webp')})));
 if(!P.length)return cv;(STYLES[c.style]||lineup)(x,c,P,logo);return cv};
window.classPosterFile=async c=>{const cv=await classPoster(c);return new Promise(r=>cv.toBlob(b=>r(new File([b],'rapaechelon-next-up-'+c.month+'.jpg',{type:'image/jpeg'})),'image/jpeg',.93))};
})();
