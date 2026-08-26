import { Skeleton } from "@/components/ui/skeleton";

export function ScheduleSkeleton() {
  return (
    <div className="container mx-auto px-4 py-6 md:py-8 space-y-6 max-w-7xl">
      {/* Header Skeleton */}
      <div className="rounded-xl border border-border/60 bg-card/60 p-5 md:p-6 space-y-4">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="w-8 h-8 rounded-lg" />
              <Skeleton className="w-48 h-8 rounded-md" />
              <Skeleton className="w-24 h-6 rounded-full" />
            </div>
            <Skeleton className="w-80 md:w-96 h-4 rounded-md" />
          </div>
          <Skeleton className="w-36 h-9 rounded-lg" />
        </div>
        <Skeleton className="w-full h-10 rounded-md" />
      </div>

      {/* Day Tabs Skeleton */}
      <div className="w-full overflow-hidden">
        <div className="flex items-center gap-2 p-1 border border-border/60 rounded-xl">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-10 flex-1 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Timeline Items Skeleton */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/40">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="relative">
            <Skeleton className="absolute -left-6 top-4 w-4 h-4 rounded-full" />
            <div className="rounded-xl border border-border/60 bg-card/60 p-4 md:p-5 flex flex-col sm:flex-row gap-4">
              <Skeleton className="w-24 sm:w-28 aspect-2/3 rounded-lg shrink-0" />
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="w-20 h-5 rounded-md" />
                  <Skeleton className="w-28 h-5 rounded-md" />
                </div>
                <Skeleton className="w-3/4 h-6 rounded-md" />
                <Skeleton className="w-1/2 h-4 rounded-md" />
                <div className="flex gap-2">
                  <Skeleton className="w-16 h-5 rounded" />
                  <Skeleton className="w-16 h-5 rounded" />
                  <Skeleton className="w-16 h-5 rounded" />
                </div>
                <div className="pt-3 border-t border-border/40 flex justify-between items-center">
                  <Skeleton className="w-32 h-4 rounded" />
                  <Skeleton className="w-32 h-8 rounded-md" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
