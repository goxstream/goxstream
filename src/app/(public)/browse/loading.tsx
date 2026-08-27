import { Skeleton } from "@/components/ui/skeleton";

export default function BrowseLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Skeleton Banner */}
      <div className="space-y-4">
        <Skeleton className="h-4 w-32 rounded-lg" />
        <Skeleton className="h-9 w-64 md:w-96 rounded-xl" />
        <Skeleton className="h-5 w-full max-w-xl rounded-lg" />
      </div>

      {/* Filter Controls Skeleton */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <Skeleton className="h-11 flex-1 rounded-xl" />
          <div className="hidden lg:flex gap-2.5">
            <Skeleton className="h-11 w-32 rounded-xl" />
            <Skeleton className="h-11 w-32 rounded-xl" />
            <Skeleton className="h-11 w-32 rounded-xl" />
            <Skeleton className="h-11 w-32 rounded-xl" />
          </div>
        </div>

        {/* Genre Pills Skeleton Ribbon */}
        <div className="flex gap-2 overflow-x-auto pb-1 pt-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-20 shrink-0 rounded-xl" />
          ))}
        </div>
      </div>

      {/* Grid Toolbar Skeleton */}
      <div className="flex items-center justify-between border-b border-border/60 pb-4">
        <Skeleton className="h-5 w-40 rounded-lg" />
        <Skeleton className="h-8 w-20 rounded-xl" />
      </div>

      {/* 12 Card Grid Skeletons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="flex flex-col rounded-xl overflow-hidden bg-card border border-border/60">
            <Skeleton className="aspect-[3/4] w-full" />
            <div className="p-3.5 space-y-2">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-3 w-2/3 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
