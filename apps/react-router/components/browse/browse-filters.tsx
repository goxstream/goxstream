import { SearchInput } from "./filters/search-input";
import { FilterSelectStrip } from "./filters/filter-select-strip";
import { ActiveFiltersBar } from "./filters/active-filters-bar";
import { MobileFilterDrawer } from "./filters/mobile-filter-drawer";

export interface BrowseFiltersProps {
  query: string;
  onQueryChange: (q: string) => void;
  genre: string;
  onGenreChange: (g: string) => void;
  status: string;
  onStatusChange: (s: string) => void;
  format: string;
  onFormatChange: (f: string) => void;
  audio: string;
  onAudioChange: (a: string) => void;
  season: string;
  onSeasonChange: (s: string) => void;
  year: string;
  onYearChange: (y: string) => void;
  sort: string;
  onSortChange: (s: string) => void;
  onResetFilters: () => void;
  activeFiltersCount: number;
}

export function BrowseFilters(props: BrowseFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center lg:hidden">
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
