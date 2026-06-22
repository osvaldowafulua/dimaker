import Link from 'next/link';
import { Download, Eye } from 'lucide-react';

const PREVIEWS = [
  'THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG.',
  'Pack my box with five dozen liquor jugs.',
  'Sphinx of black quartz, judge my vow.',
  'How vexingly quick daft zebras jump!',
];

type Props = {
  title: string;
  slug: string;
  creator_handle: string;
  asset_type?: string;
  index?: number;
  views?: number;
  downloads?: number;
  tags?: string[];
};

export function FontShowcaseCard({
  title,
  slug,
  creator_handle,
  asset_type = 'template',
  index = 0,
  views = 120,
  downloads = 48,
  tags = ['Modern', 'Commercial'],
}: Props) {
  const href = `/creators/${creator_handle}/${slug}`;
  const preview = PREVIEWS[index % PREVIEWS.length];

  return (
    <article className="rounded-2xl border border-border bg-card overflow-hidden shadow-card group">
      <Link href={href} className="block">
        <div className="px-6 sm:px-10 py-12 sm:py-16 bg-[#0a0a0a] border-b border-border/50 group-hover:bg-[#111] transition-colors">
          <p
            className="text-2xl sm:text-3xl md:text-[2.5rem] font-medium leading-[1.15] tracking-tight text-white/95 text-left"
            style={{
              fontFamily: index % 2 === 0 ? 'Georgia, serif' : 'var(--font-geist-sans)',
              fontStyle: index % 3 === 0 ? 'italic' : 'normal',
            }}
          >
            {preview}
          </p>
        </div>
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 sm:px-6 py-4 bg-elevated/80">
        <div className="min-w-0 text-left">
          <Link href={href} className="font-semibold text-foreground hover:underline truncate block">
            {title}
          </Link>
          <p className="text-xs text-muted mt-0.5 capitalize">{asset_type.replace('_', ' ')}</p>
          <div className="flex flex-wrap items-center gap-3 mt-2.5">
            <span className="inline-flex items-center gap-1 text-xs text-muted">
              <Eye className="h-3.5 w-3.5" />
              {views}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-muted">
              <Download className="h-3.5 w-3.5" />
              {downloads}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] rounded-md bg-card border border-border px-2 py-0.5 text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <Link
          href={href}
          className="inline-flex items-center justify-center gap-2 shrink-0 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-medium hover:bg-elevated transition-colors w-full sm:w-auto"
        >
          Download asset
          <Download className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
