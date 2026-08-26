import { NextResponse } from "next/server";
import { getDashboardStats } from "@/lib/db/queries/dashboard";
import { getCacheItem, setCacheItem } from "@/lib/cache";

export async function GET() {
  const CACHE_KEY = "kv_dashboard_stats_v2";
  const CACHE_TTL = 300;

  try {
    const cached = await getCacheItem<{ stats: Awaited<ReturnType<typeof getDashboardStats>> }>(CACHE_KEY);
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          "Cache-Control": "public, max-age=60, s-maxage=300",
          "X-Cache": "HIT-CACHE",
        },
      });
    }

    const realStats = await getDashboardStats();
    const data = { stats: realStats };
    await setCacheItem(CACHE_KEY, data, CACHE_TTL);

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=300",
        "X-Cache": "MISS-CACHE",
      },
    });
  } catch {
    const realStats = await getDashboardStats();
    return NextResponse.json({ stats: realStats }, { status: 200 });
  }
}
