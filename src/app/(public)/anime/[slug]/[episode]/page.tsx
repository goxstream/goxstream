"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useWatchDetails } from "@/hooks/use-watch-details";
import { WatchContainer } from "./components/watch-container";

interface WatchPageProps {
  params: Promise<{ slug: string; episode: string }>;
}

export default function WatchEpisodePage({ params }: WatchPageProps) {
  const { slug, episode } = use(params);
  const { details, episodes, recommendations, isLoading, notFoundError } = useWatchDetails(
    slug,
    episode
  );

  if (notFoundError) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {isLoading || !details ? (
        <div className="w-full space-y-6">
          <Skeleton className="w-full aspect-video rounded-2xl" />
          <div className="space-y-3">
            <Skeleton className="h-7 w-2/3 rounded-md" />
            <Skeleton className="h-4 w-1/3 rounded-md" />
          </div>
          <div className="space-y-4 pt-4">
            <Skeleton className="h-6 w-40 rounded-md" />
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <WatchContainer
          details={details}
          episodes={episodes}
          recommendations={recommendations}
        />
      )}
    </div>
  );
}
