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
      <div className="border-border/60 flex items-center justify-between border-b pb-4">
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <span className="text-foreground font-semibold">{totalResults}</span>
          <span>{totalResults === 1 ? "anime found" : "anime found"}</span>
          <span className="text-muted-foreground/40">•</span>
          <span className="text-muted-foreground text-xs">Total library: {totalAnimeCount}</span>
        </div>

        {/* View Mode Toggle */}
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

      {/* Loading Skeleton State matching active viewMode */}
      {isLoading ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
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
        <div className="border-border/80 bg-card/40 my-6 flex flex-col items-center justify-center space-y-4 rounded-2xl border border-dashed px-4 py-16 text-center">
          <div className="bg-primary/10 text-primary flex size-16 items-center justify-center rounded-full">
            <SearchX className="size-8" />
          </div>
          <div className="max-w-md space-y-1.5">
            <h3 className="text-foreground text-lg font-bold">No anime found</h3>
            <p className="text-muted-foreground text-sm">
              We couldn&apos;t find any anime matching your current search query or active filter
              criteria.
            </p>
          </div>
          <Button onClick={onResetFilters} variant="default" className="rounded-xl font-semibold">
            Reset All Filters
          </Button>
        </div>
      ) : viewMode === "grid" ? (
        /* Grid View */
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
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
