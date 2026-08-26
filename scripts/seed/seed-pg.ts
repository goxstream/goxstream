import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { fetchPopularAnime } from "./anilist";
import { transformAniListToEntities, type TransformedSeedBundle } from "./transformer";
import * as pgSchema from "../../src/lib/db/schema/pg";

function sqlEscape(val: string | null | undefined): string {
  if (val === null || val === undefined) return "NULL";
  return `'${val.replace(/'/g, "''")}'`;
}

function sqlNum(val: number | null | undefined): string {
  if (val === null || val === undefined || Number.isNaN(val)) return "NULL";
  return String(val);
}

function sqlBool(val: boolean | null | undefined): string {
  if (val === null || val === undefined) return "FALSE";
  return val ? "TRUE" : "FALSE";
}

function sqlTimestamp(val: Date | null | undefined): string {
  if (!val) return "NULL";
  return `'${val.toISOString()}'`;
}

export function generatePostgresSQL(bundle: TransformedSeedBundle): string {
  const lines: string[] = [
    "-- Auto-generated PostgreSQL seed script for GoxStream",
    "BEGIN;",
    "",
    "-- Clear existing tables in correct dependency order",
    'TRUNCATE TABLE "watch_histories", "watchlists", "anime_genres", "anime_studios", "schedules", "trending_stats", "subtitle_tracks", "audio_tracks", "stream_sources", "server_nodes", "episodes", "animes", "genres", "studios" CASCADE;',
    "",
  ];

  // Insert Animes
  bundle.animes.forEach((a) => {
    lines.push(
      `INSERT INTO "animes" ("id", "slug", "title_romaji", "title_english", "title_japanese", "synopsis", "cover_image", "banner_image", "type", "status", "season_name", "season_year", "episodes_count", "duration_per_ep", "rating", "is_featured", "is_trending", "sub_or_dub", "created_at", "updated_at") VALUES (${sqlEscape(a.id)}, ${sqlEscape(a.slug)}, ${sqlEscape(a.titleRomaji)}, ${sqlEscape(a.titleEnglish)}, ${sqlEscape(a.titleJapanese)}, ${sqlEscape(a.synopsis)}, ${sqlEscape(a.coverImage)}, ${sqlEscape(a.bannerImage)}, ${sqlEscape(a.type)}, ${sqlEscape(a.status)}, ${sqlEscape(a.seasonName)}, ${sqlNum(a.seasonYear)}, ${sqlNum(a.episodesCount)}, ${sqlEscape(a.durationPerEp)}, ${sqlNum(a.rating)}, ${sqlBool(a.isFeatured)}, ${sqlBool(a.isTrending)}, ${sqlEscape(a.subOrDub)}, ${sqlTimestamp(a.createdAt)}, ${sqlTimestamp(a.updatedAt)}) ON CONFLICT ("id") DO NOTHING;`
    );
  });

  lines.push("");

  // Insert Genres
  bundle.genres.forEach((g) => {
    lines.push(
      `INSERT INTO "genres" ("id", "name", "slug") VALUES (${sqlEscape(g.id)}, ${sqlEscape(g.name)}, ${sqlEscape(g.slug)}) ON CONFLICT ("id") DO NOTHING;`
    );
  });

  lines.push("");

  // Insert Studios
  bundle.studios.forEach((s) => {
    lines.push(
      `INSERT INTO "studios" ("id", "name", "slug") VALUES (${sqlEscape(s.id)}, ${sqlEscape(s.name)}, ${sqlEscape(s.slug)}) ON CONFLICT ("id") DO NOTHING;`
    );
  });

  lines.push("");

  // Insert Anime Genres
  bundle.animeGenres.forEach((ag) => {
    lines.push(
      `INSERT INTO "anime_genres" ("anime_id", "genre_id") VALUES (${sqlEscape(ag.animeId)}, ${sqlEscape(ag.genreId)}) ON CONFLICT ("anime_id", "genre_id") DO NOTHING;`
    );
  });

  lines.push("");

  // Insert Anime Studios
  bundle.animeStudios.forEach((as) => {
    lines.push(
      `INSERT INTO "anime_studios" ("anime_id", "studio_id") VALUES (${sqlEscape(as.animeId)}, ${sqlEscape(as.studioId)}) ON CONFLICT ("anime_id", "studio_id") DO NOTHING;`
    );
  });

  lines.push("");

  // Insert Server Nodes
  bundle.serverNodes.forEach((sn) => {
    lines.push(
      `INSERT INTO "server_nodes" ("id", "name", "region", "provider", "endpoint", "quality", "priority", "status", "health_status", "latency_ms", "is_primary") VALUES (${sqlEscape(sn.id)}, ${sqlEscape(sn.name)}, ${sqlEscape(sn.region)}, ${sqlEscape(sn.provider)}, ${sqlEscape(sn.endpoint)}, ${sqlEscape(sn.quality)}, ${sqlNum(sn.priority)}, ${sqlEscape(sn.status)}, ${sqlEscape(sn.healthStatus)}, ${sqlNum(sn.latencyMs)}, ${sqlBool(sn.isPrimary)}) ON CONFLICT ("id") DO NOTHING;`
    );
  });

  lines.push("");

  // Insert Episodes
  bundle.episodes.forEach((e) => {
    lines.push(
      `INSERT INTO "episodes" ("id", "anime_id", "number", "title", "duration_seconds", "thumbnail", "air_date", "status", "views_count", "is_vip", "created_at") VALUES (${sqlEscape(e.id)}, ${sqlEscape(e.animeId)}, ${sqlNum(e.number)}, ${sqlEscape(e.title)}, ${sqlNum(e.durationSeconds)}, ${sqlEscape(e.thumbnail)}, ${sqlTimestamp(e.airDate)}, ${sqlEscape(e.status)}, ${sqlNum(e.viewsCount)}, ${sqlBool(e.isVip)}, ${sqlTimestamp(e.createdAt)}) ON CONFLICT ("id") DO NOTHING;`
    );
  });

  lines.push("");

  // Insert Stream Sources
  bundle.streamSources.forEach((ss) => {
    lines.push(
      `INSERT INTO "stream_sources" ("id", "episode_id", "server_node_id", "server_name", "stream_url", "format", "quality", "url_1080p", "url_720p", "url_480p", "url_360p", "is_primary") VALUES (${sqlEscape(ss.id)}, ${sqlEscape(ss.episodeId)}, ${sqlEscape(ss.serverNodeId)}, ${sqlEscape(ss.serverName)}, ${sqlEscape(ss.streamUrl)}, ${sqlEscape(ss.format)}, ${sqlEscape(ss.quality)}, ${sqlEscape(ss.url1080p)}, ${sqlEscape(ss.url720p)}, ${sqlEscape(ss.url480p)}, ${sqlEscape(ss.url360p)}, ${sqlBool(ss.isPrimary)}) ON CONFLICT ("id") DO NOTHING;`
    );
  });

  lines.push("");

  // Insert Subtitle Tracks
  bundle.subtitleTracks.forEach((st) => {
    lines.push(
      `INSERT INTO "subtitle_tracks" ("id", "episode_id", "label", "language_code", "file_url", "format", "is_default") VALUES (${sqlEscape(st.id)}, ${sqlEscape(st.episodeId)}, ${sqlEscape(st.label)}, ${sqlEscape(st.languageCode)}, ${sqlEscape(st.fileUrl)}, ${sqlEscape(st.format)}, ${sqlBool(st.isDefault)}) ON CONFLICT ("id") DO NOTHING;`
    );
  });

  lines.push("");

  // Insert Audio Tracks
  bundle.audioTracks.forEach((at) => {
    lines.push(
      `INSERT INTO "audio_tracks" ("id", "episode_id", "label", "language_code", "audio_url", "type", "is_default") VALUES (${sqlEscape(at.id)}, ${sqlEscape(at.episodeId)}, ${sqlEscape(at.label)}, ${sqlEscape(at.languageCode)}, ${sqlEscape(at.audioUrl)}, ${sqlEscape(at.type)}, ${sqlBool(at.isDefault)}) ON CONFLICT ("id") DO NOTHING;`
    );
  });

  lines.push("");

  // Insert Schedules
  bundle.schedules.forEach((sch) => {
    lines.push(
      `INSERT INTO "schedules" ("id", "anime_id", "release_day", "release_time", "episode_number", "status", "timezone") VALUES (${sqlEscape(sch.id)}, ${sqlEscape(sch.animeId)}, ${sqlEscape(sch.releaseDay)}, ${sqlEscape(sch.releaseTime)}, ${sqlNum(sch.episodeNumber)}, ${sqlEscape(sch.status)}, ${sqlEscape(sch.timezone)}) ON CONFLICT ("id") DO NOTHING;`
    );
  });

  lines.push("");

  // Insert Trending Stats
  bundle.trendingStats.forEach((ts) => {
    lines.push(
      `INSERT INTO "trending_stats" ("anime_id", "rank", "previous_rank", "views_today", "views_this_week", "weekly_views", "monthly_views", "total_views", "trend_score", "updated_at") VALUES (${sqlEscape(ts.animeId)}, ${sqlNum(ts.rank)}, ${sqlNum(ts.previousRank)}, ${sqlNum(ts.viewsToday)}, ${sqlNum(ts.viewsThisWeek)}, ${sqlNum(ts.weeklyViews)}, ${sqlNum(ts.monthlyViews)}, ${sqlNum(ts.totalViews)}, ${sqlNum(ts.trendScore)}, ${sqlTimestamp(ts.updatedAt)}) ON CONFLICT ("anime_id") DO NOTHING;`
    );
  });

  lines.push("");
  lines.push("COMMIT;");
  return lines.join("\n");
}

