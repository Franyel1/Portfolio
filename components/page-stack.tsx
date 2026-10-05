'use client';

import { useEffect } from 'react';

/** Keep chapter anchors in normal flow; lift only their visual surfaces. */
export default function PageStack({ paused }: { paused: boolean }) {
  useEffect(() => {
    const site = document.querySelector<HTMLElement>('.site');
    if (!site) return;
    const pages = Array.from(
      site.querySelectorAll<HTMLElement>('.chapter-page'),
    );
    const surfaces = pages.map((page) =>
      page.querySelector<HTMLElement>('.page-surface')!,
    );
    const anchors = surfaces.map((surface) =>
      Array.from(surface.querySelectorAll<HTMLElement>('[id]')),
    );
    const native = CSS.supports('animation-timeline: --sheet-entry');
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    let frame: number | null = null;
    let positions: number[] = [];
    let offsets: number[] = [];
    let needsMeasure = true;
    let ready = false;
    const enabled = () => !paused && !preference.matches;
    const reset = () => {
      site.classList.remove('pages-ready', 'pages-native');
      ready = false;
      offsets = [];
      surfaces.forEach((surface, index) => {
        surface.style.removeProperty('transform');
        anchors[index].forEach((anchor) =>
          anchor.style.removeProperty('scroll-margin-top'),
        );
      });
    };
    const update = () => {
      frame = null;
      if (!enabled()) {
        reset();
        return;
      }
      const height = window.innerHeight;
      const scroll = window.scrollY;
      if (needsMeasure) {
        // Layout is stable during scrolling. Measure only after actual reflow.
        positions = pages.map(
          (page) => page.getBoundingClientRect().top + scroll,
        );
        needsMeasure = false;
      }
      if (!ready) {
        site.classList.add('pages-ready');
        site.classList.toggle('pages-native', native);
        ready = true;
      }
      surfaces.forEach((surface, index) => {
        const top = positions[index] - scroll;
        const distance = Math.max(0, Math.min(height, top));
        // Match sheet-reveal's quadratic handoff: velocity joins native scroll
        // continuously in the last 20% of entry, instead of an abrupt release.
        const offset =
          index === 0
            ? 0
            : distance < height * 0.2
              ? -(distance * distance) / (height * 0.4)
              : height * 0.1 - distance;
        const fallbackOffset = top >= height ? 0 : offset;
        const nextOffset = native ? offset : fallbackOffset;
        if (offsets[index] === nextOffset) return;
        offsets[index] = nextOffset;
        // Supported browsers animate transforms entirely through the timeline.
        if (!native)
          surface.style.transform = `translate3d(0, ${nextOffset}px, 0)`;
        // Update only nested anchor margins, not inherited variables across
        // every descendant. Root scroll-padding supplies navigation clearance.
        anchors[index].forEach((anchor) => {
          anchor.style.scrollMarginTop = `${nextOffset}px`;
        });
      });
    };
    const schedule = () => {
      if (frame === null) frame = requestAnimationFrame(update);
    };
    const measure = () => {
      needsMeasure = true;
      schedule();
    };
    // Focused links and controls must never remain covered by a preceding sheet.
    const focus = (event: FocusEvent) => {
      if (!enabled() || !(event.target instanceof HTMLElement)) return;
      if (!event.target.matches(':focus-visible')) return;
      const page = event.target.closest<HTMLElement>('.chapter-page');
      if (
        page &&
        page.getBoundingClientRect().top > 0 &&
        page.getBoundingClientRect().top < innerHeight
      ) {
        window.scrollBy({
          top: page.getBoundingClientRect().top,
          behavior: 'instant',
        });
        schedule();
      }
    };
    const resize = new ResizeObserver(measure);
    pages.forEach((page) => resize.observe(page));
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', measure);
    preference.addEventListener('change', schedule);
    site.addEventListener('focusin', focus);
    update();
    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', measure);
      preference.removeEventListener('change', schedule);
      site.removeEventListener('focusin', focus);
      reset();
    };
  }, [paused]);
  return null;
}
