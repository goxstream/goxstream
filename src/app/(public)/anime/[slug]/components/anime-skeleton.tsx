import { Skeleton } from "@/components/ui/skeleton";

export function AnimeDetailsSkeleton() {
  return (
    <div className="w-full space-y-8 animate-pulse">
      {/* Hero Section Skeleton */}
      <div className="border-b border-border/60 bg-card/20 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <Skeleton className="h-4 w-48 mb-6 rounded-md" />

          <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr] gap-8 items-start">
            {/* Poster Skeleton */}
            <Skeleton className="w-full max-w-[260px] md:max-w-none aspect-[2/3] rounded-xl" />

            {/* Meta & Actions Skeleton */}
            <div className="space-y-4">
              <div className="flex gap-2">
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <Skeleton className="h-9 w-3/4 max-w-lg rounded-md" />
              <Skeleton className="h-5 w-1/3 rounded-md" />
              <div className="space-y-2 pt-2">
                <Skeleton className="h-4 w-full max-w-2xl rounded-md" />
                <Skeleton className="h-4 w-5/6 rounded-md" />
                <Skeleton className="h-4 w-2/3 rounded-md" />
              </div>
              <div className="flex gap-4 pt-2">
                <Skeleton className="h-10 w-40 rounded-lg" />
                <Skeleton className="h-10 w-36 rounded-lg" />
                <Skeleton className="h-10 w-28 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metadata & Specs Skeleton */}
      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-28 w-full rounded-xl" />
        </div>
        <Skeleton className="h-72 w-full rounded-xl" />
      </div>

      {/* Episode Grid Skeleton */}
      <div className="container mx-auto px-4 space-y-4 pb-12">
        <div className="flex justify-between items-center">
          <Skeleton className="h-7 w-48 rounded-md" />
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-video w-full rounded-xl" />
              <Skeleton className="h-4 w-3/4 rounded-md" />
              <Skeleton className="h-3 w-1/2 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
