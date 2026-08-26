import { Skeleton } from "@/components/ui/skeleton";

export default function EpisodesLoading() {
  return (
    <div className="space-y-6 p-6">
      {/* Header skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-2 border-b border-border/60">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-32" />
        </div>
      </div>

      {/* Stats cards skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="p-4 rounded-xl border border-border/60 bg-card space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-7 w-16" />
          </div>
        ))}
      </div>

      {/* Filters skeleton */}
      <div className="h-16 rounded-xl border border-border/60 bg-card p-4 flex items-center justify-between">
        <div className="flex gap-3">
          <Skeleton className="h-9 w-60" />
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-9 w-36" />
        </div>
        <Skeleton className="h-9 w-32" />
      </div>

      {/* Table skeleton */}
      <div className="rounded-xl border border-border/60 bg-card p-4 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
            <div className="flex items-center gap-3">
              <Skeleton className="size-12 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
