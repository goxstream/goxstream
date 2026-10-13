"use client";

import { useState, useEffect } from "react";
import type { AnimeItem } from "@/types/anime";

export function useDashboardAnime() {
  const [animeList, setAnimeList] = useState<AnimeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchDashboardAnime() {
      try {
        const res = await fetch("/api/dashboard/anime");
        if (res.ok) {
          const data = (await res.json()) as { animeList?: AnimeItem[] };
          if (isMounted) {
            setAnimeList(data.animeList || []);
          }
        }
      } catch {
        if (isMounted) setAnimeList([]);
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
