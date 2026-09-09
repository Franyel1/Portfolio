import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
const require = createRequire(import.meta.url);
const { createCanvas, loadImage } = require('C:/Users/elfra/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas');
const image = await loadImage('public/projects/drawing/HTMLCanvas/media/aNightOut2.JPEG');
const all = [];
for (const name of ['signal','television','pair','particles','channels','screen','background']) {
  const { default: factory } = await import(`../lib/canvas-studies/${name}.js`);
  const make = () => { const c=createCanvas(600,400); c.style={}; return c; };
  const canvases = Array.from({length:name==='pair'?2:1},make), queue=new Set(), events=[];
  const video = {play:()=>Promise.resolve(),readyState:0};
  const select = s => s==='img'?image:s==='video'?video:s==='.screen'?{clientWidth:600,clientHeight:400}:s==='c2'?canvases[1]:s.startsWith('#')&&s!=='#backgroundStatic'?{addEventListener(){}}:canvases[0];
  const raf=callback=>{queue.add(callback);return 0;};
  factory({window:{innerWidth:600,innerHeight:400,devicePixelRatio:1,requestAnimationFrame:raf,addEventListener:(type,fn)=>{if(type==='load')events.push(fn);}},document:{querySelector:select,getElementById:select,createElement:make,addEventListener(){}},requestAnimationFrame:raf});
  events.forEach(fn=>fn());
  for(let n=0;n<12;n++){const callbacks=[...queue];queue.clear();callbacks.forEach(fn=>fn(performance.now()+n*33));}
  for(const c of canvases){ const data=c.getContext('2d').getImageData(0,0,c.width,c.height).data; if(!data.some(v=>v>0))throw Error(`${name} produced an empty canvas`);all.push(c); }
  console.log(`${name}: rendered ${canvases.length} canvas surface(s)`);
}
const out=createCanvas(1200,1600),ctx=out.getContext('2d');
all.forEach((c,i)=>ctx.drawImage(c,(i%2)*600,Math.floor(i/2)*400,600,400));
writeFileSync('work/canvas-contact-sheet.png',out.toBuffer('image/png'));
console.log('All 8 supplied canvas surfaces rendered without runtime errors.');
const thumbnail=createCanvas(1200,720),tc=thumbnail.getContext('2d');
tc.fillStyle='#11204a';tc.fillRect(0,0,1200,720);
[[0,-30,-30,650,-.08],[1,650,-20,620,.06],[2,280,150,660,-.035],[5,760,365,450,.08],[6,-30,440,600,.045]].forEach(([i,x,y,w,a])=>{tc.save();tc.translate(x+w/2,y+w/3);tc.rotate(a);tc.shadowColor='#0009';tc.shadowBlur=24;tc.drawImage(all[i],-w/2,-w/3,w,w*2/3);tc.restore();});
writeFileSync('public/images/projects/canvas-collage.png',thumbnail.toBuffer('image/png'));
