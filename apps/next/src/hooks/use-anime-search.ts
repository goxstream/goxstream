"use client";

import { useState, useEffect } from "react";
import type { AnimeItem } from "@/types/anime";
import type { SearchAnimeResponse } from "@/lib/api/types";

export function useAnimeSearch(query: string) {
  const [results, setResults] = useState<AnimeItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const timer = setTimeout(() => {
      fetch(`/api/anime/search?q=${encodeURIComponent(query)}`)
        .then((res) => res.json() as Promise<SearchAnimeResponse>)
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
