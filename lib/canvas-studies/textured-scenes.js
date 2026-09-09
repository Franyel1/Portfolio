// Canvas adaptations of the supplied CSSAnimation and FinalProject/ice scenes.
// Original textures and six-face cube construction are retained; one renderer replaces DOM faces.
const faces = [
  [
    [-1, -1, 1],
    [1, -1, 1],
    [1, 1, 1],
    [-1, 1, 1],
  ],
  [
    [1, -1, 1],
    [1, -1, -1],
    [1, 1, -1],
    [1, 1, 1],
  ],
  [
    [1, -1, -1],
    [-1, -1, -1],
    [-1, 1, -1],
    [1, 1, -1],
  ],
  [
    [-1, -1, -1],
    [-1, -1, 1],
    [-1, 1, 1],
    [-1, 1, -1],
  ],
  [
    [-1, -1, -1],
    [1, -1, -1],
    [1, -1, 1],
    [-1, -1, 1],
  ],
  [
    [-1, 1, 1],
    [1, 1, 1],
    [1, 1, -1],
    [-1, 1, -1],
  ],
];

export function texturedQuad(ctx, texture, points) {
  const [a, b, , d] = points;
  ctx.save();
  ctx.transform(
    (b.x - a.x) / texture.width,
    (b.y - a.y) / texture.width,
    (d.x - a.x) / texture.height,
    (d.y - a.y) / texture.height,
    a.x,
    a.y,
  );
  ctx.drawImage(texture, 0, 0);
  ctx.restore();
}

function cube(ctx, textures, cx, cy, size, yaw, pitch, translucent = false) {
  const project = ([x, y, z]) => {
    const rx = x * Math.cos(yaw) + z * Math.sin(yaw),
      rz = -x * Math.sin(yaw) + z * Math.cos(yaw);
    return {
      x: cx + rx * size,
      y: cy + (y * Math.cos(pitch) - rz * Math.sin(pitch)) * size,
      z: y * Math.sin(pitch) + rz * Math.cos(pitch),
    };
  };
  const projected = faces.map((face, index) => ({
    index,
    points: face.map(project),
  }));
  projected.sort(
    (a, b) =>
      a.points.reduce((s, p) => s + p.z, 0) -
      b.points.reduce((s, p) => s + p.z, 0),
  );
  projected.forEach(({ index, points }) => {
    const [a, b, c] = points;
    if (
      !translucent &&
      (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x) <= 0
    )
      return;
    ctx.globalAlpha = translucent ? 0.7 : 1;
    texturedQuad(ctx, textures[index % textures.length], points);
    if (!translucent && index !== 4) {
      ctx.beginPath();
      points.forEach((p, i) =>
        i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y),
      );
      ctx.closePath();
      ctx.fillStyle = index === 0 ? '#00000012' : '#00000030';
      ctx.fill();
    }
  });
  ctx.globalAlpha = 1;
}

export function createIce(makeCanvas, images, request) {
  const canvas = makeCanvas(720, 480),
    ctx = canvas.getContext('2d');
  // Rasterize the supplied SVG faces once at their display resolution.
  const textures = images.map((image) => {
    const c = makeCanvas(128, 128),
      x = c.getContext('2d');
    x.fillStyle = '#09090d';
    x.fillRect(0, 0, 128, 128);
    x.drawImage(image, 0, 0, 128, 128);
    return c;
  });
  let phase = 0;
  const draw = () => {
    ctx.fillStyle = '#09080e';
    ctx.fillRect(0, 0, 720, 480);
    phase += 0.014;
    for (let i = 0; i < 12; i++) {
      const x = 90 + (i % 4) * 180,
        y = 80 + Math.floor(i / 4) * 160;
      const order = Array.from({ length: 6 }, (_, n) => textures[(n + i) % 3]);
      cube(
        ctx,
        order,
        x,
        y,
        83,
        0.34 + Math.sin(phase) * 0.23,
        -0.28 + Math.cos(phase * 0.8) * 0.12,
        true,
      );
    }
    request(draw, canvas);
  };
  draw();
  return canvas;
}

export function createMinecraft(makeCanvas, images, request) {
  const [sky, terrain, grass, top, dirt, rose, hand, cracks] = images;
  const canvas = makeCanvas(640, 440),
    ctx = canvas.getContext('2d');
  canvas.pixelArt = true;
  const background = makeCanvas(640, 440),
    bg = background.getContext('2d');
  bg.imageSmoothingEnabled = false;
  bg.drawImage(sky, -64, 0, 768, 440);
  // The original grass plane is projected into the foreground.
  // Scanline projection keeps the supplied ground texture sharp in perspective.
  for (let row = 0; row < 186; row++) {
    const progress = row / 185;
    bg.drawImage(
      terrain,
      0,
      Math.min(terrain.height - 1, Math.floor(progress * terrain.height)),
      terrain.width,
      1,
      176 * (1 - progress),
      254 + row,
      277 + 363 * progress,
      1,
    );
  }
  // Cache progressive crack intensity from the supplied breaking texture.
  const stages = Array.from({ length: 10 }, (_, stage) =>
    [grass, grass, grass, grass, top, dirt].map((texture) => {
      const face = makeCanvas(128, 128), x = face.getContext('2d');
      x.imageSmoothingEnabled = false;
      x.drawImage(texture, 0, 0, 128, 128);
      x.globalCompositeOperation = 'multiply';
      x.globalAlpha = (stage + 1) / 10;
      x.drawImage(cracks, 0, 0, 128, 128);
      return face;
    }),
  );
  let frame = 0;
  const draw = () => {
    // At 30 fps: hold, punch/crack for 1.5 seconds, drop items, reset.
    const cycle = frame++ % 150;
    const breaking = cycle >= 36 && cycle < 81;
    const broken = cycle >= 81;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(background, 0, 0);
    if (!broken) {
      const textures = breaking
        ? stages[Math.min(9, Math.floor((cycle - 36) / 4.5))]
        : [grass, grass, grass, grass, top, dirt];
      cube(ctx, textures, 314, 278, 69, 0, -Math.PI / 18);
      ctx.drawImage(rose, 272, 107, 80, 111);
    } else {
      const bob = Math.sin((cycle - 81) * 0.12) * 4;
      cube(ctx, [grass, grass, grass, grass, top, dirt], 334, 343 + bob, 18, 0, -Math.PI / 18);
      ctx.drawImage(rose, 274, 310 + bob, 28, 39);
    }
    const punch = breaking ? Math.sin(((cycle - 36) % 12) / 12 * Math.PI) : 0;
    ctx.save();
    ctx.translate(469 - punch * 80, 282 - punch * 40);
    ctx.transform(1, -punch * 0.15, 0.2, 1, 0, 0);
    ctx.drawImage(hand, 0, 0, 161, 195);
    ctx.restore();
    request(draw, canvas);
  };
  draw();
  return canvas;
}
