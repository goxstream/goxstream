import { NextResponse } from "next/server";
import { getDashboardRoles } from "@/lib/db/queries/dashboard";
import { getCacheItem, setCacheItem } from "@/lib/cache";

export async function GET() {
  const CACHE_KEY = "kv_dashboard_roles_v2";
  const CACHE_TTL = 300;

  try {
    const cached = await getCacheItem<{ roles: Awaited<ReturnType<typeof getDashboardRoles>> }>(CACHE_KEY);
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          "Cache-Control": "public, max-age=60, s-maxage=300",
          "X-Cache": "HIT-CACHE",
        },
      });
    }

    const realRoles = await getDashboardRoles();
    const data = { roles: realRoles };
    await setCacheItem(CACHE_KEY, data, CACHE_TTL);

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=300",
        "X-Cache": "MISS-CACHE",
      },
    });
  } catch {
    const realRoles = await getDashboardRoles();
    return NextResponse.json({ roles: realRoles }, { status: 200 });
  }
}
