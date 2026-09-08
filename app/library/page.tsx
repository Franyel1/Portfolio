import type { Metadata } from 'next';
import Library from '@/components/project-library';
export const metadata: Metadata = {
  title: 'Library — Franyel',
  description:
    'Canvas experiments, interactive games, and web projects by Franyel Diaz Rodriguez.',
};
export default function LibraryPage() {
  return <Library />;
}
