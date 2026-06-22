import { cn } from '@/lib/utils';

type Cols = 3 | 5 | 6;

const mockupColClass: Record<Cols, string> = {
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  5: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5',
  6: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6',
};

/** Skeleton for /graphic mockup cards (square + title bar) */
export function GraphicMockupGridSkeleton({ cols = 5, count = 15 }: { cols?: Cols; count?: number }) {
  return (
        <div className={cn('grid w-full min-w-0 grid-cols-2 gap-1 md:gap-3', mockupColClass[cols])}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="w-full min-w-0 overflow-hidden rounded-sm border border-border bg-card shadow-sm"
        >
          <div className="border-b border-dotted">
            <div className="aspect-square w-full animate-pulse bg-muted-surface" />
          </div>
          <div className="flex items-center justify-between gap-2 p-4">
            <div className="h-4 flex-1 animate-pulse rounded bg-stone-800/90" />
            <div className="hidden md:block h-4 w-10 animate-pulse rounded bg-stone-800/90" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Skeleton for stock sections — tall rounded tiles like designali svg-icons */
export function GraphicStockGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-[300px] w-full animate-pulse rounded-2xl bg-stone-800/80"
        />
      ))}
    </div>
  );
}
