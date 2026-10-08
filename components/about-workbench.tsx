'use client';
import { useState } from 'react';
import { ArrowUpRight, Pencil, Film, Braces } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
const skills = [
  {
    id: 'react',
    name: 'React',
    group: 'interface',
    use: 'Component-based interfaces, interactive product demos, and responsive web applications.',
    project: 'SAIL · Web development',
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    group: 'interface',
    use: 'Building websites with reusable layouts and application routing.',
    project: 'SAIL · Marketing website',
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    group: 'interface',
    use: 'Turning drawings into motion: particles, canvas compositions, and playful interactions.',
    project: 'Living Sketchbook',
  },
  {
    id: 'html5',
    name: 'HTML',
    group: 'interface',
    use: 'Semantic page structure and accessible, responsive interfaces.',
    project: 'Web development · Tutoring',
  },
  {
    id: 'css3',
    name: 'CSS',
    group: 'interface',
    use: 'Typography, responsive layouts, animation, and visual transitions.',
    project: 'Websites · Canvas studies',
  },
  {
    id: 'python',
    name: 'Python',
    group: 'systems',
    use: 'Automation, data workflows, and server-side application logic.',
    project: 'SAIL · Intelligence pipeline',
  },
  {
    id: 'flask',
    name: 'Flask',
    group: 'systems',
    use: 'Connecting booking interfaces to scheduling, payments, and backend checks.',
    project: 'Antonio Jefferson Studio',
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    group: 'systems',
    use: 'JavaScript tooling and server-side web development.',
    project: 'Web applications',
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    group: 'systems',
    use: 'Application data for booking workflows and shared household tools.',
    project: 'AJ Studio · kitchIn',
  },
  {
    id: 'docker',
    name: 'Docker',
    group: 'tools',
    use: 'Keeping development and production environments consistent.',
    project: 'kitchIn',
  },
  {
    id: 'git',
    name: 'Git',
    group: 'tools',
    use: 'Versioning work, tracking changes, and iterating on projects.',
    project: 'Across my projects',
  },
  {
    id: 'figma',
    name: 'Figma',
    group: 'tools',
    use: 'Exploring interface ideas, layout, and visual direction.',
    project: 'Design workflow',
  },
];
export default function AboutWorkbench() {
  const [selected, setSelected] = useState(skills[0]);
  return (
    <section className="about-redesign">
      <div className="about-lead" data-reveal>
        <div>
          <h2>About me</h2>
        </div>
        <div className="about-intro-copy">
          <p>
            I studied computer science at NYU. My work includes web
            applications, motion content, and canvas experiments.
          </p>
          <p>
            I’m building a digital drawing practice with a tablet alongside the
            things I make with code.
          </p>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noreferrer"
            className="resume-link"
          >
            Read my résumé <ArrowUpRight size={18} />
          </a>
        </div>
      </div>
      <div className="about-facts" data-reveal>
        <span>
          <strong>NYU</strong>BA, Computer Science · 2026
        </span>
        <span>
          <strong>Web + art</strong>Minor in Web Programming & Applications
        </span>
        <span>
          <strong>Bilingual</strong>English & Spanish · HSF Scholar
        </span>
      </div>
      <div className="experience-layout">
        <div className="experience-label" data-reveal>
          <span className="eyebrow">2025 to 2026</span>
          <h3>Experience.</h3>
        </div>
        <div className="experience-timeline">
          {[
            {
              date: 'JUN to AUG 2026',
              name: 'SAIL',
              role: 'Web development & motion content',
              text: 'Rebuilt the marketing front end, created interactive product visuals and video content, and built an automated intelligence pipeline.',
            },
            {
              date: 'SEP 2025 to MAY 2026',
              name: 'New York University',
              role: 'Web Development Tutor & Grader',
              text: 'Helped students debug, build responsive interfaces, and understand accessible web design through one-on-one support and project feedback.',
            },
            {
              date: 'MAY to AUG 2025',
              name: 'Antonio Jefferson Studio',
              role: 'Studio internship · Full-stack development',
              text: 'Connected scheduling, payments, and automated confirmations in a responsive booking platform.',
            },
          ].map((job) => (
            <article key={job.name} data-reveal>
              <div>
                <span className="eyebrow">{job.date}</span>
                <h4>{job.name}</h4>
                <span className="timeline-role">{job.role}</span>
                <p>{job.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
      <div className="skills-workbench" data-reveal>
        <div className="skills-heading">
          <div>
            <h3>Tools I use.</h3>
          </div>
          <p>Select a tool to see how I use it.</p>
        </div>
        <Tabs
          defaultValue="interface"
          onValueChange={(value) =>
            setSelected(skills.find((s) => s.group === value)!)
          }
        >
          <TabsList className="skill-filters" variant="line">
            <TabsTrigger value="interface">Interfaces</TabsTrigger>
            <TabsTrigger value="systems">Systems</TabsTrigger>
            <TabsTrigger value="tools">Making & shipping</TabsTrigger>
          </TabsList>
          <div className="skill-workspace">
            <div>
              {['interface', 'systems', 'tools'].map((group) => (
                <TabsContent value={group} key={group}>
                  <div className="skill-icon-grid">
                    {skills
                      .filter((s) => s.group === group)
                      .map((skill, i) => (
                        <button
                          key={skill.id}
                          className={`skill-tile ${selected.id === skill.id ? 'selected' : ''}`}
                          onClick={() => setSelected(skill)}
                          aria-pressed={selected.id === skill.id}
                          style={{ '--order': i } as React.CSSProperties}
                        >
                          <span className="skill-icon-bed">
                            <img
                              src={`/images/skills/${skill.id}.svg`}
                              alt=""
                              width="58"
                              height="58"
                            />
                          </span>
                          <span>{skill.name}</span>
                          <ArrowUpRight size={15} />
                        </button>
                      ))}
                  </div>
                </TabsContent>
              ))}
            </div>
            <div className="skill-detail" aria-live="polite" key={selected.id}>
              <img
                src={`/images/skills/${selected.id}.svg`}
                alt=""
                className="skill-detail-logo"
              />
              <h4>{selected.name}</h4>
              <p>{selected.use}</p>
              <span className="skill-context">{selected.project}</span>
            </div>
          </div>
        </Tabs>
        <div className="creative-tools">
          <span>
            <Braces />
            Canvas & SVG
          </span>
          <span>
            <Film />
            DaVinci Resolve
          </span>
          <span>
            <Pencil />
            Digital drawing
          </span>
          <span>Codex</span>
          <span>Claude</span>
          <span>Claude Design</span>
          <span>Java · SQL · REST APIs</span>
        </div>
      </div>
    </section>
  );
}
