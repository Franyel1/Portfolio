export default function WebProjectArt({ id }: { id: string }) {
  return (
    <div className={`project-art actual-site-art actual-site-${id}`}>
      {id === 'sail' ? (
        <img src="https://www.sailgtx.com/brand/sail-wordmark.png" alt="SAIL" />
      ) : id === 'studio' ? (
        <img
          src="https://aj-studio-fdr.vercel.app/static/images/shopIMG.png"
          alt="Antonio Jefferson Studio"
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
