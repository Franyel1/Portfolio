const sites = [
  {
    id: 'sail',
    name: 'SAIL',
    detail: 'Frontend + motion',
    href: 'https://sailgtx.com',
    image: '/images/projects/sail-home.png',
  },
  {
    id: 'studio',
    name: 'Studio',
    detail: 'Product + full-stack',
    href: 'https://aj-studio-fdr.vercel.app/',
    image: '/images/projects/aj-studio-home.png',
  },
  {
    id: 'ink',
    name: 'Ink.',
    detail: 'AI-assisted journal',
    href: 'https://ink-rouge.vercel.app/login',
  },
];

export default function ProjectIndexArt() {
  return (
    <aside className="site-deck" aria-label="Three selected website previews">
      <div className="site-deck-heading">
        <span>Selected sites</span>
        <span>01—03</span>
      </div>
      <div className="site-deck-stage">
        <div className="site-deck-track">
          {sites.map((site) => (
            <a
              className={`site-deck-card site-deck-${site.id}`}
              href={site.href}
              target="_blank"
              rel="noreferrer"
              key={site.id}
              aria-label={`Open ${site.name}`}
            >
              <span className="site-deck-window" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              {site.image ? (
                <img src={site.image} alt="" />
              ) : (
                <span className="site-deck-ink-word" aria-hidden="true">
                  Ink.
                </span>
              )}
              <span className="site-deck-caption">
                <strong>{site.name}</strong>
                <small>{site.detail}</small>
              </span>
            </a>
          ))}
        </div>
      </div>
      <p className="site-deck-note">Three builds, one connected practice.</p>
    </aside>
  );
}
