import Link from 'next/link';
import { Suspense } from 'react';
import { CategoryPills } from '@/components/home/category-pills';
import { FontShowcaseCard } from '@/components/marketplace/font-showcase-card';
import { GraphicsGalleryStrip } from '@/components/marketplace/graphics-gallery-strip';
import { apiGet } from '@/lib/api';

type Asset = {
  id: string;
  title: string;
  slug: string;
  creator_handle: string;
  asset_type: string;
  view_count?: number;
};

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string }>;
}) {
  const { q, type } = await searchParams;
  let assets: Asset[] = [];

  if (q) {
    try {
      const data = await apiGet<{ hits: Asset[] }>(
        `/search?q=${encodeURIComponent(q)}`,
        30,
      );
      assets = (data.hits ?? []) as Asset[];
    } catch {
      assets = [];
    }
  } else {
    try {
      const all = await apiGet<Asset[]>('/assets?limit=48', 30);
      assets = type ? all.filter((a) => a.asset_type === type) : all;
    } catch {
      assets = [];
    }
  }

  return (
    <main className="pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-10 pb-4 text-center">
        <p className="text-sm text-muted mb-3">Dimaker marketplace</p>
        <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight">
          {q ? (
            <>
              Search: <span className="text-accent">{q}</span>
            </>
          ) : (
            <>
              Explore <span className="text-muted">graphics</span>
            </>
          )}
        </h1>
      </div>

      <Suspense fallback={null}>
        <CategoryPills />
      </Suspense>

      {assets.length === 0 ? (
        <p className="text-center text-muted text-sm py-20 px-4">
          No assets yet.{' '}
          <Link href="/creator" className="text-foreground underline">
            Start posting
          </Link>
        </p>
      ) : (
        <>
          <GraphicsGalleryStrip assets={assets.slice(0, 10)} />
          <section className="mx-auto max-w-7xl px-4 sm:px-6 py-6 space-y-4">
            {assets.map((a, i) => (
              <FontShowcaseCard
                key={a.id}
                {...a}
                index={i}
                views={Number(a.view_count) || 100 + i * 23}
                downloads={30 + i * 7}
              />
            ))}
          </section>
        </>
      )}
    </main>
  );
}
