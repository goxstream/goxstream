import { drizzle as drizzleD1 } from "drizzle-orm/d1";
import { drizzle as drizzleNeonHttp } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg } from "drizzle-orm/postgres-js";
import { neon } from "@neondatabase/serverless";
import postgres from "postgres";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { sqliteSchema, pgSchema } from "./schema";

/**
 * Universal Database Adapter for GoxStream.
 * Handles the complete 12-target runtime matrix:
 *
 * CLOUDFLARE WORKERS RUNTIME:
 * - cf -> d1                    : drizzleD1(env.DB)
 * - cf -> neon                  : drizzleNeonHttp(neon(dbUrl))
 * - cf -> tradisional (TCP/VPS) : Cloudflare Hyperdrive / postgres(activeUrl)
 * - cf -> supabase              : drizzleNeonHttp / postgres(dbUrl)
 * - cf -> aiven                 : Cloudflare Hyperdrive / postgres(dbUrl)
 * - cf -> prisma db cloud       : drizzleNeonHttp / HTTP adapter
 *
 * NODE.JS / VPS / DOCKER RUNTIME:
 * - nodejs -> sqlite            : local D1 simulation / SQLite
 * - nodejs -> neon              : drizzleNeonHttp / postgres(dbUrl)
 * - nodejs -> tradisional       : postgres(dbUrl)
 * - nodejs -> supabase          : postgres(dbUrl)
 * - nodejs -> aiven             : postgres(dbUrl)
 * - nodejs -> prisma db cloud   : postgres(dbUrl)
 */
export async function getDb() {
  let env: any;
  let isCloudflare = false;

  try {
    const cfCtx = await getCloudflareContext();
    env = cfCtx?.env;
    isCloudflare = Boolean(env && (env.DB || env.HYPERDRIVE || env.DB_URL || env.DATABASE_URL));
  } catch {
    isCloudflare = false;
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

  // -------------------------------------------------------------
  // MATRIX 1: CLOUDFLARE WORKERS RUNTIME
  // -------------------------------------------------------------
  if (isCloudflare) {
    // 1. cf -> d1 (Explicit d1 or default when env.DB bound without Postgres config)
    if ((connectionType === "d1" || (!connectionType && !dbUrl)) && env?.DB) {
      return drizzleD1(env.DB, { schema: sqliteSchema }) as any;
    }

    // 2. cf -> postgres (Neon, Supabase, Aiven, Tradisional, Prisma Cloud)
    const activeUrl = env?.HYPERDRIVE?.connectionString || dbUrl;
    if (activeUrl) {
      // Use HTTP fetch driver for serverless Postgres providers (Neon, Supabase, Prisma)
      if (
        activeUrl.includes("neon.tech") ||
        activeUrl.includes("neon.build") ||
        activeUrl.includes("supabase") ||
        activeUrl.includes("prisma")
      ) {
        const sql = neon(activeUrl);
        return drizzleNeonHttp(sql, { schema: pgSchema }) as any;
      }

      // Traditional TCP Postgres via Hyperdrive or postgres-js
      const client = postgres(activeUrl);
      return drizzlePg(client, { schema: pgSchema }) as any;
    }

    // Fallback to D1 on Cloudflare Worker if bound
    if (env?.DB) {
      return drizzleD1(env.DB, { schema: sqliteSchema }) as any;
    }
  }

  // -------------------------------------------------------------
  // MATRIX 2: NODE.JS / VPS / DOCKER RUNTIME
  // -------------------------------------------------------------
  if (dbUrl) {
    // nodejs -> neon / serverless postgres
    if (dbUrl.includes("neon.tech") || dbUrl.includes("neon.build")) {
      const sql = neon(dbUrl);
      return drizzleNeonHttp(sql, { schema: pgSchema }) as any;
    }
    // nodejs -> tradisional / aiven / supabase / prisma
    const client = postgres(dbUrl);
    return drizzlePg(client, { schema: pgSchema }) as any;
  }

  // Fallback if env.DB is available via Miniflare/Dev context
  if (env?.DB) {
    return drizzleD1(env.DB, { schema: sqliteSchema }) as any;
  }

  throw new Error(
    "No database configuration found. Please set DB_CONNECTION=postgres & DB_URL, or bind Cloudflare D1 (DB)."
  );
}
