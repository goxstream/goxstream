export type SeasonQuarter = "WINTER" | "SPRING" | "SUMMER" | "FALL";
export type BroadcastDay = "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY" | "TBA";

export interface SeasonItem {
  id: string;
  year: number;
  quarter: SeasonQuarter;
  name: string; // e.g. "Winter 2026"
  startDate: string;
  endDate: string;
  totalAnime: number;
  isCurrent: boolean;
  isActive: boolean;
}

export interface BroadcastSlotAnime {
  id: string;
  titleRomaji: string;
  titleEnglish: string;
  coverImage: string;
  airDay: BroadcastDay;
  airTime: string; // e.g. "23:00 JST"
  episodeCount: number;
  currentEpisode: number;
  studio: string;
  licenseRegion: string; // e.g. "Global", "Asia-Pacific"
}

export interface SeasonFilterState {
  year: number;
  quarter: SeasonQuarter;
}
