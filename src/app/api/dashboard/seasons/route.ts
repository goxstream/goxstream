import { NextResponse } from "next/server";
import { getCacheItem, setCacheItem } from "@/lib/cache";
import { MOCK_SEASONS } from "@/app/dashboard/anime/seasons/constants";

export async function GET() {
  const CACHE_KEY = "kv_dashboard_seasons_v1";
  const CACHE_TTL = 300;

  try {
    const cached = await getCacheItem<{ seasons: typeof MOCK_SEASONS }>(CACHE_KEY);
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          "Cache-Control": "public, max-age=60, s-maxage=300",
          "X-Cache": "HIT-CACHE",
        },
      });
    }

    const data = { seasons: MOCK_SEASONS };
    await setCacheItem(CACHE_KEY, data, CACHE_TTL);

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=300",
        "X-Cache": "MISS-CACHE",
      },
    });
  } catch {
    return NextResponse.json({ seasons: MOCK_SEASONS }, { status: 200 });
  }
}
