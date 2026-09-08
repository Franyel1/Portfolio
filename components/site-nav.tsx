'use client';
import { useState } from 'react';
import { Menu, ArrowUpRight } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
export default function SiteNav({ current = 'home' }: { current?: string }) {
  const [open, setOpen] = useState(false);
  const items = [
    { label: 'Work', href: '/#glass', active: current === 'glass' },
    { label: 'Library', href: '/library', active: current === 'library' },
    { label: 'About', href: '/#about', active: false },
    { label: 'Contact', href: '/#pixel', active: current === 'pixel' },
  ];
  return (
    <>
      <header className="main-nav">
        <a href="/" className="nav-identity" aria-label="Franyel home">
          <span className="nav-monogram">fd.</span>
          <span>Franyel Diaz Rodriguez</span>
        </a>
        <nav aria-label="Main navigation" className="desktop-nav">
          {items.map((item) => (
            <a
              key={item.label}
              href={item.href}
              aria-current={item.active ? 'page' : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <a
          className="nav-resume"
          href="/resume.pdf"
          target="_blank"
          rel="noreferrer"
        >
          Résumé <ArrowUpRight size={15} />
        </a>
        <button
          className="mobile-nav-toggle"
          aria-label="Open navigation"
          onClick={() => setOpen(true)}
        >
          <Menu size={22} />
        </button>
      </header>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="mobile-navigation">
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription className="sr-only">
            Browse Franyel’s work, project library, and contact details.
          </SheetDescription>
          <nav>
            {items.map((item, i) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
              >
                <span>0{i + 1}</span>
                {item.label}
                <ArrowUpRight size={23} />
              </a>
            ))}
          </nav>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noreferrer"
            className="mobile-resume"
          >
            Open résumé ↗
          </a>
        </SheetContent>
      </Sheet>
    </>
  );
}
