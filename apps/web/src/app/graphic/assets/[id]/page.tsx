import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Eye } from 'lucide-react';
import { GRAPHICS } from '@/data/graphics';

export default async function GraphicAssetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const asset = GRAPHICS.find((g) => g.id === id);
  if (!asset) notFound();

  return (
    <main className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
      <Link href="/graphic" className="text-sm text-muted hover:text-foreground mb-6 inline-block">
        ← Back to graphics
      </Link>
      <div className="rounded-sm border border-border bg-card overflow-hidden">
        <div className="relative aspect-square w-full bg-black">
          <Image
            src={asset.imageUrl}
            alt={asset.title}
            fill
            className="object-contain"
            sizes="(max-width: 896px) 100vw, 896px"
            priority
          />
        </div>
        <div className="flex items-center justify-between gap-4 p-6 border-t border-border">
          <h1 className="text-xl font-semibold tracking-tight">{asset.title}</h1>
          <span className="flex items-center gap-1.5 text-sm text-muted shrink-0">
            <Eye className="h-4 w-4" />
            {asset.views}
          </span>
        </div>
      </div>
    </main>
  );
}
