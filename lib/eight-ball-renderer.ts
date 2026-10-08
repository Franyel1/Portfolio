export type BallPose = { yaw: number; pitch: number; roll: number };
export type Point = { x: number; y: number };
type Vertex = Point & { z: number; u: number; v: number };

/** Inverse of Rz * Ry * Rx. Its transpose rotates model vertices into view. */
export function sphereRotation({ yaw, pitch, roll }: BallPose) {
  const cy = Math.cos(yaw),
    sy = Math.sin(yaw);
  const cx = Math.cos(pitch),
    sx = Math.sin(pitch);
  const cz = Math.cos(roll),
    sz = Math.sin(roll);
  return [
    cy * cz,
    cy * sz,
    -sy,
    sx * sy * cz - cx * sz,
    sx * sy * sz + cx * cz,
    sx * cy,
    cx * sy * cz + sx * sz,
    cx * sy * sz - sx * cz,
    cx * cy,
  ];
}
export const smoothBallProgress = (t: number) =>
  t * t * t * (t * (t * 6 - 15) + 10);
export function motionDirection(x: number, y: number, fallback: Point) {
  const length = Math.hypot(x, y);
  return length > 0.5 ? { x: x / length, y: y / length } : fallback;
}

/** Duplicated UV seam, matching physical positions, no degenerate pole faces. */
export function createLowPolySphere() {
  const vertices: Vertex[] = [],
    faces: number[][] = [];
  const columns = 12,
    rows = 7;
  for (let row = 0; row <= rows; row++) {
    for (let col = 0; col <= columns; col++) {
      const u = col / columns,
        v = row / rows;
      const longitude = (u - 0.5) * Math.PI * 2,
        latitude = v * Math.PI;
      vertices.push({
        x: Math.sin(latitude) * Math.sin(longitude),
        y: Math.cos(latitude),
        z: Math.sin(latitude) * Math.cos(longitude),
        u,
        v,
      });
    }
  }
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const a = row * (columns + 1) + col,
        b = a + 1;
      const c = a + columns + 1,
        d = c + 1;
      if (row < rows - 1) faces.push([a, c, d]);
      if (row > 0) faces.push([a, d, b]);
    }
  }
  return { vertices, faces };
}

