import { eq, desc, asc } from "drizzle-orm";
import { getDb } from "../index";
import { animes, genres, animeGenres, studios, animeStudios } from "../schema";
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

export async function getAnimeBySlug(slug: string): Promise<AnimeItem | null> {
  const db = await getDb();
  const raw = await db.query.animes.findFirst({
    where: eq(animes.slug, slug),
    with: {
      animeGenres: {
        with: {
          genre: true,
        },
      },
      animeStudios: {
        with: {
          studio: true,
        },
      },
    },
  });

  if (!raw) return null;
  return mapToAnimeItem(raw);
}

export async function getFeaturedAnime(): Promise<AnimeItem | null> {
  const db = await getDb();
  const rawList = await db.query.animes.findMany({
    where: eq(animes.isFeatured, true),
    limit: 1,
    orderBy: [desc(animes.createdAt)],
    with: {
      animeGenres: {
        with: {
          genre: true,
        },
      },
      animeStudios: {
        with: {
          studio: true,
        },
      },
    },
  });

  if (!rawList || rawList.length === 0) {
    // Fallback to first available anime if no featured flag set
    const fallback = await db.query.animes.findMany({
      limit: 1,
      with: {
        animeGenres: { with: { genre: true } },
        animeStudios: { with: { studio: true } },
      },
    });
    return fallback[0] ? mapToAnimeItem(fallback[0]) : null;
  }

  return mapToAnimeItem(rawList[0]);
}

export async function getTrendingAnime(limit = 10): Promise<AnimeItem[]> {
  const db = await getDb();
  const rawList = await db.query.animes.findMany({
    where: eq(animes.isTrending, true),
    limit,
    orderBy: [desc(animes.rating)],
    with: {
      animeGenres: {
        with: {
          genre: true,
        },
      },
      animeStudios: {
        with: {
          studio: true,
        },
      },
    },
  });

  if (!rawList || rawList.length === 0) {
    const fallback = await db.query.animes.findMany({
      limit,
      orderBy: [desc(animes.rating)],
      with: {
        animeGenres: { with: { genre: true } },
        animeStudios: { with: { studio: true } },
      },
    });
    return fallback.map(mapToAnimeItem);
  }

  return rawList.map(mapToAnimeItem);
}

export async function getAllGenres(): Promise<string[]> {
  const db = await getDb();
  const genreRecords = await db.query.genres.findMany({
    orderBy: [asc(genres.name)],
  });

  return genreRecords.map((g: any) => g.name);
}

export async function getBrowseAnime(options?: {
  genre?: string;
  query?: string;
  status?: string;
  type?: string;
  limit?: number;
}): Promise<AnimeItem[]> {
  const db = await getDb();
  const limit = options?.limit || 24;

  const rawList = await db.query.animes.findMany({
    limit,
    orderBy: [desc(animes.createdAt)],
    with: {
      animeGenres: {
        with: {
          genre: true,
        },
      },
      animeStudios: {
        with: {
          studio: true,
        },
      },
    },
  });

  let items: AnimeItem[] = rawList.map(mapToAnimeItem);

  if (options?.genre && options.genre !== "All") {
    const genreLower = options.genre.toLowerCase();
    items = items.filter((item: AnimeItem) =>
      item.genres.some((g: string) => g.toLowerCase() === genreLower)
    );
  }

  if (options?.query) {
    const q = options.query.toLowerCase();
    items = items.filter(
      (item: AnimeItem) =>
        item.title.toLowerCase().includes(q) ||
        (item.japaneseTitle && item.japaneseTitle.toLowerCase().includes(q))
    );
  }

  if (options?.status) {
    items = items.filter((item: AnimeItem) => item.status === options.status);
  }

  if (options?.type) {
    items = items.filter((item: AnimeItem) => item.type === options.type);
  }

  return items;
}
