'use client';
import { useEffect } from 'react';

/** Event-driven depth layers extend the portfolio's existing motion system. */
export default function SiteMotion({ paused }: { paused: boolean }) {
  useEffect(() => {
    const site = document.querySelector<HTMLElement>('.site');
    if (!site) return;
    site.classList.add('motion-ready');
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
    const cards = Array.from(site.querySelectorAll<HTMLElement>('[data-tilt]'));
    const scenes = Array.from(
      site.querySelectorAll<HTMLElement>('[data-scene]'),
    )
      .map((el) => ({
        el,
        layers: Array.from(el.querySelectorAll<HTMLElement>('[data-depth]')),
        x: 0,
        y: 0,
        currentX: 0,
        currentY: 0,
      }))
      .filter((scene) => scene.layers.length > 0);
    let frame: number | null = null;
    let card: HTMLElement | null = null;
    let cardX = 0,
      cardY = 0;
    const enabled = () => !paused && !preference.matches && !document.hidden;
    const resetCard = () => {
      card?.style.setProperty('--tilt-x', '0deg');
      card?.style.setProperty('--tilt-y', '0deg');
      card = null;
    };
    const reset = () => {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      resetCard();
      cards.forEach((el) => {
        el.style.setProperty('--tilt-x', '0deg');
        el.style.setProperty('--tilt-y', '0deg');
      });
      scenes.forEach((scene) => {
        scene.x = scene.y = scene.currentX = scene.currentY = 0;
        scene.layers.forEach((layer) => {
          [
            '--depth-x',
            '--depth-y',
            '--depth-scroll',
            '--depth-rx',
            '--depth-ry',
          ].forEach((key) => layer.style.removeProperty(key));
        });
      });
    };
    const render = () => {
      frame = null;
      if (!enabled()) return;
      let settling = false;
      const bounds = scenes.map((scene) => scene.el.getBoundingClientRect());
      scenes.forEach((scene, index) => {
        const rect = bounds[index];
        if (rect.bottom < 0 || rect.top > innerHeight) return;
        scene.currentX += (scene.x - scene.currentX) * 0.12;
        scene.currentY += (scene.y - scene.currentY) * 0.12;
        if (
          Math.abs(scene.x - scene.currentX) +
            Math.abs(scene.y - scene.currentY) >
          0.002
        )
          settling = true;
        const scroll = Math.max(
          -1,
          Math.min(
            1,
            (innerHeight * 0.5 - rect.top - rect.height * 0.5) / innerHeight,
          ),
        );
        scene.layers.forEach((layer) => {
          const depth = Number(layer.dataset.depth) || 0;
          const scale = finePointer.matches ? 1 : 0.4;
          layer.style.setProperty(
            '--depth-x',
            `${scene.currentX * depth * 34}px`,
          );
          layer.style.setProperty(
            '--depth-y',
            `${scene.currentY * depth * 26}px`,
          );
          layer.style.setProperty(
            '--depth-scroll',
            `${scroll * depth * -95 * scale}px`,
          );
          layer.style.setProperty(
            '--depth-rx',
            `${scene.currentY * depth * -9}deg`,
          );
          layer.style.setProperty(
            '--depth-ry',
            `${scene.currentX * depth * 12}deg`,
          );
        });
      });
      if (card) {
        card.style.setProperty('--tilt-x', `${-cardY * 6}deg`);
        card.style.setProperty('--tilt-y', `${cardX * 8}deg`);
      }
      if (settling) frame = requestAnimationFrame(render);
    };
    const schedule = () => {
      if (enabled() && frame === null) frame = requestAnimationFrame(render);
    };
    const move = (event: PointerEvent) => {
      if (!enabled() || !finePointer.matches || event.pointerType !== 'mouse')
        return;
      if (!(event.target instanceof Element)) return;
      const next = event.target.closest<HTMLElement>('[data-tilt]');
      if (card !== next) {
        resetCard();
        card = next;
      }
      if (card) {
        const rect = card.getBoundingClientRect();
        cardX = (event.clientX - rect.left) / rect.width - 0.5;
        cardY = (event.clientY - rect.top) / rect.height - 0.5;
      }
      scenes.forEach((scene) => {
        const rect = scene.el.getBoundingClientRect();
        const inside =
          event.clientY >= rect.top && event.clientY <= rect.bottom;
        scene.x = inside ? (event.clientX - rect.left) / rect.width - 0.5 : 0;
        scene.y = inside ? (event.clientY - rect.top) / rect.height - 0.5 : 0;
      });
      schedule();
    };
    const leave = () => {
      resetCard();
      scenes.forEach((scene) => {
        scene.x = scene.y = 0;
      });
      schedule();
    };
    const sync = () => {
      reset();
      schedule();
    };
    site.addEventListener('pointermove', move, { passive: true });
    site.addEventListener('pointerleave', leave);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    document.addEventListener('visibilitychange', sync);
    preference.addEventListener('change', sync);
    finePointer.addEventListener('change', sync);
    schedule();
    return () => {
      reset();
      site.removeEventListener('pointermove', move);
      site.removeEventListener('pointerleave', leave);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      document.removeEventListener('visibilitychange', sync);
      preference.removeEventListener('change', sync);
      finePointer.removeEventListener('change', sync);
    };
  }, [paused]);
  return null;
}
