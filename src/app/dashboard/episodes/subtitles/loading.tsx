import { Skeleton } from "@/components/ui/skeleton";

export default function SubtitlesLoading() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center pb-2 border-b border-border/60">
        <div className="space-y-2">
          <Skeleton className="h-8 w-72" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-40" />
        </div>
      </div>

      <div className="p-6 rounded-xl border border-border/60 bg-card space-y-4">
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-48 w-full" />
      </div>

      <div className="p-6 rounded-xl border border-border/60 bg-card space-y-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
}
