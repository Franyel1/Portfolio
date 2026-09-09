export default function CollectionPreview({ category }: { category: string }) {
  if (category === 'canvas')
    return (
      <div className="collection-preview preview-drawing">
        <img
          src="/images/projects/canvas-collage.png"
          alt="Collage of original canvas drawings"
          loading="lazy"
        />
      </div>
    );
  if (category === 'games')
    return (
      <div className="collection-preview preview-creative">
        <span className="creative-preview-word">
          In the
          <br />
          <em>making.</em>
        </span>
        <span className="creative-preview-stamp">WORK IN PROGRESS</span>
        <i aria-hidden="true" />
      </div>
    );
  return (
    <div className="collection-preview preview-web">
      <img
        className="mini-web mini-sail"
        src="/images/projects/sail-home.png"
        alt=""
        loading="lazy"
      />
      <img
        className="mini-web mini-studio"
        src="/images/projects/aj-studio-home.png"
        alt=""
        loading="lazy"
      />
      <span className="mini-web mini-ink">Ink.</span>
    </div>
  );
}
