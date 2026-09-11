'use client';
import { useEffect, useRef, useState } from 'react';
import {
  artworkAssets,
  createArtwork,
  paintCollage,
  collageLayout,
  collageRatio,
} from '@/lib/curated-collage';
import { createCollageScheduler } from '@/lib/collage-scheduler';

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
    const scheduler = createCollageScheduler();
    const video = document.createElement('video');
    video.muted = true;
    video.defaultMuted = true;
    video.volume = 0;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'none';
    video.src = '/projects/drawing-selected/fish/fish.mp4';
    let wantsVideo = false,
      videoAttempted = false;
    const syncVideo = (visible: boolean) => {
      if (visible === wantsVideo && (visible ? videoAttempted : true)) return;
      wantsVideo = visible;
      if (visible) {
        videoAttempted = true;
        video
          .play()
          .then(() => {
            if (disposed || !wantsVideo) video.pause();
          })
          .catch(() => {});
      } else {
        video.pause();
        videoAttempted = false;
      }
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
        const artwork = createArtwork(
          makeCanvas,
          images,
          scheduler.request,
          video,
        );
        const tick = (now: number) => {
          if (disposed) return;
          const width = target.clientWidth,
            narrow = width < 650;
          const height = width * collageRatio(narrow);
          const rect = target.getBoundingClientRect();
          const layout = collageLayout(narrow);
          const visible = new Set(
            artwork.surfaces.filter((source: HTMLCanvasElement, i: number) => {
              const [, y, w] = layout[i],
                top = rect.top + y * height;
              const bottom = top + (width * w * source.height) / source.width;
              return bottom > 0 && top < innerHeight;
            }),
          );
          syncVideo(
            !document.hidden &&
              !pausedRef.current &&
              visible.has(artwork.surfaces[4]),
          );
          if (
            !document.hidden &&
            now - last >= 1000 / 30 &&
            (!pausedRef.current || !painted)
          ) {
            scheduler.step(
              (source: HTMLCanvasElement) => !painted || visible.has(source),
            );
            const dpr = Math.min(devicePixelRatio, 1.5);
            target.style.aspectRatio = `1 / ${collageRatio(narrow)}`;
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
    const visibilityChanged = () => {
      if (document.hidden) syncVideo(false);
    };
    document.addEventListener('visibilitychange', visibilityChanged);
    observer.observe(target);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      scheduler.clear();
      observer.disconnect();
      document.removeEventListener('visibilitychange', visibilityChanged);
      wantsVideo = false;
      video.pause();
      video.removeAttribute('src');
      video.load();
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
        aria-label="Animated collage: beach, television color bars, neon ice cubes, Minecraft grass block and rose, fish and droplets, geometric forms, waves, and static, with gradient flower decorations"
      />
    </div>
  );
}
