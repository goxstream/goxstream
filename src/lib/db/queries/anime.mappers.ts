import type { AnimeItem } from "@/types/anime";
import type { ScheduleItem, DayOfWeek } from "@/types/schedule";

/**
 * Transforms Drizzle anime record with relations into AnimeItem UI format
 */
export function mapToAnimeItem(raw: any): AnimeItem {
  const genreList: string[] = raw.animeGenres
    ? raw.animeGenres.map((ag: any) => ag.genre?.name || ag.genreName).filter(Boolean)
    : [];

  const studioName: string = raw.animeStudios && raw.animeStudios.length > 0
    ? raw.animeStudios[0].studio?.name || raw.studioName || "Unknown Studio"
    : "Unknown Studio";

  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.titleEnglish || raw.titleRomaji || "Untitled Anime",
    japaneseTitle: raw.titleJapanese || undefined,
    synopsis: raw.synopsis || "",
    coverImage: raw.coverImage || "",
    bannerImage: raw.bannerImage || undefined,
    rating: typeof raw.rating === "number" ? raw.rating : 0,
    episodesCount: raw.episodesCount || 0,
    latestEpisode: raw.episodesCount || 0,
    status: (raw.status as AnimeItem["status"]) || "Ongoing",
    type: (raw.type as AnimeItem["type"]) || "TV",
    season: raw.seasonName || "Spring",
    year: raw.seasonYear || 2026,
    genres: genreList.length > 0 ? genreList : ["Action"],
    studio: studioName,
    isTrending: Boolean(raw.isTrending),
    isFeatured: Boolean(raw.isFeatured),
    subOrDub: (raw.subOrDub as AnimeItem["subOrDub"]) || "SUB",
  };
}

/**
 * Generates schedule items based on query index with dynamic mathematical mock patterns
 */
export function generateMockSchedule(animeItems: AnimeItem[]): ScheduleItem[] {
  const days: DayOfWeek[] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

  return animeItems.map((item, idx) => {
    const assignedDay = days[idx % days.length];
    const hour = 16 + (idx % 7);
    const airTime = `${hour}:30`;

    return {
      id: `sch-${item.id}`,
      animeId: item.id,
      slug: item.slug,
      title: item.title,
      japaneseTitle: item.japaneseTitle,
      coverImage: item.coverImage,
      bannerImage: item.bannerImage,
      airDay: assignedDay,
      airTime,
      episodeNumber: item.latestEpisode || 1,
      status: idx % 3 === 0 ? "aired" : idx % 3 === 1 ? "airing_now" : "upcoming",
      countdownText: idx % 3 === 1 ? "Airing live now!" : `At ${airTime}`,
      genres: item.genres,
      rating: item.rating,
      studio: item.studio,
      subOrDub: item.subOrDub,
      season: item.season,
      year: item.year,
      isPopular: item.isTrending,
    };
  });
}
