export default function WebProjectArt({ id }: { id: string }) {
  return (
    <div className={`project-art actual-site-art actual-site-${id}`}>
      {id === 'sail' ? (
        <img
          src="/images/projects/sail-home.png"
          alt="First screen of the SAIL website"
          loading="lazy"
        />
      ) : id === 'studio' ? (
        <img
          src="/images/projects/aj-studio-home.png"
          alt="First screen of Antonio Jefferson Studio’s website"
          loading="lazy"
        />
      ) : (
        <span className="ink-logo">Ink.</span>
      )}
      <span className="site-art-domain">
        {id === 'sail'
          ? 'sailgtx.com'
          : id === 'studio'
            ? 'aj-studio-fdr.vercel.app'
            : 'ink-rouge.vercel.app'}
      </span>
    </div>
  );
}