/** Affine triangle mapping using the collection's established Canvas path. */
export function triangleTransform(source: Point[], target: Point[]) {
  const [s0, s1, s2] = source,
    [t0, t1, t2] = target;
  const ux = s1.x - s0.x,
    uy = s1.y - s0.y;
  const vx = s2.x - s0.x,
    vy = s2.y - s0.y;
  const determinant = ux * vy - uy * vx;
  if (Math.abs(determinant) < 1e-9) return null;
  const ax = t1.x - t0.x,
    ay = t1.y - t0.y;
  const bx = t2.x - t0.x,
    by = t2.y - t0.y;
  const a = (ax * vy - bx * uy) / determinant;
  const b = (ay * vy - by * uy) / determinant;
  const c = (bx * ux - ax * vx) / determinant;
  const d = (by * ux - ay * vx) / determinant;
  return [
    a,
    b,
    c,
    d,
    t0.x - a * s0.x - c * s0.y,
    t0.y - b * s0.x - d * s0.y,
  ] as const;
}
function polygon(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  sides: number,
) {
  ctx.beginPath();
  for (let i = 0; i < sides; i++) {
    const angle = (i / sides) * Math.PI * 2;
    ctx.lineTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
  }
  ctx.closePath();
}
function makeAtlas(answer: string | null) {
  const atlas = document.createElement('canvas');
  atlas.width = 512;
  atlas.height = 256;
  const ctx = atlas.getContext('2d')!;
  polygon(ctx, 256, 128, 42, 12);
  ctx.fillStyle = '#eee4cc';
  ctx.fill();

  // Keep the question above the numbered face so it reads as a label on the ball.
  ctx.save();
  ctx.fillStyle = '#a9d3f2';
  ctx.font = 'bold 10px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const question = 'SHOULD YOU HIRE ME?';
  const arcRadius = 56;
  const arcStart = Math.PI + 0.28;
  const arcStep = (Math.PI - 0.56) / (question.length - 1);
  [...question].forEach((letter, index) => {
    const angle = arcStart + arcStep * index;
    ctx.save();
    ctx.translate(256 + Math.cos(angle) * arcRadius, 128 + Math.sin(angle) * arcRadius);
    ctx.rotate(angle + Math.PI / 2);
    ctx.fillText(letter, 0, 0);
    ctx.restore();
  });
  ctx.restore();

  ctx.fillStyle = '#101827';
  ctx.font = 'bold 44px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('8', 256, 131);
  for (const center of [0, 512]) {
    polygon(ctx, center, 128, 43, 12);
    ctx.fillStyle = '#0b1122';
    ctx.fill();
    ctx.strokeStyle = '#8195af';
    ctx.lineWidth = 2;
    ctx.stroke();
    polygon(ctx, center, 128, 38, 12);
    const answerGradient = ctx.createLinearGradient(center - 38, 98, center + 38, 158);
    answerGradient.addColorStop(0, '#173e88');
    answerGradient.addColorStop(0.42, '#347bc7');
    answerGradient.addColorStop(0.7, '#7258bc');
    answerGradient.addColorStop(1, '#263568');
    ctx.fillStyle = answerGradient;
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(center - 30, 105);
    ctx.lineTo(center + 30, 105);
    ctx.lineTo(center, 154);
    ctx.closePath();
    ctx.fillStyle = '#6c94f1';
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(center - 30, 105);
    ctx.lineTo(center, 124);
    ctx.lineTo(center, 154);
    ctx.closePath();
    ctx.fillStyle = '#4168c7';
    ctx.fill();
    if (answer) {
      ctx.font = 'bold 9px Arial, sans-serif';
      ctx.fillStyle = '#fff5df';
      const lines: string[] = [];
      let line = '';
      for (const word of answer.toUpperCase().split(' ')) {
        const candidate = line ? `${line} ${word}` : word;
        if (line && ctx.measureText(candidate).width > 42) {
          lines.push(line);
          line = word;
        } else line = candidate;
      }
      if (line) lines.push(line);
      lines.slice(0, 4).forEach((text, i) => {
        const y = 114 + i * 9;
        // The answer window narrows toward its point, so each line gets the
        // width available at its own height.
        const triangleWidth = Math.max(12, 60 * ((154 - y) / 49) - 6);
        ctx.fillText(text, center, y, triangleWidth);
      });
    }
  }
  return atlas;
}

