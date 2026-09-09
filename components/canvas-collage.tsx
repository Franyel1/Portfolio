'use client';
import { useEffect, useRef, useState } from 'react';
import signal from '@/lib/canvas-studies/signal';
import television from '@/lib/canvas-studies/television';
import pair from '@/lib/canvas-studies/pair';
import particles from '@/lib/canvas-studies/particles';
import channels from '@/lib/canvas-studies/channels';
import screen from '@/lib/canvas-studies/screen';
import background from '@/lib/canvas-studies/background';

export default function CanvasCollage() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [paused, setPaused] = useState(false);
  const [status, setStatus] = useState('Loading drawings…');
  const pausedRef = useRef(false);
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);
  useEffect(() => {
    const target = ref.current!;
    const context = target.getContext('2d')!;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    setPaused(reduced);
    pausedRef.current = reduced;
    let disposed = false,
      frame = 0,
      last = 0,
      painted = false;
    const queue = new Set<FrameRequestCallback>();
    const load: (() => void)[] = [];
    const surfaces: HTMLCanvasElement[] = [];
    const video = document.createElement('video');
    video.muted = true;
    video.defaultMuted = true;
    video.volume = 0;
    video.loop = true;
    video.playsInline = true;
    video.src = '/projects/drawing/CanvasPair/wedding.mp4';
    const image = new Image();
    image.src = '/projects/drawing/HTMLCanvas/media/aNightOut2.JPEG';
    const canvas = () => {
      const c = document.createElement('canvas');
      c.width = 600;
      c.height = 400;
      return c;
    };
    const run = (factory: typeof signal, count = 1) => {
      const local = Array.from({ length: count }, canvas);
      surfaces.push(...local);
      const buttons = new Map<string, HTMLButtonElement>();
      const select = (selector: string) => {
        if (selector === 'img') return image;
        if (selector === 'video') return video;
        if (selector === '.screen')
          return { clientWidth: 600, clientHeight: 400 };
        if (selector === 'c2') return local[1];
        if (selector.startsWith('#') && selector !== '#backgroundStatic') {
          if (!buttons.has(selector))
            buttons.set(selector, document.createElement('button'));
          return buttons.get(selector);
        }
        return local[0];
      };
      const request = (callback: FrameRequestCallback) => {
        queue.add(callback);
        return 0;
      };
      factory({
        window: {
          innerWidth: 600,
          innerHeight: 400,
          devicePixelRatio: 1,
          requestAnimationFrame: request,
          addEventListener: (type: string, callback: () => void) => {
            if (type === 'load') load.push(callback);
          },
        },
        document: {
          querySelector: select,
          getElementById: select,
          createElement: (tag: string) => document.createElement(tag),
          addEventListener: () => {},
        },
        requestAnimationFrame: request,
      });
    };
    const compose = () => {
      const width = target.clientWidth;
      const narrow = width < 650;
      const height = width * (narrow ? 2.7 : 1.15);
      const dpr = Math.min(devicePixelRatio, 2);
      if (
        target.width !== Math.round(width * dpr) ||
        target.height !== Math.round(height * dpr)
      ) {
        target.width = Math.round(width * dpr);
        target.height = Math.round(height * dpr);
      }
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);
      // Overlapping pieces share one transparent drawing surface.
      const layouts = narrow
        ? [
            [0.02, 0.02, 0.85, -0.035],
            [0.2, 0.13, 0.76, 0.06],
            [0.02, 0.25, 0.92, -0.025],
            [0.14, 0.39, 0.83, 0.025],
            [0.01, 0.52, 0.78, -0.035],
            [0.22, 0.61, 0.76, 0.065],
            [0.02, 0.75, 0.86, -0.045],
            [0.18, 0.79, 0.78, 0.025],
          ]
        : [
            [0.02, 0.02, 0.54, -0.045],
            [0.55, 0.02, 0.43, 0.045],
            [0.23, 0.28, 0.59, -0.025],
            [0.02, 0.52, 0.45, 0.035],
            [0.6, 0.5, 0.38, 0.05],
            [0.02, 0.7, 0.44, -0.04],
            [0.49, 0.7, 0.47, 0.025],
            [0.64, 0.29, 0.34, 0.06],
          ];
      // Pair's landscape and video canvases sit at the center of the composition.
      surfaces.forEach((source, i) => {
        const [x, y, w, angle] = layouts[i];
        const dw = width * w,
          dh = (dw * source.height) / source.width;
        context.save();
        context.translate(width * x + dw / 2, height * y + dh / 2);
        context.rotate(angle);
        context.shadowColor = '#0009';
        context.shadowBlur = 18;
        context.drawImage(source, -dw / 2, -dh / 2, dw, dh);
        context.restore();
      });
    };
    const tick = (now: number) => {
      if (disposed) return;
      if (
        !document.hidden &&
        now - last >= 1000 / 30 &&
        (!pausedRef.current || !painted)
      ) {
        const callbacks = [...queue];
        queue.clear();
        callbacks.forEach((callback) => callback(now));
        compose();
        painted = true;
        last = now;
      }
      frame = requestAnimationFrame(tick);
    };
    image
      .decode()
      .then(() => {
        if (disposed) return;
        run(signal);
        run(television);
        run(pair, 2);
        run(particles);
        run(channels);
        run(screen);
        run(background);
        load.forEach((callback) => callback());
        setStatus('');
        frame = requestAnimationFrame(tick);
      })
      .catch(() => {
        if (!disposed)
          setStatus(
            'The drawings could not load. Please reopen the collection.',
          );
      });
    const observer = new ResizeObserver(() => {
      painted = false;
    });
    observer.observe(target);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      queue.clear();
      observer.disconnect();
      video.pause();
      video.removeAttribute('src');
      video.load();
    };
  }, []);
  return (
    <div className="drawing-composition">
      <div className="drawing-controls">
        <span>Canvas studies · sound off</span>
        <button onClick={() => setPaused(!paused)}>
          {paused ? 'Play motion' : 'Pause motion'}
        </button>
      </div>
      {status && <p role="status">{status}</p>}
      <canvas
        ref={ref}
        aria-label="Animated collage of my television signals, static particles, geometric forms, cherry blossoms and sampled video"
      />
    </div>
  );
}
