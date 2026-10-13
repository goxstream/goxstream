"use client";

import { useState, useEffect } from "react";
import type { ActivityLogItem } from "../types";

export interface DashboardOverviewData {
  trafficData: Array<{ time: string; activeStreams: number; bandwidthGbps: number }>;
  recentActivities: ActivityLogItem[];
  notifications: Array<{ id: string; title: string; description: string; time: string; type: "success" | "alert" | "info" }>;
}

export function useDashboardOverview() {
  const [data, setData] = useState<DashboardOverviewData>({
    trafficData: [],
    recentActivities: [],
    notifications: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchOverview() {
      try {
        const res = await fetch("/api/dashboard/overview");
        if (res.ok) {
          const resData = (await res.json()) as DashboardOverviewData;
          if (isMounted) {
            setData({
              trafficData: resData.trafficData || [],
              recentActivities: resData.recentActivities || [],
              notifications: resData.notifications || [],
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch dashboard overview:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchOverview();

    return () => {
      isMounted = false;
    };
  }, []);

  return { ...data, isLoading };
}
