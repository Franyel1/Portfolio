'use client';
import { useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  ArrowLeft,
  Play,
  RotateCcw,
  Maximize2,
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import SiteNav from '@/components/site-nav';
import { libraryItems, type LibraryItem } from '@/lib/library-data';
const categories = [
  { id: 'all', label: 'All work' },
  { id: 'canvas', label: 'Drawing on the Web' },
  { id: 'games', label: 'Interactive' },
  { id: 'web', label: 'Web applications' },
];
function ProjectPlayer({ item }: { item: LibraryItem }) {
  const [playing, setPlaying] = useState(false),
    [restart, setRestart] = useState(0),
    [scale, setScale] = useState(1);
  const stage = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!stage.current) return;
    const observer = new ResizeObserver(([e]) =>
      setScale(Math.min(1, e.contentRect.width / (item.width ?? 1000))),
    );
    observer.observe(stage.current);
    return () => observer.disconnect();
  }, [item]);
  return (
    <>
      <div
        ref={stage}
        className="project-stage"
        style={{
          minHeight: playing
            ? Math.max(300, (item.height ?? 700) * scale)
            : 330,
        }}
      >
        {playing ? (
          <iframe
            key={restart}
            title={item.title}
            src={item.href}
            sandbox="allow-scripts allow-same-origin allow-pointer-lock"
            allow="autoplay; fullscreen"
            style={{
              width: item.width ?? 1000,
              height: item.height ?? 700,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          />
        ) : (
          <button className="launch-project" onClick={() => setPlaying(true)}>
            <Play size={32} />
            <span>Run {item.title}</span>
          </button>
        )}
      </div>
      <div className="player-tools">
        <p>{item.controls}</p>
        {playing && (
          <button onClick={() => setRestart(restart + 1)}>
            <RotateCcw size={16} />
            Restart
          </button>
        )}
        <a href={item.href} target="_blank" rel="noreferrer">
          <Maximize2 size={16} />
          Open separately
        </a>
      </div>
    </>
  );
}
export default function Library() {
  const [category, setCategory] = useState('all'),
    [selected, setSelected] = useState<LibraryItem | null>(null);
  useEffect(() => {
    const sync = () => {
      const hash = decodeURIComponent(location.hash.slice(1));
      const item = libraryItems.find((i) => i.id === hash);
      if (item) {
        setSelected(item);
        setCategory(item.category);
      } else {
        setSelected(null);
        setCategory(categories.some((c) => c.id === hash) ? hash : 'all');
      }
    };
    sync();
    addEventListener('hashchange', sync);
    return () => removeEventListener('hashchange', sync);
  }, []);
  const select = (item: LibraryItem) => {
    location.hash = item.id;
    setSelected(item);
  };
  return (
    <div className="library-page">
      <SiteNav current="library" />
      <main className="library-main">
        <a href="/" className="library-back">
          <ArrowLeft size={16} />
          Home
        </a>
        <div className="library-heading">
          <div>
            <span className="eyebrow">Franyel Diaz Rodriguez</span>
            <h1>
              Library<span>.</span>
            </h1>
          </div>
          <p>Canvas, games, and web applications.</p>
        </div>
        <Tabs
          value={category}
          onValueChange={(value) => {
            setCategory(String(value));
            history.replaceState(null, '', `#${value}`);
          }}
        >
          <TabsList className="library-tabs" variant="line">
            {categories.map((c) => (
              <TabsTrigger key={c.id} value={c.id}>
                {c.label}
                <span>
                  {
                    libraryItems.filter(
                      (i) => c.id === 'all' || i.category === c.id,
                    ).length
                  }
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
          {categories.map((c) => (
            <TabsContent value={c.id} key={c.id}>
              <div className="library-grid">
                {libraryItems
                  .filter((i) => c.id === 'all' || i.category === c.id)
                  .map((item, i) => (
                    <button
                      className={`library-card library-${item.category}`}
                      key={item.id}
                      onClick={() => select(item)}
                    >
                      <div className="library-card-image">
                        {item.image ? (
                          <img src={item.image} alt="" loading="lazy" />
                        ) : (
                          <span className="library-card-word">
                            {item.title}
                          </span>
                        )}
                        <span className="library-card-number">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="library-card-launch">
                          {item.local ? (
                            <Play size={20} />
                          ) : (
                            <ArrowUpRight size={23} />
                          )}
                        </span>
                      </div>
                      <div className="library-card-copy">
                        <span className="eyebrow">{item.medium}</span>
                        <h2>{item.title}</h2>
                        <p>{item.description}</p>
                      </div>
                    </button>
                  ))}
              </div>
              {!libraryItems.some(
                (i) => c.id === 'all' || i.category === c.id,
              ) && (
                <p className="library-empty">
                  No projects in this category yet.
                </p>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </main>
      <Dialog
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) {
            setSelected(null);
            history.replaceState(null, '', `#${category}`);
          }
        }}
      >
        <DialogContent className="library-detail">
          {selected && (
            <>
              <span className="eyebrow">{selected.medium}</span>
              <DialogTitle className="library-detail-title">
                {selected.title}
              </DialogTitle>
              <DialogDescription className="library-detail-description">
                {selected.description}
              </DialogDescription>
              {selected.local ? (
                <ProjectPlayer key={selected.id} item={selected} />
              ) : (
                <a
                  className="ink-button library-external"
                  href={selected.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {selected.sourceLabel}
                  <ArrowUpRight size={18} />
                </a>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function LibraryOverlay() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const sync = () =>
      setOpen(
        location.hash === '#library' || location.hash.startsWith('#library-'),
      );
    sync();
    addEventListener('hashchange', sync);
    return () => removeEventListener('hashchange', sync);
  }, []);
  if (!open) return null;
  return (
    <div
      className="library-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Project library"
    >
      <button
        className="library-overlay-close"
        onClick={() => {
          history.replaceState(null, '', '#canvas');
          setOpen(false);
        }}
      >
        Close ×
      </button>
      <div className="library-overlay-inner">
        <span className="eyebrow">Franyel Diaz Rodriguez / Library</span>
        <h2>
          Things I make<span>.</span>
        </h2>
        <div className="overlay-collage">
          {libraryItems.map((item, i) => (
            <a
              key={item.id}
              href={item.local ? `/library#${item.id}` : item.href}
              target={item.local ? undefined : '_blank'}
              rel={item.local ? undefined : 'noreferrer'}
              className={`overlay-tile tile-${i % 6}`}
            >
              {item.image ? (
                <img src={item.image} alt="" />
              ) : (
                <span>{item.title}</span>
              )}
              <small>
                {item.category === 'games'
                  ? 'Interactive'
                  : item.category === 'canvas'
                    ? 'Drawing on the Web'
                    : 'Web application'}
              </small>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
