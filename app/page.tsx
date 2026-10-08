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
import MagicEightBall from '@/components/magic-eight-ball';
import PixelLandscape from '@/components/pixel-landscape';
import SiteNav from '@/components/site-nav';
import { libraryItems } from '@/lib/library-data';
import CollectionOverlay from '@/components/collection-overlay';
import WebProjectArt from '@/components/web-project-art';
import AboutWorkbench from '@/components/about-workbench';
import CollectionPreview from '@/components/collection-preview';
import SiteMotion from '@/components/site-motion';
import PageStack from '@/components/page-stack';
import MaterialEdge from '@/components/material-edge';
const projects = [
  {
    id: 'sail',
    name: 'SAIL',
    category: 'Frontend · Motion · Product storytelling',
    tag: '2026',
    summary:
      'Rebuilt the marketing site with interactive trade visualizations, canvas particles, and original motion content.',
    stack: ['React', 'Next.js', 'Canvas', 'DaVinci Resolve'],
    url: 'https://sailgtx.com',
    link: 'Visit live site',
    role: 'Frontend development & motion content',
    problem:
      'SAIL’s classification and audit tools needed a clearer way to show visitors what the product does.',
    contribution:
      'Rebuilt the marketing site and redesigned the homepage. Made a canvas particle system, custom SVG charts, and a four-tab decision workspace to explain the product.',
    decision:
      'Used interactive product visuals alongside video and motion pieces edited in DaVinci Resolve. Each one covers a different part of the platform.',
    result:
      'Shipped a redesigned marketing site with interactive feature demos. I also built a pipeline for finding ICP-fit leads, competitor activity, and relevant regulatory updates.',
  },
  {
    id: 'studio',
    name: 'Antonio Jefferson Studio',
    category: 'Full-stack · Scheduling · Payments',
    tag: '2025',
    summary:
      'A studio site and booking platform that handles availability, payments, and confirmations.',
    stack: ['Flask', 'MongoDB', 'Stripe', 'Google Calendar'],
    url: 'https://aj-studio-fdr.vercel.app/',
    link: 'Open studio',
    role: 'Full-stack development',
    problem:
      'The booking flow needed to bring together client choices, live availability, payments, and appointment management.',
    contribution:
      'Built a responsive platform with start and end times, add-ons, dynamic pricing, and live availability. Connected Stripe, Google Calendar, and automated email confirmations.',
    decision:
      'Added backend checks to prevent double bookings, then tested the flow from scheduling through payment and confirmation.',
    result:
      'Shipped the booking platform and deployed a test version on Render. It may take a moment to start.',
  },
  {
    id: 'ink',
    name: 'Ink.',
    category: 'Private journal · Full-stack · Product',
    tag: 'PERSONAL',
    summary:
      'A private journal that helps turn everyday writing into a searchable record of your life.',
    stack: ['Full-stack', 'AI', 'Offline-first', 'Semantic search'],
    url: 'https://ink-rouge.vercel.app/login',
    link: 'Open Ink',
    role: 'Product design & full-stack development',
    problem:
      'Traditional journals save entries but make it hard to trace the people, goals, memories, and recurring themes that build up over time.',
    contribution:
      'Designed and built the full product: a timeline for text and photos, guided reflections, goals, future letters, people records, recaps, prompts, semantic search, offline writing, automatic sync, and memory controls.',
    decision:
      'Made it feel like a personal social feed with no audience. The assistive features organize context and surface patterns while the writer stays in control.',
    result:
      'A notebook that helps people revisit their story while keeping them in control of what it remembers.',
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
    let positions: number[] = [];
    let aboutPosition = Infinity;
    let needsMeasure = true;
    let previous = '';
    const about = el.querySelector<HTMLElement>('#about');
    const glassIndex = sections.findIndex((section) => section.id === 'glass');
    const pixelIndex = sections.findIndex((section) => section.id === 'pixel');
    const update = () => {
      frame = 0;
      let current = 'sketch';
      if (needsMeasure) {
        positions = sections.map(
          (section) => section.getBoundingClientRect().top + scrollY,
        );
        // About is laid out inside the glass surface; ignore its reveal transform.
        aboutPosition = about
          ? positions[glassIndex] + about.offsetTop
          : Infinity;
        needsMeasure = false;
      }
      const threshold = scrollY + innerHeight * 0.48;
      sections.forEach((section, index) => {
        if (positions[index] < threshold) current = section.id;
      });
      if (aboutPosition < threshold && positions[pixelIndex] >= threshold)
        current = 'about';
      if (previous !== current) {
        previous = current;
        setActive(current);
      }
    };
    const scroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const measure = () => {
      needsMeasure = true;
      scroll();
    };
    const resize = new ResizeObserver(measure);
    resize.observe(el);
    update();
    addEventListener('scroll', scroll, { passive: true });
    addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      resize.disconnect();
      cancelAnimationFrame(frame);
      removeEventListener('scroll', scroll);
      removeEventListener('resize', measure);
    };
  }, []);
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
      <PageStack paused={paused} />
      <main id="main">
        <section className="chapter-page" id="sketch" data-chapter>
          <div className="page-surface paper-sheet">
            <div className="sketch" data-scene>
              <div className="wrap">
                <div className="hero typography-hero">
                  <div className="hero-edition">
                    <span className="eyebrow">Developer & creative coder</span>
                  </div>
                  <div className="hero-stage">
                    <div className="name-study depth-layer" data-depth="-0.15">
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
                  </div>
                  <div className="hero-introduction">
                    <p className="hero-subtitle">
                      Web development.
                      <br />
                      Interactive work.
                    </p>
                    <div>
                      <p className="hero-description">
                        I’m Franyel Diaz Rodriguez, a computer science graduate
                        from NYU. I build web applications, canvas experiments,
                        and games.
                      </p>
                      <div className="hero-actions">
                        <a className="ink-button" href="#glass">
                          Explore my work
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="hero-colophon">
                    <a href="#canvas">
                      Scroll to explore <ArrowDown size={15} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <MaterialEdge material="paper" />
          </div>
        </section>
        <section className="chapter-page" id="canvas" data-chapter>
          <div className="page-surface paint-sheet">
            <div className="canvas-chapter" data-scene>
              <div className="canvas-texture" aria-hidden="true" />
              <div className="wrap canvas-content">
                <div className="intro-row" data-reveal>
                  <div>
                    <h2 className="chapter-title">Library</h2>
                  </div>
                </div>
                <div className="study-grid collection-grid">
                  {[
                    {
                      id: 'canvas',
                      title: 'Living Sketchbook',
                      type: 'JavaScript / Canvas / SVG',
                      mark: 'Canvas',
                    },
                    {
                      id: 'games',
                      title: 'Creative work',
                      type: 'Drawings / Design / Interactive',
                      mark: 'WIP',
                    },
                    {
                      id: 'web',
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
                      <div className="study-top" />
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
                        )}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <MaterialEdge material="paint" />
          </div>
        </section>
        <section className="chapter-page" id="glass" data-chapter>
          <div className="page-surface glass-sheet">
            <div className="glass-chapter dark" data-scene>
              <div className="glass-light" aria-hidden="true" />
              <div className="wrap glass-content">
                <div className="glass-intro" data-reveal>
                  <div>
                    <h2 className="chapter-title">Projects</h2>
                    <a href="#selected-work" className="glass-down">
                      <ArrowDown size={18} /> Selected work
                    </a>
                  </div>
                  <div className="glass-object depth-layer" data-depth="0.65">
                    <MagicEightBall paused={paused} />
                  </div>
                </div>
                <div className="project-list" id="selected-work">
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
                            {p.category}
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
              </div>
            </div>
            <div className="about-page dark" id="about">
              <div className="wrap">
                <AboutWorkbench />
              </div>
            </div>
            <div className="pixel-page-tail" aria-hidden="true">
              <PixelLandscape paused={paused} variant="page-edge" />
            </div>
          </div>
        </section>
        <section className="chapter-page" id="pixel" data-chapter>
          <div className="pixel-chapter page-surface">
            <PixelLandscape paused={paused} />
            <div className="wrap pixel-content" data-reveal>
              <h2>Contact</h2>
              <div className="pixel-actions">
                <a href="mailto:fd2190@nyu.edu" className="pixel-button">
                  <Mail size={18} /> Say hello
                </a>
                <button className="copy-button" onClick={copy}>
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                  <span aria-live="polite">
                    {copied ? 'Email copied!' : 'Copy email'}
                  </span>
                </button>
              </div>
              {copyError && (
                <output className="copy-fallback" aria-live="polite">
                  Copy this address: fd2190@nyu.edu
                </output>
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
                  Résumé
                </a>
              </div>
              <footer>
                <span>© {new Date().getFullYear()} Franyel Diaz Rodriguez</span>
                <a href="#sketch">
                  Back to the sketch <ArrowUp size={15} />
                </a>
              </footer>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
