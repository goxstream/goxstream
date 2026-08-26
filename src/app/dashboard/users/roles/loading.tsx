import { Skeleton } from "@/components/ui/skeleton";

export default function RolesAndAccessLoading() {
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-7 w-60 rounded-md" />
          <Skeleton className="h-4 w-96 rounded-md" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-36 rounded-md" />
          <Skeleton className="h-9 w-28 rounded-md" />
        </div>
      </div>

      {/* Role Cards Grid Skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border/60 p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="size-6 rounded" />
            </div>
            <Skeleton className="mt-3 h-10 w-full rounded" />
            <div className="mt-4 pt-2 flex justify-between border-t border-border/40">
              <Skeleton className="h-3 w-20 rounded" />
              <Skeleton className="h-3 w-16 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Matrix Table Skeleton */}
      <div className="rounded-lg border border-border/60 shadow-xs overflow-hidden">
        <div className="p-4 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <Skeleton className="h-4 w-40 rounded" />
                <Skeleton className="h-3 w-56 rounded" />
              </div>
              <Skeleton className="size-6 rounded" />
              <Skeleton className="size-6 rounded" />
              <Skeleton className="size-6 rounded" />
              <Skeleton className="size-6 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
