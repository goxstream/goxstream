"use client";

import { useState, useEffect } from "react";
import { TRENDING_ANIME as FALLBACK_TRENDING, GENRES_LIST as FALLBACK_GENRES } from "@/lib/mock-anime";
import type { AnimeItem } from "@/types/anime";

export interface TrendingApiResponse {
  trendingAnime?: AnimeItem[];
  genresList?: string[];
}

export function useTrendingAnime(initialTrending?: AnimeItem[], initialGenres?: string[]) {
  const [trendingAnime, setTrendingAnime] = useState<AnimeItem[]>(initialTrending || []);
  const [genresList, setGenresList] = useState<string[]>(initialGenres || []);
  const [isLoading, setIsLoading] = useState(!initialTrending || initialTrending.length === 0);

  useEffect(() => {
    if (initialTrending && initialTrending.length > 0) return;

    let isMounted = true;
    fetch("/api/anime/trending")
      .then((res) => res.json() as Promise<TrendingApiResponse>)
      .then((data) => {
        if (!isMounted) return;
        if (data.trendingAnime && data.trendingAnime.length > 0) {
          setTrendingAnime(data.trendingAnime);
        } else {
          setTrendingAnime(FALLBACK_TRENDING);
        }
        if (data.genresList && data.genresList.length > 0) {
          setGenresList(data.genresList);
        } else {
          setGenresList(FALLBACK_GENRES);
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setTrendingAnime(FALLBACK_TRENDING);
        setGenresList(FALLBACK_GENRES);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [initialTrending]);

  return {
    trendingAnime: trendingAnime.length > 0 ? trendingAnime : FALLBACK_TRENDING,
    genresList: genresList.length > 0 ? ["All", ...genresList] : FALLBACK_GENRES,
    isLoading,
  };
}
