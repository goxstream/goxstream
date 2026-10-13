"use client";

import { Search, X, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ANIME_GENRES, ANIME_STATUSES, ANIME_TYPES } from "../constants";
import type { AnimeFilterState } from "../types";

interface AnimeFiltersProps {
  filters: AnimeFilterState;
  onFilterChange: (key: keyof AnimeFilterState, value: string) => void;
  onResetFilters: () => void;
}

export function AnimeFilters({ filters, onFilterChange, onResetFilters }: AnimeFiltersProps) {
  const hasActiveFilters =
    Boolean(filters.search) ||
    filters.status !== "all" ||
    filters.genre !== "all" ||
    filters.type !== "all";

  return (
    <div className="bg-card/40 border-border/60 flex flex-col items-stretch justify-between gap-2.5 rounded-lg border p-2.5 shadow-xs sm:flex-row sm:items-center sm:p-3">
      {/* Search Bar - Full Width on Mobile */}
      <div className="relative w-full sm:w-auto sm:max-w-sm sm:flex-1">
        <Search className="text-muted-foreground absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2" />
        <Input
          placeholder="Search title, studio..."
          value={filters.search}
          onChange={(e) => onFilterChange("search", e.target.value)}
          className="border-border/60 bg-background/80 h-8 w-full pl-8 text-xs"
        />
        {filters.search && (
          <button
            onClick={() => onFilterChange("search", "")}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2 p-1"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Filter Dropdowns - 3 Column Grid on Mobile */}
      <div className="flex w-full items-center gap-1.5 sm:w-auto">
        <div className="text-muted-foreground mr-1 hidden items-center gap-1 text-xs sm:flex">
          <Filter className="h-3.5 w-3.5" />
          <span>Filter:</span>
        </div>

        <div className="grid w-full grid-cols-3 items-center gap-1.5 sm:flex sm:w-auto">
          {/* Status Dropdown */}
          <Select
            value={filters.status}
            onValueChange={(val) => val && onFilterChange("status", val)}
          >
            <SelectTrigger className="border-border/60 bg-background/80 h-8 w-full truncate px-2 text-left text-[11px] sm:w-[115px] sm:text-xs">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">
                All Status
              </SelectItem>
              {ANIME_STATUSES.map((st) => (
                <SelectItem key={st} value={st} className="text-xs">
                  {st}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Type Dropdown */}
          <Select value={filters.type} onValueChange={(val) => val && onFilterChange("type", val)}>
            <SelectTrigger className="border-border/60 bg-background/80 h-8 w-full truncate px-2 text-left text-[11px] sm:w-[100px] sm:text-xs">
              <SelectValue placeholder="Format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">
                All Formats
              </SelectItem>
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
            <SelectTrigger className="border-border/60 bg-background/80 h-8 w-full truncate px-2 text-left text-[11px] sm:w-[115px] sm:text-xs">
              <SelectValue placeholder="Genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">
                All Genres
              </SelectItem>
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
            className="text-muted-foreground hover:text-foreground h-8 shrink-0 px-2 text-xs"
          >
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
