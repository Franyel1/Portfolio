'use client';
import { useEffect, useRef, useState } from 'react';
import {
  artworkAssets,
  createArtwork,
  paintCollage,
} from '@/lib/curated-collage';

export default function CanvasCollage() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [paused, setPaused] = useState(false);
  const [status, setStatus] = useState('Loading drawings…');
  const pausedRef = useRef(false);
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);
  useEffect(() => {
    const target = ref.current!,
      context = target.getContext('2d')!;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    setPaused(reduced);
    pausedRef.current = reduced;
    let disposed = false,
      frame = 0,
      last = 0,
      painted = false;
    const queue = new Set<FrameRequestCallback>();
    const request = (callback: FrameRequestCallback) => {
      queue.add(callback);
      return 0;
    };
    const makeCanvas = (width: number, height: number) => {
      const c = document.createElement('canvas');
      c.width = width;
      c.height = height;
      return c;
    };
    const images = artworkAssets.map((src) => {
      const image = new Image();
      image.src = src;
      return image;
    });
    Promise.all(images.map((image) => image.decode()))
      .then(() => {
        if (disposed) return;
        const artwork = createArtwork(makeCanvas, images, request);
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
            const width = target.clientWidth,
              narrow = width < 650;
            const height = width * (narrow ? 3.3 : 1.15),
              dpr = Math.min(devicePixelRatio, 2);
            if (
              target.width !== Math.round(width * dpr) ||
              target.height !== Math.round(height * dpr)
            ) {
              target.width = Math.round(width * dpr);
              target.height = Math.round(height * dpr);
            }
            context.setTransform(dpr, 0, 0, dpr, 0, 0);
            context.clearRect(0, 0, width, height);
            paintCollage(context, artwork, width, height, narrow);
            painted = true;
            last = now;
          }
          frame = requestAnimationFrame(tick);
        };
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
    };
  }, []);
  return (
    <div className="drawing-composition">
      <div className="drawing-controls">
        <span>Selected drawings · sound off</span>
        <button onClick={() => setPaused(!paused)}>
          {paused ? 'Play motion' : 'Pause motion'}
        </button>
      </div>
      {status && <p role="status">{status}</p>}
      <canvas
        ref={ref}
        aria-label="Collage of selected drawings: animated beach, television color bars, geometric forms, and moving static, with gradient flower decorations"
      />
    </div>
  );
}
