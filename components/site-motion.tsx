'use client';
import { useEffect } from 'react';
export default function SiteMotion({ paused }: { paused: boolean }) {
  useEffect(() => {
    const site = document.querySelector<HTMLElement>('.site');
    if (!site) return;
    site.classList.add('motion-ready');
    const targets = Array.from(
      site.querySelectorAll<HTMLElement>('[data-tilt]'),
    );
    let frame = 0,
      target: HTMLElement | null = null,
      x = 0,
      y = 0;
    const reset = () => {
      targets.forEach((el) => {
        el.style.setProperty('--tilt-x', '0deg');
        el.style.setProperty('--tilt-y', '0deg');
      });
    };
    const move = (event: PointerEvent) => {
      if (paused || event.pointerType !== 'mouse') return;
      const next = (event.target as Element).closest<HTMLElement>(
        '[data-tilt]',
      );
      if (target !== next) {
        reset();
        target = next;
      }
      if (!next) return;
      const rect = next.getBoundingClientRect();
      x = (event.clientX - rect.left) / rect.width - 0.5;
      y = (event.clientY - rect.top) / rect.height - 0.5;
      if (!frame)
        frame = requestAnimationFrame(() => {
          frame = 0;
          target?.style.setProperty('--tilt-x', `${-y * 7}deg`);
          target?.style.setProperty('--tilt-y', `${x * 9}deg`);
        });
    };
    site.addEventListener('pointermove', move);
    site.addEventListener('pointerleave', reset);
    if (paused) reset();
    return () => {
      cancelAnimationFrame(frame);
      reset();
      site.removeEventListener('pointermove', move);
      site.removeEventListener('pointerleave', reset);
    };
  }, [paused]);
  return null;
}
