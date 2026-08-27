"use client";

import { useState, useEffect } from "react";
import type { EpisodeItem } from "@/types/anime";

export interface LatestEpisodesApiResponse {
  latestEpisodes?: EpisodeItem[];
}

export function useLatestEpisodes(initialEpisodes?: EpisodeItem[]) {
  const [episodesList, setEpisodesList] = useState<EpisodeItem[]>(initialEpisodes || []);
  const [isLoading, setIsLoading] = useState(!initialEpisodes || initialEpisodes.length === 0);

  useEffect(() => {
    if (initialEpisodes && initialEpisodes.length > 0) return;

    let isMounted = true;
    fetch("/api/episodes/latest")
      .then((res) => res.json() as Promise<LatestEpisodesApiResponse>)
      .then((data) => {
        if (!isMounted) return;
        setEpisodesList(data.latestEpisodes || []);
      })
      .catch(() => {
        if (!isMounted) return;
        setEpisodesList([]);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [initialEpisodes]);

  return {
    episodesList,
    isLoading,
  };
}
