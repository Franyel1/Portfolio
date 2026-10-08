'use client';

import { useState } from 'react';
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
    label: 'Work',
    href: '/#glass',
    active: (current: string) => current === 'glass',
  },
  {
    label: 'Library',
    href: '/#canvas',
    active: (current: string) => current === 'canvas',
  },
  {
    label: 'About',
    href: '/#about',
    active: (current: string) => current === 'about',
  },
];

export default function SiteNav({ current = 'sketch' }: { current?: string }) {
  const [open, setOpen] = useState(false);
  const material = current === 'about' ? 'glass' : current;
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <header className="atelier-nav" data-material={material}>
        <div className="atelier-rail">
          <Link
            href="/#sketch"
            className="atelier-identity"
            aria-label="Franyel Diaz Rodriguez home"
          >
            <span className="atelier-monogram" aria-hidden="true">
              fd.
            </span>
            <span className="atelier-name">
              Franyel<span>Diaz Rodriguez</span>
            </span>
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
          <span className="atelier-monogram" aria-hidden="true">
            fd.
          </span>
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
