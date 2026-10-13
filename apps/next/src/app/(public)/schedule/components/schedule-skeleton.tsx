import { Skeleton } from "@/components/ui/skeleton";

export function ScheduleSkeleton() {
  return (
    <div className="container mx-auto max-w-7xl space-y-6 px-4 py-6 md:py-8">
      {/* Header Skeleton */}
      <div className="border-border/60 bg-card/60 space-y-4 rounded-xl border p-5 md:p-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-8 w-48 rounded-md" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            <Skeleton className="h-4 w-80 rounded-md md:w-96" />
          </div>
          <Skeleton className="h-9 w-36 rounded-lg" />
        </div>
        <Skeleton className="h-10 w-full rounded-md" />
      </div>

      {/* Day Tabs Skeleton */}
      <div className="w-full overflow-hidden">
        <div className="border-border/60 flex items-center gap-2 rounded-xl border p-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-10 flex-1 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Timeline Items Skeleton */}
      <div className="before:bg-border/40 relative space-y-6 pl-6 before:absolute before:top-2 before:bottom-2 before:left-2 before:w-0.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="relative">
            <Skeleton className="absolute top-4 -left-6 h-4 w-4 rounded-full" />
            <div className="border-border/60 bg-card/60 flex flex-col gap-4 rounded-xl border p-4 sm:flex-row md:p-5">
              <Skeleton className="aspect-2/3 w-24 shrink-0 rounded-lg sm:w-28" />
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-20 rounded-md" />
                  <Skeleton className="h-5 w-28 rounded-md" />
                </div>
                <Skeleton className="h-6 w-3/4 rounded-md" />
                <Skeleton className="h-4 w-1/2 rounded-md" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-16 rounded" />
                  <Skeleton className="h-5 w-16 rounded" />
                  <Skeleton className="h-5 w-16 rounded" />
                </div>
                <div className="border-border/40 flex items-center justify-between border-t pt-3">
                  <Skeleton className="h-4 w-32 rounded" />
                  <Skeleton className="h-8 w-32 rounded-md" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
