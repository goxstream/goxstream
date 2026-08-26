import { NextResponse } from "next/server";
import { getCacheItem, setCacheItem } from "@/lib/cache";
import { MOCK_MODERATION_QUEUE } from "@/app/dashboard/users/moderation/constants";

export async function GET() {
  const CACHE_KEY = "kv_dashboard_moderation_v1";
  const CACHE_TTL = 300;

  try {
    const cached = await getCacheItem<{ reports: typeof MOCK_MODERATION_QUEUE }>(CACHE_KEY);
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          "Cache-Control": "public, max-age=60, s-maxage=300",
          "X-Cache": "HIT-CACHE",
        },
      });
    }

    const data = { reports: MOCK_MODERATION_QUEUE };
    await setCacheItem(CACHE_KEY, data, CACHE_TTL);

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=300",
        "X-Cache": "MISS-CACHE",
      },
    });
  } catch {
    return NextResponse.json({ reports: MOCK_MODERATION_QUEUE }, { status: 200 });
  }
}
