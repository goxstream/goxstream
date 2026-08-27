"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchInput } from "./search-input";
import { BaseFilterCombobox } from "./base-filter-combobox";
import {
  ANIME_STATUSES,
  ANIME_FORMATS,
  ANIME_AUDIO_OPTIONS,
  ANIME_SEASONS,
  ANIME_YEARS,
  SORT_OPTIONS,
} from "@/lib/constants";
import type { FilterSelectStripProps } from "../../types";

export function FilterSelectStrip({
  query,
  onQueryChange,
  status,
  onStatusChange,
  format,
  onFormatChange,
  audio,
  onAudioChange,
  season,
  onSeasonChange,
  year,
  onYearChange,
  sort,
  onSortChange,
  onResetFilters,
  activeFiltersCount,
}: FilterSelectStripProps) {
  // Season options formatted for combobox display
  const seasonOptions = ANIME_SEASONS.map((sn) => ({
    label: sn === "All" ? "All Seasons" : sn,
    value: sn,
  }));

  // Year options formatted for combobox display
  const yearOptions = ANIME_YEARS.map((yr) => ({
    label: yr === "All" ? "All Years" : yr,
    value: yr,
  }));

  return (
    <div className="w-full">
      {/* Primary Desktop 4-Column x 2-Row Filter Grid Layout */}
      <div className="hidden lg:grid grid-cols-4 gap-4 w-full items-end">
        {/* ROW 1 */}
        {/* Column 1: Search Input */}
        <div className="w-full flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            Search Keyword
          </label>
          <SearchInput query={query} onQueryChange={onQueryChange} />
        </div>

        {/* Column 2: Status */}
        <BaseFilterCombobox
          label="Status"
          value={status}
          onValueChange={onStatusChange}
          options={ANIME_STATUSES}
        />

        {/* Column 3: Format / Type */}
        <BaseFilterCombobox
          label="Format / Type"
          value={format}
          onValueChange={onFormatChange}
          options={ANIME_FORMATS}
        />

        {/* Column 4: Audio */}
        <BaseFilterCombobox
          label="Sub / Dub Audio"
          value={audio}
          onValueChange={onAudioChange}
          options={ANIME_AUDIO_OPTIONS}
        />

        {/* ROW 2 */}
        {/* Column 1: Sort By */}
        <BaseFilterCombobox
          label="Sort Results By"
          value={sort}
          onValueChange={onSortChange}
          options={SORT_OPTIONS}
        />

        {/* Column 2: Season */}
        <BaseFilterCombobox
          label="Season"
          value={season}
          onValueChange={onSeasonChange}
          options={seasonOptions}
        />

        {/* Column 3: Release Year */}
        <BaseFilterCombobox
          label="Release Year"
          value={year}
          onValueChange={onYearChange}
          options={yearOptions}
        />

        {/* Column 4: Reset Filter Action Button */}
        <div className="w-full flex flex-col gap-1.5 justify-end">
          {activeFiltersCount > 0 ? (
            <Button
              variant="outline"
              onClick={onResetFilters}
              className="h-10 text-xs font-semibold rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10 flex items-center justify-center gap-2 transition-colors w-full"
            >
              <RotateCcw className="size-3.5" />
              Reset All ({activeFiltersCount})
            </Button>
          ) : (
            <div className="h-10 w-full" aria-hidden="true" />
          )}
        </div>
      </div>
    </div>
  );
}
