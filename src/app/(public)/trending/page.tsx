"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingHeader } from "./components/trending-header";
import { TrendingHero } from "./components/trending-hero";
import { TrendingTabs } from "./components/trending-tabs";
import { TrendingGenreFilter } from "./components/trending-genre-filter";
import { TrendingGrid } from "./components/trending-grid";
import { useTrendingRankings } from "@/hooks/use-trending-rankings";
import type { TrendingPeriod } from "@/types/anime";

const TRENDING_GENRES = [
  "All",
  "Action",
  "Adventure",
  "Fantasy",
  "Sci-Fi",
  "Romance",
  "Isekai",
  "Slice of Life",
];

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
      {isLoading ? (
        <Skeleton className="w-full aspect-[21/9] sm:aspect-[25/8] rounded-2xl" />
      ) : (
        topRankedAnime && <TrendingHero topAnime={topRankedAnime} />
      )}

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
