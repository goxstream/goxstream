"use client";

import { useState, useEffect } from "react";
import type { AnimeItem } from "@/types/anime";
import { ALL_ANIME } from "@/lib/mock-anime";

export function useDashboardAnime() {
  const [animeList, setAnimeList] = useState<AnimeItem[]>(ALL_ANIME);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchDashboardAnime() {
      try {
        const res = await fetch("/api/dashboard/anime");
        if (res.ok) {
          const data = (await res.json()) as { animeList?: AnimeItem[] };
          if (isMounted && data.animeList && data.animeList.length > 0) {
            setAnimeList(data.animeList);
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

    fetchDashboardAnime();

    return () => {
      isMounted = false;
    };
  }, []);

  return { animeList, isLoading };
}
