"use client";

import { AnimeCard } from "@/components/anime-card";
import { TrendingItemCard } from "./trending-item-card";
import type { TrendingAnimeItem, TrendingPeriod } from "@/types/anime";

interface TrendingGridProps {
  items: TrendingAnimeItem[];
  period: TrendingPeriod;
  viewMode: "list" | "grid";
  selectedGenre: string;
  onResetGenre: () => void;
  isLoading?: boolean;
}

export function TrendingGrid({
  items,
  period,
  viewMode,
  selectedGenre,
  onResetGenre,
  isLoading,
}: TrendingGridProps) {
  if (isLoading) {
    if (viewMode === "list") {
      return (
        <div className="space-y-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <AnimeCard key={i} variant="list" isLoading={true} />
          ))}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <AnimeCard key={i} variant="grid" isLoading={true} />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16 border border-dashed border-border rounded-xl space-y-3">
        <p className="text-base font-semibold text-foreground">
          No trending anime found for genre "{selectedGenre}".
        </p>
        <button
          onClick={onResetGenre}
          aria-label="Reset genre filter to view all trending anime"
          className="text-xs text-primary font-bold hover:underline cursor-pointer"
        >
          Reset genre filter
        </button>
      </div>
    );
  }

  const rankedItems = viewMode === "grid" ? items : items.slice(1);

  return (
    <div
      className={
        viewMode === "grid"
          ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6"
          : "space-y-3"
      }
    >
      {rankedItems.map((anime) => (
        <TrendingItemCard
          key={anime.id}
          anime={anime}
          period={period}
          viewMode={viewMode}
        />
      ))}
    </div>
  );
}
