import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";
import { fetchPopularAnime } from "./anilist";
import { transformAniListToEntities } from "./transformer";
import { generateSQLiteSQL } from "./seed-d1";
import { generatePostgresSQL } from "./seed-pg";

/**
 * Bulk Export & Seeder Pipeline for GoxStream.
 * 1. Scrapes bulk anime entries from AniList API (with optional API key auto-detection).
 * 2. Saves transformed JSON dataset locally to `drizzle/anime-database.json`.
 * 3. Generates SQLite dialect SQL file at `drizzle/d1/seed.sql`.
 * 4. Generates PostgreSQL dialect SQL file at `drizzle/pg/seed.sql`.
 * 5. Applies generated D1 seed file to local Wrangler D1 binding.
 */
async function main() {
  console.log("=========================================================");
  console.log("[EXPORT ALL] Bulk Anime Scraper & Dual SQL Export Pipeline");
  console.log("=========================================================");

  const scrapeLimit = Number.parseInt(process.env.SCRAPE_LIMIT || "100", 10);
  console.log(`[EXPORT ALL] Target scrape limit: ${scrapeLimit} anime entries.`);

  // 1. Scrape raw data from AniList API
  const rawAnime = await fetchPopularAnime(scrapeLimit);

  // 2. Transform into GoxStream entities DTO
  console.log("[EXPORT ALL] Transforming API response into GoxStream DTOs...");
  const bundle = transformAniListToEntities(rawAnime);

  // Ensure output directories exist
  const drizzleDir = join(process.cwd(), "drizzle");
  const d1Dir = join(drizzleDir, "d1");
  const pgDir = join(drizzleDir, "pg");

  mkdirSync(drizzleDir, { recursive: true });
  mkdirSync(d1Dir, { recursive: true });
  mkdirSync(pgDir, { recursive: true });

  // 3. Save JSON cache locally
  const jsonPath = join(drizzleDir, "anime-database.json");
  writeFileSync(jsonPath, JSON.stringify(bundle, null, 2), "utf-8");
  console.log(`[EXPORT ALL] Saved local JSON dataset at: ${jsonPath}`);

  // 4. Generate SQLite / Cloudflare D1 SQL
  const d1Sql = generateSQLiteSQL(bundle);
  const d1SqlPath = join(d1Dir, "seed.sql");
  writeFileSync(d1SqlPath, d1Sql, "utf-8");
  console.log(`[EXPORT ALL] Generated SQLite/D1 seed SQL at: ${d1SqlPath}`);

  // 5. Generate PostgreSQL SQL
  const pgSql = generatePostgresSQL(bundle);
  const pgSqlPath = join(pgDir, "seed.sql");
  writeFileSync(pgSqlPath, pgSql, "utf-8");
  console.log(`[EXPORT ALL] Generated PostgreSQL seed SQL at: ${pgSqlPath}`);

  // 6. Apply to local D1 database
  console.log("[EXPORT ALL] Applying generated D1 seed to local Wrangler D1 binding...");
  try {
    execSync("npx wrangler d1 execute goxstream --local --file=./drizzle/d1/seed.sql", {
      stdio: "inherit",
    });
    console.log("=========================================================");
    console.log("[EXPORT ALL] Bulk export & local D1 seeding completed successfully!");
    console.log("=========================================================");
  } catch (error) {
    console.error("[EXPORT ALL] Error executing D1 seed:", error);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("[EXPORT ALL] Fatal error:", err);
  process.exit(1);
});
