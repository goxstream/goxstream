import { NextResponse } from "next/server";
import { getDashboardUsers } from "@/lib/db/queries/dashboard";
import { getCacheItem, setCacheItem } from "@/lib/cache";

export async function GET() {
  const CACHE_KEY = "kv_dashboard_users_v2";
  const CACHE_TTL = 300;

  try {
    const cached = await getCacheItem<{ users: Awaited<ReturnType<typeof getDashboardUsers>> }>(CACHE_KEY);
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          "Cache-Control": "public, max-age=60, s-maxage=300",
          "X-Cache": "HIT-CACHE",
        },
      });
    }

    const realUsers = await getDashboardUsers();
    const data = { users: realUsers };
    await setCacheItem(CACHE_KEY, data, CACHE_TTL);

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=300",
        "X-Cache": "MISS-CACHE",
      },
    });
  } catch {
    const realUsers = await getDashboardUsers();
    return NextResponse.json({ users: realUsers }, { status: 200 });
  }
}
