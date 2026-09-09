// Adapted from assignments/Canvas Pair/pairJS1.js, drawing2.
// One persistent sample buffer and a capped ripple pool replace per-drop allocations.
export function createFish(makeCanvas, video, poster, request) {
  const canvas = makeCanvas(600, 400),
    ctx = canvas.getContext('2d');
  const sample = makeCanvas(60, 40),
    sampler = sample.getContext('2d', { willReadFrequently: true });
  const ripples = [];
  let frame = 0;
  const draw = () => {
    const source = video && video.readyState >= 2 ? video : poster;
    ctx.globalAlpha = 1;
    ctx.drawImage(source, 0, 0, 600, 400);
    ctx.fillStyle = 'rgba(25,35,51,0.42)';
    ctx.fillRect(0, 0, 600, 400);
    if (frame++ % 4 === 0) {
      sampler.drawImage(source, 0, 0, 60, 40);
      const x = Math.random() * 600,
        y = Math.random() * 400;
      const [r, g, b] = sampler.getImageData(
        Math.floor(x / 10),
        Math.floor(y / 10),
        1,
        1,
      ).data;
      if (ripples.length < 36)
        ripples.push({ x, y, radius: 2, a: 0.9, color: `${r},${g},${b}` });
    }
    for (let i = ripples.length - 1; i >= 0; i--) {
      const drop = ripples[i];
      ctx.beginPath();
      ctx.arc(drop.x, drop.y, drop.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${drop.color},${drop.a})`;
      ctx.lineWidth = 2;
      ctx.stroke();
      drop.radius += 1.5;
      drop.a *= 0.955;
      if (drop.a < 0.06) ripples.splice(i, 1);
    }
    request(draw, canvas);
  };
  draw();
  return canvas;
}
