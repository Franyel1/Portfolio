import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
// Preserve the supplied drawing algorithms, isolating their globals and audio.
const sources = {
  signal: ['HTMLCanvas/canvas.js', []],
  television: ['HTMLCanvasObjects/canvas.js', []],
  pair: ['CanvasPair/pairJS.js', []],
  particles: ['FinalProject/static/static.js', ['playTone']],
  channels: [
    'FinalProject/whatToWatch/script.js',
    ['audio', 'tone', 'hat', 'woo'],
  ],
  screen: ['FinalProject/watchingTV/tv.js', []],
  background: ['FinalProject/watchingTV/background.js', []],
};
mkdirSync('lib/canvas-studies', { recursive: true });
let beach = readFileSync(
  'public/projects/drawing-selected/beach-original.js',
  'utf8',
)
  .replace('let delta_time = 0;', 'let deltaTime = 0;')
  .replace(/for \(i=0/g, 'for (let i=0')
  .replace('    window.requestAnimationFrame(draw);', '');
const beachPaletteStart = beach.indexOf('function sampleColors() {');
const beachPaletteClose = /\r?\n}\r?\n/.exec(beach.slice(beachPaletteStart));
const beachPaletteEnd =
  beachPaletteStart + beachPaletteClose.index + beachPaletteClose[0].length;
beach =
  beach.slice(0, beachPaletteStart) +
  `function sampleColors() {
    // Keep the supplied beach study's motion while using a fixed, calm palette.
    colors.push(
        'rgba(58, 102, 118, 1)',
        'rgba(225, 187, 157, 1)',
        'rgba(229, 103, 74, 1)',
        'rgba(150, 192, 207, 1)',
        'rgba(54, 123, 76, 1)'
    );
    waterColor = colors[0];
    sandColor = colors[1];
    sunColor = colors[2];
    skyColor = colors[3];
}
` +
  beach.slice(beachPaletteEnd);
writeFileSync(
  'lib/canvas-studies/beach.js',
  `// Supplied assignments/HTMLCanvasObjects/canvas.js; isolated globals and a single animation loop.\nexport default function createStudy({window, document, requestAnimationFrame}) {\n${beach}\n}\n`,
);
let blossom = readFileSync(
  'public/projects/drawing/CanvasPair/pairJS.js',
  'utf8',
);
blossom =
  blossom
    .slice(0, blossom.indexOf('let once2 = false;'))
    .replace('video.play();', '') +
  "\nwindow.addEventListener('load', () => { setup(); requestAnimationFrame(draw1); });\n";
writeFileSync(
  'lib/canvas-studies/blossom.js',
  `// Supplied CanvasPair landscape only; companion video study omitted from the selection.\nexport default function createStudy({window, document, requestAnimationFrame}) {\n${blossom}\n}\n`,
);
const waves = `// Adapted from supplied assignments/FinalProject/crowdNoise/controls.js; sound removed.
export default function createStudy({ window, document, requestAnimationFrame }) {
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const width = 700, height = 450;
canvas.width = width; canvas.height = height;
const waves = Array.from({length: 5}, (_, index) => ({
  phase: index * 0.9, speed: 0.018 + index * 0.004,
  amplitude: 45 + index * 10, y: 70 + index * 78,
  color: ['#e66a5d', '#f0b45e', '#4ca9b8', '#d886c6', '#7ca7e8'][index],
}));
function draw(now = performance.now()) {
  context.fillStyle = '#101a2d'; context.fillRect(0, 0, width, height);
  waves.forEach((wave, index) => {
    wave.phase += wave.speed;
    context.beginPath();
    for (let point = 0; point < 36; point++) {
      const x = point * width / 35;
      const y = wave.y + Math.sin(point * 0.52 + wave.phase) * wave.amplitude;
      if (point === 0) context.moveTo(x, y); else context.lineTo(x, y);
    }
    context.strokeStyle = wave.color; context.lineWidth = 4 - index * 0.35;
    context.globalAlpha = 0.9 - index * 0.08; context.shadowColor = wave.color; context.shadowBlur = 14;
    context.stroke(); context.globalAlpha = 1; context.shadowBlur = 0;
  });
  requestAnimationFrame(draw);
}
window.addEventListener('load', () => draw());
}
`;
writeFileSync('lib/canvas-studies/waves.js', waves);
for (const [name, [path, muted]] of Object.entries(sources)) {
  let code = readFileSync(`public/projects/drawing/${path}`, 'utf8');
  code = code.replace('let delta_time = 0;', 'let deltaTime = 0;');
  code = code.replace(
    /function draw\(currentTime\)/g,
    'function draw(currentTime = performance.now())',
  );
  if (name === 'background')
    code = code.slice(0, code.indexOf('const music ='));
  for (const fn of muted) {
    const start = code.indexOf(`function ${fn}(`);
    const brace = code.indexOf('{', start);
    let depth = 1,
      end = brace + 1;
    while (depth && end < code.length) {
      if (code[end] === '{') depth++;
      if (code[end] === '}') depth--;
      end++;
    }
    code =
      code.slice(0, brace + 1) +
      '\n// Sound intentionally disabled in the collage.\n}' +
      code.slice(end);
  }
  if (name === 'pair')
    code = code.replace('video.play();', 'video.play().catch(() => {});');
  if (name === 'pair') code = 'let opacities = [];\n' + code;
  if (name === 'pair')
    code = code.replace(
      'hidContext.drawImage(video, 0, 0, hidden.width, hidden.height);',
      'if (video.readyState >= 2) hidContext.drawImage(video, 0, 0, hidden.width, hidden.height);',
    );
  if (name === 'channels')
    code += '\nobjects.push(new Circle(), new Line(), new Triangle());\n';
  writeFileSync(
    `lib/canvas-studies/${name}.js`,
    `// Adapted from supplied coursework: ${path}\nexport default function createStudy({ window, document, requestAnimationFrame }) {\n${code}\n}\n`,
  );
}
