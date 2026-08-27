"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { useAnimeDetails } from "@/hooks/use-anime-details";
import { AnimeHero } from "./anime-hero";
import { AnimeMetadata } from "./anime-metadata";
import { EpisodeList } from "./episode-list";
import { AnimeRecommendations } from "./anime-recommendations";

interface AnimeDetailsClientProps {
  paramsPromise: Promise<{ slug: string }>;
}

export function AnimeDetailsClient({ paramsPromise }: AnimeDetailsClientProps) {
  const { slug } = use(paramsPromise);
  const { anime, episodes, recommendations, isLoading, notFoundError } = useAnimeDetails(slug);

  if (notFoundError) {
    notFound();
  }

  const latestEpNum = episodes && episodes.length > 0 ? Math.max(...episodes.map((e) => e.episodeNumber)) : 1;

  return (
    <main className="flex-1">
      <AnimeHero anime={anime} latestEpisodeNum={latestEpNum} isLoading={isLoading} />

      <div className="container mx-auto px-4">
        <AnimeMetadata anime={anime} isLoading={isLoading} />
        <EpisodeList episodes={episodes} animeSlug={anime?.slug || slug} isLoading={isLoading} />
        {recommendations && recommendations.length > 0 && (
          <AnimeRecommendations recommendations={recommendations} />
        )}
      </div>
    </main>
  );
}
