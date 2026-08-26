import { eq, desc } from "drizzle-orm";
import { getDb } from "../index";
import { animes, genres, animeGenres } from "../schema";

export async function getAnimeBySlug(slug: string) {
  const db = await getDb();
  return db.query.animes.findFirst({
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
      schedules: true,
      trendingStats: true,
    },
  });
}

export async function listFeaturedAnime(limit = 10) {
  const db = await getDb();
  return db.query.animes.findMany({
    where: eq(animes.isFeatured, true),
    limit,
    orderBy: [desc(animes.createdAt)],
  });
}

export async function listAnimeByGenre(genreSlug: string, limit = 20) {
  const db = await getDb();
  const genreRecord = await db.query.genres.findFirst({
    where: eq(genres.slug, genreSlug),
  });

  if (!genreRecord) {
    return [];
  }

  const items = await db.query.animeGenres.findMany({
    where: eq(animeGenres.genreId, genreRecord.id),
    limit,
    with: {
      anime: true,
    },
  });

  return items.map((item: any) => item.anime);
}
