"use client";

import { useState, useEffect } from "react";
import { FEATURED_ANIME as FALLBACK_ANIME, LATEST_EPISODES, TRENDING_ANIME } from "@/lib/mock-anime";
import type { AnimeItem, EpisodeItem } from "@/types/anime";

export interface AnimeDetailsApiResponse {
  anime?: AnimeItem | null;
  episodes?: EpisodeItem[];
  recommendations?: AnimeItem[];
}

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
        return res.json() as Promise<AnimeDetailsApiResponse>;
      })
      .then((data) => {
        if (!isMounted || !data) return;
        if (data.anime) {
          setAnime(data.anime);
          setEpisodes(data.episodes || []);
          setRecommendations(data.recommendations || []);
        } else {
          // Mock fallback
          setAnime({ ...FALLBACK_ANIME, slug, title: slug.replace(/-/g, " ").toUpperCase() });
          setEpisodes(LATEST_EPISODES);
          setRecommendations(TRENDING_ANIME.slice(0, 4));
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setAnime({ ...FALLBACK_ANIME, slug, title: slug.replace(/-/g, " ").toUpperCase() });
        setEpisodes(LATEST_EPISODES);
        setRecommendations(TRENDING_ANIME.slice(0, 4));
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
