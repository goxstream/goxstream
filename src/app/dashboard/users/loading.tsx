import { Skeleton } from "@/components/ui/skeleton";

export default function UserDirectoryLoading() {
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-7 w-48 rounded-md" />
          <Skeleton className="h-4 w-80 rounded-md" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-28 rounded-md" />
        </div>
      </div>

      {/* Stat Cards Skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border/60 p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3.5 w-28 rounded" />
              <Skeleton className="size-8 rounded-md" />
            </div>
            <Skeleton className="mt-3 h-8 w-16 rounded" />
            <Skeleton className="mt-2 h-3 w-36 rounded" />
          </div>
        ))}
      </div>

      {/* Filter Bar Skeleton */}
      <div className="flex flex-col gap-3 rounded-lg border border-border/60 p-3 shadow-xs md:flex-row md:items-center md:justify-between">
        <Skeleton className="h-9 w-full md:max-w-xs rounded-md" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-[130px] rounded-md" />
          <Skeleton className="h-9 w-[130px] rounded-md" />
          <Skeleton className="h-9 w-[130px] rounded-md" />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="rounded-lg border border-border/60 shadow-xs overflow-hidden">
        <div className="p-4 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Skeleton className="size-9 rounded-full" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-32 rounded" />
                  <Skeleton className="h-3 w-44 rounded" />
                </div>
              </div>
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-5 w-16 rounded" />
              <Skeleton className="h-4 w-20 rounded" />
              <Skeleton className="size-8 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
