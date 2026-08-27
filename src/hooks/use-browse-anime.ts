"use client";

import { useState, useEffect } from "react";
import type { AnimeItem } from "@/types/anime";

export interface BrowseFilterOptions {
  genre?: string;
  query?: string;
  status?: string;
  type?: string;
}

export interface BrowseApiResponse {
  animeList?: AnimeItem[];
}

export function useBrowseAnime(filters?: BrowseFilterOptions, initialList?: AnimeItem[]) {
  const [animeList, setAnimeList] = useState<AnimeItem[]>(initialList || []);
  const [isLoading, setIsLoading] = useState(!initialList || initialList.length === 0);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const params = new URLSearchParams();
    if (filters?.genre && filters.genre !== "All") params.set("genre", filters.genre);
    if (filters?.query) params.set("query", filters.query);
    if (filters?.status && filters.status !== "All") params.set("status", filters.status);
    if (filters?.type && filters.type !== "All") params.set("type", filters.type);

    fetch(`/api/anime/browse?${params.toString()}`)
      .then((res) => res.json() as Promise<BrowseApiResponse>)
      .then((data) => {
        if (!isMounted) return;
        setAnimeList(data.animeList || []);
      })
      .catch(() => {
        if (!isMounted) return;
        setAnimeList([]);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [filters?.genre, filters?.query, filters?.status, filters?.type]);

  return {
    animeList,
    isLoading,
  };
}
