import { NextResponse } from "next/server";
import { getTrendingAnime, getAllGenres } from "@/lib/db/queries/anime";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { TRENDING_ANIME as FALLBACK_TRENDING, GENRES_LIST as FALLBACK_GENRES } from "@/lib/mock-anime";

export async function GET() {
  const CACHE_KEY = "kv_trending_anime_v1";
  const CACHE_TTL = 300; // 5 minutes

  try {
    try {
      const { env } = await getCloudflareContext();
      if (env?.KV) {
        const cached = await env.KV.get(CACHE_KEY, "json");
        if (cached) {
          return NextResponse.json(cached, {
            headers: {
              "Cache-Control": "public, max-age=60, s-maxage=300",
              "X-Cache": "HIT-KV",
            },
          });
        }
      }
    } catch {
      // Fallback
    }

    const [trendingAnime, genresList] = await Promise.all([
      getTrendingAnime(10).catch(() => FALLBACK_TRENDING),
      getAllGenres().catch(() => FALLBACK_GENRES),
    ]);

    const data = {
      trendingAnime: trendingAnime.length > 0 ? trendingAnime : FALLBACK_TRENDING,
      genresList: genresList.length > 0 ? genresList : FALLBACK_GENRES,
    };

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
        "Cache-Control": "public, max-age=60, s-maxage=300",
        "X-Cache": "MISS-KV",
      },
    });
  } catch {
    return NextResponse.json(
      { trendingAnime: FALLBACK_TRENDING, genresList: FALLBACK_GENRES },
      { status: 200 }
    );
  }
}
