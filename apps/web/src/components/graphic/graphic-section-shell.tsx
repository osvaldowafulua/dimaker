import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { GraphicSectionId } from '@/data/graphic-sections';
import { GRAPHIC_SECTION_META } from '@/data/graphic-sections';
import { MarketingPageShell } from '@/components/layout/marketing-page-shell';

export function GraphicSectionShell({
  section,
  children,
}: {
  section: GraphicSectionId;
  children: React.ReactNode;
}) {
  const meta = GRAPHIC_SECTION_META[section];

  return (
    <MarketingPageShell>
      <h3 className="z-20 justify-center bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-clip-text py-3 text-center text-4xl font-bold tracking-tighter text-transparent md:text-7xl">
        Free Stock <span className="text-ali">Photos</span>
      </h3>
      <p className="mx-auto max-w-xl text-center text-xs text-muted">{meta.description}</p>

      <nav aria-label="breadcrumb" className="my-10 flex justify-center">
        <ol className="flex flex-wrap items-center gap-1.5 break-words text-sm text-muted sm:gap-2.5">
          <li className="inline-flex items-center gap-1.5">
            <Link href="/" className="transition-colors hover:text-foreground">
              Home
            </Link>
          </li>
          <li role="presentation" aria-hidden>
            <ChevronRight className="h-3.5 w-3.5" />
          </li>
          <li className="inline-flex items-center gap-1.5">
            <Link href="/graphic" className="transition-colors hover:text-foreground">
              Graphic
            </Link>
          </li>
          <li role="presentation" aria-hidden>
            <ChevronRight className="h-3.5 w-3.5" />
          </li>
          <li className="inline-flex items-center gap-1.5">
            <span className="font-normal text-foreground">Images Results</span>
          </li>
        </ol>
      </nav>

      <input
        type="search"
        placeholder="Search..."
        className="my-3 flex h-12 w-full rounded-lg border border-input bg-transparent px-6 text-base text-primary ring-offset-background placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm"
      />

      {children}
    </MarketingPageShell>
  );
}
