"use client";

import { useState } from "react";
import { TrendingHeader } from "./components/trending-header";
import { TrendingHero } from "./components/trending-hero";
import { TrendingTabs } from "./components/trending-tabs";
import { TrendingGenreFilter } from "./components/trending-genre-filter";
import { TrendingGrid } from "./components/trending-grid";
import { useTrendingRankings } from "@/hooks/use-trending-rankings";
import { TRENDING_GENRES } from "./constants";
import type { TrendingPeriod } from "@/types/anime";

export default function TrendingPage() {
  const [period, setPeriod] = useState<TrendingPeriod>("weekly");
  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const { animeList, isLoading } = useTrendingRankings(period, selectedGenre);
  const topRankedAnime = animeList[0];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
      {/* 1. Header Section */}
      <TrendingHeader />

      {/* 2. Spotlight Banner Section */}
      <TrendingHero topAnime={topRankedAnime} isLoading={isLoading} />

      {/* 3. Period & View Switcher Tabs */}
      <TrendingTabs
        activePeriod={period}
        onPeriodChange={setPeriod}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalCount={animeList.length}
      />

      {/* 4. Genre Filter Ribbon */}
      <TrendingGenreFilter
        genres={TRENDING_GENRES}
        selectedGenre={selectedGenre}
        onGenreSelect={setSelectedGenre}
      />

      {/* 5. Leaderboard Grid/List */}
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
