/** Transparent material scans move with the outgoing sheet. */
export default function MaterialEdge({
  material,
}: {
  material: 'paper' | 'paint';
}) {
  return <div className={`material-edge edge-${material}`} aria-hidden="true" />;
}
