import beach from './canvas-studies/beach.js';
import blossom from './canvas-studies/blossom.js';
import screen from './canvas-studies/screen.js';

export const artworkAssets = [
  '/projects/drawing-selected/beach2.jpg',
  '/projects/drawing-selected/orchid.svg',
  '/projects/drawing-selected/daisy.svg',
];

export function createArtwork(makeCanvas, images, requestAnimationFrame) {
  function study(factory, image, width = 600, height = 400) {
    const primary = makeCanvas(width, height);
    const companion = makeCanvas(600, 400);
    const events = [];
    const select = (s) =>
      s === 'img'
        ? image
        : s === 'c2'
          ? companion
          : s === '.screen'
            ? { clientWidth: 600, clientHeight: 400 }
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
  function botanical(image) {
    const c = makeCanvas(600, 600),
      context = c.getContext('2d');
    context.fillStyle = '#f4f0e7';
    context.fillRect(0, 0, 600, 600);
    const scale = Math.min(470 / image.width, 470 / image.height);
    context.drawImage(
      image,
      (600 - image.width * scale) / 2,
      (600 - image.height * scale) / 2,
      image.width * scale,
      image.height * scale,
    );
    return c;
  }
  return [
    study(beach, images[0], 1200, 800),
    botanical(images[1]),
    study(blossom),
    botanical(images[2]),
    study(screen),
  ];
}

export function paintCollage(context, surfaces, width, height, narrow) {
  const layout = narrow
    ? [
        [0.035, 0.015, 0.91, -0.025],
        [0.26, 0.17, 0.69, 0.035],
        [0.025, 0.37, 0.92, -0.025],
        [0.07, 0.54, 0.7, -0.04],
        [0.06, 0.77, 0.91, 0.025],
      ]
    : [
        [0.025, 0.02, 0.65, -0.025],
        [0.66, 0.105, 0.31, 0.045],
        [0.37, 0.415, 0.6, 0.025],
        [0.045, 0.37, 0.32, -0.04],
        [0.04, 0.65, 0.56, -0.025],
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
}
