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

  return (
    <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-border/40">
      <span className="text-xs font-semibold text-muted-foreground">Active:</span>

      {query && (
        <Badge
          variant="secondary"
          className="bg-primary/10 text-primary border border-primary/20 text-xs font-medium px-2.5 py-1 flex items-center gap-1.5 rounded-lg"
        >
          <span>Search: &quot;{query}&quot;</span>
          <button onClick={() => onQueryChange("")} className="hover:opacity-75" aria-label="Remove search filter">
            <X className="size-3" />
          </button>
        </Badge>
      )}

      {genre !== "All" && (
        <Badge
          variant="secondary"
          className="bg-primary/10 text-primary border border-primary/20 text-xs font-medium px-2.5 py-1 flex items-center gap-1.5 rounded-lg"
        >
          <span>Genre: {genre}</span>
          <button onClick={() => onGenreChange("All")} className="hover:opacity-75" aria-label="Remove genre filter">
            <X className="size-3" />
          </button>
        </Badge>
      )}

      {status !== "All" && (
        <Badge
          variant="secondary"
          className="bg-primary/10 text-primary border border-primary/20 text-xs font-medium px-2.5 py-1 flex items-center gap-1.5 rounded-lg"
        >
          <span>Status: {status}</span>
          <button onClick={() => onStatusChange("All")} className="hover:opacity-75" aria-label="Remove status filter">
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
          <button onClick={() => onFormatChange("All")} className="hover:opacity-75" aria-label="Remove format filter">
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
          <button onClick={() => onAudioChange("All")} className="hover:opacity-75" aria-label="Remove audio filter">
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
          <button onClick={() => onSeasonChange("All")} className="hover:opacity-75" aria-label="Remove season filter">
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
          <button onClick={() => onYearChange("All")} className="hover:opacity-75" aria-label="Remove year filter">
            <X className="size-3" />
          </button>
        </Badge>
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={onResetFilters}
        className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 ml-auto"
      >
        <RotateCcw className="size-3" />
        Reset All ({activeFiltersCount})
      </Button>
    </div>
  );
}
