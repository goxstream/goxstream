import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import type { CloudflareEnv } from "@shionstream/cloudflare";
import { getDb, animes, episodes, streamSources, subtitleTracks, audioTracks } from "@shionstream/db";
import { desc, asc, eq } from "drizzle-orm";

const EpisodeListItemSchema = z.object({
  id: z.string(),
  number: z.number(),
  title: z.string(),
  durationSeconds: z.number(),
  thumbnail: z.string().nullable().optional(),
  airDate: z.string().nullable().optional(),
  status: z.string(),
  viewsCount: z.number(),
  isVip: z.boolean(),
  createdAt: z.string(),
});

const StreamSourceSchema = z.object({
  id: z.string(),
  serverName: z.string().nullable().optional(),
  streamUrl: z.string(),
  format: z.string(),
  quality: z.string(),
  url1080p: z.string().nullable().optional(),
  url720p: z.string().nullable().optional(),
  url480p: z.string().nullable().optional(),
  url360p: z.string().nullable().optional(),
  isPrimary: z.boolean(),
});

const SubtitleTrackSchema = z.object({
  id: z.string(),
  label: z.string(),
  languageCode: z.string(),
  fileUrl: z.string(),
  format: z.string(),
  isDefault: z.boolean(),
});

const AudioTrackSchema = z.object({
  id: z.string(),
  label: z.string(),
  languageCode: z.string(),
  audioUrl: z.string(),
  type: z.string(),
  isDefault: z.boolean(),
});

// ── GET /v1/anime/{slug}/episodes ────────────────────────────────────────
const listAnimeEpisodesRoute = createRoute({
  method: "get",
  path: "/v1/anime/{slug}/episodes",
  tags: ["Episodes"],
  summary: "List Episodes by Anime Slug",
  description: "Retrieve an ordered list of published episodes for a specific anime.",
  request: {
    params: z.object({
      slug: z.string().min(1),
    }),
    query: z.object({
      page: z.string().optional().default("1"),
      limit: z.string().optional().default("50"),
      sort: z.enum(["asc", "desc"]).optional().default("asc"),
    }),
  },
  responses: {
    200: {
      description: "List of anime episodes",
      content: {
        "application/json": {
          schema: z.object({
            success: z.literal(true),
            anime: z.object({
              id: z.string(),
              slug: z.string(),
              titleRomaji: z.string(),
            }),
            data: z.array(EpisodeListItemSchema),
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

// ── GET /v1/episodes/{id}/stream ─────────────────────────────────────────
const getEpisodeStreamRoute = createRoute({
  method: "get",
  path: "/v1/episodes/{id}/stream",
  tags: ["Episodes"],
  summary: "Get Episode Stream Sources",
  description:
    "Retrieve video playback manifests, multi-resolution URLs, subtitles, and audio tracks for an episode.",
  request: {
    params: z.object({
      id: z.string().min(1),
    }),
  },
  responses: {
    200: {
      description: "Stream sources and media tracks",
      content: {
        "application/json": {
          schema: z.object({
            success: z.literal(true),
            episode: z.object({
              id: z.string(),
              animeId: z.string(),
              number: z.number(),
              title: z.string(),
            }),
            sources: z.array(StreamSourceSchema),
            subtitles: z.array(SubtitleTrackSchema),
            audio: z.array(AudioTrackSchema),
          }),
        },
      },
    },
    404: {
      description: "Episode not found",
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

export const episodesApp = new OpenAPIHono<{ Bindings: CloudflareEnv }>();

// Implementation: List Anime Episodes
episodesApp.openapi(listAnimeEpisodesRoute, async (c) => {
  const db = getDb(c.env.DB);
  const { slug } = c.req.valid("param");
  const q = c.req.valid("query");

  const animeRecord = await db
    .select({
      id: animes.id,
      slug: animes.slug,
      titleRomaji: animes.titleRomaji,
    })
    .from(animes)
    .where(eq(animes.slug, slug))
    .limit(1);

  if (animeRecord.length === 0) {
    return c.json(
      {
        success: false as const,
        error: `Anime with slug "${slug}" not found`,
      },
      404,
    );
  }

  const targetAnime = animeRecord[0];
  const page = Math.max(1, parseInt(q.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(q.limit, 10) || 50));
  const offset = (page - 1) * limit;

  const orderDirection = q.sort === "desc" ? desc(episodes.number) : asc(episodes.number);

  const [episodesList, countResult] = await Promise.all([
    db
      .select()
      .from(episodes)
      .where(eq(episodes.animeId, targetAnime.id))
      .orderBy(orderDirection)
      .limit(limit)
      .offset(offset),
    db.select({ count: episodes.id }).from(episodes).where(eq(episodes.animeId, targetAnime.id)),
  ]);

  const total = countResult.length;
  const totalPages = Math.ceil(total / limit);

  return c.json(
    {
      success: true as const,
      anime: targetAnime,
      data: episodesList.map((ep) => ({
        id: ep.id,
        number: ep.number,
        title: ep.title,
        durationSeconds: ep.durationSeconds,
        thumbnail: ep.thumbnail,
        airDate: ep.airDate ? ep.airDate.toISOString() : null,
        status: ep.status,
        viewsCount: ep.viewsCount,
        isVip: Boolean(ep.isVip),
        createdAt: ep.createdAt.toISOString(),
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

// Implementation: Get Episode Stream Sources
episodesApp.openapi(getEpisodeStreamRoute, async (c) => {
  const db = getDb(c.env.DB);
  const { id } = c.req.valid("param");

  const episodeRecord = await db
    .select({
      id: episodes.id,
      animeId: episodes.animeId,
      number: episodes.number,
      title: episodes.title,
    })
    .from(episodes)
    .where(eq(episodes.id, id))
    .limit(1);

  if (episodeRecord.length === 0) {
    return c.json(
      {
        success: false as const,
        error: `Episode with ID "${id}" not found`,
      },
      404,
    );
  }

  const [sourcesList, subsList, audioList] = await Promise.all([
    db
      .select()
      .from(streamSources)
      .where(eq(streamSources.episodeId, id))
      .orderBy(desc(streamSources.isPrimary)),
    db
      .select()
      .from(subtitleTracks)
      .where(eq(subtitleTracks.episodeId, id))
      .orderBy(desc(subtitleTracks.isDefault)),
    db
      .select()
      .from(audioTracks)
      .where(eq(audioTracks.episodeId, id))
      .orderBy(desc(audioTracks.isDefault)),
  ]);

  return c.json(
    {
      success: true as const,
      episode: episodeRecord[0],
      sources: sourcesList.map((s) => ({
        id: s.id,
        serverName: s.serverName,
        streamUrl: s.streamUrl,
        format: s.format,
        quality: s.quality,
        url1080p: s.url1080p,
        url720p: s.url720p,
        url480p: s.url480p,
        url360p: s.url360p,
        isPrimary: Boolean(s.isPrimary),
      })),
      subtitles: subsList.map((sub) => ({
        id: sub.id,
        label: sub.label,
        languageCode: sub.languageCode,
        fileUrl: sub.fileUrl,
        format: sub.format,
        isDefault: Boolean(sub.isDefault),
      })),
      audio: audioList.map((a) => ({
        id: a.id,
        label: a.label,
        languageCode: a.languageCode,
        audioUrl: a.audioUrl,
        type: a.type,
        isDefault: Boolean(a.isDefault),
      })),
    },
    200,
  );
});
