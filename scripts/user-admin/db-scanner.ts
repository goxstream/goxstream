import { execSync } from "node:child_process";
import postgres from "postgres";
import type { DbTargetInfo } from "./types";

export async function scanAvailableDatabases(): Promise<DbTargetInfo[]> {
  try {
    process.loadEnvFile();
  } catch {}

  const results: DbTargetInfo[] = [];

  // 1. PostgreSQL Scan
  const dbUrl = process.env.DB_URL || process.env.DATABASE_URL;
  if (dbUrl) {
    try {
      const sql = postgres(dbUrl, { max: 1, connect_timeout: 3, idle_timeout: 1 });
      await sql`SELECT 1`;
      await sql.end();
      results.push({
        id: "postgres",
        name: "PostgreSQL Database",
        description: "Direct connection via DATABASE_URL / DB_URL (.env)",
        isAvailable: true,
      });
    } catch (err: any) {
      results.push({
        id: "postgres",
        name: "PostgreSQL Database",
        description: "Connection failed",
        isAvailable: false,
        reason: err.message,
      });
    }
  } else {
    results.push({
      id: "postgres",
      name: "PostgreSQL Database",
      description: "DB_URL / DATABASE_URL not defined in .env",
      isAvailable: false,
    });
  }

  // 2. D1 Local Scan
  try {
    execSync("npx wrangler d1 execute goxstream --local --command=\"SELECT 1\"", {
      stdio: ["ignore", "pipe", "pipe"],
      timeout: 5000,
      env: { ...process.env, CI: "true", WRANGLER_SEND_METRICS: "false" },
    });
    results.push({
      id: "d1-local",
      name: "Cloudflare D1 (Local)",
      description: "Local Miniflare SQLite storage (.wrangler/state/v3/d1)",
      isAvailable: true,
    });
  } catch (err: any) {
    results.push({
      id: "d1-local",
      name: "Cloudflare D1 (Local)",
      description: "Local D1 database not initialized or Wrangler error",
      isAvailable: false,
      reason: err?.message || String(err),
    });
  }

  // 3. D1 Remote Scan
  try {
    const whoami = execSync("npx wrangler whoami", {
      stdio: ["ignore", "pipe", "pipe"],
      timeout: 5000,
      env: { ...process.env, CI: "true", WRANGLER_SEND_METRICS: "false" },
    }).toString();
    if (whoami.includes("Not logged in")) {
      results.push({
        id: "d1-remote",
        name: "Cloudflare D1 (Remote)",
        description: "Wrangler not logged in (run 'npx wrangler login')",
        isAvailable: false,
      });
    } else {
      execSync("npx wrangler d1 execute goxstream --remote --command=\"SELECT 1\"", {
        stdio: ["ignore", "pipe", "pipe"],
        timeout: 8000,
        env: { ...process.env, CI: "true", WRANGLER_SEND_METRICS: "false" },
      });
      results.push({
        id: "d1-remote",
        name: "Cloudflare D1 (Remote)",
        description: "Cloudflare Production D1 Instance",
        isAvailable: true,
      });
    }
  } catch (err: any) {
    results.push({
      id: "d1-remote",
      name: "Cloudflare D1 (Remote)",
      description: "Remote D1 inaccessible or not logged in",
      isAvailable: false,
      reason: err?.message || String(err),
    });
  }

  return results;
}
