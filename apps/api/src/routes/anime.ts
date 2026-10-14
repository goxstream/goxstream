import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import type { CloudflareEnv } from "@goxstream/cloudflare";
import { getDb, animes, genres, animeGenres } from "@goxstream/db";
import { and, desc, asc, eq, like, sql, inArray } from "drizzle-orm";

const AnimeItemSchema = z.object({
  id: z.string(),
  slug: z.string(),
  titleRomaji: z.string(),
  titleEnglish: z.string().nullable().optional(),
  titleJapanese: z.string().nullable().optional(),
  synopsis: z.string().nullable().optional(),
  coverImage: z.string().nullable().optional(),
  bannerImage: z.string().nullable().optional(),
  type: z.string(),
  status: z.string(),
  seasonName: z.string().nullable().optional(),
  seasonYear: z.number().nullable().optional(),
  episodesCount: z.number(),
  durationPerEp: z.string().nullable().optional(),
  rating: z.number().nullable().optional(),
  isFeatured: z.boolean(),
  isTrending: z.boolean(),
  subOrDub: z.string(),
});

const AnimeDetailSchema = AnimeItemSchema.extend({
  genres: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      slug: z.string(),
    }),
  ),
  studios: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      slug: z.string(),
    }),
  ),
  schedule: z
    .object({
      releaseDay: z.string(),
      releaseTime: z.string(),
      episodeNumber: z.number().nullable().optional(),
      status: z.string(),
      timezone: z.string(),
    })
    .nullable()
    .optional(),
  trendingStats: z
    .object({
      rank: z.number(),
      trendScore: z.number(),
      totalViews: z.number(),
    })
    .nullable()
    .optional(),
});

// ── GET /v1/anime (Catalog List) ─────────────────────────────────────────
const listAnimeRoute = createRoute({
  method: "get",
  path: "/v1/anime",
  tags: ["Anime"],
  summary: "List Anime Catalog",
  description:
    "Retrieve paginated list of anime with filters for type, status, season, year, genre, and search.",
  request: {
    query: z.object({
      page: z.string().optional().default("1"),
      limit: z.string().optional().default("20"),
      search: z.string().optional(),
      type: z.string().optional(),
      status: z.string().optional(),
      genre: z.string().optional(),
      season: z.string().optional(),
      year: z.string().optional(),
      sort: z.enum(["latest", "popular", "score"]).optional().default("latest"),
    }),
  },
  responses: {
    200: {
      description: "Paginated anime list",
      content: {
        "application/json": {
          schema: z.object({
            success: z.literal(true),
            data: z.array(AnimeItemSchema),
            pagination: z.object({
              page: z.number(),
              limit: z.number(),
              total: z.number(),
              totalPages: z.number(),
            }),
          }),
        },
      },
    },
  },
});

// ── GET /v1/anime/{slug} (Anime Details) ─────────────────────────────────
const getAnimeBySlugRoute = createRoute({
  method: "get",
  path: "/v1/anime/{slug}",
  tags: ["Anime"],
  summary: "Get Anime Details by Slug",
  description:
    "Retrieve comprehensive anime metadata including associated genres, studios, schedule, and trending stats.",
  request: {
    params: z.object({
      slug: z.string().min(1),
    }),
  },
  responses: {
    200: {
      description: "Anime detailed metadata",
      content: {
        "application/json": {
          schema: z.object({
            success: z.literal(true),
            data: AnimeDetailSchema,
          }),
        },
      },
    },
    404: {
      description: "Anime not found",
      content: {
        "application/json": {
          schema: z.object({
            success: z.literal(false),
            error: z.string(),
          }),
        },
      },
    },
  },
});

export const animeApp = new OpenAPIHono<{ Bindings: CloudflareEnv }>();

