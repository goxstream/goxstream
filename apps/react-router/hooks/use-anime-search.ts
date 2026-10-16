import { useState, useEffect } from "react";
import type { AnimeItem } from "@/types/anime";
import { animeApi } from "@/lib/api-client";
import { V1AnimeGetSortEnum } from "@shionstream/shionstream-sdk";
import { mapCatalogAnimeToItem } from "@/lib/anime-mappers";

export function useAnimeSearch(query: string) {
  const [results, setResults] = useState<AnimeItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    const timer = setTimeout(() => {
      const params = query
        ? { search: query, limit: "10" as const }
        : { sort: V1AnimeGetSortEnum.Popular, limit: "5" as const };

      animeApi
        .v1AnimeGet(params)
        .then((res) => {
          if (!isMounted) return;
          setResults((res.data || []).map(mapCatalogAnimeToItem));
        })
        .catch((err) => {
          if (!isMounted) return;
          setError(err instanceof Error ? err.message : "Search failed");
          setResults([]);
        })
        .finally(() => {
          if (isMounted) setIsLoading(false);
        });
    }, 250);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [query]);

  return {
    results,
    isLoading,
    error,
  };
}
