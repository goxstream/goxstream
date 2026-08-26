"use client";

import { useState, useEffect } from "react";
import type { EpisodeItem } from "@/types/anime";
import { LATEST_EPISODES } from "@/lib/mock-anime";

export function useDashboardEpisodes() {
  const [episodes, setEpisodes] = useState<EpisodeItem[]>(LATEST_EPISODES);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchDashboardEpisodes() {
      try {
        const res = await fetch("/api/dashboard/episodes");
        if (res.ok) {
          const data = (await res.json()) as { episodes?: EpisodeItem[] };
          if (isMounted && data.episodes && data.episodes.length > 0) {
            setEpisodes(data.episodes);
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

    fetchDashboardEpisodes();

    return () => {
      isMounted = false;
    };
  }, []);

  return { episodes, isLoading };
}
