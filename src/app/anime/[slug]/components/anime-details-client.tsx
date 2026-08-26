"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { useAnimeDetails } from "@/hooks/use-anime-details";
import { AnimeHero } from "./anime-hero";
import { AnimeMetadata } from "./anime-metadata";
import { EpisodeList } from "./episode-list";
import { AnimeRecommendations } from "./anime-recommendations";
import { AnimeDetailsSkeleton } from "./anime-skeleton";

interface AnimeDetailsClientProps {
  paramsPromise: Promise<{ slug: string }>;
}

export function AnimeDetailsClient({ paramsPromise }: AnimeDetailsClientProps) {
  const { slug } = use(paramsPromise);
  const { anime, episodes, recommendations, isLoading, notFoundError } = useAnimeDetails(slug);

  if (notFoundError) {
    notFound();
  }

  if (isLoading || !anime) {
    return <AnimeDetailsSkeleton />;
  }

  const latestEpNum = episodes.length > 0 ? Math.max(...episodes.map((e) => e.episodeNumber)) : 1;

  return (
    <main className="flex-1">
      <AnimeHero anime={anime} latestEpisodeNum={latestEpNum} />

      <div className="container mx-auto px-4">
        <AnimeMetadata anime={anime} />
        <EpisodeList episodes={episodes} animeSlug={anime.slug} />
        <AnimeRecommendations recommendations={recommendations} />
      </div>
    </main>
  );
}
