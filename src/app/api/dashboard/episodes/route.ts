import { NextResponse } from "next/server";
import { getLatestEpisodes } from "@/lib/db/queries/episodes";
import { getCacheItem, setCacheItem } from "@/lib/cache";
import { LATEST_EPISODES as FALLBACK_EPISODES } from "@/lib/mock-anime";

export async function GET() {
  const CACHE_KEY = "kv_dashboard_episodes_v1";
  const CACHE_TTL = 300;

  try {
    const cached = await getCacheItem<{ episodes: typeof FALLBACK_EPISODES }>(CACHE_KEY);
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          "Cache-Control": "public, max-age=60, s-maxage=300",
          "X-Cache": "HIT-CACHE",
        },
      });
    }

    const items = await getLatestEpisodes(20).catch(() => FALLBACK_EPISODES);
    const data = { episodes: items.length > 0 ? items : FALLBACK_EPISODES };

    await setCacheItem(CACHE_KEY, data, CACHE_TTL);

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=300",
        "X-Cache": "MISS-CACHE",
      },
    });
  } catch {
    return NextResponse.json({ episodes: FALLBACK_EPISODES }, { status: 200 });
  }
}
