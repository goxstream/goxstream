import type { AnimeItem } from "@/types/anime";

export interface ComboboxOption {
  label: string;
  value: string;
}

export interface BaseFilterComboboxProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: (string | ComboboxOption)[];
  className?: string;
  contentClassName?: string;
}

export interface SearchInputProps {
  query: string;
  onQueryChange: (q: string) => void;
}

export interface GenreRibbonProps {
  selectedGenre: string;
  onGenreChange: (genre: string) => void;
}

export interface FilterSelectStripProps {
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
}

export interface MobileFilterDrawerProps {
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

export interface ActiveFiltersBarProps {
  query: string;
  genre: string;
  status: string;
  format: string;
  audio: string;
  season: string;
  year: string;
  activeFiltersCount: number;
  onQueryChange: (q: string) => void;
  onGenreChange: (g: string) => void;
  onStatusChange: (s: string) => void;
  onFormatChange: (f: string) => void;
  onAudioChange: (a: string) => void;
  onSeasonChange: (s: string) => void;
  onYearChange: (y: string) => void;
  onResetFilters: () => void;
}

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

export interface BrowseGridProps {
  items: AnimeItem[];
  totalResults: number;
  totalAnimeCount: number;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  onResetFilters: () => void;
}

export interface BrowsePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
