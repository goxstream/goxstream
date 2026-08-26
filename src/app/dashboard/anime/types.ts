export type AnimeStatus = "Airing" | "Finished" | "Upcoming" | "Draft";
export type AnimeType = "TV" | "Movie" | "OVA" | "Special" | "ONA";
export type SeasonName = "Winter" | "Spring" | "Summer" | "Fall";

export interface AnimeSeason {
  year: number;
  season: SeasonName;
}

export interface AnimeItem {
  id: string;
  titleRomaji: string;
  titleEnglish: string;
  titleJapanese?: string;
  slug: string;
  coverImage: string;
  bannerImage?: string;
  synopsis: string;
  type: AnimeType;
  status: AnimeStatus;
  episodes: number;
  durationPerEp?: string;
  season: AnimeSeason;
  rating?: number; // e.g. 8.7
  studios: string[];
  genres: string[];
  featured?: boolean;
  trending?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AnimeFilterState {
  search: string;
  status: string;
  genre: string;
  season: string;
  type: string;
}

export interface AnimeFormValues {
  titleRomaji: string;
  titleEnglish: string;
  titleJapanese: string;
  synopsis: string;
  coverImage: string;
  bannerImage: string;
  type: AnimeType;
  status: AnimeStatus;
  episodes: number;
  seasonYear: number;
  seasonName: SeasonName;
  studios: string;
  genres: string[];
  rating: number;
  featured: boolean;
}
