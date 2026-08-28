"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { useAnimeDetails } from "@/hooks/use-anime-details";
import { AnimeHero } from "./components/anime-hero";
import { AnimeMetadata } from "./components/anime-metadata";
import { EpisodeList } from "./components/episode-list";
import { AnimeRecommendations } from "./components/anime-recommendations";

interface AnimePageProps {
  params: Promise<{ slug: string }>;
}

export default function AnimeDetailsPage({ params }: AnimePageProps) {
  const { slug } = use(params);
  const { anime, episodes, recommendations, isLoading, notFoundError } = useAnimeDetails(slug);

  if (notFoundError) {
    notFound();
  }

  const latestEpNum = episodes && episodes.length > 0 ? Math.max(...episodes.map((e) => e.episodeNumber)) : 1;

  return (
    <div className="flex-1 space-y-6">
      {/* 1. Hero Spotlight & Poster Header */}
      <AnimeHero anime={anime} latestEpisodeNum={latestEpNum} isLoading={isLoading} />

      <div className="container mx-auto px-4 space-y-8">
        {/* 2. Anime Metadata & Specs Grid */}
        <AnimeMetadata anime={anime} isLoading={isLoading} />

        {/* 3. Episode Stream List Grid */}
        <EpisodeList episodes={episodes} animeSlug={anime?.slug || slug} isLoading={isLoading} />

        {/* 4. Similar Recommendations Carousel */}
        {recommendations && recommendations.length > 0 && (
          <AnimeRecommendations recommendations={recommendations} />
        )}
      </div>
    </div>
  );
}
