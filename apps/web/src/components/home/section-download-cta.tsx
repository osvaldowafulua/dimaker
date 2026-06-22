import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function SectionDownloadCta() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 flex justify-center">
      <Link
        href="/explore"
        className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-medium hover:bg-elevated transition-colors group"
      >
        Free download — all graphics
        <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </div>
  );
}
