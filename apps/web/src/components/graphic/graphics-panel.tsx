'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { GRAPHIC_CATEGORIES, GRAPHICS } from '@/data/graphics';
import { GraphicCard } from './graphic-card';
import { cn } from '@/lib/utils';

type Sort = 'latest' | 'popular';
type Cols = 3 | 5 | 6;

function CategoryTab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        'inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full border px-3 py-1.5 text-sm font-medium ring-offset-background transition-all mx-1',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        active
          ? 'bg-black text-white shadow-sm dark:bg-white dark:text-black'
          : 'bg-transparent text-muted hover:text-foreground',
      )}
    >
      {children}
    </button>
  );
}

const colClass: Record<Cols, string> = {
  3: 'md:grid-cols-3',
  5: 'md:grid-cols-5',
  6: 'md:grid-cols-6',
};

export function GraphicsPanel() {
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<Sort>('latest');
  const [cols, setCols] = useState<Cols>(5);

  const filtered = useMemo(() => {
    let list = [...GRAPHICS];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((g) => g.title.toLowerCase().includes(q));
    }
    if (category !== 'All') {
      const c = category.toLowerCase();
      list = list.filter(
        (g) =>
          g.tags.some((t) => t.toLowerCase() === c || t.toLowerCase().includes(c)) ||
          g.title.toLowerCase().includes(c),
      );
    }
    if (sort === 'popular') {
      list.sort((a, b) => b.views - a.views);
    }
    return list;
  }, [search, category, sort]);

  return (
    <div
      role="tabpanel"
      className="mt-2 min-h-[50vh] ring-offset-background focus-visible:outline-none"
    >
      <div className="mb-3">
        <div className="mt-3 grid justify-items-center gap-2 md:flex md:justify-between">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search assets by title..."
            className="flex h-10 w-60 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          <div className="w-full overflow-hidden">
            <div
              role="tablist"
              className="inline-flex h-10 w-full items-center justify-center overflow-x-auto scrollbar-hide rounded-md bg-transparent p-1 text-center text-muted"
            >
              {GRAPHIC_CATEGORIES.map((cat) => (
                <CategoryTab
                  key={cat}
                  active={category === cat}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </CategoryTab>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-center gap-2 md:justify-end">
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="flex h-10 w-60 appearance-none items-center justify-between rounded-md border border-dotted border-input bg-background px-3 py-2 pr-9 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="latest">Latest</option>
              <option value="popular">Popular</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50" />
          </div>
          <div
            role="tablist"
            className="inline-flex h-10 items-center justify-center rounded-md bg-muted-surface p-1 text-muted"
          >
            {([3, 5, 6] as const).map((n) => (
              <button
                key={n}
                type="button"
                role="tab"
                aria-selected={cols === n}
                onClick={() => setCols(n)}
                className={cn(
                  'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all',
                  cols === n
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted hover:text-foreground',
                )}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-20 text-center text-sm text-muted">No graphics match your filters.</p>
      ) : (
        <div className={cn('grid grid-cols-2 gap-1 md:gap-3', colClass[cols])}>
          {filtered.map((asset) => (
            <GraphicCard key={asset.id} asset={asset} />
          ))}
        </div>
      )}
    </div>
  );
}
