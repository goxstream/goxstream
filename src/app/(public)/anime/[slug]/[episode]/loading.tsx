import { Skeleton } from "@/components/ui/skeleton";

export default function WatchEpisodeLoading() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Player Column */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Video Player Skeleton */}
          <Skeleton className="w-full aspect-video rounded-xl" />

          {/* Header Info Skeleton */}
          <div className="flex flex-col gap-3 py-4 border-b border-border/60">
            <Skeleton className="h-4 w-48 rounded" />
            <Skeleton className="h-7 w-3/4 rounded" />
            <Skeleton className="h-4 w-32 rounded" />

            {/* Server Switcher Bar Skeleton */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-border/60">
              <Skeleton className="h-4 w-36 rounded" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-24 rounded-lg" />
                <Skeleton className="h-8 w-24 rounded-lg" />
              </div>
            </div>

            {/* Toolbar & Synopsis Skeletons */}
            <div className="flex gap-2">
              <Skeleton className="h-8 w-28 rounded-lg" />
              <Skeleton className="h-8 w-32 rounded-lg" />
              <Skeleton className="h-8 w-20 rounded-lg" />
            </div>
            <Skeleton className="h-16 w-full rounded-xl" />
          </div>

          {/* Comments Skeleton */}
          <div className="p-4 rounded-xl border border-border/60 flex flex-col gap-4">
            <Skeleton className="h-5 w-40 rounded" />
            <Skeleton className="h-20 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="p-4 rounded-xl border border-border/60 flex flex-col gap-3">
            <Skeleton className="h-5 w-32 rounded" />
            <Skeleton className="h-8 w-full rounded-lg" />
            <div className="flex flex-col gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl border border-border/60 flex flex-col gap-3">
            <Skeleton className="h-5 w-36 rounded" />
            <div className="flex flex-col gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="w-14 h-18 rounded-md shrink-0" />
                  <div className="flex-1 flex flex-col gap-2">
                    <Skeleton className="h-4 w-full rounded" />
                    <Skeleton className="h-3 w-1/2 rounded" />
                    <Skeleton className="h-3 w-4/5 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
