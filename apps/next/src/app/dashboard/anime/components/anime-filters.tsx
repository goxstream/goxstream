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
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 p-2.5 sm:p-3 bg-card/40 rounded-lg border border-border/60 shadow-xs">
      {/* Search Bar - Full Width on Mobile */}
      <div className="relative w-full sm:w-auto sm:flex-1 sm:max-w-sm">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          placeholder="Search title, studio..."
          value={filters.search}
          onChange={(e) => onFilterChange("search", e.target.value)}
          className="pl-8 h-8 text-xs border-border/60 bg-background/80 w-full"
        />
        {filters.search && (
          <button
            onClick={() => onFilterChange("search", "")}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Filter Dropdowns - 3 Column Grid on Mobile */}
      <div className="flex items-center gap-1.5 w-full sm:w-auto">
        <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground mr-1">
          <Filter className="h-3.5 w-3.5" />
          <span>Filter:</span>
        </div>

        <div className="grid grid-cols-3 sm:flex items-center gap-1.5 w-full sm:w-auto">
          {/* Status Dropdown */}
          <Select
            value={filters.status}
            onValueChange={(val) => val && onFilterChange("status", val)}
          >
            <SelectTrigger className="h-8 text-[11px] sm:text-xs border-border/60 bg-background/80 px-2 w-full sm:w-[115px] text-left truncate">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">All Status</SelectItem>
              {ANIME_STATUSES.map((st) => (
                <SelectItem key={st} value={st} className="text-xs">
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
            <SelectTrigger className="h-8 text-[11px] sm:text-xs border-border/60 bg-background/80 px-2 w-full sm:w-[100px] text-left truncate">
              <SelectValue placeholder="Format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">All Formats</SelectItem>
              {ANIME_TYPES.map((tp) => (
                <SelectItem key={tp} value={tp} className="text-xs">
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
            <SelectTrigger className="h-8 text-[11px] sm:text-xs border-border/60 bg-background/80 px-2 w-full sm:w-[115px] text-left truncate">
              <SelectValue placeholder="Genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">All Genres</SelectItem>
              {ANIME_GENRES.map((gn) => (
                <SelectItem key={gn} value={gn} className="text-xs">
                  {gn}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Reset Button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            className="h-8 text-xs text-muted-foreground hover:text-foreground px-2 shrink-0"
          >
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
