import { NextResponse } from "next/server";
import { getAnimeScheduleItems } from "@/lib/db/queries/anime";
import { getCacheItem, setCacheItem } from "@/lib/cache";
import type { ScheduleItem } from "@/types/schedule";

export async function GET() {
  const CACHE_KEY = "kv_schedule_anime_v2";
  const CACHE_TTL = 300;

  try {
    const cached = await getCacheItem<{ scheduleItems: ScheduleItem[] }>(CACHE_KEY);

    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          "Cache-Control": "public, max-age=60, s-maxage=300",
          "X-Cache": "HIT-CACHE",
        },
      });
    }

    const scheduleItems = await getAnimeScheduleItems().catch(() => []);
    const data = { scheduleItems };

    await setCacheItem(CACHE_KEY, data, CACHE_TTL);

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=300",
        "X-Cache": "MISS-CACHE",
      },
    });
  } catch {
    return NextResponse.json({ scheduleItems: [] }, { status: 200 });
  }
}
