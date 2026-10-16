import { useState, useEffect } from "react";
import type { AnimeItem } from "@/types/anime";
import { animeApi } from "@/lib/api-client";
import { V1AnimeGetSortEnum } from "@shionstream/shionstream-sdk";
import { mapCatalogAnimeToItem } from "@/lib/anime-mappers";

export function useFeaturedAnime(initialFeaturedAnime?: AnimeItem | null) {
  const [anime, setAnime] = useState<AnimeItem | null>(initialFeaturedAnime || null);
  const [isLoading, setIsLoading] = useState(!initialFeaturedAnime);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialFeaturedAnime) return;

    let isMounted = true;
    setError(null);

    animeApi
      .v1AnimeGet({ sort: V1AnimeGetSortEnum.Popular, limit: "1" })
      .then((res) => {
        if (!isMounted) return;
        const first = res.data?.[0];
        if (first) {
          const item = mapCatalogAnimeToItem(first);
          setAnime({ ...item, isFeatured: true });
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : "Failed to load featured anime");
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
    error,
  };
}
