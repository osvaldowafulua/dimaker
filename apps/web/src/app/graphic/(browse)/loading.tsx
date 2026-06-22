import { GraphicMockupGridSkeleton } from '@/components/graphic/graphic-grid-skeleton';

export default function GraphicBrowseLoading() {
  return (
    <div className="mt-2 min-h-[50vh]">
      <div className="mb-3 space-y-3">
        <div className="mt-3 flex flex-wrap justify-center gap-2 md:justify-between">
          <div className="h-10 w-60 animate-pulse rounded-md bg-muted-surface" />
          <div className="h-10 flex-1 max-w-xl animate-pulse rounded-md bg-muted-surface/60" />
        </div>
        <div className="flex justify-end gap-2">
          <div className="h-10 w-60 animate-pulse rounded-md bg-muted-surface" />
          <div className="h-10 w-28 animate-pulse rounded-md bg-muted-surface" />
        </div>
      </div>
      <GraphicMockupGridSkeleton cols={5} count={15} />
    </div>
  );
}
