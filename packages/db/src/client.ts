import { drizzle, type DrizzleD1Database } from "drizzle-orm/d1";
import * as schema from "./schema/index";

/**
 * Module-level isolate singleton cache for the Drizzle D1 database instance.
 *
 * In Cloudflare Workers, a single isolate handles many requests sequentially.
 * Re-using the same Drizzle instance avoids ~2-4ms re-initialization per request,
 * keeping us well under the 10ms CPU limit on the free plan.
 */
let cachedDb: DrizzleD1Database<typeof schema> | null = null;
let cachedD1Ref: D1Database | null = null;

export function getDb(d1: D1Database): DrizzleD1Database<typeof schema> {
  if (cachedDb && cachedD1Ref === d1) {
    return cachedDb;
  }
  cachedDb = drizzle(d1, { schema });
  cachedD1Ref = d1;
  return cachedDb;
}
