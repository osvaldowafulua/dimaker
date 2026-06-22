import { AssetTile, type AssetTileProps } from './asset-tile';

type Asset = AssetTileProps & { view_count?: number };

export function AssetScrollRow({
  title,
  assets,
}: {
  title?: string;
  assets: Asset[];
}) {
  if (!assets.length) return null;

  return (
    <section className="py-8">
      {title && (
        <h2 className="mx-auto max-w-7xl px-4 sm:px-6 text-lg font-semibold mb-5">
          {title}
        </h2>
      )}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-4 px-4 sm:px-6 max-w-7xl mx-auto w-max min-w-full pb-2">
          {assets.map((asset, i) => (
            <AssetTile
              key={asset.id}
              {...asset}
              views={asset.view_count ?? asset.views}
              index={i}
              variant="scroll"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
