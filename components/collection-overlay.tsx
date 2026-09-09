'use client';
import { useEffect, useRef, useState } from 'react';
import { Dialog as Primitive } from '@base-ui/react/dialog';
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { ArrowUpRight, X } from 'lucide-react';
import CanvasCollage from '@/components/canvas-collage';
import { libraryItems } from '@/lib/library-data';

type Collection = 'canvas' | 'games' | 'web' | 'index';
const titles = {
  canvas: 'Drawing on the Web',
  games: 'Creative work',
  web: 'Web applications',
  index: 'The library',
};
export default function CollectionOverlay() {
  const [mode, setMode] = useState<Collection | null>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const parse = (hash: string): Collection | null =>
      hash === '#library'
        ? 'index'
        : hash === '#library-canvas'
          ? 'canvas'
          : hash === '#library-games'
            ? 'games'
            : hash === '#library-web'
              ? 'web'
              : null;
    const initial = parse(location.hash);
    if (initial) setMode(initial);
    const click = (event: MouseEvent) => {
      const link = (event.target as Element).closest<HTMLAnchorElement>(
        'a[href]',
      );
      if (
        !link ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey ||
        event.button !== 0
      )
        return;
      const url = new URL(link.href, location.href),
        next = parse(url.hash);
      if (url.origin !== location.origin || !next) return;
      event.preventDefault();
      trigger.current = link;
      setMode(next);
    };
    document.addEventListener('click', click, true);
    return () => document.removeEventListener('click', click, true);
  }, []);
  useEffect(() => {
    if (scroller.current) scroller.current.scrollTop = 0;
  }, [mode]);
  return (
    <Dialog
      open={mode !== null}
      onOpenChange={(open) => {
        if (!open) setMode(null);
      }}
    >
      <DialogPortal>
        <DialogOverlay className="collection-backdrop" />
        <Primitive.Popup
          className={`collection-dialog collection-${mode}`}
          finalFocus={() => {
            trigger.current?.focus({ preventScroll: true });
            return false;
          }}
        >
          <header className="collection-header">
            <div>
              <span className="eyebrow">Franyel / Library</span>
              <DialogTitle>{mode ? titles[mode] : 'Library'}</DialogTitle>
            </div>
            <DialogClose
              className="collection-close"
              aria-label="Close collection"
            >
              <X size={24} />
            </DialogClose>
          </header>
          <div className="collection-body" ref={scroller}>
            <DialogDescription className="sr-only">
              A scrollable collection over the homepage. Close to return to the
              same position.
            </DialogDescription>
            {mode === 'canvas' && <CanvasCollage />}
            {mode === 'games' && (
              <div className="creative-wip">
                <span className="wip-stamp">Work in progress</span>
                <h3>
                  A space for
                  <br />
                  what comes next.
                </h3>
                <p>
                  Drawings, designs, and interactive experiments.
                  <br />
                  New work will be added here.
                </p>
                <span className="wip-index">Collection 02 / In progress</span>
              </div>
            )}
            {mode === 'web' && (
              <div className="web-collection">
                {libraryItems
                  .filter((item) => item.category === 'web')
                  .map((item, i) => (
                    <a
                      key={item.id}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className={`web-entry web-entry-${item.id}`}
                    >
                      <span className="web-entry-number">0{i + 1}</span>
                      <div className="web-entry-mark">
                        {item.id === 'sail' ? (
                          <img
                            src="https://www.sailgtx.com/brand/sail-wordmark.png"
                            alt="SAIL"
                          />
                        ) : item.id === 'studio' ? (
                          <img
                            src="https://aj-studio-fdr.vercel.app/static/images/shopIMG.png"
                            alt="Antonio Jefferson Studio"
                          />
                        ) : (
                          <span className="ink-logo">Ink.</span>
                        )}
                      </div>
                      <div>
                        <span className="eyebrow">
                          {item.id === 'ink'
                            ? 'Personal project'
                            : 'Web development'}
                        </span>
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                        <span className="web-entry-url">
                          {new URL(item.href).hostname}
                        </span>
                      </div>
                      <ArrowUpRight size={26} />
                    </a>
                  ))}
              </div>
            )}
            {mode === 'index' && (
              <div className="collection-index">
                {(['canvas', 'games', 'web'] as const).map((category, i) => (
                  <button key={category} onClick={() => setMode(category)}>
                    <span>0{i + 1}</span>
                    <h3>{titles[category]}</h3>
                    <span>
                      {category === 'games'
                        ? 'Work in progress'
                        : category === 'canvas'
                          ? 'Live canvas collage'
                          : 'Selected websites'}
                    </span>
                    <ArrowUpRight />
                  </button>
                ))}
              </div>
            )}
          </div>
        </Primitive.Popup>
      </DialogPortal>
    </Dialog>
  );
}
