import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

const source = await readFile(
  new URL('../lib/eight-ball-renderer.ts', import.meta.url),
  'utf8',
);
const { outputText } = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
});
const {
  sphereRotation,
  smoothBallProgress,
  createLowPolySphere,
  triangleTransform,
  motionDirection,
} = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`
);
const near = (actual, expected, tolerance = 1e-9) =>
  assert.ok(
    Math.abs(actual - expected) < tolerance,
    `${actual} != ${expected}`,
  );
const rotate = (m, point) =>
  [0, 1, 2].map(
    (row) =>
      m[row * 3] * point[0] +
      m[row * 3 + 1] * point[1] +
      m[row * 3 + 2] * point[2],
  );

// A half turn must swap the numbered and answer hemispheres; a full turn
// must preserve every surface point, including the resting face's lean.
near(
  rotate(sphereRotation({ yaw: Math.PI, pitch: 0, roll: 0 }), [0, 0, 1])[2],
  -1,
);
const resting = { yaw: Math.PI - 0.18, pitch: -0.08, roll: 0.06 };
const repeated = { ...resting, yaw: resting.yaw + 2 * Math.PI };
const restMatrix = sphereRotation(resting),
  repeatMatrix = sphereRotation(repeated);
restMatrix.forEach((value, i) => near(value, repeatMatrix[i]));

// Arbitrary yaw/pitch/roll must preserve the sphere's radius and the
// orthogonality of its coordinate axes, rather than deforming its markings.
for (let i = 0; i < 40; i++) {
  const matrix = sphereRotation({
    yaw: i * 0.43,
    pitch: Math.sin(i) * 0.6,
    roll: Math.cos(i) * 0.4,
  });
  for (const point of [
    [0, 0, 1],
    [1, 0, 0],
    [0, 1, 0],
    [0.6, 0.8, 0],
  ]) {
    near(Math.hypot(...rotate(matrix, point)), 1);
  }
  const x = rotate(matrix, [1, 0, 0]),
    y = rotate(matrix, [0, 1, 0]);
  near(
    x.reduce((sum, value, index) => sum + value * y[index], 0),
    0,
  );
}

// Both endpoints have zero velocity, and easing never reverses or overshoots.
near(smoothBallProgress(0), 0);
near(smoothBallProgress(1), 1);
const step = 0.0001;
assert.ok(smoothBallProgress(step) / step < 0.000001);
assert.ok((1 - smoothBallProgress(1 - step)) / step < 0.000001);
let previous = 0;
for (let i = 0; i <= 1000; i++) {
  const progress = smoothBallProgress(i / 1000);
  assert.ok(progress >= previous - 1e-12 && progress <= 1);
  previous = progress;
}
const mesh = createLowPolySphere();
assert.equal(mesh.faces.length, 144);
for (const vertex of mesh.vertices)
  near(Math.hypot(vertex.x, vertex.y, vertex.z), 1);
for (const indices of mesh.faces) {
  const [a, b, c] = indices.map((i) => mesh.vertices[i]);
  const u = [b.x - a.x, b.y - a.y, b.z - a.z],
    v = [c.x - a.x, c.y - a.y, c.z - a.z];
  const n = [
    u[1] * v[2] - u[2] * v[1],
    u[2] * v[0] - u[0] * v[2],
    u[0] * v[1] - u[1] * v[0],
  ];
  assert.ok(Math.hypot(...n) > 0.01, 'no collapsed pole triangle');
  assert.ok(
    n[0] * a.x + n[1] * a.y + n[2] * a.z > 0,
    'all facets face outward',
  );
}
for (let row = 0; row <= 7; row++) {
  const left = mesh.vertices[row * 13],
    right = mesh.vertices[row * 13 + 12];
  for (const axis of ['x', 'y', 'z']) near(left[axis], right[axis]);
  assert.equal(left.u, 0);
  assert.equal(right.u, 1);
}
const texture = [
  { x: 12, y: 19 },
  { x: 31, y: 19 },
  { x: 12, y: 47 },
];
const projected = [
  { x: 110, y: 97 },
  { x: 165, y: 83 },
  { x: 124, y: 140 },
];
const [a, b, c, d, e, f] = triangleTransform(texture, projected);
texture.forEach((p, i) => {
  near(a * p.x + c * p.y + e, projected[i].x);
  near(b * p.x + d * p.y + f, projected[i].y);
});
assert.equal(
  triangleTransform(
    [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 2 },
    ],
    projected,
  ),
  null,
);
for (const [x, y] of [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
  [3, -4],
]) {
  const axis = motionDirection(x, y, { x: 1, y: 0 });
  near(Math.hypot(axis.x, axis.y), 1);
  assert.ok(
    axis.x * x + axis.y * y > 0,
    'shake follows the actual gesture direction',
  );
}
assert.deepEqual(motionDirection(0, 0, { x: 0, y: -1 }), { x: 0, y: -1 });
console.log(
  '8 Ball checks passed: 144 outward facets, closed UV seam, rigid rotation, texture mapping, directional gestures, and smooth endpoints.',
);
