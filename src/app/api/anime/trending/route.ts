import { NextResponse } from "next/server";
import { getTrendingAnime, getAllGenres } from "@/lib/db/queries/anime";
import { getCacheItem, setCacheItem } from "@/lib/cache";
import { TRENDING_ANIME as FALLBACK_TRENDING, GENRES_LIST as FALLBACK_GENRES } from "@/lib/mock-anime";

export async function GET() {
  const CACHE_KEY = "kv_trending_anime_v1";
  const CACHE_TTL = 300; // 5 minutes

  try {
    const cached = await getCacheItem<{
      trendingAnime: typeof FALLBACK_TRENDING;
      genresList: typeof FALLBACK_GENRES;
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
      getTrendingAnime(10).catch(() => FALLBACK_TRENDING),
      getAllGenres().catch(() => FALLBACK_GENRES),
    ]);

    const data = {
      trendingAnime: trendingAnime.length > 0 ? trendingAnime : FALLBACK_TRENDING,
      genresList: genresList.length > 0 ? genresList : FALLBACK_GENRES,
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
      { trendingAnime: FALLBACK_TRENDING, genresList: FALLBACK_GENRES },
      { status: 200 }
    );
  }
}
