import { useState, useEffect } from "react";
import type { AnimeItem } from "@/types/anime";
import { animeApi } from "@/lib/api-client";
import { V1AnimeGetSortEnum } from "@goxstream/goxstream-sdk";
import { mapCatalogAnimeToItem } from "@/lib/anime-mappers";

export function useTrendingAnime(initialTrending?: AnimeItem[], initialGenres?: string[]) {
  const [trendingAnime, setTrendingAnime] = useState<AnimeItem[]>(initialTrending || []);
  const [genresList, setGenresList] = useState<string[]>(initialGenres || []);
  const [isLoading, setIsLoading] = useState(!initialTrending || initialTrending.length === 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialTrending && initialTrending.length > 0) return;

    let isMounted = true;
    setError(null);

    animeApi
      .v1AnimeGet({ sort: V1AnimeGetSortEnum.Popular, limit: "12" })
      .then((res) => {
        if (!isMounted) return;
        const items = (res.data || []).map(mapCatalogAnimeToItem);
        setTrendingAnime(items);

        // Extract unique genres
        const uniqueGenres = Array.from(
          new Set(items.flatMap((item) => item.genres).filter(Boolean)),
        );
        setGenresList(uniqueGenres);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : "Failed to load trending anime");
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
    error,
  };
}
