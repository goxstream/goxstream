import type { AnimeItem } from "@/types/anime";

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
