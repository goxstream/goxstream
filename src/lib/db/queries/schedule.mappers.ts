import type { ScheduleItem, DayOfWeek, AiringStatus } from "@/types/schedule";

/**
 * Maps raw database schedule record (with anime relations) into ScheduleItem UI format
 */
export function mapToScheduleItem(s: any): ScheduleItem {
  const anime = s.anime || {};
  
  const genreList: string[] = anime.animeGenres
    ? anime.animeGenres.map((ag: any) => ag.genre?.name || ag.genreName).filter(Boolean)
    : [];

  const studioName: string = anime.animeStudios && anime.animeStudios.length > 0
    ? anime.animeStudios[0].studio?.name || anime.studioName || "Unknown Studio"
    : "Unknown Studio";

  const airDay = (s.releaseDay || "Monday").toLowerCase() as DayOfWeek;
  const status = (s.status || "upcoming").toLowerCase() as AiringStatus;

  return {
    id: s.id,
    animeId: s.animeId,
    slug: anime.slug || "anime",
    title: anime.titleEnglish || anime.titleRomaji || "Untitled Anime",
    japaneseTitle: anime.titleJapanese || undefined,
    coverImage: anime.coverImage || "",
    bannerImage: anime.bannerImage || undefined,
    airDay,
    airTime: s.releaseTime || "18:00",
    episodeNumber: s.episodeNumber || anime.episodesCount || 1,
    status,
    countdownText: status === "airing_now" ? "Airing live now!" : `At ${s.releaseTime || "18:00"}`,
    genres: genreList.length > 0 ? genreList : ["Action"],
    rating: typeof anime.rating === "number" ? anime.rating : 0,
    studio: studioName,
    subOrDub: (anime.subOrDub as ScheduleItem["subOrDub"]) || "SUB",
    season: anime.seasonName || "Spring",
    year: anime.seasonYear || 2026,
    isPopular: Boolean(anime.isTrending),
  };
}
