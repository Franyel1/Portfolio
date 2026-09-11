// Adapted from supplied assignments/FinalProject/crowdNoise/controls.js; sound removed.
export default function createStudy({
  window,
  document,
  requestAnimationFrame,
}) {
  const canvas = document.querySelector('canvas');
  const context = canvas.getContext('2d');
  const width = 700,
    height = 450;
  canvas.width = width;
  canvas.height = height;
  const waves = Array.from({ length: 5 }, (_, index) => ({
    phase: index * 0.9,
    speed: 0.018 + index * 0.004,
    amplitude: 45 + index * 10,
    y: 70 + index * 78,
    color: ['#e66a5d', '#f0b45e', '#4ca9b8', '#d886c6', '#7ca7e8'][index],
  }));
  function draw(now = performance.now()) {
    context.fillStyle = '#101a2d';
    context.fillRect(0, 0, width, height);
    waves.forEach((wave, index) => {
      wave.phase += wave.speed;
      context.beginPath();
      for (let point = 0; point < 36; point++) {
        const x = (point * width) / 35;
        const y = wave.y + Math.sin(point * 0.52 + wave.phase) * wave.amplitude;
        if (point === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.strokeStyle = wave.color;
      context.lineWidth = 4 - index * 0.35;
      context.globalAlpha = 0.9 - index * 0.08;
      context.shadowColor = wave.color;
      context.shadowBlur = 14;
      context.stroke();
      context.globalAlpha = 1;
      context.shadowBlur = 0;
    });
    requestAnimationFrame(draw);
  }
  window.addEventListener('load', () => draw());
}
