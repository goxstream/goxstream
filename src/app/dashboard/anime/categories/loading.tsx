import { Skeleton } from "@/components/ui/skeleton";

export default function CategoriesLoading() {
  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-7xl mx-auto w-full">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-5">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-64 rounded-lg" />
          <Skeleton className="h-4 w-96 rounded-md" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-32 rounded-lg" />
          <Skeleton className="h-9 w-36 rounded-lg" />
        </div>
      </div>

      {/* Stats Skeleton Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-4 border border-border/60 bg-card/60 rounded-xl flex justify-between items-center">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-3 w-24 rounded" />
              <Skeleton className="h-7 w-32 rounded-md" />
              <Skeleton className="h-3 w-28 rounded" />
            </div>
            <Skeleton className="size-10 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Tabs Skeleton */}
      <div className="flex flex-col gap-4">
        <Skeleton className="h-9 w-64 rounded-lg" />

        {/* Table Rows Skeleton */}
        <div className="border border-border/60 rounded-xl overflow-hidden p-4 flex flex-col gap-3 bg-card/40">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-4 py-2 border-b border-border/30 last:border-0">
              <Skeleton className="h-5 w-16 rounded" />
              <Skeleton className="h-5 w-40 rounded" />
              <Skeleton className="h-5 w-24 rounded" />
              <Skeleton className="h-5 w-16 rounded" />
              <Skeleton className="h-5 w-12 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
