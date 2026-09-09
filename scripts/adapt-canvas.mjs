import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
// Preserve the supplied drawing algorithms, isolating their globals and audio.
const sources = {
  signal: ['HTMLCanvas/canvas.js', []],
  television: ['HTMLCanvasObjects/canvas.js', []],
  pair: ['CanvasPair/pairJS.js', []],
  particles: ['FinalProject/static/static.js', ['playTone']],
  channels: ['FinalProject/whatToWatch/script.js', ['audio', 'tone', 'hat', 'woo']],
  screen: ['FinalProject/watchingTV/tv.js', []],
  background: ['FinalProject/watchingTV/background.js', []],
};
mkdirSync('lib/canvas-studies', { recursive: true });
for (const [name, [path, muted]] of Object.entries(sources)) {
  let code = readFileSync(`public/projects/drawing/${path}`, 'utf8');
  code = code.replace('let delta_time = 0;', 'let deltaTime = 0;');
  code = code.replace(/function draw\(currentTime\)/g, 'function draw(currentTime = performance.now())');
  if (name === 'background') code = code.slice(0, code.indexOf('const music ='));
  for (const fn of muted) {
    const start = code.indexOf(`function ${fn}(`);
    const brace = code.indexOf('{', start);
    let depth = 1, end = brace + 1;
    while (depth && end < code.length) { if (code[end] === '{') depth++; if (code[end] === '}') depth--; end++; }
    code = code.slice(0, brace + 1) + '\n// Sound intentionally disabled in the collage.\n}' + code.slice(end);
  }
  if (name === 'pair') code = code.replace('video.play();', 'video.play().catch(() => {});');
  if (name === 'pair') code = 'let opacities = [];\n' + code;
  if (name === 'pair') code = code.replace('hidContext.drawImage(video, 0, 0, hidden.width, hidden.height);', 'if (video.readyState >= 2) hidContext.drawImage(video, 0, 0, hidden.width, hidden.height);');
  if (name === 'channels') code += '\nobjects.push(new Circle(), new Line(), new Triangle());\n';
  writeFileSync(`lib/canvas-studies/${name}.js`, `// Adapted from supplied coursework: ${path}\nexport default function createStudy({ window, document, requestAnimationFrame }) {\n${code}\n}\n`);
}
