import { SearchInput } from "./search-input";
import { BaseFilterCombobox } from "./base-filter-combobox";
import { BaseGenreMultiSelectCombobox } from "./base-genre-multiselect-combobox";
import {
  ANIME_STATUSES,
  ANIME_FORMATS,
  ANIME_AUDIO_OPTIONS,
  ANIME_SEASONS,
  ANIME_YEARS,
  SORT_OPTIONS,
} from "@/lib/constants";
import type { FilterSelectStripProps } from "@/types/browse";

export function FilterSelectStrip({
  query,
  onQueryChange,
  genre,
  onGenreChange,
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
  const seasonOptions = ANIME_SEASONS.map((sn) => ({
    label: sn === "All" ? "All Seasons" : sn,
    value: sn,
  }));

  const yearOptions = ANIME_YEARS.map((yr) => ({
    label: yr === "All" ? "All Years" : yr,
    value: yr,
  }));

  return (
    <div className="w-full">
      <div className="hidden w-full grid-cols-4 items-end gap-4 lg:grid">
        <div className="flex w-full flex-col gap-1.5">
          <label className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
            Search Keyword
          </label>
          <SearchInput query={query} onQueryChange={onQueryChange} />
        </div>

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

        <BaseGenreMultiSelectCombobox value={genre} onValueChange={onGenreChange} />
      </div>
    </div>
  );
}
