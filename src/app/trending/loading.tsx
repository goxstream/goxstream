import { Skeleton } from "@/components/ui/skeleton";

export default function TrendingLoading() {
  return (
    <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
      {/* Header Skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-9 w-72 rounded-lg" />
        <Skeleton className="h-4 w-96 max-w-full rounded-md" />
      </div>

      {/* Hero Banner Skeleton */}
      <div className="rounded-2xl border border-border/60 p-6 md:p-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex gap-2">
              <Skeleton className="h-6 w-32 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            <Skeleton className="h-10 w-3/4 rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
            <div className="flex gap-4 pt-4">
              <Skeleton className="h-11 w-40 rounded-xl" />
              <Skeleton className="h-11 w-32 rounded-xl" />
            </div>
          </div>
          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <Skeleton className="w-56 aspect-[2/3] rounded-xl" />
          </div>
        </div>
      </div>

      {/* Controls & Filter Skeletons */}
      <div className="flex justify-between gap-4">
        <Skeleton className="h-12 w-80 rounded-xl" />
        <Skeleton className="h-10 w-24 rounded-lg" />
      </div>

      <div className="flex gap-2 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-full shrink-0" />
        ))}
      </div>

      {/* List Items Skeleton */}
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-4 rounded-xl border border-border/60 gap-4"
          >
            <div className="flex items-center gap-4">
              <Skeleton className="size-9 rounded-xl" />
              <Skeleton className="size-16 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-48 rounded-md" />
                <Skeleton className="h-4 w-32 rounded-md" />
              </div>
            </div>
            <Skeleton className="h-9 w-24 rounded-lg" />
          </div>
        ))}
      </div>
    </main>
  );
}
