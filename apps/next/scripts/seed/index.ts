import { runSeedD1 } from "./seed-d1";
import { runSeedPG } from "./seed-pg";

/**
 * Main Database Seeder Dispatcher for GoxStream.
 * Auto-detects target database environment variables:
 * - If DB_CONNECTION=postgres or DB_URL / DATABASE_URL is set: runs PostgreSQL seeder.
 * - Otherwise: runs Cloudflare D1 (SQLite) seeder.
 */
async function main() {
  try {
    process.loadEnvFile();
  } catch {}

  const connectionType = (process.env.DB_CONNECTION || "").toLowerCase();
  const dbUrl = process.env.DB_URL || process.env.DATABASE_URL;

  const isD1 = connectionType === "d1";
  const isPostgres =
    !isD1 &&
    (connectionType === "postgres" ||
      connectionType === "postgresql" ||
      connectionType === "hyperdrive" ||
      Boolean(dbUrl));

  if (isPostgres) {
    console.log("[SEED DISPATCHER] PostgreSQL environment detected.");
    await runSeedPG();
  } else {
    console.log("[SEED DISPATCHER] Local D1 / SQLite environment detected.");
    await runSeedD1();
  }
}

main().catch((err) => {
  console.error("[SEED DISPATCHER] Execution error:", err);
  process.exit(1);
});