// Implementation: List Anime
animeApp.openapi(listAnimeRoute, async (c) => {
  const db = getDb(c.env.DB);
  const q = c.req.valid("query");

  const page = Math.max(1, parseInt(q.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(q.limit, 10) || 20));
  const offset = (page - 1) * limit;

  const conditions = [];

  if (q.search) {
    const term = `%${q.search.trim()}%`;
    conditions.push(
      sql`(${animes.titleRomaji} LIKE ${term} OR ${animes.titleEnglish} LIKE ${term} OR ${animes.titleJapanese} LIKE ${term})`,
    );
  }
  if (q.type) {
    conditions.push(eq(animes.type, q.type));
  }
  if (q.status) {
    conditions.push(eq(animes.status, q.status));
  }
  if (q.season) {
    conditions.push(eq(animes.seasonName, q.season));
  }
  if (q.year) {
    const parsedYear = parseInt(q.year, 10);
    if (!isNaN(parsedYear)) conditions.push(eq(animes.seasonYear, parsedYear));
  }
  if (q.genre) {
    const matchedGenre = await db
      .select({ id: genres.id })
      .from(genres)
      .where(eq(genres.slug, q.genre.toLowerCase()))
      .limit(1);

    if (matchedGenre.length > 0) {
      const animeIds = await db
        .select({ animeId: animeGenres.animeId })
        .from(animeGenres)
        .where(eq(animeGenres.genreId, matchedGenre[0].id));

      if (animeIds.length > 0) {
        conditions.push(
          inArray(
            animes.id,
            animeIds.map((a) => a.animeId),
          ),
        );
      } else {
        return c.json(
          {
            success: true as const,
            data: [],
            pagination: { page, limit, total: 0, totalPages: 0 },
          },
          200,
        );
      }
    }
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  let orderByClause = desc(animes.createdAt);
  if (q.sort === "score") {
    orderByClause = desc(animes.rating);
  } else if (q.sort === "popular") {
    orderByClause = desc(animes.episodesCount);
  }

  const [totalRes, items] = await Promise.all([
    db
      .select({ count: sql<number>`count(*)` })
      .from(animes)
      .where(whereClause),
    db.select().from(animes).where(whereClause).orderBy(orderByClause).limit(limit).offset(offset),
  ]);

  const total = totalRes[0]?.count ?? 0;
  const totalPages = Math.ceil(total / limit);

  return c.json(
    {
      success: true as const,
      data: items.map((item) => ({
        ...item,
        isFeatured: Boolean(item.isFeatured),
        isTrending: Boolean(item.isTrending),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    },
    200,
  );
});

// Implementation: Get Anime by Slug
animeApp.openapi(getAnimeBySlugRoute, async (c) => {
  const db = getDb(c.env.DB);
  const { slug } = c.req.valid("param");

  const animeRecord = await db.query.animes.findFirst({
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

  if (!animeRecord) {
    return c.json(
      {
        success: false as const,
        error: `Anime with slug "${slug}" not found`,
      },
      404,
    );
  }

  const activeSchedule = animeRecord.schedules?.[0] ?? null;

  return c.json(
    {
      success: true as const,
      data: {
        id: animeRecord.id,
        slug: animeRecord.slug,
        titleRomaji: animeRecord.titleRomaji,
        titleEnglish: animeRecord.titleEnglish,
        titleJapanese: animeRecord.titleJapanese,
        synopsis: animeRecord.synopsis,
        coverImage: animeRecord.coverImage,
        bannerImage: animeRecord.bannerImage,
        type: animeRecord.type,
        status: animeRecord.status,
        seasonName: animeRecord.seasonName,
        seasonYear: animeRecord.seasonYear,
        episodesCount: animeRecord.episodesCount,
        durationPerEp: animeRecord.durationPerEp,
        rating: animeRecord.rating,
        isFeatured: Boolean(animeRecord.isFeatured),
        isTrending: Boolean(animeRecord.isTrending),
        subOrDub: animeRecord.subOrDub,
        genres: animeRecord.animeGenres.map((ag) => ag.genre),
        studios: animeRecord.animeStudios.map((as) => as.studio),
        schedule: activeSchedule
          ? {
              releaseDay: activeSchedule.releaseDay,
              releaseTime: activeSchedule.releaseTime,
              episodeNumber: activeSchedule.episodeNumber,
              status: activeSchedule.status,
              timezone: activeSchedule.timezone,
            }
          : null,
        trendingStats: animeRecord.trendingStats
          ? {
              rank: animeRecord.trendingStats.rank,
              trendScore: animeRecord.trendingStats.trendScore,
              totalViews: animeRecord.trendingStats.totalViews,
            }
          : null,
      },
    },
    200,
  );
});
