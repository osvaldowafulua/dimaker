import Link from 'next/link';
import { Eye } from 'lucide-react';
import { GRAPHICS } from '@/data/graphics';

type GalleryTile = {
  id: string;
  title: string;
  href: string;
  imageUrl: string;
  views: number;
};

export function GraphicsGalleryStrip({
  assets,
}: {
  assets: { id: string; title: string; slug: string; creator_handle: string; view_count?: number }[];
}) {
  const tiles: GalleryTile[] =
    assets.length > 0
      ? assets.map((asset, i) => ({
          id: asset.id,
          title: asset.title,
          href: `/creators/${asset.creator_handle}/${asset.slug}`,
          imageUrl: GRAPHICS[i % GRAPHICS.length]?.imageUrl ?? '',
          views: asset.view_count ?? 200,
        }))
      : GRAPHICS.slice(0, 8).map((g) => ({
          id: g.id,
          title: g.title,
          href: `/graphic/assets/${g.id}`,
          imageUrl: g.imageUrl,
          views: g.views,
        }));

  if (!tiles.length) return null;

  return (
    <section className="py-4 sm:py-6">
      <div className="scrollbar-hide overflow-x-auto">
        <div className="mx-auto flex w-max min-w-full max-w-7xl gap-3 px-4 pb-1 sm:px-6">
          {tiles.map((asset) => (
            <Link
              key={asset.id}
              href={asset.href}
              className="group relative w-[168px] shrink-0 overflow-hidden rounded-sm border bg-card shadow-sm transition-shadow hover:shadow-md sm:w-[188px]"
            >
              <div className="relative aspect-square overflow-hidden bg-muted-surface">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset.imageUrl}
                  alt={asset.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="border-t border-dotted p-3">
                <p className="truncate text-sm font-semibold text-foreground">{asset.title}</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-primary/70">
                  <Eye className="h-3 w-3" />
                  {asset.views}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
