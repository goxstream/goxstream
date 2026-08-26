import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";
import { fetchPopularAnime } from "./anilist";
import { transformAniListToEntities, type TransformedSeedBundle } from "./transformer";

function sqlEscape(val: string | null | undefined): string {
  if (val === null || val === undefined) return "NULL";
  return `'${val.replace(/'/g, "''")}'`;
}

function sqlNum(val: number | null | undefined): string {
  if (val === null || val === undefined || Number.isNaN(val)) return "NULL";
  return String(val);
}

function sqlBool(val: boolean | null | undefined): string {
  if (val === null || val === undefined) return "0";
  return val ? "1" : "0";
}

function sqlTimestamp(val: Date | null | undefined): string {
  if (!val) return "NULL";
  return String(val.getTime());
}

export function generateSQLiteSQL(bundle: TransformedSeedBundle): string {
  const lines: string[] = [
    "-- Auto-generated SQLite / D1 seed script for GoxStream",
    "PRAGMA foreign_keys = OFF;",
    "",
    "-- Clear existing tables",
    'DELETE FROM "anime_genres";',
    'DELETE FROM "anime_studios";',
    'DELETE FROM "schedules";',
    'DELETE FROM "trending_stats";',
    'DELETE FROM "subtitle_tracks";',
    'DELETE FROM "audio_tracks";',
    'DELETE FROM "stream_sources";',
    'DELETE FROM "server_nodes";',
    'DELETE FROM "episodes";',
    'DELETE FROM "animes";',
    'DELETE FROM "genres";',
    'DELETE FROM "studios";',
    "",
  ];

  // Insert Animes
  bundle.animes.forEach((a) => {
    lines.push(
      `INSERT OR REPLACE INTO "animes" ("id", "slug", "title_romaji", "title_english", "title_japanese", "synopsis", "cover_image", "banner_image", "type", "status", "season_name", "season_year", "episodes_count", "duration_per_ep", "rating", "is_featured", "is_trending", "sub_or_dub", "created_at", "updated_at") VALUES (${sqlEscape(a.id)}, ${sqlEscape(a.slug)}, ${sqlEscape(a.titleRomaji)}, ${sqlEscape(a.titleEnglish)}, ${sqlEscape(a.titleJapanese)}, ${sqlEscape(a.synopsis)}, ${sqlEscape(a.coverImage)}, ${sqlEscape(a.bannerImage)}, ${sqlEscape(a.type)}, ${sqlEscape(a.status)}, ${sqlEscape(a.seasonName)}, ${sqlNum(a.seasonYear)}, ${sqlNum(a.episodesCount)}, ${sqlEscape(a.durationPerEp)}, ${sqlNum(a.rating)}, ${sqlBool(a.isFeatured)}, ${sqlBool(a.isTrending)}, ${sqlEscape(a.subOrDub)}, ${sqlTimestamp(a.createdAt)}, ${sqlTimestamp(a.updatedAt)});`
    );
  });

  lines.push("");

  // Insert Genres
  bundle.genres.forEach((g) => {
    lines.push(
      `INSERT OR REPLACE INTO "genres" ("id", "name", "slug") VALUES (${sqlEscape(g.id)}, ${sqlEscape(g.name)}, ${sqlEscape(g.slug)});`
    );
  });

  lines.push("");

  // Insert Studios
  bundle.studios.forEach((s) => {
    lines.push(
      `INSERT OR REPLACE INTO "studios" ("id", "name", "slug") VALUES (${sqlEscape(s.id)}, ${sqlEscape(s.name)}, ${sqlEscape(s.slug)});`
    );
  });

  lines.push("");

  // Insert Anime Genres
  bundle.animeGenres.forEach((ag) => {
    lines.push(
      `INSERT OR REPLACE INTO "anime_genres" ("anime_id", "genre_id") VALUES (${sqlEscape(ag.animeId)}, ${sqlEscape(ag.genreId)});`
    );
  });

  lines.push("");

  // Insert Anime Studios
  bundle.animeStudios.forEach((as) => {
    lines.push(
      `INSERT OR REPLACE INTO "anime_studios" ("anime_id", "studio_id") VALUES (${sqlEscape(as.animeId)}, ${sqlEscape(as.studioId)});`
    );
  });

  lines.push("");

  // Insert Server Nodes
  bundle.serverNodes.forEach((sn) => {
    lines.push(
      `INSERT OR REPLACE INTO "server_nodes" ("id", "name", "region", "provider", "endpoint", "quality", "priority", "status", "health_status", "latency_ms", "is_primary") VALUES (${sqlEscape(sn.id)}, ${sqlEscape(sn.name)}, ${sqlEscape(sn.region)}, ${sqlEscape(sn.provider)}, ${sqlEscape(sn.endpoint)}, ${sqlEscape(sn.quality)}, ${sqlNum(sn.priority)}, ${sqlEscape(sn.status)}, ${sqlEscape(sn.healthStatus)}, ${sqlNum(sn.latencyMs)}, ${sqlBool(sn.isPrimary)});`
    );
  });

  lines.push("");

  // Insert Episodes
  bundle.episodes.forEach((e) => {
    lines.push(
      `INSERT OR REPLACE INTO "episodes" ("id", "anime_id", "number", "title", "duration_seconds", "thumbnail", "air_date", "status", "views_count", "is_vip", "created_at") VALUES (${sqlEscape(e.id)}, ${sqlEscape(e.animeId)}, ${sqlNum(e.number)}, ${sqlEscape(e.title)}, ${sqlNum(e.durationSeconds)}, ${sqlEscape(e.thumbnail)}, ${sqlTimestamp(e.airDate)}, ${sqlEscape(e.status)}, ${sqlNum(e.viewsCount)}, ${sqlBool(e.isVip)}, ${sqlTimestamp(e.createdAt)});`
    );
  });

  lines.push("");

  // Insert Stream Sources
  bundle.streamSources.forEach((ss) => {
    lines.push(
      `INSERT OR REPLACE INTO "stream_sources" ("id", "episode_id", "server_node_id", "server_name", "stream_url", "format", "quality", "url_1080p", "url_720p", "url_480p", "url_360p", "is_primary") VALUES (${sqlEscape(ss.id)}, ${sqlEscape(ss.episodeId)}, ${sqlEscape(ss.serverNodeId)}, ${sqlEscape(ss.serverName)}, ${sqlEscape(ss.streamUrl)}, ${sqlEscape(ss.format)}, ${sqlEscape(ss.quality)}, ${sqlEscape(ss.url1080p)}, ${sqlEscape(ss.url720p)}, ${sqlEscape(ss.url480p)}, ${sqlEscape(ss.url360p)}, ${sqlBool(ss.isPrimary)});`
    );
  });

  lines.push("");

  // Insert Subtitle Tracks
  bundle.subtitleTracks.forEach((st) => {
    lines.push(
      `INSERT OR REPLACE INTO "subtitle_tracks" ("id", "episode_id", "label", "language_code", "file_url", "format", "is_default") VALUES (${sqlEscape(st.id)}, ${sqlEscape(st.episodeId)}, ${sqlEscape(st.label)}, ${sqlEscape(st.languageCode)}, ${sqlEscape(st.fileUrl)}, ${sqlEscape(st.format)}, ${sqlBool(st.isDefault)});`
    );
  });

  lines.push("");

  // Insert Audio Tracks
  bundle.audioTracks.forEach((at) => {
    lines.push(
      `INSERT OR REPLACE INTO "audio_tracks" ("id", "episode_id", "label", "language_code", "audio_url", "type", "is_default") VALUES (${sqlEscape(at.id)}, ${sqlEscape(at.episodeId)}, ${sqlEscape(at.label)}, ${sqlEscape(at.languageCode)}, ${sqlEscape(at.audioUrl)}, ${sqlEscape(at.type)}, ${sqlBool(at.isDefault)});`
    );
  });

  lines.push("");

  // Insert Schedules
  bundle.schedules.forEach((sch) => {
    lines.push(
      `INSERT OR REPLACE INTO "schedules" ("id", "anime_id", "release_day", "release_time", "episode_number", "status", "timezone") VALUES (${sqlEscape(sch.id)}, ${sqlEscape(sch.animeId)}, ${sqlEscape(sch.releaseDay)}, ${sqlEscape(sch.releaseTime)}, ${sqlNum(sch.episodeNumber)}, ${sqlEscape(sch.status)}, ${sqlEscape(sch.timezone)});`
    );
  });

  lines.push("");

  // Insert Trending Stats
  bundle.trendingStats.forEach((ts) => {
    lines.push(
      `INSERT OR REPLACE INTO "trending_stats" ("anime_id", "rank", "previous_rank", "views_today", "views_this_week", "weekly_views", "monthly_views", "total_views", "trend_score", "updated_at") VALUES (${sqlEscape(ts.animeId)}, ${sqlNum(ts.rank)}, ${sqlNum(ts.previousRank)}, ${sqlNum(ts.viewsToday)}, ${sqlNum(ts.viewsThisWeek)}, ${sqlNum(ts.weeklyViews)}, ${sqlNum(ts.monthlyViews)}, ${sqlNum(ts.totalViews)}, ${sqlNum(ts.trendScore)}, ${sqlTimestamp(ts.updatedAt)});`
    );
  });

  lines.push("");
  lines.push("PRAGMA foreign_keys = ON;");
  return lines.join("\n");
}

