"use client";

import Link from "next/link";
import { LayoutGrid, List, SearchX, Star, Play, Tv } from "lucide-react";
import { AnimeCard } from "@/components/anime-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getImageStyle } from "@/lib/utils";
import type { AnimeItem } from "@/types/anime";

import type { BrowseGridProps } from "../types";

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
      {/* Grid Top Toolbar: Stats & View Toggle */}
      <div className="flex items-center justify-between border-b border-border/60 pb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{totalResults}</span>
          <span>{totalResults === 1 ? "anime found" : "anime found"}</span>
          <span className="text-muted-foreground/40">•</span>
          <span className="text-xs text-muted-foreground">
            Total library: {totalAnimeCount}
          </span>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border/60">
          <button
            type="button"
            onClick={() => onViewModeChange("grid")}
            className={`p-1.5 rounded-lg transition-all ${
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
            className={`p-1.5 rounded-lg transition-all ${
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

      {/* Loading Skeleton State matching active viewMode */}
      {isLoading ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
            {Array.from({ length: 12 }).map((_, i) => (
              <AnimeCard key={i} variant="grid" isLoading={true} />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <AnimeCard key={i} variant="list" isLoading={true} />
            ))}
          </div>
        )
      ) : items.length === 0 ? (
        /* No Results Empty State */
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl border border-dashed border-border/80 bg-card/40 my-6 space-y-4">
          <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <SearchX className="size-8" />
          </div>
          <div className="space-y-1.5 max-w-md">
            <h3 className="font-bold text-lg text-foreground">No anime found</h3>
            <p className="text-sm text-muted-foreground">
              We couldn&apos;t find any anime matching your current search query or active filter criteria.
            </p>
          </div>
          <Button onClick={onResetFilters} variant="default" className="rounded-xl font-semibold">
            Reset All Filters
          </Button>
        </div>
      ) : viewMode === "grid" ? (
        /* Grid View */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
          {items.map((anime) => (
            <AnimeCard key={anime.id} variant="grid" anime={anime} />
          ))}
        </div>
      ) : (
        /* Compact List View */
        <div className="space-y-3">
          {items.map((anime) => (
            <AnimeCard key={anime.id} variant="list" anime={anime} />
          ))}
        </div>
      )}
    </div>
  );
}
