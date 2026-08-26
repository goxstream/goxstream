import { NextResponse } from "next/server";
import { getBrowseAnime } from "@/lib/db/queries/anime";
import { getCacheItem, setCacheItem } from "@/lib/cache";
import { TRENDING_ANIME as FALLBACK_SEARCH } from "@/lib/mock-anime";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") || "").trim().toLowerCase();

  const CACHE_KEY = `kv_search_${encodeURIComponent(query || "default")}`;
  const CACHE_TTL = 300;

  try {
    const cached = await getCacheItem<{ results: typeof FALLBACK_SEARCH }>(CACHE_KEY);
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          "Cache-Control": "public, max-age=60, s-maxage=300",
          "X-Cache": "HIT-CACHE",
        },
      });
    }

    const items = await getBrowseAnime({ query, limit: 12 }).catch(() => FALLBACK_SEARCH);
    const data = { results: items.length > 0 ? items : (query ? [] : FALLBACK_SEARCH) };

    await setCacheItem(CACHE_KEY, data, CACHE_TTL);

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=300",
        "X-Cache": "MISS-CACHE",
      },
    });
  } catch {
    return NextResponse.json({ results: FALLBACK_SEARCH }, { status: 200 });
  }
}
