'use client';
import { useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  ArrowDown,
  ArrowUp,
  Pause,
  Play,
  Copy,
  Check,
  Code2,
  Mail,
} from 'lucide-react';
import GlassSculpture from '@/components/glass-sculpture';
import PixelLandscape from '@/components/pixel-landscape';
import SiteNav from '@/components/site-nav';
import { libraryItems } from '@/lib/library-data';
import CollectionOverlay from '@/components/collection-overlay';
import WebProjectArt from '@/components/web-project-art';
import AboutWorkbench from '@/components/about-workbench';
import CollectionPreview from '@/components/collection-preview';
import SiteMotion from '@/components/site-motion';
const projects = [
  {
    id: 'sail',
    number: '01',
    name: 'SAIL',
    category: 'Frontend · Motion · Product storytelling',
    tag: '2026',
    summary:
      'Rebuilt the marketing front end with interactive trade visualizations, canvas particles, and original motion content.',
    stack: ['React', 'Next.js', 'Canvas', 'DaVinci Resolve'],
    url: 'https://sailgtx.com',
    link: 'Visit live site',
    role: 'Frontend development & motion content',
    problem:
      'SAIL’s classification and audit workflows needed a visual story that visitors could understand.',
    contribution:
      'Rebuilt the marketing front end and redesigned the homepage. Created a canvas-based particle system, custom SVG charts, and a four-tab decision workspace to explain the product.',
    decision:
      'Paired interactive product visualizations with original video and motion content edited in DaVinci Resolve. Each format explains a different part of the platform.',
    result:
      'Delivered a redesigned marketing experience with interactive feature showcases. Also built an intelligence pipeline to surface ICP-fit leads, competitor activity, and relevant regulatory events.',
  },
  {
    id: 'studio',
    number: '02',
    name: 'Antonio Jefferson Studio',
    category: 'Full-stack · Scheduling · Payments',
    tag: '2025',
    summary:
      'A studio website and booking platform connecting availability, payments, and confirmations.',
    stack: ['Flask', 'MongoDB', 'Stripe', 'Google Calendar'],
    url: 'https://aj-studio-fdr.vercel.app/',
    link: 'Open studio',
    role: 'Full-stack development',
    problem:
      'A studio booking flow needs to connect client choices, live availability, payments, and appointment management.',
    contribution:
      'Built a responsive platform with start and end time selection, add-ons, dynamic pricing, and a live availability view. Integrated Stripe payments, Google Calendar, and automated email confirmations.',
    decision:
      'Connected the booking interface to backend checks that prevent double bookings. Tested the end-to-end flow across scheduling, payment, and confirmation.',
    result:
      'Delivered an integrated booking platform and deployed a test instance on Render. The demo is a test deployment and may take a moment to start.',
  },
  {
    id: 'ink',
    number: '03',
    name: 'Ink.',
    category: 'Personal project · Writing · Product',
    tag: 'PERSONAL',
    summary: 'A personal writing project built around a private feed.',
    stack: ['Personal project', 'Writing'],
    url: 'https://ink-rouge.vercel.app/login',
    link: 'Open Ink',
    role: 'Product and frontend development',
    problem: 'Writing deserves a quieter, more personal place to live.',
    contribution:
      'Built a private writing experience centered on a feed, identity, and the small ritual of returning to the page.',
    decision:
      'Kept the interface focused on reading and writing, with authentication protecting the personal space.',
    result:
      'A live personal project, ready to evolve as the writing system grows.',
  },
];
export default function Home() {
  const [paused, setPaused] = useState(false),
    [copied, setCopied] = useState(false),
    [copyError, setCopyError] = useState(false),
    [active, setActive] = useState('sketch');
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setPaused(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const sections = Array.from(
      el.querySelectorAll<HTMLElement>('section[data-chapter]'),
    );
    const reveals = Array.from(
      el.querySelectorAll<HTMLElement>('[data-reveal]'),
    );
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            observer.unobserve(e.target);
          }
        }),
      { threshold: 0.08 },
    );
    reveals.forEach((e) => observer.observe(e));
    let frame = 0;
    const update = () => {
      frame = 0;
      let current = 'sketch';
      sections.forEach((section) => {
        const r = section.getBoundingClientRect();
        if (r.top < innerHeight * 0.48) current = section.id;
      });
      setActive(current);
      if (!paused) {
        el.querySelectorAll<HTMLElement>('[data-parallax]').forEach((item) => {
          const r = item.parentElement!.getBoundingClientRect();
          if (r.bottom > 0 && r.top < innerHeight)
            item.style.setProperty(
              '--parallax',
              `${Math.max(-45, Math.min(45, (innerHeight * 0.5 - r.top - r.height * 0.5) * 0.075))}px`,
            );
        });
        el.querySelectorAll<HTMLElement>('.material-transition').forEach(
          (item) => {
            const r = item.getBoundingClientRect();
            item.style.setProperty(
              '--phase',
              String(
                Math.max(
                  0,
                  Math.min(1, (innerHeight - r.top) / (innerHeight + r.height)),
                ),
              ),
            );
          },
        );
      }
    };
    const scroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    addEventListener('scroll', scroll, { passive: true });
    addEventListener('resize', scroll);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      removeEventListener('scroll', scroll);
      removeEventListener('resize', scroll);
    };
  }, [paused]);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText('fd2190@nyu.edu');
      setCopied(true);
      setCopyError(false);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopyError(true);
    }
  };
  return (
    <div
      ref={root}
      className={paused ? 'site motion-paused' : 'site'}
      data-active={active}
    >
      <a className="skip" href="#main">
        Skip to content
      </a>
      <SiteNav current={active} />
      <button
        className="motion-control"
        onClick={() => setPaused(!paused)}
        aria-label={paused ? 'Enable animation' : 'Pause animation'}
        title={paused ? 'Enable animation' : 'Pause animation'}
      >
        {paused ? <Play size={14} /> : <Pause size={14} />}
        <span>{paused ? 'Motion off' : 'Motion on'}</span>
      </button>
      <CollectionOverlay />
      <SiteMotion paused={paused} />
      <main id="main">
        <section className="sketch" id="sketch" data-chapter>
          <div className="wrap">
            <div className="hero typography-hero">
              <div className="eyebrow hero-kicker">
                <span className="status-dot" /> Developer & creative coder
              </div>
              <div className="name-study">
                <div className="type-guides" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </div>
                <h1 className="sketched-name" aria-label="Franyel">
                  <span className="name-outline" aria-hidden="true">
                    Franyel.
                  </span>
                  <span className="name-ink" aria-hidden="true">
                    Franyel<span className="name-period">.</span>
                  </span>
                </h1>
              </div>
              <div className="hero-introduction">
                <p className="hero-subtitle">
                  Web development.
                  <br />
                  Interactive work.
                </p>
                <div>
                  <p className="hero-description">
                    I’m Franyel Diaz Rodriguez, a computer science graduate from
                    NYU. I build web applications, canvas experiments, and
                    games.
                  </p>
                  <div className="hero-actions">
                    <a className="ink-button" href="#glass">
                      Explore my work <ArrowUpRight size={18} />
                    </a>
                    <a className="text-link" href="#library">
                      Browse the library
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="canvas-chapter" id="canvas" data-chapter>
          <div className="canvas-texture" aria-hidden="true" />
          <div className="wrap canvas-content">
            <div className="intro-row" data-reveal>
              <div>
                <span className="eyebrow">Creative work</span>
                <h2 className="chapter-title">The library.</h2>
              </div>
            </div>
            <div className="study-grid collection-grid">
              {[
                {
                  id: 'canvas',
                  n: '01',
                  title: 'Living Sketchbook',
                  type: 'JavaScript / Canvas / SVG',
                  mark: 'Canvas',
                },
                {
                  id: 'games',
                  n: '02',
                  title: 'Creative work',
                  type: 'Drawings / Design / Interactive',
                  mark: 'WIP',
                },
                {
                  id: 'web',
                  n: '03',
                  title: 'Web applications',
                  type: 'Frontend / Full-stack',
                  mark: 'Web',
                },
              ].map((item, i) => (
                <a
                  data-reveal
                  data-tilt
                  className={`study-card study-${i}`}
                  href={`#library-${item.id}`}
                  key={item.id}
                >
                  <div className="study-top">
                    <span className="eyebrow">{item.n}</span>
                    <ArrowUpRight size={22} />
                  </div>
                  <CollectionPreview category={item.id} />
                  <span className="eyebrow study-medium">{item.type}</span>
                  <h3>{item.title}</h3>
                  <span className="study-open">
                    {item.id === 'games' ? (
                      'Work in progress'
                    ) : item.id === 'canvas' ? (
                      'Open canvas collage'
                    ) : (
                      <>
                        {
                          libraryItems.filter(
                            (work) => work.category === item.id,
                          ).length
                        }{' '}
                        websites
                      </>
                    )}{' '}
                    <ArrowUpRight size={16} />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
        <section className="glass-chapter dark" id="glass" data-chapter>
          <div className="glass-light" aria-hidden="true" />
          <div className="wrap glass-content">
            <div className="glass-intro" data-reveal>
              <div>
                <span className="eyebrow">Web development / 2025—2026</span>
                <h2 className="chapter-title">
                  Selected
                  <br />
                  <em>projects.</em>
                </h2>
                <p>
                  Marketing websites, booking tools, and a personal writing app.
                </p>
                <a href="#selected-work" className="glass-down">
                  <ArrowDown size={18} /> Selected work
                </a>
              </div>
              <GlassSculpture paused={paused} />
            </div>
            <div className="work-heading" id="selected-work">
              <span className="eyebrow">Three projects</span>
              <span className="eyebrow">Design · Development · Motion</span>
            </div>
            <div className="project-list">
              {projects.map((p) => (
                <article
                  data-tilt
                  className={`project-card project-${p.id}`}
                  key={p.id}
                  data-reveal
                >
                  <a
                    className="project-visual-button"
                    aria-label={`Visit ${p.name}`}
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <WebProjectArt id={p.id} />
                  </a>
                  <div className="project-copy">
                    <div className="project-meta eyebrow">
                      <span>
                        {p.number} / {p.category}
                      </span>
                      <span>{p.tag}</span>
                    </div>
                    <h3>{p.name}</h3>
                    <p>{p.summary}</p>
                    <div className="tags">
                      {p.stack.map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                    </div>
                    <a
                      className="case-link"
                      href={p.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {p.link} <ArrowUpRight size={19} />
                    </a>
                  </div>
                </article>
              ))}
            </div>
            <AboutWorkbench />
          </div>
        </section>
        <section className="pixel-chapter" id="pixel" data-chapter>
          <PixelLandscape paused={paused} />
          <div className="wrap pixel-content" data-reveal>
            <span className="eyebrow">Contact</span>
            <span className="pixel-small">CONTACT</span>
            <h2>
              Get in
              <br />
              <span>touch.</span>
            </h2>
            <p>Get in touch about projects and opportunities.</p>
            <div className="pixel-actions">
              <a href="mailto:fd2190@nyu.edu" className="pixel-button">
                <Mail size={18} /> Say hello <ArrowUpRight size={18} />
              </a>
              <button className="copy-button" onClick={copy}>
                {copied ? <Check size={18} /> : <Copy size={18} />}
                <span aria-live="polite">
                  {copied ? 'Email copied!' : 'Copy email'}
                </span>
              </button>
            </div>
            {copyError && (
              <p className="copy-fallback" role="status">
                Copy this address: fd2190@nyu.edu
              </p>
            )}
            <div className="pixel-links">
              <a
                href="https://github.com/Franyel1"
                target="_blank"
                rel="noreferrer"
              >
                <Code2 size={17} /> GitHub ↗
              </a>
              <a href="/resume.pdf" target="_blank" rel="noreferrer">
                Résumé ↗
              </a>
            </div>
            <footer>
              <span>© {new Date().getFullYear()} Franyel Diaz Rodriguez</span>
              <a href="#sketch">
                Back to the sketch <ArrowUp size={15} />
              </a>
            </footer>
          </div>
        </section>
      </main>
    </div>
  );
}
