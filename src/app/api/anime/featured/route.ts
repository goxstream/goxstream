import { NextResponse } from "next/server";
import { getFeaturedAnime } from "@/lib/db/queries/anime";
import { getCacheItem, setCacheItem } from "@/lib/cache";
import { FEATURED_ANIME as FALLBACK_FEATURED } from "@/lib/mock-anime";

export async function GET() {
  const CACHE_KEY = "kv_featured_anime_v1";
  const CACHE_TTL = 300; // 5 minutes

  try {
    const cached = await getCacheItem<{ featuredAnime: typeof FALLBACK_FEATURED }>(CACHE_KEY);
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          "Cache-Control": "public, max-age=60, s-maxage=300",
          "X-Cache": "HIT-CACHE",
        },
      });
    }

    const featuredAnime = await getFeaturedAnime().catch(() => FALLBACK_FEATURED);
    const data = { featuredAnime: featuredAnime || FALLBACK_FEATURED };

    await setCacheItem(CACHE_KEY, data, CACHE_TTL);

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=300",
        "X-Cache": "MISS-CACHE",
      },
    });
  } catch {
    return NextResponse.json({ featuredAnime: FALLBACK_FEATURED }, { status: 200 });
  }
}
