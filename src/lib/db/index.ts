import { drizzle as drizzleD1 } from "drizzle-orm/d1";
import { drizzle as drizzleNeonHttp } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg } from "drizzle-orm/postgres-js";
import { neon } from "@neondatabase/serverless";
import postgres from "postgres";
import { sql } from "drizzle-orm";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { sqliteSchema, pgSchema } from "./schema";

/**
 * Universal Database Adapter for GoxStream with 3-Step Priority Hierarchy:
 *
 * 1. D1: If DB_CONNECTION=d1 or env.DB is present (and no explicit override).
 * 2. Postgres: If DB_CONNECTION=postgres & DB_URL is set (Neon HTTP or TCP).
 * 3. Hyperdrive: If DB_CONNECTION=hyperdrive or env.HYPERDRIVE is present & status 200 connected (verified via live SELECT 1 ping).
 */
export async function getDb() {
  let env: any;
  try {
    const cfCtx = await getCloudflareContext();
    env = cfCtx?.env;
  } catch {
    // Not running inside Cloudflare Workers
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

  // ==============================================================================
  // 1. D1 (Cloudflare D1 Primary Choice)
  // ==============================================================================
  if ((connectionType === "d1" || (!connectionType && env?.DB && !dbUrl)) && env?.DB) {
    return drizzleD1(env.DB, { schema: sqliteSchema }) as any;
  }

  // ==============================================================================
  // 2. Postgres (Driver = postgres & DB_URL present)
  // ==============================================================================
  if ((connectionType === "postgres" || connectionType === "postgresql") && dbUrl) {
    if (
      dbUrl.includes("neon.tech") ||
      dbUrl.includes("neon.build") ||
      dbUrl.includes("supabase") ||
      dbUrl.includes("prisma")
    ) {
      const sqlClient = neon(dbUrl);
      return drizzleNeonHttp(sqlClient, { schema: pgSchema }) as any;
    }
    const client = postgres(dbUrl);
    return drizzlePg(client, { schema: pgSchema }) as any;
  }

  // ==============================================================================
  // 3. Hyperdrive (Binding present & status connected 200 verified via live ping)
  // ==============================================================================
  const hyperdriveUrl = env?.HYPERDRIVE?.connectionString;
  if (connectionType === "hyperdrive" || hyperdriveUrl) {
    if (hyperdriveUrl) {
      try {
        const client = postgres(hyperdriveUrl, { connect_timeout: 2, max: 1 });
        const db = drizzlePg(client, { schema: pgSchema });
        // Live ping check to verify Hyperdrive status connected (200 OK)
        await db.execute(sql`SELECT 1`);
        return db as any;
      } catch (err) {
        console.warn(
          "[GoxStream DB] Hyperdrive connection test failed or inaccessible. Falling back to D1/DB_URL.",
          err
        );
      }
    }
  }

  // ==============================================================================
  // Fallbacks: Try D1 or Postgres DB_URL if present
  // ==============================================================================
  if (env?.DB) {
    return drizzleD1(env.DB, { schema: sqliteSchema }) as any;
  }

  if (dbUrl) {
    if (dbUrl.includes("neon.tech") || dbUrl.includes("neon.build")) {
      const sqlClient = neon(dbUrl);
      return drizzleNeonHttp(sqlClient, { schema: pgSchema }) as any;
    }
    const client = postgres(dbUrl);
    return drizzlePg(client, { schema: pgSchema }) as any;
  }

  throw new Error(
    "No valid database connection found. Configure D1 (env.DB), DB_CONNECTION=postgres & DB_URL, or Cloudflare Hyperdrive."
  );
}
