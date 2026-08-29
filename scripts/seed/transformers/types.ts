export interface AnimeSeedData {
  id: string;
  slug: string;
  titleRomaji: string;
  titleEnglish: string | null;
  titleJapanese: string | null;
  synopsis: string | null;
  coverImage: string | null;
  bannerImage: string | null;
  type: string;
  status: string;
  seasonName: string | null;
  seasonYear: number | null;
  episodesCount: number;
  durationPerEp: string | null;
  rating: number;
  isFeatured: boolean;
  isTrending: boolean;
  subOrDub: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GenreSeedData {
  id: string;
  name: string;
  slug: string;
}

export interface StudioSeedData {
  id: string;
  name: string;
  slug: string;
}

export interface AnimeGenreRelation {
  animeId: string;
  genreId: string;
}

export interface AnimeStudioRelation {
  animeId: string;
  studioId: string;
}

export interface EpisodeSeedData {
  id: string;
  animeId: string;
  number: number;
  title: string;
  durationSeconds: number;
  thumbnail: string | null;
  airDate: Date | null;
  status: string;
  viewsCount: number;
  isVip: boolean;
  createdAt: Date;
}

export interface StreamSourceSeedData {
  id: string;
  episodeId: string;
  serverName: string;
  streamUrl: string;
  format: string;
  quality: string;
  url1080p: string | null;
  url720p: string | null;
  url480p: string | null;
  url360p: string | null;
  isPrimary: boolean;
}

export interface SubtitleTrackSeedData {
  id: string;
  episodeId: string;
  label: string;
  languageCode: string;
  fileUrl: string;
  format: string;
  isDefault: boolean;
}

export interface AudioTrackSeedData {
  id: string;
  episodeId: string;
  label: string;
  languageCode: string;
  audioUrl: string;
  type: string;
  isDefault: boolean;
}

export interface ScheduleSeedData {
  id: string;
  animeId: string;
  releaseDay: string;
  releaseTime: string;
  episodeNumber: number | null;
  status: string;
  timezone: string;
}

export interface TrendingStatSeedData {
  animeId: string;
  rank: number;
  previousRank: number;
  viewsToday: number;
  viewsThisWeek: number;
  weeklyViews: number;
  monthlyViews: number;
  totalViews: number;
  trendScore: number;
  updatedAt: Date;
}

export interface TransformedSeedBundle {
  animes: AnimeSeedData[];
  genres: GenreSeedData[];
  studios: StudioSeedData[];
  animeGenres: AnimeGenreRelation[];
  animeStudios: AnimeStudioRelation[];
  episodes: EpisodeSeedData[];
  streamSources: StreamSourceSeedData[];
  subtitleTracks: SubtitleTrackSeedData[];
  audioTracks: AudioTrackSeedData[];
  schedules: ScheduleSeedData[];
  trendingStats: TrendingStatSeedData[];
}
