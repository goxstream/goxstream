import { NextResponse } from "next/server";
import { getCacheItem, setCacheItem } from "@/lib/cache";

const DEFAULT_STATS = {
  totalAnime: 1240,
  totalEpisodes: 18920,
  totalUsers: 45210,
  activeStreams: 3420,
  bandwidthUsageGb: 842.5,
  cpuLoadPercent: 18.4,
  storageUsedGb: 1420.8,
  monthlyGrowthPercent: 14.8,
};

export async function GET() {
  const CACHE_KEY = "kv_dashboard_stats_v1";
  const CACHE_TTL = 300;

  try {
    const cached = await getCacheItem<{ stats: typeof DEFAULT_STATS }>(CACHE_KEY);
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          "Cache-Control": "public, max-age=60, s-maxage=300",
          "X-Cache": "HIT-CACHE",
        },
      });
    }

    const data = { stats: DEFAULT_STATS };
    await setCacheItem(CACHE_KEY, data, CACHE_TTL);

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=300",
        "X-Cache": "MISS-CACHE",
      },
    });
  } catch {
    return NextResponse.json({ stats: DEFAULT_STATS }, { status: 200 });
  }
}
