"use client";

import { useState, useEffect } from "react";
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
          setResults(data.results || []);
        })
        .catch(() => {
          if (!isMounted) return;
          setResults([]);
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
