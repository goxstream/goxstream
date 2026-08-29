import { eq, desc, asc, and, or, like, sql } from "drizzle-orm";
import { getDb } from "../index";
import { animes, genres, animeGenres, studios, animeStudios } from "../schema";
import type { AnimeItem } from "@/types/anime";
import type { ScheduleItem } from "@/types/schedule";
import { generateMockSchedule, mapToAnimeItem as _mapToAnimeItem } from "./anime.mappers";

// Re-export mapToAnimeItem for external consumers (e.g. users.ts)
const mapToAnimeItem = _mapToAnimeItem;
export { mapToAnimeItem };

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
  const conditions: any[] = [];

  if (options?.query && options.query.trim() !== "") {
    const pattern = `%${options.query.trim().toLowerCase()}%`;
    conditions.push(
      or(
        like(sql`LOWER(${animes.titleEnglish})`, pattern),
        like(sql`LOWER(${animes.titleRomaji})`, pattern),
        like(sql`LOWER(${animes.titleJapanese})`, pattern)
      )
    );
  }

  if (options?.status && options.status !== "All") {
    conditions.push(eq(animes.status, options.status));
  }

  if (options?.type && options.type !== "All") {
    conditions.push(eq(animes.type, options.type));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const rawList = await db.query.animes.findMany({
    where: whereClause,
    ...(options?.limit ? { limit: options.limit } : {}),
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
    const selectedGenres = options.genre.split(",").map((g) => g.trim().toLowerCase()).filter(Boolean);
    if (selectedGenres.length > 0) {
      items = items.filter((item: AnimeItem) =>
        item.genres.some((g: string) => selectedGenres.includes(g.toLowerCase()))
      );
    }
  }

  return items;
}

export async function getAnimeScheduleItems(): Promise<ScheduleItem[]> {
  const db = await getDb();
  const rawList = await db.query.animes.findMany({
    limit: 50,
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
    return [];
  }

  const animeItems = rawList.map(mapToAnimeItem);
  return generateMockSchedule(animeItems);
}
