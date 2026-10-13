"use client";

import { useState, useEffect } from "react";
import type { AnimeItem, EpisodeItem } from "@/types/anime";
import type { AnimeDetailResponse } from "@/lib/api/types";

export function useAnimeDetails(slug: string) {
  const [anime, setAnime] = useState<AnimeItem | null>(null);
  const [episodes, setEpisodes] = useState<EpisodeItem[]>([]);
  const [recommendations, setRecommendations] = useState<AnimeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFoundError, setNotFoundError] = useState(false);

  useEffect(() => {
    if (!slug) return;

    let isMounted = true;
    setIsLoading(true);
    setNotFoundError(false);

    fetch(`/api/anime/${slug}`)
      .then(async (res) => {
        if (res.status === 404) {
          if (isMounted) setNotFoundError(true);
          return null;
        }
        return res.json() as Promise<AnimeDetailResponse>;
      })
      .then((data) => {
        if (!isMounted || !data) return;
        if (data.anime) {
          setAnime(data.anime);
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
  }, [slug]);

  return {
    anime,
    episodes,
    recommendations,
    isLoading,
    notFoundError,
  };
}
