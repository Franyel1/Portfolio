'use client';
import { useEffect, useRef } from 'react';

/** Draw at an integer CSS-pixel scale; no resampling or painted image assets. */
export default function PixelLandscape({ paused }: { paused: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const context = canvas.getContext('2d', { alpha: false });
    if (!context) return;
    let width = 0,
      height = 0,
      tick = 0,
      visible = true;
    const scale = 4;
    const random = (n: number) => {
      const value = Math.sin(n * 127.1 + 311.7) * 43758.5453;
      return value - Math.floor(value);
    };
    const draw = () => {
      if (!width || !height) return;
      const ctx = context;
      const box = (
        x: number,
        y: number,
        w: number,
        h: number,
        color: string,
      ) => {
        ctx.fillStyle = color;
        ctx.fillRect(
          Math.round(x),
          Math.round(y),
          Math.round(w),
          Math.round(h),
        );
      };
      // Flat color bands preserve the deliberately limited game palette.
      [
        '#101c43',
        '#12214e',
        '#152758',
        '#1c3066',
        '#324178',
        '#675274',
        '#b57c82',
        '#e8ad98',
      ].forEach((color, i) => {
        const top =
          i < 4 ? i * height * 0.14 : height * (0.56 + (i - 4) * 0.055);
        const band = i < 4 ? height * 0.14 + 1 : height * 0.055 + 1;
        box(0, top, width, band, color);
      });
      for (let i = 0; i < Math.max(40, width / 2); i++) {
        const x = Math.floor(random(i + 1) * width);
        const y = Math.floor(random(i + 450) * height * 0.55);
        const bright = (i + tick) % 11 === 0;
        box(x, y, 1, 1, bright ? '#f8d4ad' : '#6c87b5');
        if (bright && i % 5 === 0) {
          box(x - 1, y, 3, 1, '#b8cbed');
          box(x, y - 1, 1, 3, '#b8cbed');
        }
      }
      const moonX = Math.floor(width * 0.86),
        moonY = Math.floor(height * 0.18);
      box(moonX, moonY, 5, 7, '#edcfaa');
      box(moonX - 1, moonY + 1, 7, 5, '#edcfaa');
      box(moonX + 2, moonY - 1, 5, 6, '#12214e');
      // Each mountain is constructed from whole pixel columns, including edges.
      const ridge = (
        base: number,
        amplitude: number,
        frequency: number,
        color: string,
        seed: number,
      ) => {
        for (let x = 0; x < width; x++) {
          const y = Math.round(
            height * base +
              Math.sin(x * frequency + seed) * amplitude +
              Math.sin(x * frequency * 2.7 + seed) * amplitude * 0.35,
          );
          box(x, y, 1, height - y, color);
        }
      };
      ridge(0.73, 7, 0.041, '#515580', 2);
      ridge(0.78, 9, 0.034, '#343f70', 4);
      ridge(0.84, 5, 0.047, '#202e58', 6);
      ridge(0.9, 3, 0.029, '#111e3d', 2);
      // A small path catches the last light.
      for (let y = Math.round(height * 0.88); y < height; y++) {
        const distance = y - height * 0.88;
        const x = width * 0.61 + Math.sin(distance * 0.14) * distance * 0.25;
        box(x, y, Math.max(1, distance * 0.18), 1, '#3d4264');
      }
      const tree = (x: number, y: number, size: number) => {
        box(x, y, size, 8 * size, '#0c1732');
        for (let i = 0; i < 4; i++)
          box(
            x - i * size,
            y + i * size * 1.5,
            (i * 2 + 1) * size,
            2 * size,
            '#0c1732',
          );
      };
      tree(width * 0.05, height * 0.78, 2);
      tree(width * 0.11, height * 0.84, 1);
      tree(width * 0.95, height * 0.78, 2);
      tree(width * 0.89, height * 0.86, 1);
      for (let i = 0; i < width / 2; i++) {
        const x = random(i + 900) * width,
          y = height * (0.91 + random(i + 1400) * 0.09);
        box(x, y, 1, 1, i % 5 === 0 ? '#556681' : '#213257');
      }
      // Tiny explorer sprite, drawn directly on the same integer grid.
      const sprite = [
        '..hhh..',
        '..hsh..',
        '...s...',
        '..jjj..',
        '.bjjj..',
        '.bjjj..',
        '..lll..',
        '..l.l..',
        '..l.l..',
        '.dd.dd.',
      ];
      const palette: Record<string, string> = {
        h: '#372b3c',
        s: '#e5b79c',
        j: '#dfab74',
        b: '#824c55',
        l: '#1c2341',
        d: '#8391ae',
      };
      const personX = Math.floor(width * 0.76),
        personY = Math.floor(height * 0.875) - 10;
      sprite.forEach((row, y) =>
        [...row].forEach((pixel, x) => {
          if (palette[pixel])
            box(personX + x, personY + y, 1, 1, palette[pixel]);
        }),
      );
    };
    const resize = new ResizeObserver((entries) => {
      const rect = entries[0].contentRect;
      width = Math.ceil(rect.width / scale);
      height = Math.ceil(rect.height / scale);
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = `${width * scale}px`;
      canvas.style.height = `${height * scale}px`;
      context.imageSmoothingEnabled = false;
      draw();
    });
    resize.observe(canvas.parentElement!);
    const observer = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
    });
    observer.observe(canvas);
    const timer = paused
      ? undefined
      : window.setInterval(() => {
          if (visible && !document.hidden) {
            tick++;
            draw();
          }
        }, 700);
    return () => {
      resize.disconnect();
      observer.disconnect();
      if (timer) clearInterval(timer);
    };
  }, [paused]);
  return (
    <canvas
      ref={ref}
      className="pixel-landscape pixel-canvas"
      aria-hidden="true"
    />
  );
}
