import { NextResponse } from "next/server";
import { getDashboardModeration } from "@/lib/db/queries/dashboard";
import { getCacheItem, setCacheItem } from "@/lib/cache";

export async function GET() {
  const CACHE_KEY = "kv_dashboard_moderation_v2";
  const CACHE_TTL = 300;

  try {
    const cached = await getCacheItem<{ reports: Awaited<ReturnType<typeof getDashboardModeration>> }>(CACHE_KEY);
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          "Cache-Control": "public, max-age=60, s-maxage=300",
          "X-Cache": "HIT-CACHE",
        },
      });
    }

    const realReports = await getDashboardModeration();
    const data = { reports: realReports };
    await setCacheItem(CACHE_KEY, data, CACHE_TTL);

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=300",
        "X-Cache": "MISS-CACHE",
      },
    });
  } catch {
    const realReports = await getDashboardModeration();
    return NextResponse.json({ reports: realReports }, { status: 200 });
  }
}
