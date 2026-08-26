import { execSync } from "node:child_process";

/**
 * Dynamic DB Push script for GoxStream.
 * Auto-detects custom PostgreSQL environment variables (DB_URL / DATABASE_URL / DB_CONNECTION=postgres).
 * - If detected: Pushes schema directly to PostgreSQL using Drizzle Kit.
 * - If absent: Applies local D1 migrations to Wrangler/Miniflare D1 binding.
 */
function runDbPush() {
  try {
    process.loadEnvFile();
  } catch {}

  const connectionType = (process.env.DB_CONNECTION || "").toLowerCase();
  const dbUrl = process.env.DB_URL || process.env.DATABASE_URL;
  const isRemote =
    process.env.DB_REMOTE === "true" ||
    process.argv.includes("--remote") ||
    process.argv.includes("-r");

  const isPostgres =
    connectionType === "postgres" ||
    connectionType === "postgresql" ||
    Boolean(dbUrl);

  if (isPostgres) {
    console.log("---------------------------------------------------------");
    console.log("[DB PUSH] Detected PostgreSQL configuration.");
    console.log("[DB PUSH] Pushing schema to PostgreSQL database...");
    console.log("---------------------------------------------------------");
    execSync("npx drizzle-kit push", {
      stdio: "inherit",
      env: {
        ...process.env,
        DB_CONNECTION: "postgres",
      },
    });
  } else {
    const targetFlag = isRemote ? "--remote" : "--local";
    const targetText = isRemote ? "remote Cloudflare D1 database" : "local Cloudflare D1 binding";
    console.log("---------------------------------------------------------");
    console.log("[DB PUSH] No custom DB URL detected.");
    console.log(`[DB PUSH] Applying migrations to ${targetText}...`);
    console.log("---------------------------------------------------------");
    execSync(`npx wrangler d1 migrations apply goxstream ${targetFlag}`, {
      stdio: "inherit",
      env: process.env,
    });
  }
}

runDbPush();
