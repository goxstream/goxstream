"use client";

import { X, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ActiveFiltersBarProps } from "../../types";

export function ActiveFiltersBar({
  query,
  genre,
  status,
  format,
  audio,
  season,
  year,
  activeFiltersCount,
  onQueryChange,
  onGenreChange,
  onStatusChange,
  onFormatChange,
  onAudioChange,
  onSeasonChange,
  onYearChange,
  onResetFilters,
}: ActiveFiltersBarProps) {
  if (activeFiltersCount === 0) return null;

  // Extract individual active genres array
  const activeGenres =
    genre && genre !== "All"
      ? genre.split(",").map((g) => g.trim()).filter(Boolean)
      : [];

  const removeSingleGenre = (targetGenre: string) => {
    const updated = activeGenres.filter((g) => g !== targetGenre);
    if (updated.length === 0) {
      onGenreChange("All");
    } else {
      onGenreChange(updated.join(","));
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-border/40">
      <span className="text-xs font-semibold text-muted-foreground">Active:</span>

      {query && (
        <Badge
          variant="secondary"
          className="bg-primary/10 text-primary border border-primary/20 text-xs font-medium px-2.5 py-1 flex items-center gap-1.5 rounded-lg"
        >
          <span>Search: &quot;{query}&quot;</span>
          <button
            type="button"
            onClick={() => onQueryChange("")}
            className="hover:opacity-75"
            aria-label="Remove search filter"
          >
            <X className="size-3" />
          </button>
        </Badge>
      )}

      {/* Individual Badges for Each Selected Genre */}
      {activeGenres.map((singleGenre) => (
        <Badge
          key={singleGenre}
          variant="secondary"
          className="bg-primary/10 text-primary border border-primary/20 text-xs font-medium px-2.5 py-1 flex items-center gap-1.5 rounded-lg"
        >
          <span>Genre: {singleGenre}</span>
          <button
            type="button"
            onClick={() => removeSingleGenre(singleGenre)}
            className="hover:opacity-75"
            aria-label={`Remove ${singleGenre} genre filter`}
          >
            <X className="size-3" />
          </button>
        </Badge>
      ))}

      {status !== "All" && (
        <Badge
          variant="secondary"
          className="bg-primary/10 text-primary border border-primary/20 text-xs font-medium px-2.5 py-1 flex items-center gap-1.5 rounded-lg"
        >
          <span>Status: {status}</span>
          <button
            type="button"
            onClick={() => onStatusChange("All")}
            className="hover:opacity-75"
            aria-label="Remove status filter"
          >
            <X className="size-3" />
          </button>
        </Badge>
      )}

      {format !== "All" && (
        <Badge
          variant="secondary"
          className="bg-primary/10 text-primary border border-primary/20 text-xs font-medium px-2.5 py-1 flex items-center gap-1.5 rounded-lg"
        >
          <span>Type: {format}</span>
          <button
            type="button"
            onClick={() => onFormatChange("All")}
            className="hover:opacity-75"
            aria-label="Remove format filter"
          >
            <X className="size-3" />
          </button>
        </Badge>
      )}

      {audio !== "All" && (
        <Badge
          variant="secondary"
          className="bg-primary/10 text-primary border border-primary/20 text-xs font-medium px-2.5 py-1 flex items-center gap-1.5 rounded-lg"
        >
          <span>Audio: {audio}</span>
          <button
            type="button"
            onClick={() => onAudioChange("All")}
            className="hover:opacity-75"
            aria-label="Remove audio filter"
          >
            <X className="size-3" />
          </button>
        </Badge>
      )}

      {season !== "All" && (
        <Badge
          variant="secondary"
          className="bg-primary/10 text-primary border border-primary/20 text-xs font-medium px-2.5 py-1 flex items-center gap-1.5 rounded-lg"
        >
          <span>Season: {season}</span>
          <button
            type="button"
            onClick={() => onSeasonChange("All")}
            className="hover:opacity-75"
            aria-label="Remove season filter"
          >
            <X className="size-3" />
          </button>
        </Badge>
      )}

      {year !== "All" && (
        <Badge
          variant="secondary"
          className="bg-primary/10 text-primary border border-primary/20 text-xs font-medium px-2.5 py-1 flex items-center gap-1.5 rounded-lg"
        >
          <span>Year: {year}</span>
          <button
            type="button"
            onClick={() => onYearChange("All")}
            className="hover:opacity-75"
            aria-label="Remove year filter"
          >
            <X className="size-3" />
          </button>
        </Badge>
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={onResetFilters}
        className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 ml-auto font-medium"
      >
        <RotateCcw className="size-3" />
        Reset All ({activeFiltersCount})
      </Button>
    </div>
  );
}
