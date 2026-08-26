import { NextResponse } from "next/server";
import { getBrowseAnime } from "@/lib/db/queries/anime";
import { getCacheItem, setCacheItem } from "@/lib/cache";
import { ALL_ANIME as FALLBACK_ANIME } from "@/lib/mock-anime";

export async function GET() {
  const CACHE_KEY = "kv_dashboard_anime_v1";
  const CACHE_TTL = 300;

  try {
    const cached = await getCacheItem<{ animeList: typeof FALLBACK_ANIME }>(CACHE_KEY);
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          "Cache-Control": "public, max-age=60, s-maxage=300",
          "X-Cache": "HIT-CACHE",
        },
      });
    }

    const items = await getBrowseAnime({ limit: 50 }).catch(() => FALLBACK_ANIME);
    const data = { animeList: items.length > 0 ? items : FALLBACK_ANIME };

    await setCacheItem(CACHE_KEY, data, CACHE_TTL);

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=300",
        "X-Cache": "MISS-CACHE",
      },
    });
  } catch {
    return NextResponse.json({ animeList: FALLBACK_ANIME }, { status: 200 });
  }
}
