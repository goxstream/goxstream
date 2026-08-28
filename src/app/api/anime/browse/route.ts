import { NextResponse } from "next/server";
import { getBrowseAnime } from "@/lib/db/queries/anime";
import { getCacheItem, setCacheItem } from "@/lib/cache";
import type { AnimeItem } from "@/types/anime";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const genre = searchParams.get("genre") || undefined;
  const query = searchParams.get("query") || undefined;
  const status = searchParams.get("status") || undefined;
  const type = searchParams.get("type") || undefined;
  const limit = parseInt(searchParams.get("limit") || "40", 10);

  const cacheKeyRaw = `cache_browse_${genre || "all"}_${query || "all"}_${status || "all"}_${type || "all"}_${limit}`;
  const CACHE_KEY = encodeURIComponent(cacheKeyRaw);
  const CACHE_TTL = 300;

  try {
    const cached = await getCacheItem<{ animeList: AnimeItem[] }>(CACHE_KEY);
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          "Cache-Control": "public, max-age=60, s-maxage=300",
          "X-Cache": "HIT-CACHE",
        },
      });
    }

    const items = await getBrowseAnime({ genre, query, status, type, limit }).catch(() => []);
    const data = { animeList: items };

    await setCacheItem(CACHE_KEY, data, CACHE_TTL);

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=300",
        "X-Cache": "MISS-CACHE",
      },
    });
  } catch {
    return NextResponse.json({ animeList: [] }, { status: 200 });
  }
}
