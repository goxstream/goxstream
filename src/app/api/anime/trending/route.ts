import { NextResponse } from "next/server";
import { getTrendingAnime, getAllGenres } from "@/lib/db/queries/anime";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const runtime = "edge";

export async function GET() {
  const CACHE_KEY = "kv_trending_anime_v1";
  const CACHE_TTL = 300; // 5 minutes

  try {
    // 1. Cek KV Cache pada environment Cloudflare
    try {
      const { env } = await getCloudflareContext();
      if (env?.KV) {
        const cached = await env.KV.get(CACHE_KEY, "json");
        if (cached) {
          return NextResponse.json(cached, {
            headers: {
              "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600",
              "X-Cache": "HIT-KV",
            },
          });
        }
      }
    } catch {
      // Fallback untuk local Node dev mode
    }

    // 2. Fetch data dari database D1 jika KV Miss
    const [trendingAnime, genresList] = await Promise.all([
      getTrendingAnime(10).catch(() => []),
      getAllGenres().catch(() => []),
    ]);

    const data = { trendingAnime, genresList };

    // 3. Simpan ke KV Cache secara asynchronous
    try {
      const { env } = await getCloudflareContext();
      if (env?.KV) {
        await env.KV.put(CACHE_KEY, JSON.stringify(data), { expirationTtl: CACHE_TTL });
      }
    } catch {
      // Fallback
    }

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600",
        "X-Cache": "MISS-KV",
      },
    });
  } catch {
    return NextResponse.json({ trendingAnime: [], genresList: [] }, { status: 500 });
  }
}
