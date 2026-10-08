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
    const native =
      CSS.supports('animation-timeline: --sheet-entry') &&
      CSS.supports('animation-range: entry 0% entry 100%');
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
      surfaces.forEach((surface) => {
        surface.style.removeProperty('transform');
        surface.style.removeProperty('rotate');
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
      if (needsMeasure && !native) {
        // Layout is stable during scrolling. Measure only after actual reflow.
        const boxes = pages.map((page) => page.getBoundingClientRect());
        positions = boxes.map((box) => box.top + scroll);
        needsMeasure = false;
      }
      if (!ready) {
        site.classList.add('pages-ready');
        site.classList.toggle('pages-native', native);
        ready = true;
      }
      // Native timelines need no JavaScript work while scrolling.
      if (native) return;
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
        const nextOffset = top >= height ? 0 : offset;
        if (offsets[index] === nextOffset) return;
        offsets[index] = nextOffset;
        // Supported browsers animate transforms entirely through the timeline.
        surface.style.transform = nextOffset
          ? `translateY(${nextOffset}px)`
          : 'none';
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
    // Resolve chapter links against layout, rather than a translated surface.
    // This replaces per-scroll anchor-style writes, including for repeated links.
    const navigate = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest<HTMLAnchorElement>('a[href]');
      if (!link || link.target || link.hasAttribute('download')) return;
      const url = new URL(link.href, location.href);
      if (
        url.origin !== location.origin ||
        url.pathname !== location.pathname ||
        !url.hash
      )
        return;
      const target = document.getElementById(
        decodeURIComponent(url.hash.slice(1)),
      );
      if (!target?.closest('.chapter-page')) return;
      event.preventDefault();
      let top = 0;
      let node: HTMLElement | null = target;
      while (node) {
        top += node.offsetTop;
        node = node.offsetParent as HTMLElement | null;
      }
      const padding =
        parseFloat(
          getComputedStyle(document.documentElement).scrollPaddingTop,
        ) || 0;
      if (location.hash !== url.hash) history.pushState(null, '', url.hash);
      window.scrollTo({
        top: top - padding,
        behavior: enabled() ? 'smooth' : 'instant',
      });
    };
    const resize = native ? null : new ResizeObserver(measure);
    if (resize) {
      pages.forEach((page) => resize.observe(page));
      window.addEventListener('scroll', schedule, { passive: true });
      window.addEventListener('resize', measure);
    }
    document.addEventListener('click', navigate, true);
    preference.addEventListener('change', schedule);
    site.addEventListener('focusin', focus);
    update();
    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      resize?.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', measure);
      preference.removeEventListener('change', schedule);
      site.removeEventListener('focusin', focus);
      document.removeEventListener('click', navigate, true);
      reset();
    };
  }, [paused]);
  return null;
}
