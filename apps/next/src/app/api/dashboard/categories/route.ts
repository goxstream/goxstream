import { NextResponse } from "next/server";
import { getDashboardCategories } from "@/lib/db/queries/dashboard";
import { getCacheItem, setCacheItem } from "@/lib/cache";

export async function GET() {
  const CACHE_KEY = "kv_dashboard_categories_v2";
  const CACHE_TTL = 300;

  try {
    const cached = await getCacheItem<{ categories: Awaited<ReturnType<typeof getDashboardCategories>> }>(CACHE_KEY);
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          "Cache-Control": "public, max-age=60, s-maxage=300",
          "X-Cache": "HIT-CACHE",
        },
      });
    }

    const realCategories = await getDashboardCategories();
    const data = { categories: realCategories };
    await setCacheItem(CACHE_KEY, data, CACHE_TTL);

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=300",
        "X-Cache": "MISS-CACHE",
      },
    });
  } catch {
    const realCategories = await getDashboardCategories();
    return NextResponse.json({ categories: realCategories }, { status: 200 });
  }
}
