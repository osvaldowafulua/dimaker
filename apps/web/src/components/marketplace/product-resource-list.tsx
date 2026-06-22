'use client';

import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

export type ResourceItem = {
  id: string;
  title: string;
  slug: string;
  creator_handle: string;
  views?: number;
};

const FALLBACK: ResourceItem[] = [
  { id: '1', title: 'UI Logos Pack', slug: 'ui-logos', creator_handle: 'dimaker', views: 19 },
  { id: '2', title: '3D Icons Bundle', slug: '3d-icons', creator_handle: 'dimaker', views: 16 },
  { id: '3', title: 'Cool Shapes', slug: 'cool-shapes', creator_handle: 'dimaker', views: 23 },
  { id: '4', title: 'Font Pairing Kit', slug: 'font-kit', creator_handle: 'dimaker', views: 20 },
];

export function ProductResourceList({ items }: { items: ResourceItem[] }) {
  const list = items.length >= 4 ? items.slice(0, 8) : FALLBACK;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-6 space-y-2">
      {list.map((item) => (
        <details
          key={item.id}
          className="group rounded-2xl border border-border bg-card overflow-hidden open:bg-elevated/30"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 hover:bg-card/80 transition-colors [&::-webkit-details-marker]:hidden">
            <span className="font-medium text-sm sm:text-base">{item.title}</span>
            <span className="flex items-center gap-3 text-muted text-sm shrink-0">
              <span className="tabular-nums">{item.views ?? 0}</span>
              <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
            </span>
          </summary>
          <div className="border-t border-border px-5 py-4 text-sm text-muted">
            <p>Preview pack by @{item.creator_handle}</p>
            <Link
              href={`/creators/${item.creator_handle}/${item.slug}`}
              className="inline-block mt-3 text-foreground font-medium hover:underline"
            >
              Open resource →
            </Link>
          </div>
        </details>
      ))}
    </section>
  );
}
