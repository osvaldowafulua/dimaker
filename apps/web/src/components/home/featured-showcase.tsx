import Link from 'next/link';

type Asset = {
  id: string;
  title: string;
  slug: string;
  creator_handle: string;
  asset_type?: string;
  description?: string;
};

const PREVIEW_LINES = [
  'THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG.',
  'Premium mockups & templates for modern brands.',
  'Crafted for designers who ship fast.',
];

export function FeaturedShowcase({ assets }: { assets: Asset[] }) {
  const featured = assets.slice(0, 4);
  if (!featured.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-4">
      {featured.map((asset, i) => (
        <article
          key={asset.id}
          className="rounded-2xl border border-border bg-card shadow-card overflow-hidden"
        >
          <div className="px-6 sm:px-10 py-10 sm:py-14 bg-gradient-to-br from-white/[0.04] to-transparent">
            <p
              className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-foreground/90 leading-tight"
              style={{ fontFamily: 'var(--font-geist-sans)' }}
            >
              {PREVIEW_LINES[i % PREVIEW_LINES.length]}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 sm:px-6 py-4 border-t border-border bg-elevated/50">
            <div>
              <Link
                href={`/creators/${asset.creator_handle}/${asset.slug}`}
                className="font-semibold hover:underline"
              >
                {asset.title}
              </Link>
              <p className="text-xs text-muted mt-1 capitalize">
                {asset.asset_type ?? 'asset'} · @{asset.creator_handle}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {['Modern', 'Commercial', 'PSD'].slice(0, 2 + (i % 2)).map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] rounded-full bg-card border border-border px-2.5 py-1 text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <Link
              href={`/creators/${asset.creator_handle}/${asset.slug}`}
              className="inline-flex items-center gap-2 shrink-0 rounded-full border border-border px-5 py-2.5 text-sm font-medium hover:bg-card transition-colors"
            >
              View asset
              <span aria-hidden>↓</span>
            </Link>
          </div>
        </article>
      ))}
    </section>
  );
}
