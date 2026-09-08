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
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import GlassSculpture from '@/components/glass-sculpture';
import PixelLandscape from '@/components/pixel-landscape';
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
    url: 'https://ajstudiosite.onrender.com/',
    link: 'Open demo',
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
    id: 'kitchin',
    number: '03',
    name: 'kitchIn',
    category: 'Full-stack · Shared living · Everyday tools',
    tag: 'PROJECT',
    summary: 'A shared home. A pantry on the same page.',
    stack: ['Flask', 'MongoDB', 'Jinja', 'Docker'],
    url: 'https://github.com/Franyel1/kitchIn',
    link: 'Explore repository',
    role: 'Full-stack development',
    problem:
      'People sharing a household need a common place to manage pantry items and grocery requests.',
    contribution:
      'Built a shared pantry application with user authentication, item requests, household roles, and dynamic server-rendered templates.',
    decision:
      'Used Flask and MongoDB for the application and data model, Jinja for the interface, and Docker to keep the environment consistent.',
    result:
      'Built and deployed the application, with CI/CD pipelines configured for automatic deployment. The repository shows the implementation.',
  },
];
const studies = [
  {
    n: '01',
    title: 'A mark of my own',
    type: 'Identity / SVG',
    description:
      'From loose F + D sketches to one small, recognizable signature.',
    brief:
      'Sketch 12 monograms in black and white. Choose three to refine, test them at favicon size, and turn one into a clean SVG. Keep the rough pages: the decisions are part of the story.',
    deliverable: 'A sketch sheet, a final SVG mark, and a short logo reveal.',
  },
  {
    n: '02',
    title: 'One idea, three lives',
    type: 'Drawing / Materials',
    description:
      'The same character, explored in pixels, glossy light, and painted color.',
    brief:
      'Choose a simple character silhouette. Draw it three times using the same pose and palette: a 32 × 32 pixel sprite, a smooth digital rendering, and a textured painting. Compare how each medium changes its personality.',
    deliverable: 'Three finished studies and a side-by-side process sheet.',
  },
  {
    n: '03',
    title: 'A pantry with personality',
    type: 'Illustration / kitchIn',
    description:
      'An expressive little cast of ingredients for a shared kitchen.',
    brief:
      'Draw six pantry ingredients with distinct silhouettes and expressions. Keep one brush style and a small palette. Arrange them into a poster, then explore how they could appear in kitchIn.',
    deliverable:
      'Six illustrations, a small poster, and one interface application.',
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
    <div className="project-art kitchin-art">
      <div className="art-top">
        <span className="kitchin-word">
          kitch<span>In</span>
        </span>
        <span className="mini-label">YOUR SHARED PANTRY</span>
      </div>
      <div className="pantry-flow">
        <span>Household</span>
        <i>↓</i>
        <div>
          <span>Pantry</span>
          <span>Requests</span>
          <span>Roles</span>
        </div>
      </div>
      <span className="art-caption">Application overview</span>
    </div>
  );
}
export default function Home() {
  const [project, setProject] = useState<(typeof projects)[number] | null>(
      null,
    ),
    [study, setStudy] = useState<(typeof studies)[number] | null>(null),
    [paused, setPaused] = useState(false),
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
      <aside className="journey-nav" aria-label="Jump to chapter">
        {['sketch', 'canvas', 'glass', 'pixel'].map((id, i) => (
          <a
            key={id}
            href={`#${id}`}
            aria-label={`${i + 1}. ${id}`}
            aria-current={active === id ? 'location' : undefined}
          >
            <span>{String(i + 1).padStart(2, '0')}</span>
            <i />
          </a>
        ))}
      </aside>
      <button
        className="motion-control"
        onClick={() => setPaused(!paused)}
        aria-label={paused ? 'Enable animation' : 'Pause animation'}
        title={paused ? 'Enable animation' : 'Pause animation'}
      >
        {paused ? <Play size={14} /> : <Pause size={14} />}
        <span>{paused ? 'Motion off' : 'Motion on'}</span>
      </button>
      <main id="main">
        <section className="sketch" id="sketch" data-chapter>
          <div className="wrap">
            <header className="nav">
              <a className="brand" href="#sketch" aria-label="Franyel, home">
                fd.
              </a>
              <nav className="navlinks" aria-label="Main navigation">
                <a href="#canvas">Sketchbook</a>
                <a href="#glass">Work</a>
                <a href="#about">About</a>
                <a className="nav-contact" href="#pixel">
                  Say hello ↗
                </a>
              </nav>
            </header>
            <div className="hero typography-hero">
              <div className="eyebrow hero-kicker">
                <span className="status-dot" /> Developer. Visual thinker.
                Always curious.
              </div>
              <div className="name-study">
                <span className="name-note hand" aria-hidden="true">
                  a name. a starting point.
                </span>
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
                <span className="name-measure eyebrow" aria-hidden="true">
                  F / D / R — a study in becoming
                </span>
                <span className="name-signoff hand" aria-hidden="true">
                  never quite finished.
                </span>
              </div>
              <div className="hero-introduction">
                <p className="hero-subtitle">
                  A little logic.
                  <br />A lot of imagination.
                </p>
                <div>
                  <p className="hero-description">
                    I’m Franyel Diaz Rodriguez. I build for the web, get lost in
                    the details, and follow ideas from their first scribble to
                    something real.
                  </p>
                  <div className="hero-actions">
                    <a className="ink-button" href="#glass">
                      Explore my work <ArrowUpRight size={18} />
                    </a>
                    <a className="text-link" href="#canvas">
                      The creative side
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="sketch-bottom">
              <a className="scroll-note" href="#canvas">
                <ArrowDown size={16} /> Follow the thread
              </a>
              <div className="chapter-index eyebrow">
                <span>01 Sketch</span>
                <i />
                <span>04 Pixel</span>
              </div>
              <span className="eyebrow bottom-motto">
                Code + color + curiosity
              </span>
            </div>
          </div>
        </section>
        <section className="canvas-chapter" id="canvas" data-chapter>
          <div className="canvas-texture" aria-hidden="true" />
          <div className="wrap canvas-content">
            <div className="intro-row" data-reveal>
              <div>
                <span className="eyebrow">02 / The canvas</span>
                <h2 className="chapter-title">
                  Room to
                  <br />
                  <em>make a mess.</em>
                </h2>
              </div>
              <div>
                <span className="hand canvas-note">
                  less undo. more discovery.
                </span>
                <p>
                  I’m building a practice in digital drawing and design. This is
                  the space for experiments, happy accidents, and finding my own
                  visual voice.
                </p>
              </div>
            </div>
            <div className="studio-banner" data-reveal>
              <span className="eyebrow">The sketchbook</span>
              <span className="studio-status">
                <i /> Personal studies coming soon
              </span>
            </div>
            <div className="study-grid">
              {studies.map((s, i) => (
                <button
                  className={`study-card study-${i}`}
                  key={s.n}
                  onClick={() => setStudy(s)}
                  data-reveal
                >
                  <div className="study-top">
                    <span className="eyebrow">Study {s.n}</span>
                    <ArrowUpRight size={22} />
                  </div>
                  <div className="study-type-art" aria-hidden="true">
                    {i === 0 ? (
                      <span className="monogram-type">
                        f<span>d.</span>
                      </span>
                    ) : i === 1 ? (
                      <div className="material-type">
                        <span>Aa</span>
                        <span>Aa</span>
                        <span>Aa</span>
                      </div>
                    ) : (
                      <span className="pantry-type">
                        a little
                        <br />
                        <em>good taste.</em>
                      </span>
                    )}
                  </div>
                  <span className="eyebrow study-medium">{s.type}</span>
                  <h3>{s.title}</h3>
                  <p>{s.description}</p>
                  <span className="study-open">
                    Read the study brief <span>↗</span>
                  </span>
                </button>
              ))}
            </div>
            <div className="canvas-bottom">
              <span className="hand">
                Making room for the things I haven’t made yet.
              </span>
              <span className="asset-note">
                Painted chapter texture is AI-generated.
                <br />
                Personal artwork will be labeled separately.
              </span>
            </div>
          </div>
        </section>
        <section className="glass-chapter dark" id="glass" data-chapter>
          <div className="glass-light" aria-hidden="true" />
          <div className="wrap glass-content">
            <div className="glass-intro" data-reveal>
              <div>
                <span className="eyebrow">03 / The glass</span>
                <h2 className="chapter-title">
                  Ideas, made
                  <br />
                  <em>tangible.</em>
                </h2>
                <p>
                  Thoughtful interfaces. Useful systems.
                  <br />A few things I’ve brought to life.
                </p>
                <a href="#selected-work" className="glass-down">
                  <ArrowDown size={18} /> Selected work
                </a>
              </div>
              <GlassSculpture paused={paused} />
            </div>
            <div className="work-heading" id="selected-work">
              <span className="eyebrow">Selected work / 2025—2026</span>
              <span className="eyebrow">Design meets development</span>
            </div>
            <div className="project-list">
              {projects.map((p) => (
                <article
                  className={`project-card project-${p.id}`}
                  key={p.id}
                  data-reveal
                >
                  <button
                    className="project-visual-button"
                    aria-label={`Read ${p.name} case study`}
                    onClick={() => setProject(p)}
                  >
                    <ProjectVisual id={p.id} />
                  </button>
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
                    <button className="case-link" onClick={() => setProject(p)}>
                      Behind the build <ArrowUpRight size={19} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
            <div className="about-section" id="about">
              <div className="about-heading" data-reveal>
                <span className="eyebrow">The person behind the pixels</span>
                <h2 className="chapter-title">
                  Curious by nature.
                  <br />
                  <em>Builder by practice.</em>
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
                <span className="eyebrow">Along the way</span>
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
              <span className="eyebrow">Things I work with</span>
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
            <span className="eyebrow">04 / A new level</span>
            <span className="pixel-small">YOU MADE IT.</span>
            <h2>
              Let’s make
              <br />
              something <span>good.</span>
            </h2>
            <p>
              Have an idea, a project, or just a good hello?
              <br />
              There’s always room for one more conversation.
            </p>
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
              <span className="pixel-signature">
                Still exploring<span className="blink">_</span>
              </span>
              <a href="#sketch">
                Back to the sketch <ArrowUp size={15} />
              </a>
            </footer>
          </div>
        </section>
      </main>
      <Dialog
        open={!!project}
        onOpenChange={(open) => {
          if (!open) setProject(null);
        }}
      >
        <DialogContent className="case-dialog">
          {project && (
            <>
              <span className="eyebrow">Selected work / {project.tag}</span>
              <DialogTitle className="dialog-title">{project.name}</DialogTitle>
              <DialogDescription className="dialog-description">
                {project.summary}
              </DialogDescription>
              <div className="dialog-tags">
                {project.stack.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              <dl>
                <div>
                  <dt>My role</dt>
                  <dd>{project.role}</dd>
                </div>
                <div>
                  <dt>The problem</dt>
                  <dd>{project.problem}</dd>
                </div>
                <div>
                  <dt>What I built</dt>
                  <dd>{project.contribution}</dd>
                </div>
                <div>
                  <dt>Key decisions</dt>
                  <dd>{project.decision}</dd>
                </div>
                <div>
                  <dt>The result</dt>
                  <dd>{project.result}</dd>
                </div>
              </dl>
              <a
                className="ink-button"
                href={project.url}
                target="_blank"
                rel="noreferrer"
              >
                {project.link}
                <ArrowUpRight size={18} />
              </a>
            </>
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!study}
        onOpenChange={(open) => {
          if (!open) setStudy(null);
        }}
      >
        <DialogContent className="case-dialog study-dialog">
          {study && (
            <>
              <span className="eyebrow">
                Upcoming personal study / {study.n}
              </span>
              <DialogTitle className="dialog-title">{study.title}</DialogTitle>
              <DialogDescription className="dialog-description">
                {study.description}
              </DialogDescription>
              <div className="study-brief">
                <h3>The exploration</h3>
                <p>{study.brief}</p>
                <h3>What to make</h3>
                <p>{study.deliverable}</p>
                <p className="brief-note">
                  This is a planned study. Finished artwork and process images
                  will be added here as the practice grows.
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
