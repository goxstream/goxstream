import { useState, useEffect } from "react";
import type { AnimeItem } from "@/types/anime";
import { animeApi } from "@/lib/api-client";
import { mapCatalogAnimeToItem } from "@/lib/anime-mappers";

export interface BrowseFilterOptions {
  genre?: string;
  query?: string;
  status?: string;
  type?: string;
}

export function useBrowseAnime(filters?: BrowseFilterOptions, initialList?: AnimeItem[]) {
  const [animeList, setAnimeList] = useState<AnimeItem[]>(initialList || []);
  const [isLoading, setIsLoading] = useState(!initialList || initialList.length === 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    animeApi
      .v1AnimeGet({
        genre: filters?.genre && filters.genre !== "All" ? filters.genre : undefined,
        search: filters?.query || undefined,
        status:
          filters?.status && filters.status !== "All"
            ? filters.status.toLowerCase()
            : undefined,
        type:
          filters?.type && filters.type !== "All" ? filters.type.toLowerCase() : undefined,
        limit: "100",
      })
      .then((res) => {
        if (!isMounted) return;
        setAnimeList((res.data || []).map(mapCatalogAnimeToItem));
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : "Failed to load anime");
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
    error,
  };
}
