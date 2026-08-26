import { NextResponse } from "next/server";
import { getCacheItem, setCacheItem } from "@/lib/cache";
import { MOCK_CATEGORIES } from "@/app/dashboard/anime/categories/constants";

export async function GET() {
  const CACHE_KEY = "kv_dashboard_categories_v1";
  const CACHE_TTL = 300;

  try {
    const cached = await getCacheItem<{ categories: typeof MOCK_CATEGORIES }>(CACHE_KEY);
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          "Cache-Control": "public, max-age=60, s-maxage=300",
          "X-Cache": "HIT-CACHE",
        },
      });
    }

    const data = { categories: MOCK_CATEGORIES };
    await setCacheItem(CACHE_KEY, data, CACHE_TTL);

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=300",
        "X-Cache": "MISS-CACHE",
      },
    });
  } catch {
    return NextResponse.json({ categories: MOCK_CATEGORIES }, { status: 200 });
  }
}
