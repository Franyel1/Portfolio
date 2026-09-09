import { createRequire } from 'node:module';
import { readdirSync, writeFileSync } from 'node:fs';
const require = createRequire(import.meta.url);
const {
  createCanvas,
  loadImage,
} = require('C:/Users/elfra/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas');
const files = ['ice', 'minecraft'].flatMap((dir) =>
  readdirSync(`public/projects/drawing-selected/${dir}`)
    .filter((f) => /\.(png|svg)$/.test(f))
    .map((f) => `${dir}/${f}`),
);
const canvas = createCanvas(1000, Math.ceil(files.length / 4) * 240),
  ctx = canvas.getContext('2d');
ctx.fillStyle = '#8a8d96';
ctx.fillRect(0, 0, canvas.width, canvas.height);
for (const [i, f] of files.entries()) {
  const image = await loadImage(`public/projects/drawing-selected/${f}`),
    scale = Math.min(230 / image.width, 195 / image.height),
    x = (i % 4) * 250,
    y = Math.floor(i / 4) * 240;
  ctx.drawImage(image, x, y, image.width * scale, image.height * scale);
  ctx.fillStyle = 'white';
  ctx.font = '14px sans-serif';
  ctx.fillText(f, x + 5, y + 220);
  console.log(f, image.width, image.height);
}
writeFileSync('work/scene-assets.png', canvas.toBuffer('image/png'));
