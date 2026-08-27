import { drizzle as drizzleD1 } from "drizzle-orm/d1";
import { drizzle as drizzlePg } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { sqliteSchema, pgSchema } from "./schema";

/**
 * Returns an initialized Drizzle ORM client instance.
 * Automatically selects PostgreSQL if DB_CONNECTION=postgres or DB_URL/DATABASE_URL is set,
 * otherwise defaults to Cloudflare D1 (Cloudflare Workers).
 */
export async function getDb() {
  try {
    const { env } = await getCloudflareContext();
    if (env && env.DB) {
      return drizzleD1(env.DB, { schema: sqliteSchema }) as any;
    }
  } catch {
    // getCloudflareContext throws or is unavailable when running outside Workers context
  }

  const connectionType = (process.env.DB_CONNECTION || "").toLowerCase();
  const dbUrl = process.env.DB_URL || process.env.DATABASE_URL;

  const isPostgres =
    connectionType === "postgres" ||
    connectionType === "postgresql" ||
    Boolean(dbUrl);

  if (isPostgres && dbUrl) {
    const client = postgres(dbUrl);
    return drizzlePg(client, { schema: pgSchema }) as any;
  }

  throw new Error("No database context found. Please ensure Cloudflare D1 binding (DB) is configured or DATABASE_URL is set.");
}
