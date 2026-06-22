import { GraphicSectionShell } from '@/components/graphic/graphic-section-shell';
import { GRAPHIC_SECTION_SLUGS, type GraphicSectionId } from '@/data/graphic-sections';
import { notFound } from 'next/navigation';

export default async function GraphicSectionLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  if (!GRAPHIC_SECTION_SLUGS.includes(section as GraphicSectionId)) {
    notFound();
  }

  return (
    <GraphicSectionShell section={section as GraphicSectionId}>{children}</GraphicSectionShell>
  );
}
