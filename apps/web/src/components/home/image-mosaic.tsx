import { AssetTile, type AssetTileProps } from '@/components/marketplace/asset-tile';

export function ImageMosaic({ assets }: { assets: AssetTileProps[] }) {
  if (!assets.length) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 text-center text-muted text-sm">
        Loading gallery…
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <h2 className="text-lg font-semibold mb-6 text-center sm:text-left">
        Inspiration gallery
      </h2>
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {assets.map((asset, i) => (
          <div key={asset.id} className="break-inside-avoid">
            <AssetTile {...asset} index={i} variant="grid" views={(i + 1) * 47} />
          </div>
        ))}
      </div>
    </section>
  );
}
