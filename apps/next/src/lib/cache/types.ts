/**
 * Standard Cache Adapter Interface
 * Provides unified contract for Cloudflare KV, Redis, and In-Memory caches.
 */
export interface CacheAdapter {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
  delete(key: string): Promise<void>;
}