export async function runSeedPG(customBundle?: TransformedSeedBundle) {
  console.log("=========================================================");
  console.log("[SEED PG] Starting PostgreSQL Seeding Pipeline");
  console.log("=========================================================");

  let bundle: TransformedSeedBundle;
  if (customBundle) {
    bundle = customBundle;
  } else {
    const rawAnime = await fetchPopularAnime(50);
    bundle = transformAniListToEntities(rawAnime);
  }

  // Generate & Save PostgreSQL SQL seed file
  const pgSql = generatePostgresSQL(bundle);
  const pgSeedDirPath = join(process.cwd(), "drizzle", "pg");
  mkdirSync(pgSeedDirPath, { recursive: true });
  const pgSeedFilePath = join(pgSeedDirPath, "seed.sql");
  writeFileSync(pgSeedFilePath, pgSql, "utf-8");
  console.log(`[SEED PG] Generated PostgreSQL seed file at: ${pgSeedFilePath}`);

  const dbUrl = process.env.DB_URL || process.env.DATABASE_URL;
  if (!dbUrl) {
    console.log("[SEED PG] Note: DB_URL/DATABASE_URL not set. Saved drizzle/pg/seed.sql file locally.");
    return;
  }

  const client = postgres(dbUrl);
  const db = drizzle(client, { schema: pgSchema });

  try {
    console.log("[SEED PG] Truncating existing database tables...");
    await db.delete(pgSchema.animeGenres);
    await db.delete(pgSchema.animeStudios);
    await db.delete(pgSchema.schedules);
    await db.delete(pgSchema.trendingStats);
    await db.delete(pgSchema.subtitleTracks);
    await db.delete(pgSchema.audioTracks);
    await db.delete(pgSchema.streamSources);
    await db.delete(pgSchema.serverNodes);
    await db.delete(pgSchema.episodes);
    await db.delete(pgSchema.animes);
    await db.delete(pgSchema.genres);
    await db.delete(pgSchema.studios);

    console.log("[SEED PG] Inserting Animes...");
    if (bundle.animes.length > 0) {
      await db.insert(pgSchema.animes).values(bundle.animes as any).onConflictDoNothing();
    }

    console.log("[SEED PG] Inserting Genres...");
    if (bundle.genres.length > 0) {
      await db.insert(pgSchema.genres).values(bundle.genres).onConflictDoNothing();
    }

    console.log("[SEED PG] Inserting Studios...");
    if (bundle.studios.length > 0) {
      await db.insert(pgSchema.studios).values(bundle.studios).onConflictDoNothing();
    }

    console.log("[SEED PG] Inserting Anime-Genre relations...");
    if (bundle.animeGenres.length > 0) {
      const uniqueAnimeGenres = Array.from(
        new Map(bundle.animeGenres.map((ag) => [`${ag.animeId}_${ag.genreId}`, ag])).values()
      );
      await db.insert(pgSchema.animeGenres).values(uniqueAnimeGenres).onConflictDoNothing();
    }

    console.log("[SEED PG] Inserting Anime-Studio relations...");
    if (bundle.animeStudios.length > 0) {
      const uniqueAnimeStudios = Array.from(
        new Map(bundle.animeStudios.map((as) => [`${as.animeId}_${as.studioId}`, as])).values()
      );
      await db.insert(pgSchema.animeStudios).values(uniqueAnimeStudios).onConflictDoNothing();
    }

    console.log("[SEED PG] Inserting Server Nodes...");
    if (bundle.serverNodes.length > 0) {
      await db.insert(pgSchema.serverNodes).values(bundle.serverNodes).onConflictDoNothing();
    }

    console.log("[SEED PG] Inserting Episodes...");
    if (bundle.episodes.length > 0) {
      for (let i = 0; i < bundle.episodes.length; i += 50) {
        const chunk = bundle.episodes.slice(i, i + 50);
        await db.insert(pgSchema.episodes).values(chunk).onConflictDoNothing();
      }
    }

    console.log("[SEED PG] Inserting Stream Sources...");
    if (bundle.streamSources.length > 0) {
      for (let i = 0; i < bundle.streamSources.length; i += 50) {
        const chunk = bundle.streamSources.slice(i, i + 50);
        await db.insert(pgSchema.streamSources).values(chunk).onConflictDoNothing();
      }
    }

    console.log("[SEED PG] Inserting Subtitle Tracks...");
    if (bundle.subtitleTracks.length > 0) {
      for (let i = 0; i < bundle.subtitleTracks.length; i += 50) {
        const chunk = bundle.subtitleTracks.slice(i, i + 50);
        await db.insert(pgSchema.subtitleTracks).values(chunk).onConflictDoNothing();
      }
    }

    console.log("[SEED PG] Inserting Audio Tracks...");
    if (bundle.audioTracks.length > 0) {
      for (let i = 0; i < bundle.audioTracks.length; i += 50) {
        const chunk = bundle.audioTracks.slice(i, i + 50);
        await db.insert(pgSchema.audioTracks).values(chunk).onConflictDoNothing();
      }
    }

    console.log("[SEED PG] Inserting Schedules...");
    if (bundle.schedules.length > 0) {
      await db.insert(pgSchema.schedules).values(bundle.schedules).onConflictDoNothing();
    }

    console.log("[SEED PG] Inserting Trending Stats...");
    if (bundle.trendingStats.length > 0) {
      await db.insert(pgSchema.trendingStats).values(bundle.trendingStats).onConflictDoNothing();
    }

    console.log("=========================================================");
    console.log("[SEED PG] PostgreSQL Database successfully seeded!");
    console.log("=========================================================");
  } catch (error) {
    console.error("[SEED PG] Error seeding PostgreSQL database:", error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

if (process.argv[1]?.includes("seed-pg.ts")) {
  runSeedPG();
}
