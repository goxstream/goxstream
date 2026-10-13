export type DayOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export type AiringStatus = 'airing_now' | 'upcoming' | 'aired';

export type ScheduleViewMode = 'timeline' | 'grid';

export interface ScheduleItem {
  id: string;
  animeId: string;
  slug: string;
  title: string;
  japaneseTitle?: string;
  coverImage: string;
  bannerImage?: string;
  airDay: DayOfWeek;
  airTime: string; // HH:mm in WIB (UTC+7)
  episodeNumber: number;
  status: AiringStatus;
  countdownText?: string;
  genres: string[];
  rating: number;
  studio: string;
  subOrDub: 'SUB' | 'DUB' | 'SUB & DUB';
  season: string;
  year: number;
  isPopular?: boolean;
}

export interface DayTabInfo {
  id: DayOfWeek;
  label: string;
  shortLabel: string;
  isToday: boolean;
  count: number;
}
