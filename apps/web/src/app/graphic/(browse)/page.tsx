import type { Metadata } from 'next';
import { GraphicsPanel } from '@/components/graphic/graphics-panel';

export const metadata: Metadata = {
  title: 'Graphic — Dimaker',
  description:
    'Discover the essence of creativity in our exquisite collection of top-tier abstract design assets.',
};

export default function GraphicPage() {
  return <GraphicsPanel />;
}
