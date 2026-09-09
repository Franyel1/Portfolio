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
import { LibraryOverlay } from '@/components/project-library';
const projects = [
  {
    id: 'sail',
    number: '01',
    name: 'SAIL',
    category: 'Frontend · Motion · Product storytelling',
    tag: '2026',
    summary: 'Making complex trade workflows feel clear.',
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
    summary: 'Less back-and-forth. More time to create.',
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
    summary: 'A private feed for writing your life in ink.',
    stack: ['React', 'Authentication', 'Writing'],
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
function ProjectVisual({ id }: { id: string }) {
  if (id === 'sail')
    return (
      <div
        className="project-art sail-art"
        aria-label="Conceptual illustration of SAIL’s classification workflow"
      >
        <div className="art-top">
          <span className="sail-word">
            SAIL<span>↗</span>
          </span>
          <span className="mini-label">TRADE INTELLIGENCE</span>
        </div>
        <div className="sail-flow">
          <div className="signal-lines">
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <span key={i} style={{ width: `${50 + i * 7}%` }} />
            ))}
          </div>
          <div className="flow-core">S</div>
          <div className="flow-out">
            <span>
              CLASSIFY <Check size={12} />
            </span>
            <span>
              VERIFY <Check size={12} />
            </span>
            <span>
              AUDIT <Check size={12} />
            </span>
          </div>
        </div>
        <span className="art-caption">Workflow illustration</span>
      </div>
    );
  if (id === 'studio')
    return (
      <div className="project-art studio-art">
        <div className="art-top">
          <span className="studio-word">
            Antonio
            <br />
            Jefferson <i>Studio.</i>
          </span>
          <span className="mini-label">BOOKING PLATFORM</span>
        </div>
        <div className="booking-flow">
          <span>
            01 <b>Select a time</b>
          </span>
          <span>
            02 <b>Make it yours</b>
          </span>
          <span>
            03 <b>Ready to create ↗</b>
          </span>
        </div>
        <span className="art-caption">Booking flow overview</span>
      </div>
    );
  return (
    <div className="project-art ink-art">
      <div className="art-top">
        <span className="ink-word">
          Ink<span>.</span>
        </span>
        <span className="mini-label">PERSONAL WRITING</span>
      </div>
      <div className="ink-flow">
        <span>private</span>
        <i>·</i>
        <div>
          <span>write</span>
          <span>remember</span>
          <span>return</span>
        </div>
      </div>
      <span className="art-caption">A quiet place for a life in words</span>
    </div>
  );
}
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
      <LibraryOverlay />
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
            <div className="intro-row">
              <div>
                <span className="eyebrow">Creative work</span>
                <h2 className="chapter-title">The library.</h2>
              </div>
              <a className="text-link" href="#library">
                Open the library ↗
              </a>
            </div>
            <div className="study-grid collection-grid">
              {[
                {
                  id: 'canvas',
                  n: '01',
                  title: 'Drawing on the Web',
                  type: 'JavaScript / Canvas / SVG',
                  mark: 'Canvas',
                },
                {
                  id: 'games',
                  n: '02',
                  title: 'Interactive',
                  type: 'p5.js / Interactive work',
                  mark: 'Play',
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
                  className={`study-card study-${i}`}
                  href={`#library-${item.id}`}
                  key={item.id}
                >
                  <div className="study-top">
                    <span className="eyebrow">{item.n}</span>
                    <ArrowUpRight size={22} />
                  </div>
                  <div className="collection-preview">
                    {i < 2 ? (
                      <img
                        src={
                          i === 0
                            ? '/projects/thumbs/i.png'
                            : '/projects/interactive/franyelFinal/media/images/background.png'
                        }
                        alt=""
                        loading="lazy"
                      />
                    ) : (
                      <span className="collection-word">{item.mark}</span>
                    )}
                  </div>
                  <span className="eyebrow study-medium">{item.type}</span>
                  <h3>{item.title}</h3>
                  <span className="study-open">
                    {
                      libraryItems.filter((work) => work.category === item.id)
                        .length
                    }{' '}
                    projects <ArrowUpRight size={16} />
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
                <span className="eyebrow">Selected projects</span>
                <h2 className="chapter-title">
                  Selected
                  <br />
                  <em>projects.</em>
                </h2>
                <p>Web development and product work.</p>
                <a href="#selected-work" className="glass-down">
                  <ArrowDown size={18} /> Selected work
                </a>
              </div>
              <GlassSculpture paused={paused} />
            </div>
            <div className="work-heading" id="selected-work">
              <span className="eyebrow">Selected work / 2025—2026</span>
              <span className="eyebrow"></span>
            </div>
            <div className="project-list">
              {projects.map((p) => (
                <article
                  className={`project-card project-${p.id}`}
                  key={p.id}
                  data-reveal
                >
                  <a
                    className="project-visual-button"
                    aria-label={`Read ${p.name} case study`}
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ProjectVisual id={p.id} />
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
            <div className="about-section" id="about">
              <div className="about-heading" data-reveal>
                <span className="eyebrow">About</span>
                <h2 className="chapter-title">
                  Franyel Diaz
                  <br />
                  <em>Rodriguez.</em>
                </h2>
                <p>
                  My work moves between the technical and the visual: web
                  applications, interactive storytelling, motion, and now
                  digital drawing. I like understanding how things work—and
                  imagining how they could feel.
                </p>
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="resume-link"
                >
                  Read my résumé <ArrowUpRight size={17} />
                </a>
                <div className="education">
                  <span className="eyebrow">
                    New York University · 2022—2026
                  </span>
                  <p>
                    BA, Computer Science
                    <br />
                    Minor in Web Programming and Applications
                  </p>
                  <span>HSF Scholar · English & Spanish</span>
                </div>
              </div>
              <div className="experience" data-reveal>
                <span className="eyebrow">Experience</span>
                <article>
                  <span className="experience-date">JUN — AUG 2026</span>
                  <h3>SAIL (SAIL GTX)</h3>
                  <span className="role">Web development & motion content</span>
                  <p>
                    Rebuilt the marketing front end, created interactive product
                    visuals and video content, and built an automated
                    intelligence pipeline.
                  </p>
                </article>
                <article>
                  <span className="experience-date">SEP 2025 — MAY 2026</span>
                  <h3>New York University</h3>
                  <span className="role">Web Development Tutor & Grader</span>
                  <p>
                    Helped students debug, build responsive interfaces, and
                    understand accessible web design through one-on-one support
                    and project feedback.
                  </p>
                </article>
                <article>
                  <span className="experience-date">MAY — AUG 2025</span>
                  <h3>Antonio Jefferson Studio</h3>
                  <span className="role">
                    Studio internship · Full-stack development
                  </span>
                  <p>
                    Connected scheduling, payments, and automated confirmations
                    in a responsive booking platform.
                  </p>
                </article>
              </div>
            </div>
            <div className="toolbox" data-reveal>
              <span className="eyebrow">Skills</span>
              <div className="toolbox-grid">
                <div>
                  <h3>Interfaces</h3>
                  <p>
                    React · Next.js · JavaScript
                    <br />
                    HTML / CSS · Canvas · SVG
                  </p>
                </div>
                <div>
                  <h3>Under the hood</h3>
                  <p>
                    Python / Flask · Node / Express
                    <br />
                    Java · REST APIs · MongoDB · SQL
                  </p>
                </div>
                <div>
                  <h3>Making & shipping</h3>
                  <p>
                    Git · Docker · Figma
                    <br />
                    DaVinci Resolve · Digital drawing
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="pixel-chapter" id="pixel" data-chapter>
          <PixelLandscape paused={paused} />
          <div className="wrap pixel-content">
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
