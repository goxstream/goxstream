"use client";

import { use } from "react";
import { notFound } from "next/navigation";
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
      <WatchContainer
        details={details}
        episodes={episodes}
        recommendations={recommendations}
        isLoading={isLoading}
      />
    </div>
  );
}
