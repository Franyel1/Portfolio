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
  const wakeRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    pausedRef.current = paused;
    wakeRef.current?.();
  }, [paused]);
  useEffect(() => {
    const target = ref.current;
    if (!target) return;
    const context = target.getContext('2d');
    if (!context) return;
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    pausedRef.current = preference.matches;
    let disposed = false,
      frame = 0,
      last = 0,
      painted = false,
      dirty = true;
    const scroller = target.closest<HTMLElement>('.collection-body');
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
          (callback: FrameRequestCallback, surface: HTMLCanvasElement) =>
            scheduler.request(callback, surface),
          video,
        );
        let width = 0,
          height = 0,
          narrow = false,
          clipTop = 0,
          clipBottom = 0;
        let visible = new Set<HTMLCanvasElement>();
        const animate = () =>
          !document.hidden && !pausedRef.current && visible.size > 0;
        const schedule = () => {
          if (
            !disposed &&
            width > 0 &&
            !document.hidden &&
            !frame &&
            (dirty || animate())
          )
            frame = requestAnimationFrame(tick);
        };
        const wake = () => {
          cancelAnimationFrame(frame);
          frame = 0;
          syncVideo(animate() && visible.has(artwork.surfaces[4]));
          schedule();
        };
        const measure = () => {
          const nextWidth = target.clientWidth;
          const nextNarrow = nextWidth < 650;
          const nextHeight = nextWidth * collageRatio(nextNarrow);
          if (width !== nextWidth || height !== nextHeight) {
            width = nextWidth;
            height = nextHeight;
            narrow = nextNarrow;
            target.style.aspectRatio = `1 / ${collageRatio(narrow)}`;
            target.width = Math.round(width);
            target.height = Math.round(height);
            painted = false;
          }
          const rect = target.getBoundingClientRect();
          const viewport = scroller?.getBoundingClientRect();
          clipTop = Math.max(0, Math.floor((viewport?.top ?? 0) - rect.top));
          clipBottom = Math.min(
            height,
            Math.ceil((viewport?.bottom ?? innerHeight) - rect.top),
          );
          const layout = collageLayout(narrow);
          visible = new Set(
            artwork.surfaces.filter((source: HTMLCanvasElement, i: number) => {
              const [, y, w, angle] = layout[i];
              const dw = width * w,
                dh = (dw * source.height) / source.width;
              const center = y * height + dh / 2;
              const half =
                (Math.abs(Math.sin(angle)) * dw +
                  Math.abs(Math.cos(angle)) * dh) /
                  2 +
                24;
              return center + half > clipTop && center - half < clipBottom;
            }),
          );
          dirty = true;
          wake();
        };
        const tick = (now: number) => {
          frame = 0;
          if (disposed || document.hidden) return;
          if (width > 0 && (dirty || (animate() && now - last >= 1000 / 30))) {
            if (!painted || (animate() && now - last >= 1000 / 30)) {
              scheduler.step(
                (source: HTMLCanvasElement) => !painted || visible.has(source),
              );
              last = now;
            }
            // Keep one initial full image; subsequent paints touch only the
            // visible scroll viewport. Geometry is cached outside this loop.
            const top = painted ? clipTop : 0;
            const bottom = painted ? clipBottom : height;
            context.save();
            context.beginPath();
            context.rect(0, top, width, Math.max(0, bottom - top));
            context.clip();
            context.clearRect(0, top, width, Math.max(0, bottom - top));
            paintCollage(context, artwork, width, height, narrow);
            context.restore();
            painted = true;
            dirty = false;
          }
          schedule();
        };
        wakeRef.current = wake;
        setPaused(preference.matches);
        observer = new ResizeObserver(measure);
        observer.observe(target);
        if (scroller) observer.observe(scroller);
        scroller?.addEventListener('scroll', measure, { passive: true });
        document.addEventListener('visibilitychange', wake);
        cleanMeasurements = () => {
          scroller?.removeEventListener('scroll', measure);
          document.removeEventListener('visibilitychange', wake);
        };
        setStatus('');
        measure();
      })
      .catch(() => {
        if (!disposed)
          setStatus(
            'The drawings could not load. Please reopen the collection.',
          );
      });
    let observer: ResizeObserver | null = null;
    let cleanMeasurements: (() => void) | null = null;
    const preferenceChanged = () => {
      pausedRef.current = preference.matches;
      setPaused(preference.matches);
      wakeRef.current?.();
    };
    preference.addEventListener('change', preferenceChanged);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      scheduler.clear();
      observer?.disconnect();
      cleanMeasurements?.();
      wakeRef.current = null;
      preference.removeEventListener('change', preferenceChanged);
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
      {status && <output>{status}</output>}
      <canvas
        ref={ref}
        aria-label="Animated collage: beach, television color bars, neon ice cubes, Minecraft grass block and rose, fish and droplets, geometric forms, waves, and static, with gradient flower decorations"
      />
    </div>
  );
}
