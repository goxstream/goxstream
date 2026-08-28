import type { AnimeItem, EpisodeItem, EpisodeWatchDetails } from "@/types/anime";
import type { ScheduleItem } from "@/types/schedule";

/**
 * API Response Type Contracts
 *
 * Single source of truth for all API route response shapes.
 * Used by both:
 *   - Server: Route Handlers in src/app/api/
 *   - Client: Hooks in src/hooks/
 *
 * Non-sensitive public API data types only.
 * Sensitive/user-specific responses (auth, user settings) should define
 * their types colocated with the respective feature.
 */

// GET /api/anime/featured
export interface FeaturedAnimeResponse {
  featuredAnime: AnimeItem | null;
}

// GET /api/anime/trending
export interface TrendingAnimeResponse {
  trendingAnime: AnimeItem[];
  genresList: string[];
}

// GET /api/anime/[slug]
export interface AnimeDetailResponse {
  anime: AnimeItem | null;
  episodes: EpisodeItem[];
  recommendations: AnimeItem[];
}

// GET /api/anime/browse
export interface BrowseAnimeResponse {
  animeList: AnimeItem[];
}

// GET /api/anime/search
export interface SearchAnimeResponse {
  results: AnimeItem[];
}

// GET /api/anime/schedule
export interface ScheduleAnimeResponse {
  scheduleItems: ScheduleItem[];
}

// GET /api/episodes/latest
export interface LatestEpisodesResponse {
  latestEpisodes: EpisodeItem[];
}

// GET /api/anime/[slug]/episodes/[episode]
export interface WatchDetailsResponse {
  details: EpisodeWatchDetails | null;
  episodes: EpisodeItem[];
  recommendations: AnimeItem[];
}
