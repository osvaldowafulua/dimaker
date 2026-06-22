import Link from 'next/link';
import { AssetTile } from '@/components/marketplace/asset-tile';
import { apiGet } from '@/lib/api';

export default async function CreatorPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  let profile: {
    handle: string;
    headline?: string;
    display_name?: string;
  } | null = null;
  let assets: Array<{
    id: string;
    title: string;
    slug: string;
    creator_handle: string;
    asset_type: string;
  }> = [];

  try {
    profile = await apiGet(`/creators/${handle}`);
  } catch {
    profile = null;
  }

  try {
    const all = await apiGet<typeof assets>('/assets?limit=48');
    assets = all.filter((a) => a.creator_handle === handle);
  } catch {
    assets = [];
  }

  return (
    <main className="pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-12">
        <Link href="/explore" className="text-sm text-muted hover:text-foreground">
          ← Explore
        </Link>
        <div className="mt-8 flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent text-2xl font-bold text-white">
            {(profile?.display_name ?? handle).charAt(0).toUpperCase()}
          </span>
          <div>
            <h1 className="text-3xl font-semibold">@{handle}</h1>
            {profile?.headline && (
              <p className="text-muted mt-1">{profile.headline}</p>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 mt-12 columns-2 md:columns-3 gap-4 space-y-4">
        {assets.map((a, i) => (
          <div key={a.id} className="break-inside-avoid">
            <AssetTile {...a} index={i} variant="grid" views={200 + i * 17} />
          </div>
        ))}
      </div>

      {!profile && (
        <p className="text-center text-muted text-sm mt-12">Creator not found.</p>
      )}
    </main>
  );
}
