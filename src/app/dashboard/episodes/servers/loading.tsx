import { Skeleton } from "@/components/ui/skeleton";

export default function ServersLoading() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center pb-2 border-b border-border/60">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-36" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-4 rounded-xl border border-border/60 bg-card space-y-4">
            <div className="flex justify-between">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-5 w-20" />
            </div>
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ))}
      </div>

      <div className="p-6 rounded-xl border border-border/60 bg-card space-y-3">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-16 w-full" />
      </div>
    </div>
  );
}
