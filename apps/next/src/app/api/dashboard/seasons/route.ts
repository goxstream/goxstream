import { NextResponse } from "next/server";
import { getDashboardSeasons } from "@/lib/db/queries/dashboard";
import { getCacheItem, setCacheItem } from "@/lib/cache";

export async function GET() {
  const CACHE_KEY = "kv_dashboard_seasons_v2";
  const CACHE_TTL = 300;

  try {
    const cached = await getCacheItem<{ seasons: Awaited<ReturnType<typeof getDashboardSeasons>> }>(CACHE_KEY);
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          "Cache-Control": "public, max-age=60, s-maxage=300",
          "X-Cache": "HIT-CACHE",
        },
      });
    }

    const realSeasons = await getDashboardSeasons();
    const data = { seasons: realSeasons };
    await setCacheItem(CACHE_KEY, data, CACHE_TTL);

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=300",
        "X-Cache": "MISS-CACHE",
      },
    });
  } catch {
    const realSeasons = await getDashboardSeasons();
    return NextResponse.json({ seasons: realSeasons }, { status: 200 });
  }
}
