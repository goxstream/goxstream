import { useState, useEffect } from "react";
import type { TrendingAnimeItem, TrendingPeriod, AnimeItem } from "@/types/anime";
import { animeApi } from "@/lib/api-client";
import { V1AnimeGetSortEnum } from "@goxstream/goxstream-sdk";
import { mapCatalogAnimeToItem } from "@/lib/anime-mappers";

/**
 * Maps an AnimeItem to a TrendingAnimeItem.
 *
 * NOTE: weeklyViews, monthlyViews, totalViews, weeklyGrowth, and trendScore
 * are NOT available from the current API. These fields are left undefined.
 * When the API provides trending metrics, this mapper should be updated.
 * See: docs/DEVELOPER_NOTES.md — "Missing API Data Fields"
 */
function mapToTrendingAnimeItem(item: AnimeItem, index: number): TrendingAnimeItem {
  return {
    ...item,
    rank: index + 1,
  };
}

export function useTrendingRankings(period: TrendingPeriod, genre: string) {
  const [animeList, setAnimeList] = useState<TrendingAnimeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    animeApi
      .v1AnimeGet({ sort: V1AnimeGetSortEnum.Popular, limit: "25" })
      .then((res) => {
        if (!isMounted) return;
        let items = (res.data || []).map(mapCatalogAnimeToItem);

        if (genre !== "All") {
          const gLower = genre.toLowerCase();
          items = items.filter((item) => item.genres.some((g) => g.toLowerCase() === gLower));
        }

        setAnimeList(items.map((item, idx) => mapToTrendingAnimeItem(item, idx)));
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : "Failed to load trending rankings");
        setAnimeList([]);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [period, genre]);

  return {
    animeList,
    isLoading,
    error,
  };
}
