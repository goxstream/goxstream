"use client";

import { useState, useEffect } from "react";
import { LATEST_EPISODES, TRENDING_ANIME } from "@/lib/mock-anime";
import type { EpisodeItem, AnimeItem } from "@/types/anime";

export interface ScheduleApiResponse {
  latestEpisodes?: EpisodeItem[];
  trendingAnime?: AnimeItem[];
}

export function useScheduleAnime() {
  const [latestEpisodes, setLatestEpisodes] = useState<EpisodeItem[]>([]);
  const [trendingAnime, setTrendingAnime] = useState<AnimeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetch("/api/anime/schedule")
      .then((res) => res.json() as Promise<ScheduleApiResponse>)
      .then((data) => {
        if (!isMounted) return;
        if (data.latestEpisodes && data.latestEpisodes.length > 0) {
          setLatestEpisodes(data.latestEpisodes);
        } else {
          setLatestEpisodes(LATEST_EPISODES);
        }
        if (data.trendingAnime && data.trendingAnime.length > 0) {
          setTrendingAnime(data.trendingAnime);
        } else {
          setTrendingAnime(TRENDING_ANIME);
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setLatestEpisodes(LATEST_EPISODES);
        setTrendingAnime(TRENDING_ANIME);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    latestEpisodes,
    trendingAnime,
    isLoading,
  };
}
