import { getCloudflareContext } from "@opennextjs/cloudflare";

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

// In-Memory fallback store for Node.js / VPS environments
const memoryCache = new Map<string, CacheEntry<unknown>>();

/**
 * Cleans expired In-Memory cache entries
 */
function pruneMemoryCache() {
  const now = Date.now();
  for (const [key, entry] of memoryCache.entries()) {
    if (entry.expiresAt <= now) {
      memoryCache.delete(key);
    }
  }
}

/**
 * Unified Cache Layer Adapter (Cloudflare-first, Not Cloudflare-locked)
 * - In Cloudflare Workers environment: Uses Cloudflare KV (env.KV)
 * - In Node.js / VPS environment: Uses In-Memory Cache with TTL
 */
export async function getCacheItem<T>(key: string): Promise<T | null> {
  // 1. Try Cloudflare KV in Workers runtime
  try {
    const { env } = await getCloudflareContext();
    if (env?.KV) {
      const cached = await env.KV.get(key, "json");
      if (cached !== null) {
        return cached as T;
      }
      return null;
    }
  } catch {
    // Fallback to Node.js in-memory store
  }

  // 2. In-Memory fallback for Node.js / VPS
  pruneMemoryCache();
  const entry = memoryCache.get(key);
  if (entry && entry.expiresAt > Date.now()) {
    return entry.value as T;
  }
  return null;
}

/**
 * Sets a cached item in Cloudflare KV (Workers) or In-Memory Store (Node.js/VPS).
 */
export async function setCacheItem<T>(
  key: string,
  value: T,
  ttlSeconds = 300
): Promise<void> {
  // 1. Try Cloudflare KV in Workers runtime
  try {
    const { env } = await getCloudflareContext();
    if (env?.KV) {
      await env.KV.put(key, JSON.stringify(value), {
        expirationTtl: ttlSeconds,
      });
      return;
    }
  } catch {
    // Fallback to Node.js in-memory store
  }

  // 2. In-Memory fallback for Node.js / VPS
  const expiresAt = Date.now() + ttlSeconds * 1000;
  memoryCache.set(key, { value, expiresAt });
}

/**
 * Deletes a cached item from Cloudflare KV or In-Memory Store.
 */
export async function deleteCacheItem(key: string): Promise<void> {
  try {
    const { env } = await getCloudflareContext();
    if (env?.KV) {
      await env.KV.delete(key);
    }
  } catch {
    // Fallback
  }

  memoryCache.delete(key);
}
