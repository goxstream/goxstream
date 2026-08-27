"use client";

import { useState, useEffect } from "react";
import type { EpisodeItem } from "@/types/anime";

export function useDashboardEpisodes() {
  const [episodes, setEpisodes] = useState<EpisodeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchDashboardEpisodes() {
      try {
        const res = await fetch("/api/dashboard/episodes");
        if (res.ok) {
          const data = (await res.json()) as { episodes?: EpisodeItem[] };
          if (isMounted) {
            setEpisodes(data.episodes || []);
          }
        }
      } catch {
        if (isMounted) setEpisodes([]);
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
