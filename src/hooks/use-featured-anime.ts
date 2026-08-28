"use client";

import { useState, useEffect } from "react";
import type { AnimeItem } from "@/types/anime";
import type { FeaturedAnimeResponse } from "@/lib/api/types";

export function useFeaturedAnime(initialFeaturedAnime?: AnimeItem | null) {
  const [anime, setAnime] = useState<AnimeItem | null>(initialFeaturedAnime || null);
  const [isLoading, setIsLoading] = useState(!initialFeaturedAnime);

  useEffect(() => {
    if (initialFeaturedAnime) return;

    let isMounted = true;
    fetch("/api/anime/featured")
      .then((res) => res.json() as Promise<FeaturedAnimeResponse>)
      .then((data) => {
        if (!isMounted) return;
        setAnime(data.featuredAnime || null);
      })
      .catch(() => {
        if (!isMounted) return;
        setAnime(null);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [initialFeaturedAnime]);

  return {
    featuredAnime: anime,
    isLoading,
  };
}
