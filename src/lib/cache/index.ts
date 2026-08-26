import { getCloudflareContext } from "@opennextjs/cloudflare";
import { kvCacheAdapter } from "./kv";
import { redisCacheAdapter } from "./redis";
import type { CacheAdapter } from "./types";

export * from "./types";
export { kvCacheAdapter } from "./kv";
export { redisCacheAdapter } from "./redis";

/**
 * Dynamically resolves the active CacheAdapter based on the current execution runtime.
 * Returns `kvCacheAdapter` in Cloudflare Workers, or `redisCacheAdapter` in Node.js/VPS.
 */
async function resolveCacheAdapter(): Promise<CacheAdapter> {
  try {
    const { env } = await getCloudflareContext();
    if (env?.KV) {
      return kvCacheAdapter;
    }
  } catch {
    // Fallback to Redis / In-Memory provider in Node.js or VPS
  }
  return redisCacheAdapter;
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
