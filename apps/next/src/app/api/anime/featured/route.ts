import { NextResponse } from "next/server";
import { getFeaturedAnime } from "@/lib/db/queries/anime";
import { getCacheItem, setCacheItem } from "@/lib/cache";
import type { AnimeItem } from "@/types/anime";

export async function GET() {
  const CACHE_KEY = "kv_featured_anime_v2";
  const CACHE_TTL = 300;

  try {
    const cached = await getCacheItem<{ featuredAnime: AnimeItem | null }>(CACHE_KEY);
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          "Cache-Control": "public, max-age=60, s-maxage=300",
          "X-Cache": "HIT-CACHE",
        },
      });
    }

    const featuredAnime = await getFeaturedAnime().catch(() => null);
    const data = { featuredAnime };

    await setCacheItem(CACHE_KEY, data, CACHE_TTL);

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=300",
        "X-Cache": "MISS-CACHE",
      },
    });
  } catch {
    return NextResponse.json({ featuredAnime: null }, { status: 200 });
  }
}
