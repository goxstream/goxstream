"use client";

import { SearchInput } from "./filters/search-input";
import { FilterSelectStrip } from "./filters/filter-select-strip";
import { ActiveFiltersBar } from "./filters/active-filters-bar";
import { MobileFilterDrawer } from "./filters/mobile-filter-drawer";
import type { BrowseFiltersProps } from "../types";

export function BrowseFilters(props: BrowseFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Mobile & Tablet Header Controls (< lg) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 lg:hidden">
        <SearchInput query={props.query} onQueryChange={props.onQueryChange} />

        <MobileFilterDrawer
          genre={props.genre}
          onGenreChange={props.onGenreChange}
          status={props.status}
          onStatusChange={props.onStatusChange}
          format={props.format}
          onFormatChange={props.onFormatChange}
          audio={props.audio}
          onAudioChange={props.onAudioChange}
          season={props.season}
          onSeasonChange={props.onSeasonChange}
          year={props.year}
          onYearChange={props.onYearChange}
          sort={props.sort}
          onSortChange={props.onSortChange}
          onResetFilters={props.onResetFilters}
          activeFiltersCount={props.activeFiltersCount}
        />
      </div>

      {/* Desktop 4-Column x 2-Row Filter Grid (>= lg) */}
      <FilterSelectStrip
        query={props.query}
        onQueryChange={props.onQueryChange}
        genre={props.genre}
        onGenreChange={props.onGenreChange}
        status={props.status}
        onStatusChange={props.onStatusChange}
        format={props.format}
        onFormatChange={props.onFormatChange}
        audio={props.audio}
        onAudioChange={props.onAudioChange}
        season={props.season}
        onSeasonChange={props.onSeasonChange}
        year={props.year}
        onYearChange={props.onYearChange}
        sort={props.sort}
        onSortChange={props.onSortChange}
        onResetFilters={props.onResetFilters}
        activeFiltersCount={props.activeFiltersCount}
      />

      {/* Single Centralized Active Filter Badges & Reset Bar */}
      <ActiveFiltersBar
        query={props.query}
        genre={props.genre}
        status={props.status}
        format={props.format}
        audio={props.audio}
        season={props.season}
        year={props.year}
        activeFiltersCount={props.activeFiltersCount}
        onQueryChange={props.onQueryChange}
        onGenreChange={props.onGenreChange}
        onStatusChange={props.onStatusChange}
        onFormatChange={props.onFormatChange}
        onAudioChange={props.onAudioChange}
        onSeasonChange={props.onSeasonChange}
        onYearChange={props.onYearChange}
        onResetFilters={props.onResetFilters}
      />
    </div>
  );
}
