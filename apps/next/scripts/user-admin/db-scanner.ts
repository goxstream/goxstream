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
    execSync("npx wrangler d1 execute goxstream --remote --command=\"SELECT 1\"", {
      stdio: ["ignore", "pipe", "pipe"],
      timeout: 10000,
      env: { ...process.env, WRANGLER_SEND_METRICS: "false" },
    });
    results.push({
      id: "d1-remote",
      name: "Cloudflare D1 (Remote)",
      description: "Cloudflare Production D1 Instance (93a28981-ac5e-4381-a3aa-18d98b9bf5ca)",
      isAvailable: true,
    });
  } catch (err: any) {
    results.push({
      id: "d1-remote",
      name: "Cloudflare D1 (Remote)",
      description: "Remote D1 inaccessible or not logged in (run 'npx wrangler login')",
      isAvailable: false,
      reason: err?.message || String(err),
    });
  }

  return results;
}
