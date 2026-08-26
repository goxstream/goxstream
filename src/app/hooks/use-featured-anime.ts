"use client";

import { useState, useEffect } from "react";
import { FEATURED_ANIME as FALLBACK_FEATURED } from "@/lib/mock-anime";
import type { AnimeItem } from "@/types/anime";

export interface FeaturedApiResponse {
  featuredAnime?: AnimeItem | null;
}

export function useFeaturedAnime(initialFeaturedAnime?: AnimeItem | null) {
  const [anime, setAnime] = useState<AnimeItem | null>(initialFeaturedAnime || null);
  const [isLoading, setIsLoading] = useState(!initialFeaturedAnime);

  useEffect(() => {
    if (initialFeaturedAnime) return;

    let isMounted = true;
    fetch("/api/anime/featured")
      .then((res) => res.json() as Promise<FeaturedApiResponse>)
      .then((data) => {
        if (!isMounted) return;
        setAnime(data.featuredAnime || FALLBACK_FEATURED);
      })
      .catch(() => {
        if (!isMounted) return;
        setAnime(FALLBACK_FEATURED);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [initialFeaturedAnime]);

  return {
    featuredAnime: anime || FALLBACK_FEATURED,
    isLoading,
  };
}
