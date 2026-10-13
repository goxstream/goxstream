"use client";

import { useState, useEffect } from "react";
import type { AnimeItem } from "@/types/anime";
import type { TrendingAnimeResponse } from "@/lib/api/types";

export function useTrendingAnime(initialTrending?: AnimeItem[], initialGenres?: string[]) {
  const [trendingAnime, setTrendingAnime] = useState<AnimeItem[]>(initialTrending || []);
  const [genresList, setGenresList] = useState<string[]>(initialGenres || []);
  const [isLoading, setIsLoading] = useState(!initialTrending || initialTrending.length === 0);

  useEffect(() => {
    if (initialTrending && initialTrending.length > 0) return;

    let isMounted = true;
    fetch("/api/anime/trending")
      .then((res) => res.json() as Promise<TrendingAnimeResponse>)
      .then((data) => {
        if (!isMounted) return;
        setTrendingAnime(data.trendingAnime || []);
        setGenresList(data.genresList || []);
      })
      .catch(() => {
        if (!isMounted) return;
        setTrendingAnime([]);
        setGenresList([]);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [initialTrending]);

  return {
    trendingAnime,
    genresList: genresList.length > 0 ? ["All", ...genresList] : ["All"],
    isLoading,
  };
}
