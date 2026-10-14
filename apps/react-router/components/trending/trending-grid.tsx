import { AnimeCard } from "@/components/anime/anime-card";
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
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <AnimeCard key={i} variant="grid" isLoading={true} />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="border-border space-y-3 rounded-xl border border-dashed py-16 text-center">
        <p className="text-foreground text-base font-semibold">
          No trending anime found for genre "{selectedGenre}".
        </p>
        <button
          onClick={onResetGenre}
          aria-label="Reset genre filter to view all trending anime"
          className="text-primary cursor-pointer text-xs font-bold hover:underline"
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
          ? "grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 lg:grid-cols-5"
          : "space-y-3"
      }
    >
      {rankedItems.map((anime) => (
        <TrendingItemCard key={anime.id} anime={anime} period={period} viewMode={viewMode} />
      ))}
    </div>
  );
}
