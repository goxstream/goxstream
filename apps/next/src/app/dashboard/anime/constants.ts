import type { AnimeItem, AnimeStatus, AnimeType, SeasonName } from "./types";

export const ANIME_GENRES = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Fantasy",
  "Isekai",
  "Mecha",
  "Mystery",
  "Psychological",
  "Romance",
  "Sci-Fi",
  "Slice of Life",
  "Sports",
  "Supernatural",
  "Thriller",
];

export const ANIME_STATUSES: AnimeStatus[] = [
  "Airing",
  "Finished",
  "Upcoming",
  "Draft",
];

export const ANIME_TYPES: AnimeType[] = ["TV", "Movie", "OVA", "Special", "ONA"];

export const ANIME_SEASONS: SeasonName[] = ["Winter", "Spring", "Summer", "Fall"];

export const MOCK_ANIME_DATA: AnimeItem[] = [];

