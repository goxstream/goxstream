"use client";

import { useState, useEffect } from "react";
import type { SeasonItem } from "@/app/dashboard/anime/seasons/types";

export function useDashboardSeasons() {
  const [seasons, setSeasons] = useState<SeasonItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchSeasons() {
      try {
        const res = await fetch("/api/dashboard/seasons");
        if (res.ok) {
          const data = (await res.json()) as { seasons?: SeasonItem[] };
          if (isMounted) {
            setSeasons(data.seasons || []);
          }
        }
      } catch {
        if (isMounted) setSeasons([]);
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
