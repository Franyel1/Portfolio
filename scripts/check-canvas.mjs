import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
import {
  artworkAssets,
  createArtwork,
  paintCollage,
} from '../lib/curated-collage.js';
const require = createRequire(import.meta.url);
const {
  createCanvas,
  loadImage,
  Path2D,
} = require('C:/Users/elfra/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas');
globalThis.Path2D = Path2D;
let seed = 27;
Math.random = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;
const images = await Promise.all(
  artworkAssets.map((src) => loadImage(`public${src}`)),
);
const queue = new Set();
const artwork = createArtwork(
  (w, h) => {
    const c = createCanvas(w, h);
    c.style = {};
    return c;
  },
  images,
  (callback) => queue.add(callback),
);
const start = performance.now();
for (let i = 0; i < 90; i++) {
  const callbacks = [...queue];
  queue.clear();
  callbacks.forEach((fn) => fn(start + i * 33));
}
if (queue.size !== 5)
  throw Error(`Expected five animated studies, found ${queue.size}`);
artwork.surfaces.forEach((c, i) => {
  if (
    !c
      .getContext('2d')
      .getImageData(0, 0, c.width, c.height)
      .data.some((v) => v)
  )
    throw Error(`Empty artwork ${i}`);
});
for (const [name, width, height, narrow] of [
  ['desktop', 1200, 1560, false],
  ['mobile', 400, 1480, true],
]) {
  const c = createCanvas(width, height),
    ctx = c.getContext('2d');
  ctx.fillStyle = '#18191c';
  ctx.fillRect(0, 0, width, height);
  paintCollage(ctx, artwork, width, height, narrow);
  writeFileSync(`work/curated-${name}.png`, c.toBuffer('image/png'));
  if (!narrow)
    writeFileSync(
      'public/images/projects/canvas-collage.png',
      c.toBuffer('image/png'),
    );
}
console.log(
  'Five selected canvas artworks and five gradient SVG decorations rendered at desktop and mobile; five isolated animation loops; no video or audio.',
);
