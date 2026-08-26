import { Skeleton } from "@/components/ui/skeleton";

export default function SeasonsLoading() {
  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-7xl mx-auto w-full">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-5">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-72 rounded-lg" />
          <Skeleton className="h-4 w-96 rounded-md" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-48 rounded-lg" />
          <Skeleton className="h-9 w-32 rounded-lg" />
        </div>
      </div>

      {/* Stats Skeleton */}
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

      {/* Weekly Broadcast Matrix Skeleton */}
      <div className="flex flex-col gap-3">
        <Skeleton className="h-6 w-64 rounded-md" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="p-3 border border-border/60 rounded-xl bg-card/40 flex flex-col gap-3 h-48">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-16 w-full rounded-lg" />
              <Skeleton className="h-16 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
