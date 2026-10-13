import { AnimeItem } from "./anime";

export type WatchlistStatus =
  | "watching"
  | "plan_to_watch"
  | "completed"
  | "on_hold"
  | "dropped";

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatarUrl?: string;
  bannerUrl?: string;
  bio: string;
  joinDate: string;
  isVip: boolean;
  vipTier?: string;
  stats: {
    animeCompleted: number;
    episodesWatched: number;
    hoursWatched: number;
    watchlistCount: number;
    favoriteGenres: { genre: string; percentage: number }[];
  };
}


export interface WatchlistItem {
  id: string;
  anime: AnimeItem;
  status: WatchlistStatus;
  isFavorite: boolean;
  currentEpisode: number;
  totalEpisodes: number;
  rating?: number;
  updatedAt: string;
}

export interface WatchHistoryItem {
  id: string;
  animeId: string;
  animeSlug: string;
  animeTitle: string;
  animeCover: string;
  episodeNumber: number;
  episodeTitle: string;
  progressPercent: number;
  durationSeconds: number;
  watchedSeconds: number;
  lastWatchedAt: string;
}

export interface UserSettings {
  profile: {
    displayName: string;
    bio: string;
    avatarUrl: string;
  };
  player: {
    defaultQuality: "auto" | "1080p" | "720p" | "480p";
    defaultSubtitle: "id" | "en" | "jp";
    autoPlayNext: boolean;
    autoSkipIntro: boolean;
    preferredAudio: "subbed" | "dubbed";
  };
  notifications: {
    newEpisodeAlerts: boolean;
    watchlistUpdates: boolean;
    marketingEmails: boolean;
    publicWatchlist: boolean;
  };
}
