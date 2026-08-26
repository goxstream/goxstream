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

export interface PlatformStat {
  label: string;
  value: string;
  description: string;
}
