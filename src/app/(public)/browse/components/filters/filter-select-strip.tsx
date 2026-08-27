"use client";

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
}: FilterSelectStripProps) {
  // Season options formatted for combobox display
  const seasonOptions = ANIME_SEASONS.map((sn) => ({
    label: sn === "All" ? "Season: All" : sn,
    value: sn,
  }));

  // Year options formatted for combobox display
  const yearOptions = ANIME_YEARS.map((yr) => ({
    label: yr === "All" ? "Year: All" : yr,
    value: yr,
  }));

  return (
    <div className="space-y-3">
      {/* Primary Desktop Filter Dropdowns using Base UI Combobox */}
      <div className="hidden lg:flex items-center gap-3 flex-wrap">
        {/* Status */}
        <BaseFilterCombobox
          label="Status"
          value={status}
          onValueChange={onStatusChange}
          options={ANIME_STATUSES}
          className="min-w-28"
        />

        {/* Type / Format */}
        <BaseFilterCombobox
          label="Type"
          value={format}
          onValueChange={onFormatChange}
          options={ANIME_FORMATS}
          className="min-w-24"
        />

        {/* Audio */}
        <BaseFilterCombobox
          label="Audio"
          value={audio}
          onValueChange={onAudioChange}
          options={ANIME_AUDIO_OPTIONS}
          className="min-w-28"
        />

        {/* Sort By */}
        <BaseFilterCombobox
          label="Sort"
          value={sort}
          onValueChange={onSortChange}
          options={SORT_OPTIONS}
          className="min-w-36"
        />

        {/* Season & Year Secondary Options */}
        <div className="flex items-center gap-2 border-l border-border/60 pl-3">
          {/* Season */}
          <BaseFilterCombobox
            label=""
            value={season}
            onValueChange={onSeasonChange}
            options={seasonOptions}
            className="min-w-28 bg-muted/40"
          />

          {/* Year */}
          <BaseFilterCombobox
            label=""
            value={year}
            onValueChange={onYearChange}
            options={yearOptions}
            className="min-w-24 bg-muted/40"
          />
        </div>
      </div>
    </div>
  );
}
