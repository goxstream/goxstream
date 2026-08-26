"use client";

import { useState, useEffect } from "react";
import { MOCK_SEASONS } from "@/app/dashboard/anime/seasons/constants";
import type { SeasonItem } from "@/app/dashboard/anime/seasons/types";

export function useDashboardSeasons() {
  const [seasons, setSeasons] = useState<SeasonItem[]>(MOCK_SEASONS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchSeasons() {
      try {
        const res = await fetch("/api/dashboard/seasons");
        if (res.ok) {
          const data = (await res.json()) as { seasons?: SeasonItem[] };
          if (isMounted && data.seasons && data.seasons.length > 0) {
            setSeasons(data.seasons);
          }
        }
      } catch {
        // Fallback
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchSeasons();

    return () => {
      isMounted = false;
    };
  }, []);

  return { seasons, isLoading, setSeasons };
}
