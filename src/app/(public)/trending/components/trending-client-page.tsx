"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingHero } from "./trending-hero";
import { TrendingTabs } from "./trending-tabs";
import { TrendingGenreFilter } from "./trending-genre-filter";
import { TrendingItemCard } from "./trending-item-card";
import { useTrendingRankings } from "@/hooks/use-trending-rankings";
import type { TrendingPeriod } from "@/types/anime";

const TRENDING_GENRES = ["All", "Action", "Adventure", "Fantasy", "Sci-Fi", "Romance", "Isekai", "Slice of Life"];

export function TrendingClientPage() {
  const [period, setPeriod] = useState<TrendingPeriod>("weekly");
  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const { animeList: trendingAnimeList, isLoading } = useTrendingRankings(period, selectedGenre);

  // Rank #1 anime for hero spotlight
  const topRankedAnime = trendingAnimeList[0];
  // Remaining ranked anime list
  const rankedAnimeList = trendingAnimeList.slice(1);

  return (
    <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
      {/* Header Page Title */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
          Anime Trending Rankings
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary uppercase tracking-wider">
            Live Leaderboard
          </span>
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-3xl">
          Track real-time weekly simulcast popularity, monthly hyped titles, and all-time top streaming hits filtered by your favorite genres.
        </p>
      </div>

      {/* In-Component Skeleton Loader for Trending Spotlight & List */}
      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="w-full aspect-[21/9] sm:aspect-[25/8] rounded-2xl" />
          <div className="flex items-center gap-2 overflow-hidden pb-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-7 w-20 rounded-full shrink-0" />
            ))}
          </div>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/70">
                <Skeleton className="size-16 rounded-lg shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/3 rounded" />
                  <Skeleton className="h-3 w-1/4 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* #1 Trending Hero Spotlight Banner */}
          {topRankedAnime && <TrendingHero topAnime={topRankedAnime} />}

          {/* Control Toolbar: Period Tabs & View Switcher */}
          <TrendingTabs
            activePeriod={period}
            onPeriodChange={setPeriod}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            totalCount={trendingAnimeList.length}
          />

          {/* Genre Filter Chips (Multi-Genre Query Filter) */}
          <TrendingGenreFilter
            genres={TRENDING_GENRES}
            selectedGenre={selectedGenre}
            onGenreSelect={setSelectedGenre}
          />


          {/* Main Leaderboard List / Grid Display */}
          {trendingAnimeList.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-border rounded-xl space-y-3">
              <p className="text-base font-semibold text-foreground">
                No trending anime found for genre "{selectedGenre}".
              </p>
              <button
                onClick={() => setSelectedGenre("All")}
                aria-label="Reset genre filter to view all trending anime"
                className="text-xs text-primary font-bold hover:underline cursor-pointer"
              >
                Reset genre filter
              </button>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6"
                  : "space-y-3"
              }
            >
              {(viewMode === "grid" ? trendingAnimeList : rankedAnimeList).map(
                (anime) => (
                  <TrendingItemCard
                    key={anime.id}
                    anime={anime}
                    period={period}
                    viewMode={viewMode}
                  />
                )
              )}
            </div>
          )}
        </>
      )}
    </main>
  );
}
