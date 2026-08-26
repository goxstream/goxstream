"use client";

import { useState, useEffect } from "react";

export interface DashboardStatsData {
  totalAnime: number;
  totalEpisodes: number;
  totalUsers: number;
  activeStreams: number;
  bandwidthUsageGb: number;
  cpuLoadPercent: number;
  storageUsedGb: number;
  monthlyGrowthPercent: number;
}

const DEFAULT_STATS: DashboardStatsData = {
  totalAnime: 1240,
  totalEpisodes: 18920,
  totalUsers: 45210,
  activeStreams: 3420,
  bandwidthUsageGb: 842.5,
  cpuLoadPercent: 18.4,
  storageUsedGb: 1420.8,
  monthlyGrowthPercent: 14.8,
};

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStatsData>(DEFAULT_STATS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchStats() {
      try {
        const res = await fetch("/api/dashboard/stats");
        if (res.ok) {
          const data = (await res.json()) as { stats?: DashboardStatsData };
          if (isMounted && data.stats) {
            setStats(data.stats);
          }
        }
      } catch {
        // Fallback to default stats
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchStats();

    return () => {
      isMounted = false;
    };
  }, []);

  return { stats, isLoading };
}
