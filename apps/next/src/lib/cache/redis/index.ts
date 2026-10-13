import type { CacheAdapter } from "../types";

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

// In-Memory store fallback for Node.js / VPS environments
const memoryStore = new Map<string, CacheEntry<unknown>>();

function pruneMemoryStore() {
  const now = Date.now();
  for (const [key, entry] of memoryStore.entries()) {
    if (entry.expiresAt <= now) {
      memoryStore.delete(key);
    }
  }
}

/**
 * Redis & In-Memory Cache Provider Implementation
 * Handles caching for Node.js / VPS environments
 */
export class RedisMemoryCacheAdapter implements CacheAdapter {
  async get<T>(key: string): Promise<T | null> {
    pruneMemoryStore();
    const entry = memoryStore.get(key);
    if (entry && entry.expiresAt > Date.now()) {
      return entry.value as T;
    }
    return null;
  }

  async set<T>(key: string, value: T, ttlSeconds = 300): Promise<void> {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    memoryStore.set(key, { value, expiresAt });
  }

  async delete(key: string): Promise<void> {
    memoryStore.delete(key);
  }
}

export const redisCacheAdapter = new RedisMemoryCacheAdapter();
