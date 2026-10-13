import { getCloudflareContext } from "@opennextjs/cloudflare";
import { kvCacheAdapter } from "./kv";
import { redisCacheAdapter } from "./redis";
import type { CacheAdapter } from "./types";

export * from "./types";
export { kvCacheAdapter } from "./kv";
export { redisCacheAdapter } from "./redis";

/**
 * Module-level singleton cache for the resolved CacheAdapter.
 * Avoids re-resolving (including getCloudflareContext() call) on every request.
 */
let cachedAdapter: CacheAdapter | null = null;

/**
 * Resolves active CacheAdapter following "Cloudflare-first, Not Cloudflare-locked" principles:
 * 1. Explicit Override: If CACHE_CONNECTION=redis or REDIS_URL/REDIS_HOST is set, override and use redisCacheAdapter.
 * 2. Default Target: Cloudflare KV (env.KV via getCloudflareContext()).
 * 3. Fallback: If KV is unavailable (e.g. Node.js local dev), fallback to redisCacheAdapter (In-Memory/Redis).
 *
 * The resolved adapter is cached at module level to avoid re-resolution overhead
 * on subsequent requests within the same Workers isolate.
 */
async function resolveCacheAdapter(): Promise<CacheAdapter> {
  if (cachedAdapter) return cachedAdapter;

  const cacheType = (process.env.CACHE_CONNECTION || "").toLowerCase();
  const redisUrl = process.env.REDIS_URL || process.env.REDIS_HOST;

  const isRedisOverride =
    cacheType === "redis" ||
    Boolean(redisUrl);

  if (isRedisOverride) {
    cachedAdapter = redisCacheAdapter;
    return cachedAdapter;
  }

  try {
    const { env } = await getCloudflareContext();
    if (env?.KV) {
      cachedAdapter = kvCacheAdapter;
      return cachedAdapter;
    }
  } catch {
    // Fallback for Node.js / local dev mode
  }

  cachedAdapter = redisCacheAdapter;
  return cachedAdapter;
}

/**
 * Gets a cached item from Cloudflare KV (Workers) or Redis/In-Memory (Node.js/VPS).
 */
export async function getCacheItem<T>(key: string): Promise<T | null> {
  const adapter = await resolveCacheAdapter();
  return adapter.get<T>(key);
}

/**
 * Sets a cached item in Cloudflare KV (Workers) or Redis/In-Memory (Node.js/VPS).
 */
export async function setCacheItem<T>(
  key: string,
  value: T,
  ttlSeconds = 300
): Promise<void> {
  const adapter = await resolveCacheAdapter();
  return adapter.set<T>(key, value, ttlSeconds);
}

/**
 * Deletes a cached item from the active cache provider.
 */
export async function deleteCacheItem(key: string): Promise<void> {
  const adapter = await resolveCacheAdapter();
  return adapter.delete(key);
}
