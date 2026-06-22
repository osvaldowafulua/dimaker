import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { StockSectionGrid } from '@/components/graphic/stock-section-grid';
import {
  GRAPHIC_SECTION_META,
  GRAPHIC_SECTION_SLUGS,
  type GraphicSectionId,
} from '@/data/graphic-sections';

export function generateStaticParams() {
  return GRAPHIC_SECTION_SLUGS.map((section) => ({ section }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string }>;
}): Promise<Metadata> {
  const { section } = await params;
  const meta = GRAPHIC_SECTION_META[section as GraphicSectionId];
  if (!meta) return { title: 'Graphic — Dimaker' };
  return {
    title: `${meta.label} — Graphic — Dimaker`,
    description: meta.description,
  };
}

export default async function GraphicSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  if (!GRAPHIC_SECTION_SLUGS.includes(section as GraphicSectionId)) {
    notFound();
  }

  return <StockSectionGrid section={section as GraphicSectionId} />;
}
