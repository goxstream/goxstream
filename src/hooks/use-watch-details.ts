"use client";

import { useState, useEffect } from "react";
import type { EpisodeWatchDetails, EpisodeItem, AnimeItem } from "@/types/anime";

export interface WatchDetailsApiResponse {
  details?: EpisodeWatchDetails | null;
  episodes?: EpisodeItem[];
  recommendations?: AnimeItem[];
}

export function useWatchDetails(slug: string, episodeNum: string) {
  const [details, setDetails] = useState<EpisodeWatchDetails | null>(null);
  const [episodes, setEpisodes] = useState<EpisodeItem[]>([]);
  const [recommendations, setRecommendations] = useState<AnimeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFoundError, setNotFoundError] = useState(false);

  useEffect(() => {
    if (!slug || !episodeNum) return;

    let isMounted = true;
    setIsLoading(true);
    setNotFoundError(false);

    fetch(`/api/anime/${slug}/episodes/${episodeNum}`)
      .then(async (res) => {
        if (res.status === 404) {
          if (isMounted) setNotFoundError(true);
          return null;
        }
        return res.json() as Promise<WatchDetailsApiResponse>;
      })
      .then((data) => {
        if (!isMounted || !data) return;
        if (data.details) {
          setDetails(data.details);
          setEpisodes(data.episodes || []);
          setRecommendations(data.recommendations || []);
        } else {
          setNotFoundError(true);
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setNotFoundError(true);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug, episodeNum]);

  return {
    details,
    episodes,
    recommendations,
    isLoading,
    notFoundError,
  };
}
