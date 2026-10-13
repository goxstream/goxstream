import { NextResponse } from "next/server";
import { getTrendingAnime, getAllGenres } from "@/lib/db/queries/anime";
import { getCacheItem, setCacheItem } from "@/lib/cache";
import type { AnimeItem } from "@/types/anime";

export async function GET() {
  const CACHE_KEY = "kv_trending_anime_v2";
  const CACHE_TTL = 300;

  try {
    const cached = await getCacheItem<{
      trendingAnime: AnimeItem[];
      genresList: string[];
    }>(CACHE_KEY);

    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          "Cache-Control": "public, max-age=60, s-maxage=300",
          "X-Cache": "HIT-CACHE",
        },
      });
    }

    const [trendingAnime, genresList] = await Promise.all([
      getTrendingAnime(10).catch(() => []),
      getAllGenres().catch(() => []),
    ]);

    const data = {
      trendingAnime,
      genresList,
    };

    await setCacheItem(CACHE_KEY, data, CACHE_TTL);

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=300",
        "X-Cache": "MISS-CACHE",
      },
    });
  } catch {
    return NextResponse.json(
      { trendingAnime: [], genresList: [] },
      { status: 200 }
    );
  }
}
