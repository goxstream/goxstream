import { NextResponse } from "next/server";
import { getCacheItem, setCacheItem } from "@/lib/cache";
import { MOCK_ROLES } from "@/app/dashboard/users/roles/constants";

export async function GET() {
  const CACHE_KEY = "kv_dashboard_roles_v1";
  const CACHE_TTL = 300;

  try {
    const cached = await getCacheItem<{ roles: typeof MOCK_ROLES }>(CACHE_KEY);
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          "Cache-Control": "public, max-age=60, s-maxage=300",
          "X-Cache": "HIT-CACHE",
        },
      });
    }

    const data = { roles: MOCK_ROLES };
    await setCacheItem(CACHE_KEY, data, CACHE_TTL);

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=300",
        "X-Cache": "MISS-CACHE",
      },
    });
  } catch {
    return NextResponse.json({ roles: MOCK_ROLES }, { status: 200 });
  }
}