/** 144 flat-shaded triangles; original artwork, no WebGL or idle scheduler. */
export function createEightBallRenderer(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  const mesh = createLowPolySphere();
  const buffer = document.createElement('canvas');
  buffer.width = buffer.height = 512;
  const paint = buffer.getContext('2d')!;
  paint.imageSmoothingEnabled = true;
  const blank = makeAtlas(null);
  const blankShades = new Map<number, HTMLCanvasElement>();
  const answerShades = new Map<number, HTMLCanvasElement>();
  function shadedTexture(
    texture: HTMLCanvasElement,
    shade: number,
    cache: Map<number, HTMLCanvasElement>,
  ) {
    const cached = cache.get(shade);
    if (cached) return cached;
    const result = document.createElement('canvas');
    result.width = texture.width;
    result.height = texture.height;
    const ink = result.getContext('2d')!;
    ink.drawImage(texture, 0, 0);
    ink.globalCompositeOperation = 'source-atop';
    ink.fillStyle = `rgba(0,0,0,${1 - shade})`;
    ink.fillRect(0, 0, result.width, result.height);
    cache.set(shade, result);
    return result;
  }
  let answer: string | null = null,
    atlas = blank;
  return {
    draw(pose: BallPose, nextAnswer: string | null, reveal = 1) {
      if (answer !== nextAnswer) {
        answer = nextAnswer;
        atlas = answer ? makeAtlas(answer) : blank;
        answerShades.clear();
      }
      const m = sphereRotation(pose),
        camera = 4.8;
      const vertices = mesh.vertices.map(({ x, y, z, u, v }) => {
        const wx = m[0] * x + m[3] * y + m[6] * z;
        const wy = m[1] * x + m[4] * y + m[7] * z;
        const wz = m[2] * x + m[5] * y + m[8] * z;
        const scale = (buffer.width * 0.458 * camera) / (camera - wz);
        return {
          x: wx,
          y: wy,
          z: wz,
          screen: {
            x: buffer.width / 2 + wx * scale,
            y: buffer.height / 2 - wy * scale,
          },
          uv: { x: u * 512, y: v * 256 },
        };
      });
      const faces = mesh.faces
        .map((indices, index) => {
          const points = indices.map((i) => vertices[i]),
            [a, b, c] = points;
          const ux = b.x - a.x,
            uy = b.y - a.y,
            uz = b.z - a.z;
          const vx = c.x - a.x,
            vy = c.y - a.y,
            vz = c.z - a.z;
          const nx = uy * vz - uz * vy,
            ny = uz * vx - ux * vz,
            nz = ux * vy - uy * vx;
          const cx = (a.x + b.x + c.x) / 3,
            cy = (a.y + b.y + c.y) / 3,
            cz = (a.z + b.z + c.z) / 3;
          const facing = nx * -cx + ny * -cy + nz * (camera - cz);
          const diffuse = Math.max(
            0,
            (-nx * 0.45 + ny * 0.65 + nz * 0.61) / Math.hypot(nx, ny, nz),
          );
          const shade =
            0.28 + (Math.round(diffuse * 6) / 6) * 0.7 + (index % 2) * 0.018;
          return { points, depth: cz, facing, shade };
        })
        .filter((face) => face.facing > 0)
        .sort((a, b) => a.depth - b.depth);
      paint.clearRect(0, 0, buffer.width, buffer.height);
      for (const { points, shade } of faces) {
        const screen = points.map((p) => p.screen),
          uv = points.map((p) => p.uv);
        const center = {
          x: screen.reduce((sum, p) => sum + p.x, 0) / 3,
          y: screen.reduce((sum, p) => sum + p.y, 0) / 3,
        };
        // Tiny overlap seals antialiased texture seams, without a wireframe rim.
        paint.beginPath();
        screen.forEach((p) => {
          const length = Math.hypot(p.x - center.x, p.y - center.y);
          paint.lineTo(
            p.x + ((p.x - center.x) / length) * 0.6,
            p.y + ((p.y - center.y) / length) * 0.6,
          );
        });
        paint.closePath();
        const textured = uv.some(
          (p) =>
            ((p.x > 190 && p.x < 322) || p.x < 86 || p.x > 426) &&
            p.y > 70 &&
            p.y < 207,
        );
        const bodyShade = shade;
        paint.fillStyle = `rgb(${Math.round(57 * bodyShade)},${Math.round(74 * bodyShade)},${Math.round(101 * bodyShade)})`;
        paint.fill();
        if (!textured) continue;
        const transform = triangleTransform(uv, screen);
        if (!transform) continue;
        paint.save();
        paint.clip();
        paint.save();
        paint.transform(...transform);
        paint.drawImage(shadedTexture(blank, shade, blankShades), 0, 0);
        if (atlas !== blank && reveal > 0) {
          paint.globalAlpha = reveal;
          paint.drawImage(shadedTexture(atlas, shade, answerShades), 0, 0);
        }
        paint.restore();
        paint.restore();
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(buffer, 0, 0, canvas.width, canvas.height);
    },
  };
}