export async function runSeedD1() {
  console.log("=========================================================");
  console.log("[SEED D1] Starting Cloudflare D1 (SQLite) Seeding Pipeline");
  console.log("=========================================================");

  const rawAnime = await fetchPopularAnime(20);
  const bundle = transformAniListToEntities(rawAnime);

  const sqlContent = generateSQLiteSQL(bundle);

  const seedDirPath = join(process.cwd(), "drizzle", "d1");
  mkdirSync(seedDirPath, { recursive: true });

  const seedFilePath = join(seedDirPath, "seed.sql");
  writeFileSync(seedFilePath, sqlContent, "utf-8");

  console.log(`[SEED D1] Successfully generated D1 seed file at: ${seedFilePath}`);
  console.log("[SEED D1] Applying seed to local Wrangler D1 binding...");

  try {
    execSync("npx wrangler d1 execute goxstream --local --file=./drizzle/d1/seed.sql", {
      stdio: "inherit",
    });
    console.log("=========================================================");
    console.log("[SEED D1] Cloudflare D1 Database successfully seeded!");
    console.log("=========================================================");
  } catch (error) {
    console.error("[SEED D1] Error applying D1 seed:", error);
    process.exit(1);
  }
}

if (process.argv[1]?.includes("seed-d1.ts")) {
  runSeedD1();
}
