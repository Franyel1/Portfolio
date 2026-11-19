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
import dynamic from 'next/dynamic';
import Image from 'next/image';
import WebProjectArt from '@/components/web-project-art';
import { libraryItems } from '@/lib/library-data';

type Collection = 'canvas' | 'games' | 'web' | 'index';
const CanvasCollage = dynamic(() => import('@/components/canvas-collage'), {
  loading: () => <output>Loading drawings…</output>,
});
const titles = {
  canvas: 'Living Sketchbook',
  games: 'Creative work',
  web: 'Web applications',
  index: 'The library',
};
const smallTalkShots = [
  ['pip-lab', 'Pip Lab, choosing a face shape for a new Pip'],
  ['park-chat', 'Zuzu talking to another Pip in the park'],
  ['island-map', 'The island map with every building labeled'],
  ['cafe', 'Two Pips sharing a table at the cafe'],
  ['pipzine', 'Pipzine front page: Zuzu vs Bea'],
  ['pipline', 'A post from Bea on Pipline, the island social feed'],
];

export default function CollectionOverlay({ paused }: { paused: boolean }) {
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
    const initialFrame = requestAnimationFrame(() => {
      const initial = parse(location.hash);
      if (initial) setMode(initial);
    });
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
    return () => {
      cancelAnimationFrame(initialFrame);
      document.removeEventListener('click', click, true);
    };
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
              <>
                <a
                  className="small-talk-entry"
                  data-paused={paused}
                  href="https://franyel1.itch.io/small-talk"
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="small-talk-cover">
                    <Image
                      src="/images/projects/small-talk/cover.png"
                      alt=""
                      width={630}
                      height={500}
                      unoptimized
                    />
                  </div>
                  <div>
                    <Image
                      className="small-talk-logo"
                      src="/images/projects/small-talk/logo.png"
                      alt=""
                      width={51}
                      height={51}
                      unoptimized
                    />
                    <span className="eyebrow">Playdate</span>
                    <h3>Small Talk</h3>
                    <p>A quirky island life sim.</p>
                    <span className="small-talk-link">
                      View on itch.io{' '}
                      <ArrowUpRight size={18} aria-hidden="true" />
                    </span>
                  </div>
                </a>
                <ul
                  className="small-talk-shots"
                  aria-label="Small Talk screenshots"
                >
                  {smallTalkShots.map(([file, alt]) => (
                    <li key={file}>
                      <img
                        src={`/images/projects/small-talk/${file}.webp`}
                        alt={alt}
                        width={808}
                        height={488}
                        loading="lazy"
                      />
                    </li>
                  ))}
                </ul>
              </>
            )}
            {mode === 'web' && (
              <div className="web-collection">
                {libraryItems
                  .filter((item) => item.category === 'web')
                  .map((item) => (
                    <a
                      key={item.id}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className={`web-entry web-entry-${item.id}`}
                    >
                      <div className="web-entry-mark">
                        <WebProjectArt id={item.id} />
                      </div>
                      <div>
                        <span className="eyebrow">
                          {item.id === 'ink'
                            ? 'Private journal'
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
                {(['canvas', 'games', 'web'] as const).map((category) => (
                  <button key={category} onClick={() => setMode(category)}>
                    <h3>{titles[category]}</h3>
                    <span>
                      {category === 'games'
                        ? 'Small Talk'
                        : category === 'canvas'
                          ? 'Live canvas collage'
                          : 'Selected websites'}
                    </span>
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
