export interface AnimeItem {
  id: string;
  slug: string;
  title: string;
  japaneseTitle?: string;
  synopsis: string;
  coverImage: string;
  bannerImage?: string;
  rating: number;
  episodesCount: number;
  latestEpisode?: number;
  status: 'Ongoing' | 'Completed' | 'Upcoming';
  type: 'TV' | 'Movie' | 'OVA';
  season: string;
  year: number;
  genres: string[];
  studio: string;
  isTrending?: boolean;
  isFeatured?: boolean;
  subOrDub: 'SUB' | 'DUB' | 'SUB & DUB';
}

export interface EpisodeItem {
  id: string;
  animeId: string;
  animeSlug: string;
  animeTitle: string;
  episodeNumber: number;
  episodeTitle: string;
  thumbnail: string;
  duration: string;
  releasedAt: string;
  isSub: boolean;
  isDub: boolean;
}

export type TrendingPeriod = "weekly" | "monthly" | "all-time";

export interface TrendingAnimeItem extends AnimeItem {
  rank: number;
  previousRank?: number;
  weeklyViews: number;
  monthlyViews: number;
  totalViews: number;
  weeklyGrowth: string;
  trendScore: number;
}

export interface PlatformStat {
  label: string;
  value: string;
  description: string;
}

export interface QualityUrls {
  url1080p?: string;
  url720p?: string;
  url480p?: string;
  url360p?: string;
}

export interface StreamSource {
  id: string;
  serverName: string;
  quality: string;
  url: string;
  type: "hls" | "mp4" | "embed" | "dash";
  isPrimary?: boolean;
  qualityUrls?: QualityUrls;
}

export interface EpisodeWatchDetails {
  anime: AnimeItem;
  episode: EpisodeItem;
  nextEpisode?: EpisodeItem;
  prevEpisode?: EpisodeItem;
  sources: StreamSource[];
}

