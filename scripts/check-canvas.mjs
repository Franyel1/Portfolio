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
