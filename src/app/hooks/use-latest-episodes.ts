"use client";

import { useState, useEffect } from "react";
import { LATEST_EPISODES as FALLBACK_EPISODES } from "@/lib/mock-anime";
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
        if (data.latestEpisodes && data.latestEpisodes.length > 0) {
          setEpisodesList(data.latestEpisodes);
        } else {
          setEpisodesList(FALLBACK_EPISODES);
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setEpisodesList(FALLBACK_EPISODES);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [initialEpisodes]);

  return {
    episodesList: episodesList.length > 0 ? episodesList : FALLBACK_EPISODES,
    isLoading,
  };
}
