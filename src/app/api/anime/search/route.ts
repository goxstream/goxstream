import { NextResponse } from "next/server";
import { getBrowseAnime } from "@/lib/db/queries/anime";
import { getCacheItem, setCacheItem } from "@/lib/cache";
import type { AnimeItem } from "@/types/anime";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") || "").trim().toLowerCase();

  const CACHE_KEY = `kv_search_${encodeURIComponent(query || "default")}`;
  const CACHE_TTL = 300;

  try {
    const cached = await getCacheItem<{ results: AnimeItem[] }>(CACHE_KEY);
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          "Cache-Control": "public, max-age=60, s-maxage=300",
          "X-Cache": "HIT-CACHE",
        },
      });
    }

    const items = await getBrowseAnime({ query, limit: 12 }).catch(() => []);
    const data = { results: items };

    await setCacheItem(CACHE_KEY, data, CACHE_TTL);

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=300",
        "X-Cache": "MISS-CACHE",
      },
    });
  } catch {
    return NextResponse.json({ results: [] }, { status: 200 });
  }
}
