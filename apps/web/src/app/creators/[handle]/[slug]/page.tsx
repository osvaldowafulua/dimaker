import Link from 'next/link';
import { apiGet } from '@/lib/api';

export default async function AssetPage({
  params,
}: {
  params: Promise<{ handle: string; slug: string }>;
}) {
  const { handle, slug } = await params;
  let asset: {
    title: string;
    description?: string;
    asset_type: string;
  } | null = null;

  try {
    asset = await apiGet(`/creators/${handle}/assets/${slug}`);
  } catch {
    asset = null;
  }

  return (
    <main className="pb-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-12">
        <Link
          href={`/creators/${handle}`}
          className="text-sm text-muted hover:text-foreground"
        >
          ← @{handle}
        </Link>

        {asset ? (
          <>
            <div className="mt-8 rounded-2xl border border-border bg-card aspect-video bg-gradient-to-br from-violet-600/30 via-fuchsia-500/10 to-transparent shadow-card" />
            <h1 className="mt-8 text-3xl sm:text-4xl font-semibold tracking-tight">
              {asset.title}
            </h1>
            <p className="text-sm text-muted mt-2 capitalize">{asset.asset_type}</p>
            {asset.description && (
              <p className="mt-6 text-muted leading-relaxed">{asset.description}</p>
            )}
            <div className="mt-10 flex flex-wrap gap-3">
              <button
                type="button"
                className="rounded-full bg-foreground text-surface font-medium text-sm px-6 py-3 hover:opacity-90"
              >
                Purchase license
              </button>
              <button
                type="button"
                className="rounded-full border border-border bg-card font-medium text-sm px-6 py-3 hover:bg-elevated"
              >
                Download preview
              </button>
            </div>
          </>
        ) : (
          <p className="mt-12 text-muted">Asset not found.</p>
        )}
      </div>
    </main>
  );
}
