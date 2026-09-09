import beach from './canvas-studies/beach.js';
import television from './canvas-studies/television.js';
import channels from './canvas-studies/channels.js';
import particles from './canvas-studies/particles.js';
import waves from './canvas-studies/waves.js';
import {
  createIce,
  createMinecraft,
} from './canvas-studies/textured-scenes.js';
import { createFish } from './canvas-studies/fish-ripples.js';

export const artworkAssets = [
  '/projects/drawing-selected/beach2.jpg',
  '/projects/drawing/HTMLCanvas/media/aNightOut2.JPEG',
  '/projects/drawing-selected/orchid.svg',
  '/projects/drawing-selected/daisy.svg',
  '/projects/drawing-selected/sakura.svg',
  '/projects/drawing-selected/sunflower.svg',
  '/projects/drawing-selected/tulip.svg',
  '/projects/drawing-selected/ice/iceCyan.svg',
  '/projects/drawing-selected/ice/iceMagenta.svg',
  '/projects/drawing-selected/ice/iceYellow.svg',
  '/projects/drawing-selected/minecraft/sky.png',
  '/projects/drawing-selected/minecraft/terrain.png',
  '/projects/drawing-selected/minecraft/grass.png',
  '/projects/drawing-selected/minecraft/grassTop.png',
  '/projects/drawing-selected/minecraft/dirt.png',
  '/projects/drawing-selected/minecraft/rose.png',
  '/projects/drawing-selected/minecraft/steve-hand.png',
  '/projects/drawing-selected/fish/poster.jpg',
];

export const collageRatio = (narrow) => (narrow ? 5.65 : 1.85);
export const artworkNames = [
  'Beach',
  'Television',
  'Ice',
  'Minecraft',
  'Fish & droplets',
  'Geometric forms',
  'Waves',
  'Static',
];
export function collageLayout(narrow) {
  return narrow
    ? [
        [0.035, 0.008, 0.91, -0.025],
        [0.14, 0.123, 0.81, 0.03],
        [0.035, 0.238, 0.89, -0.025],
        [0.1, 0.357, 0.85, 0.02],
        [0.025, 0.474, 0.92, -0.02],
        [0.13, 0.59, 0.81, 0.025],
        [0.04, 0.712, 0.85, -0.03],
        [0.1, 0.827, 0.85, 0.025],
      ]
    : [
        [0.025, 0.015, 0.62, -0.025],
        [0.67, 0.025, 0.31, 0.04],
        [0.03, 0.275, 0.48, -0.035],
        [0.5, 0.255, 0.47, 0.035],
        [0.035, 0.515, 0.54, -0.025],
        [0.58, 0.545, 0.39, 0.02],
        [0.035, 0.775, 0.39, -0.03],
        [0.53, 0.775, 0.4, 0.025],
      ];
}
/** @param {HTMLVideoElement | null} video */
export function createArtwork(
  makeCanvas,
  images,
  requestAnimationFrame,
  video = null,
) {
  function study(factory, image, width = 600, height = 400) {
    const primary = makeCanvas(width, height);
    const events = [];
    const request = (callback) => requestAnimationFrame(callback, primary);
    const controls = new Map();
    const select = (s) =>
      s === 'img'
        ? image
        : s === '.screen'
          ? { clientWidth: 600, clientHeight: 400 }
          : s.startsWith('#')
            ? controls.get(s) ||
              (controls.set(s, { addEventListener() {} }), controls.get(s))
            : primary;
    factory({
      window: {
        innerWidth: width,
        innerHeight: height,
        devicePixelRatio: 1,
        requestAnimationFrame: request,
        addEventListener: (type, callback) => {
          if (type === 'load') events.push(callback);
        },
      },
      document: {
        querySelector: select,
        getElementById: select,
        addEventListener() {},
      },
      requestAnimationFrame: request,
    });
    events.forEach((callback) => callback());
    return primary;
  }
  function flowerDecoration(image, index) {
    const c = makeCanvas(420, 540),
      context = c.getContext('2d');
    const scale = Math.min(390 / image.width, 490 / image.height);
    const width = image.width * scale,
      height = image.height * scale;
    context.drawImage(
      image,
      (420 - width) / 2,
      (540 - height) / 2,
      width,
      height,
    );
    context.globalCompositeOperation = 'source-in';
    const gradient = context.createLinearGradient(0, 0, 420, 540);
    const palettes = [
      ['#1f3d78', '#f06d5f'],
      ['#e1a53d', '#173d75'],
      ['#d94f70', '#f2c56b'],
      ['#22477d', '#df6c45'],
      ['#e26d55', '#202c5b'],
    ];
    gradient.addColorStop(0, palettes[index % palettes.length][0]);
    gradient.addColorStop(1, palettes[index % palettes.length][1]);
    context.fillStyle = gradient;
    context.fillRect(0, 0, 420, 540);
    context.globalCompositeOperation = 'source-over';
    return c;
  }
  return {
    surfaces: [
      study(beach, images[0], 1200, 800),
      study(television, images[1]),
      createIce(makeCanvas, images.slice(7, 10), requestAnimationFrame),
      createMinecraft(makeCanvas, images.slice(10, 17), requestAnimationFrame),
      createFish(makeCanvas, video, images[17], requestAnimationFrame),
      study(channels),
      study(waves),
      study(particles),
    ],
    decorations: images.slice(2, 7).map(flowerDecoration),
  };
}

export function paintCollage(context, artwork, width, height, narrow) {
  const { surfaces, decorations } = artwork;
  const layout = collageLayout(narrow);
  surfaces.forEach((source, index) => {
    const [x, y, w, angle] = layout[index],
      dw = width * w,
      dh = (dw * source.height) / source.width;
    context.save();
    context.translate(width * x + dw / 2, height * y + dh / 2);
    context.rotate(angle);
    context.imageSmoothingEnabled = !source.pixelArt;
    context.shadowColor = '#0008';
    context.shadowBlur = 18;
    context.drawImage(source, -dw / 2, -dh / 2, dw, dh);
    context.restore();
  });
  const flowerLayout = narrow
    ? [
        [0.01, 0.11, 0.25, -0.18],
        [0.73, 0.225, 0.25, 0.12],
        [0.01, 0.46, 0.26, 0.1],
        [0.71, 0.697, 0.27, -0.1],
        [0.34, 0.934, 0.24, 0.06],
      ]
    : [
        [0.76, 0.145, 0.23, 0.12],
        [0.8, 0.405, 0.19, -0.1],
        [0.01, 0.675, 0.23, 0.08],
        [0.75, 0.665, 0.23, -0.08],
        [0.36, 0.86, 0.21, 0.1],
      ];
  decorations.forEach((flower, index) => {
    const [x, y, size, angle] = flowerLayout[index];
    const dw = width * size,
      dh = (dw * flower.height) / flower.width;
    context.save();
    context.translate(width * x + dw / 2, height * y + dh / 2);
    context.rotate(angle);
    context.globalAlpha = 0.92;
    context.drawImage(flower, -dw / 2, -dh / 2, dw, dh);
    context.restore();
  });
}
