import Link from 'next/link';
import { Eye } from 'lucide-react';
import type { GraphicAsset } from '@/data/graphics';

export function GraphicCard({ asset }: { asset: GraphicAsset }) {
  return (
    <div className="group h-full overflow-hidden rounded-sm border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col space-y-1.5 border-b border-dotted p-0">
        <div className="relative w-full" style={{ paddingBottom: '100%' }}>
          <div className="absolute inset-0 overflow-hidden">
            <Link href={`/graphic/assets/${asset.id}`} className="block h-full w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset.imageUrl}
                alt={asset.title}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-all group-hover:scale-105"
              />
            </Link>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between p-4">
        <Link
          href={`/graphic/assets/${asset.id}`}
          className="truncate py-[2px] text-sm font-semibold tracking-tight hover:text-ali md:text-base"
        >
          {asset.title}
        </Link>
        <div className="hidden gap-4 text-xs text-primary/70 md:flex">
          <div className="flex gap-1">
            <Eye className="h-4 w-4" />
            <p>{asset.views}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
