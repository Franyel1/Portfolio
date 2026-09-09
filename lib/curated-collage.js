import beach from './canvas-studies/beach.js';
import television from './canvas-studies/television.js';
import channels from './canvas-studies/channels.js';
import particles from './canvas-studies/particles.js';
import waves from './canvas-studies/waves.js';

export const artworkAssets = [
  '/projects/drawing-selected/beach2.jpg',
  '/projects/drawing/HTMLCanvas/media/aNightOut2.JPEG',
  '/projects/drawing-selected/orchid.svg',
  '/projects/drawing-selected/daisy.svg',
  '/projects/drawing-selected/sakura.svg',
  '/projects/drawing-selected/sunflower.svg',
  '/projects/drawing-selected/tulip.svg',
];

export function createArtwork(makeCanvas, images, requestAnimationFrame) {
  function study(factory, image, width = 600, height = 400) {
    const primary = makeCanvas(width, height);
    const companion = makeCanvas(600, 400);
    const events = [];
    const controls = new Map();
    const select = (s) =>
      s === 'img'
        ? image
        : s === 'c2'
          ? companion
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
        requestAnimationFrame,
        addEventListener: (type, callback) => {
          if (type === 'load') events.push(callback);
        },
      },
      document: {
        querySelector: select,
        getElementById: select,
        addEventListener() {},
      },
      requestAnimationFrame,
    });
    events.forEach((callback) => callback());
    return primary;
  }
  function flowerDecoration(image, index) {
    const c = makeCanvas(210, 270),
      context = c.getContext('2d');
    const scale = Math.min(175 / image.width, 220 / image.height);
    const width = image.width * scale,
      height = image.height * scale;
    context.drawImage(
      image,
      (210 - width) / 2,
      (270 - height) / 2,
      width,
      height,
    );
    context.globalCompositeOperation = 'source-in';
    const gradient = context.createLinearGradient(0, 0, 210, 270);
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
    context.fillRect(0, 0, 210, 270);
    context.globalCompositeOperation = 'source-over';
    return c;
  }
  return {
    surfaces: [
      study(beach, images[0], 1200, 800),
      study(television, images[1]),
      study(channels),
      study(waves),
      study(particles),
    ],
    decorations: images.slice(2).map(flowerDecoration),
  };
}

export function paintCollage(context, artwork, width, height, narrow) {
  const { surfaces, decorations } = artwork;
  const layout = narrow
    ? [
        [0.035, 0.015, 0.91, -0.025],
        [0.18, 0.19, 0.78, 0.035],
        [0.025, 0.4, 0.92, -0.025],
        [0.08, 0.66, 0.8, -0.04],
        [0.05, 0.82, 0.85, 0.025],
      ]
    : [
        [0.025, 0.02, 0.6, -0.025],
        [0.66, 0.03, 0.31, 0.045],
        [0.36, 0.4, 0.56, 0.025],
        [0.02, 0.46, 0.32, -0.04],
        [0.03, 0.74, 0.46, -0.025],
      ];
  surfaces.forEach((source, index) => {
    const [x, y, w, angle] = layout[index],
      dw = width * w,
      dh = (dw * source.height) / source.width;
    context.save();
    context.translate(width * x + dw / 2, height * y + dh / 2);
    context.rotate(angle);
    context.shadowColor = '#0008';
    context.shadowBlur = 18;
    context.drawImage(source, -dw / 2, -dh / 2, dw, dh);
    context.restore();
  });
  const flowerLayout = narrow
    ? [
        [0.01, 0.2, 0.22, -0.18],
        [0.77, 0.31, 0.22, 0.12],
        [0.01, 0.57, 0.22, 0.1],
        [0.76, 0.74, 0.22, -0.1],
        [0.4, 0.91, 0.2, 0.06],
      ]
    : [
        [0.79, 0.18, 0.2, 0.12],
        [0.82, 0.42, 0.17, -0.1],
        [0.01, 0.53, 0.19, 0.08],
        [0.75, 0.73, 0.2, -0.08],
        [0.5, 0.86, 0.17, 0.1],
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
