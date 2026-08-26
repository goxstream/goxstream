"use client";

import { Search, X, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ANIME_GENRES, ANIME_STATUSES, ANIME_TYPES } from "../constants";
import type { AnimeFilterState } from "../types";

interface AnimeFiltersProps {
  filters: AnimeFilterState;
  onFilterChange: (key: keyof AnimeFilterState, value: string) => void;
  onResetFilters: () => void;
}

export function AnimeFilters({
  filters,
  onFilterChange,
  onResetFilters,
}: AnimeFiltersProps) {
  const hasActiveFilters =
    Boolean(filters.search) ||
    filters.status !== "all" ||
    filters.genre !== "all" ||
    filters.type !== "all";

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-card/40 rounded-lg border border-border/60 shadow-xs">
      {/* Left: Search input */}
      <div className="relative flex-1 min-w-[220px] max-w-sm">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by title, studio, or ID..."
          value={filters.search}
          onChange={(e) => onFilterChange("search", e.target.value)}
          className="pl-9 h-9 text-xs border-border/60 bg-background/80"
        />
        {filters.search && (
          <button
            onClick={() => onFilterChange("search", "")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Right: Dropdowns & Reset */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 text-xs text-muted-foreground mr-1">
          <Filter className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Filter:</span>
        </div>

        {/* Status Dropdown */}
        <Select
          value={filters.status}
          onValueChange={(val) => val && onFilterChange("status", val)}
        >
          <SelectTrigger className="h-9 w-[130px] text-xs border-border/60 bg-background/80">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {ANIME_STATUSES.map((st) => (
              <SelectItem key={st} value={st}>
                {st}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Type Dropdown */}
        <Select
          value={filters.type}
          onValueChange={(val) => val && onFilterChange("type", val)}
        >
          <SelectTrigger className="h-9 w-[110px] text-xs border-border/60 bg-background/80">
            <SelectValue placeholder="Format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Formats</SelectItem>
            {ANIME_TYPES.map((tp) => (
              <SelectItem key={tp} value={tp}>
                {tp}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Genre Dropdown */}
        <Select
          value={filters.genre}
          onValueChange={(val) => val && onFilterChange("genre", val)}
        >
          <SelectTrigger className="h-9 w-[130px] text-xs border-border/60 bg-background/80">
            <SelectValue placeholder="Genre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genres</SelectItem>
            {ANIME_GENRES.map((gn) => (
              <SelectItem key={gn} value={gn}>
                {gn}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            className="h-9 text-xs text-muted-foreground hover:text-foreground px-2.5"
          >
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
