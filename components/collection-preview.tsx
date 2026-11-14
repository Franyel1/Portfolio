import Image from 'next/image';

export default function CollectionPreview({ category }: { category: string }) {
  if (category === 'canvas')
    return (
      <div className="collection-preview preview-drawing">
        <div className="sketchbook-stack" aria-label="Collage of original canvas drawings">
          <img className="sketchbook-shot sketchbook-shot-a" src="/images/projects/canvas-collage.png" alt="" loading="lazy" />
          <img className="sketchbook-shot sketchbook-shot-b" src="/images/projects/canvas-collage.png" alt="" loading="lazy" />
          <img className="sketchbook-shot sketchbook-shot-c" src="/images/projects/canvas-collage.png" alt="" loading="lazy" />
        </div>
      </div>
    );
  if (category === 'games')
    return (
      <div className="collection-preview preview-small-talk">
        <Image
          src="/images/projects/small-talk/banner.png"
          alt=""
          width={884}
          height={232}
          unoptimized
        />
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
