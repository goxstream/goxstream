import { LayoutGrid, List, SearchX } from "lucide-react";
import { AnimeCard } from "@/components/anime/anime-card";
import { Button } from "@shionstream/ui/components/button";
import type { AnimeItem } from "@/types/anime";

export interface BrowseGridProps {
  items: AnimeItem[];
  totalResults: number;
  totalAnimeCount: number;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  onResetFilters: () => void;
  isLoading: boolean;
}

export function BrowseGrid({
  items,
  totalResults,
  totalAnimeCount,
  viewMode,
  onViewModeChange,
  onResetFilters,
  isLoading,
}: BrowseGridProps) {
  return (
    <div className="space-y-6">
      <div className="border-border/60 flex items-center justify-between border-b pb-4">
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <span className="text-foreground font-semibold">{totalResults}</span>
          <span>{totalResults === 1 ? "anime found" : "anime found"}</span>
          <span className="text-muted-foreground/40">•</span>
          <span className="text-muted-foreground text-xs">Total library: {totalAnimeCount}</span>
        </div>

        <div className="bg-muted/60 border-border/60 flex items-center gap-1 rounded-xl border p-1">
          <button
            type="button"
            onClick={() => onViewModeChange("grid")}
            className={`rounded-lg p-1.5 transition-all ${
              viewMode === "grid"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title="Grid View"
            aria-label="Switch to Grid View"
          >
            <LayoutGrid className="size-4" />
          </button>

          <button
            type="button"
            onClick={() => onViewModeChange("list")}
            className={`rounded-lg p-1.5 transition-all ${
              viewMode === "list"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title="List View"
            aria-label="Switch to List View"
          >
            <List className="size-4" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
              : "flex flex-col gap-3"
          }
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <AnimeCard key={i} isLoading={true} variant={viewMode} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="border-border/60 bg-card/40 flex flex-col items-center justify-center rounded-2xl border p-12 text-center">
          <div className="bg-muted/80 text-muted-foreground mb-4 flex size-14 items-center justify-center rounded-2xl">
            <SearchX className="size-7" />
          </div>
          <h3 className="text-foreground text-lg font-bold">No matching anime found</h3>
          <p className="text-muted-foreground mt-1 max-w-sm text-sm leading-relaxed">
            We couldn&apos;t find any anime matching your selected criteria. Try loosening your
            filters or clearing your search query.
          </p>
          <Button
            variant="outline"
            onClick={onResetFilters}
            className="border-border/80 mt-6 h-9 rounded-xl text-xs font-semibold"
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
              : "flex flex-col gap-3"
          }
        >
          {items.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} variant={viewMode} />
          ))}
        </div>
      )}
    </div>
  );
}
