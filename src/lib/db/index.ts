import { drizzle as drizzleD1 } from "drizzle-orm/d1";
import { drizzle as drizzleNeonHttp } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg } from "drizzle-orm/postgres-js";
import { neon } from "@neondatabase/serverless";
import postgres from "postgres";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { sqliteSchema, pgSchema } from "./schema";

/**
 * Returns an initialized Drizzle ORM client instance.
 * Automatically selects PostgreSQL if DB_CONNECTION=postgres or DB_URL/DATABASE_URL is set.
 * Uses HTTP-based Neon driver (@neondatabase/serverless) for full Cloudflare Workers & Node.js compatibility.
 * Otherwise defaults to Cloudflare D1 (Cloudflare Workers).
 */
export async function getDb() {
  let env: any;
  try {
    const cfCtx = await getCloudflareContext();
    env = cfCtx.env;
  } catch {
    // getCloudflareContext throws or is unavailable when running outside Workers context
  }

  const connectionType = (
    env?.DB_CONNECTION ||
    process.env.DB_CONNECTION ||
    ""
  ).toLowerCase();

  const dbUrl =
    env?.DB_URL ||
    process.env.DB_URL ||
    env?.DATABASE_URL ||
    process.env.DATABASE_URL;

  const isPostgres =
    connectionType === "postgres" ||
    connectionType === "postgresql" ||
    Boolean(dbUrl && (connectionType === "postgres" || connectionType === "postgresql"));

  if (isPostgres && dbUrl) {
    if (dbUrl.includes("neon.tech")) {
      const sql = neon(dbUrl);
      return drizzleNeonHttp(sql, { schema: pgSchema }) as any;
    }
    const client = postgres(dbUrl);
    return drizzlePg(client, { schema: pgSchema }) as any;
  }

  if (env && env.DB) {
    return drizzleD1(env.DB, { schema: sqliteSchema }) as any;
  }

  throw new Error("No database context found. Please ensure Cloudflare D1 binding (DB) is configured or DATABASE_URL is set.");
}
