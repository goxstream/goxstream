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

      {/* No Results Empty State */}
      {items.length === 0 && (
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
      )}

      {/* Grid View */}
      {items.length > 0 && viewMode === "grid" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
          {items.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>
      )}

      {/* Compact List View */}
      {items.length > 0 && viewMode === "list" && (
        <div className="space-y-3">
          {items.map((anime) => {
            const isGradient = anime.coverImage && anime.coverImage.startsWith("linear-gradient");

            return (
              <Link
                key={anime.id}
                href={`/anime/${anime.slug}`}
                className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-card border border-border/70 hover:border-primary/60 transition-all duration-200"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {/* Thumbnail */}
                  <div className="relative size-16 sm:size-20 rounded-lg shrink-0 overflow-hidden bg-muted flex items-center justify-center">
                    {isGradient ? (
                      <div
                        className="absolute inset-0 size-full"
                        style={getImageStyle(anime.coverImage)}
                      />
                    ) : (
                      <img
                        src={anime.coverImage || ""}
                        alt={anime.title}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 size-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.opacity = "0";
                        }}
                      />
                    )}
                    <Play className="relative size-6 text-white/80 fill-white/80 group-hover:scale-110 transition-transform z-10" />
                  </div>

                  {/* Info */}
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-base text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                        {anime.title}
                      </h3>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        {anime.type}
                      </Badge>
                    </div>
                    {anime.japaneseTitle && (
                      <p className="text-xs text-muted-foreground/80 line-clamp-1">
                        {anime.japaneseTitle}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {anime.genres.join(" • ")}
                    </p>
                  </div>
                </div>

                {/* Stats & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto text-xs text-muted-foreground border-t sm:border-t-0 border-border/40 pt-2 sm:pt-0">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 font-semibold text-amber-500">
                      <Star className="size-3.5 fill-amber-500 stroke-amber-500" />
                      {anime.rating ? anime.rating.toFixed(1) : "N/A"}
                    </span>
                    <span>{anime.year}</span>
                    <span className="flex items-center gap-1">
                      <Tv className="size-3.5" />
                      {anime.episodesCount} Eps
                    </span>
                  </div>
                  <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-semibold">
                    {anime.status}
                  </Badge>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
