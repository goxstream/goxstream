import { NextResponse } from "next/server";
import {
  getDashboardWorkspacesData,
  getDashboardTrafficData,
  getDashboardRecentActivities,
  getDashboardNotifications,
} from "@/lib/db/queries/dashboard-overview";
import { getCacheItem, setCacheItem } from "@/lib/cache";

export async function GET() {
  const CACHE_KEY = "kv_dashboard_overview_v2";
  const CACHE_TTL = 120; // 2 minutes cache for real-time dashboard feel

  try {
    const cached = await getCacheItem<any>(CACHE_KEY);
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          "Cache-Control": "public, max-age=15, s-maxage=120",
          "X-Cache": "HIT-CACHE",
        },
      });
    }

    const [workspaces, trafficData, recentActivities, notifications] = await Promise.all([
      getDashboardWorkspacesData().catch(() => []),
      getDashboardTrafficData().catch(() => []),
      getDashboardRecentActivities().catch(() => []),
      getDashboardNotifications().catch(() => []),
    ]);

    const data = {
      workspaces,
      trafficData,
      recentActivities,
      notifications,
    };

    await setCacheItem(CACHE_KEY, data, CACHE_TTL);

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, max-age=15, s-maxage=120",
        "X-Cache": "MISS-CACHE",
      },
    });
  } catch (error) {
    console.error("Dashboard overview API error:", error);
    return NextResponse.json(
      {
        workspaces: [],
        trafficData: [],
        recentActivities: [],
        notifications: [],
      },
      { status: 200 }
    );
  }
}
