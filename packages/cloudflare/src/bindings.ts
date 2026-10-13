/**
 * Strongly-typed Cloudflare Workers environment bindings for GoxStream API.
 *
 * All Cloudflare bindings (D1, KV, R2, Durable Objects, AI, Queues)
 * and environment variables/secrets are declared here as the single
 * source of truth consumed by `@goxstream/api`, `@goxstream/db`,
 * and `@goxstream/auth`.
 */
export interface CloudflareEnv {
  // ── D1 Database ──────────────────────────────────────────────────────
  DB: D1Database;

  // ── KV Namespaces ────────────────────────────────────────────────────
  CACHE_KV: KVNamespace;

  // ── R2 Object Storage ────────────────────────────────────────────────
  MEDIA_BUCKET: R2Bucket;

  // ── Durable Objects (foundation, optional at runtime) ───────────────
  RATE_LIMITER?: DurableObjectNamespace;

  // ── Workers AI (foundation, optional at runtime) ─────────────────────
  AI?: Ai;

  // ── Queues (foundation, optional at runtime) ─────────────────────────
  ANALYTICS_QUEUE?: Queue;

  // ── Environment Variables & Secrets ──────────────────────────────────
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  NODE_ENV?: "development" | "production" | "test";
}
