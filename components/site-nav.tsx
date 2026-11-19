'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from '@/components/ui/sheet';

const navItems = [
  {
    label: 'Library',
    href: '/#canvas',
    active: (current: string) => current === 'canvas',
  },
  {
    label: 'Projects',
    href: '/#glass',
    active: (current: string) => current === 'glass',
  },
  {
    label: 'About',
    href: '/#about',
    active: (current: string) => current === 'about',
  },
];

// fd. written as one pen line; the dot takes the chapter's accent colour.
function Signature() {
  return (
    <svg
      className="atelier-monogram"
      viewBox="0 0 66 60"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path
        className="sig-f"
        pathLength={1}
        d="M31 13C30 6 22 4 19.5 11.5C17 20 17 38 13 50C11 56 5.5 57 5 52.5"
      />
      <path
        className="sig-d"
        pathLength={1}
        d="M9 28.5C20 27 33 26.5 44.5 30C37 25 27 29 27.5 37.5C28 44 36 42.5 41 35C45 27 46 14 48 6C46 18 44 32 45 38.5C45.6 42.5 49 42 52 38.5"
      />
      <path
        className="sig-dot"
        d="M59.5 39L63.37 37.36A4.2 4.2 0 1 1 61.14 35.13Z"
        fill="var(--nav-accent)"
        stroke="none"
      />
    </svg>
  );
}

export default function SiteNav({ current = 'sketch' }: { current?: string }) {
  const [open, setOpen] = useState(false);
  const material = current === 'about' ? 'glass' : current;
  // The logo re-signs itself the first time each material comes into view.
  const seen = useRef(new Set<string>());
  const [redraw, setRedraw] = useState<string | null>(null);
  useEffect(() => {
    if (seen.current.has(material)) return;
    seen.current.add(material);
    setRedraw(material);
    const done = window.setTimeout(() => setRedraw(null), 1600);
    return () => window.clearTimeout(done);
  }, [material]);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <header className="atelier-nav" data-material={material}>
        <div className="atelier-rail">
          <Link
            href="/#sketch"
            className="atelier-identity"
            aria-label="Franyel Diaz Rodriguez home"
            data-redraw={redraw ? '' : undefined}
          >
            <Signature key={redraw ?? 'still'} />
          </Link>
          <nav aria-label="Main navigation" className="atelier-links">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                aria-current={item.active(current) ? 'location' : undefined}
              >
                <span className="atelier-label">{item.label}</span>
                <svg
                  className="atelier-mark"
                  viewBox="0 0 100 12"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path d="M3 8 Q25 2 51 6 T97 4 M12 10 Q54 5 88 8" />
                </svg>
              </Link>
            ))}
          </nav>
          <a
            className="atelier-resume"
            href="/resume.pdf"
            target="_blank"
            rel="noreferrer"
          >
            <span>Résumé</span>
          </a>
          <SheetTrigger className="atelier-menu" aria-label="Open navigation">
            <Menu size={21} aria-hidden="true" />
          </SheetTrigger>
        </div>
      </header>
      <SheetContent className="atelier-drawer" data-material={material}>
        <div className="atelier-drawer-heading">
          <Signature />
          <SheetTitle>Explore the portfolio</SheetTitle>
        </div>
        <SheetDescription className="sr-only">
          Five chapters of code, color, and curiosity.
        </SheetDescription>
        <nav aria-label="Mobile navigation">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              aria-current={item.active(current) ? 'location' : undefined}
              onClick={() => setOpen(false)}
            >
              <span className="atelier-drawer-label">{item.label}</span>
            </Link>
          ))}
        </nav>
        <a
          className="atelier-drawer-resume"
          href="/resume.pdf"
          target="_blank"
          rel="noreferrer"
        >
          Open résumé
        </a>
      </SheetContent>
    </Sheet>
  );
}
