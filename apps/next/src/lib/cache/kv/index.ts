import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { CacheAdapter } from "../types";

/**
 * Cloudflare KV Cache Provider Implementation
 * Interacts directly with Cloudflare Workers KV binding (env.KV)
 */
export class CloudflareKVCacheAdapter implements CacheAdapter {
  async get<T>(key: string): Promise<T | null> {
    try {
      const { env } = await getCloudflareContext();
      if (env?.KV) {
        const cached = await env.KV.get(key, "json");
        if (cached !== null) {
          return cached as T;
        }
      }
    } catch {
      // Return null if Workers KV context is unavailable
    }
    return null;
  }

  async set<T>(key: string, value: T, ttlSeconds = 300): Promise<void> {
    try {
      const { env } = await getCloudflareContext();
      if (env?.KV) {
        await env.KV.put(key, JSON.stringify(value), {
          expirationTtl: ttlSeconds,
        });
      }
    } catch {
      // Fallback
    }
  }

  async delete(key: string): Promise<void> {
    try {
      const { env } = await getCloudflareContext();
      if (env?.KV) {
        await env.KV.delete(key);
      }
    } catch {
      // Fallback
    }
  }
}

export const kvCacheAdapter = new CloudflareKVCacheAdapter();
