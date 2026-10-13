"use client";

import type { AnimeItem, EpisodeItem } from "@/types/anime";
import { EpisodeListCard } from "./sidebar/episode-list-card";
import { RecommendationsCard } from "./sidebar/recommendations-card";

interface EpisodeSidebarProps {
  anime: AnimeItem;
  episodes: EpisodeItem[];
  currentEpisodeNumber: number;
  recommendations: AnimeItem[];
  hideEpisodeList?: boolean;
}

export function EpisodeSidebar({
  anime,
  episodes,
  currentEpisodeNumber,
  recommendations,
  hideEpisodeList = false,
}: EpisodeSidebarProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="hidden lg:block">
        <EpisodeListCard
          anime={anime}
          episodes={episodes}
          currentEpisodeNumber={currentEpisodeNumber}
        />
      </div>

      <RecommendationsCard recommendations={recommendations} />
    </div>
  );
}
