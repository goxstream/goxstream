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
      {/* Responsive Grid Layout for Desktop Dropdowns (4 columns on lg screens) */}
      <div className="hidden lg:grid grid-cols-4 gap-4 w-full items-end">
        {/* Row 1: Primary Filters */}
        <BaseFilterCombobox
          label="Status"
          value={status}
          onValueChange={onStatusChange}
          options={ANIME_STATUSES}
        />

        <BaseFilterCombobox
          label="Format / Type"
          value={format}
          onValueChange={onFormatChange}
          options={ANIME_FORMATS}
        />

        <BaseFilterCombobox
          label="Sub / Dub Audio"
          value={audio}
          onValueChange={onAudioChange}
          options={ANIME_AUDIO_OPTIONS}
        />

        <BaseFilterCombobox
          label="Sort Results By"
          value={sort}
          onValueChange={onSortChange}
          options={SORT_OPTIONS}
        />

        {/* Row 2: Season & Year */}
        <BaseFilterCombobox
          label="Season"
          value={season}
          onValueChange={onSeasonChange}
          options={seasonOptions}
        />

        <BaseFilterCombobox
          label="Release Year"
          value={year}
          onValueChange={onYearChange}
          options={yearOptions}
        />
      </div>
    </div>
  );
}
