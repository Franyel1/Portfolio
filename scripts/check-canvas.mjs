import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
import {
  artworkAssets,
  createArtwork,
  paintCollage,
  collageRatio,
  collageLayout,
  artworkNames,
} from '../lib/curated-collage.js';
import assert from 'node:assert/strict';
import { createCollageScheduler } from '../lib/collage-scheduler.js';
import { pickBeachPalette, beachPalettes } from '../lib/beach-palettes.js';
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
const scheduler = createCollageScheduler();
const artwork = createArtwork(
  (w, h) => {
    const c = createCanvas(w, h);
    c.style = {};
    return c;
  },
  images,
  scheduler.request,
);
for (let i = 0; i < 90; i++) scheduler.step();
assert.equal(scheduler.size, 8, 'one animation callback per artwork');
assert.equal(
  new Set(
    beachPalettes.map((_, i) =>
      pickBeachPalette(() => i / beachPalettes.length).join('|'),
    ),
  ).size,
  4,
  'four different complete palettes',
);
// A hidden study must stop receiving updates; its clock resumes without jumping.
const timing = createCollageScheduler(0),
  clockValues = [],
  token = {};
const callback = (now) => {
  clockValues.push(now);
  timing.request(callback, token);
};
timing.request(callback, token);
timing.step();
for (let i = 0; i < 100; i++) timing.step(() => false);
timing.step();
assert.equal(clockValues.length, 2);
assert.ok(Math.abs(clockValues[1] - clockValues[0] - 1000 / 30) < 0.01);
timing.clear();
assert.equal(timing.size, 0);
artwork.surfaces.forEach((c, i) => {
  if (
    !c
      .getContext('2d')
      .getImageData(0, 0, c.width, c.height)
      .data.some((v) => v)
  )
    throw Error(`Empty artwork ${artworkNames[i]}`);
  writeFileSync(`work/study-${i}.png`, c.toBuffer('image/png'));
});
for (const [name, width, height, narrow] of [
  ['desktop', 1200, 1200 * collageRatio(false), false],
  ['mobile', 400, 400 * collageRatio(true), true],
]) {
  collageLayout(narrow).forEach(([x, y, w, angle], i) => {
    const dw = width * w,
      dh = (dw * artwork.surfaces[i].height) / artwork.surfaces[i].width;
    const cx = width * x + dw / 2,
      cy = height * y + dh / 2;
    for (const [px, py] of [
      [-dw / 2, -dh / 2],
      [dw / 2, -dh / 2],
      [dw / 2, dh / 2],
      [-dw / 2, dh / 2],
    ]) {
      const ax = cx + px * Math.cos(angle) - py * Math.sin(angle),
        ay = cy + px * Math.sin(angle) + py * Math.cos(angle);
      assert.ok(
        ax >= 0 && ax <= width && ay >= 0 && ay <= height,
        `${name}: ${artworkNames[i]} clipped`,
      );
    }
  });
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
  'Eight artworks rendered at desktop/mobile without clipping; four palettes; hidden/paused clocks and cleanup verified. Fish uses the actual video poster in this native render; video playback is not browser-tested.',
);
