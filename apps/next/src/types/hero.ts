export interface HeroSlideItem {
  id: string;
  slug: string;
  title: string;
  japaneseTitle?: string;
  image: string;
  badgeText: string;
  rating?: number;
  episodeNumber?: number;
  airTime?: string;
  season?: string;
  year?: number;
  genres: string[];
  synopsis?: string;
}
