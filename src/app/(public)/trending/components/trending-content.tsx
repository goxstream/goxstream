"use client";

import { useState } from "react";
import { TrendingHero } from "./trending-hero";
import { TrendingTabs } from "./trending-tabs";
import { TrendingGenreFilter } from "./trending-genre-filter";
import { TrendingGrid } from "./trending-grid";
import { useTrendingRankings } from "@/hooks/use-trending-rankings";
import { TRENDING_GENRES } from "../constants";
import type { TrendingPeriod } from "@/types/anime";

export function TrendingContent() {
  const [period, setPeriod] = useState<TrendingPeriod>("weekly");
  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const { animeList, isLoading } = useTrendingRankings(period, selectedGenre);
  const topRankedAnime = animeList[0];

  return (
    <div className="space-y-8">
      <TrendingHero topAnime={topRankedAnime} isLoading={isLoading} />
      <TrendingTabs
        activePeriod={period}
        onPeriodChange={setPeriod}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalCount={animeList.length}
      />
      <TrendingGenreFilter
        genres={TRENDING_GENRES}
        selectedGenre={selectedGenre}
        onGenreSelect={setSelectedGenre}
      />
      <TrendingGrid
        items={animeList}
        period={period}
        viewMode={viewMode}
        selectedGenre={selectedGenre}
        onResetGenre={() => setSelectedGenre("All")}
        isLoading={isLoading}
      />
    </div>
  );
}
