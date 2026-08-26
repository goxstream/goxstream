"use client";

import { useState, useEffect } from "react";
import { TRENDING_ANIME as FALLBACK_SEARCH } from "@/lib/mock-anime";
import type { AnimeItem } from "@/types/anime";

export interface SearchApiResponse {
  results?: AnimeItem[];
}

export function useAnimeSearch(query: string) {
  const [results, setResults] = useState<AnimeItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const timer = setTimeout(() => {
      fetch(`/api/anime/search?q=${encodeURIComponent(query)}`)
        .then((res) => res.json() as Promise<SearchApiResponse>)
        .then((data) => {
          if (!isMounted) return;
          if (data.results && data.results.length > 0) {
            setResults(data.results);
          } else if (!query) {
            setResults(FALLBACK_SEARCH);
          } else {
            setResults([]);
          }
        })
        .catch(() => {
          if (!isMounted) return;
          setResults(query ? [] : FALLBACK_SEARCH);
        })
        .finally(() => {
          if (isMounted) setIsLoading(false);
        });
    }, 200);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [query]);

  return {
    results,
    isLoading,
  };
}
