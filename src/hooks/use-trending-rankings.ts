"use client";

import { useState, useEffect } from "react";
import { getTrendingAnime as getMockTrending } from "@/lib/mock-trending";
import type { TrendingAnimeItem, TrendingPeriod, AnimeItem } from "@/types/anime";
import type { TrendingApiResponse } from "@/hooks/use-trending-anime";

function mapToTrendingAnimeItem(item: AnimeItem, index: number): TrendingAnimeItem {
  return {
    ...item,
    rank: index + 1,
    previousRank: Math.max(1, index + (index % 2 === 0 ? 1 : -1)),
    weeklyViews: Math.round((item.rating || 8.5) * 150000),
    monthlyViews: Math.round((item.rating || 8.5) * 600000),
    totalViews: Math.round((item.rating || 8.5) * 2500000),
    weeklyGrowth: index === 0 ? "+42%" : "+18%",
    trendScore: Math.round((item.rating || 8.5) * 1000),
  };
}

export function useTrendingRankings(period: TrendingPeriod, genre: string) {
  const [animeList, setAnimeList] = useState<TrendingAnimeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetch(`/api/anime/trending?period=${period}&genre=${encodeURIComponent(genre)}`)
      .then((res) => res.json() as Promise<TrendingApiResponse>)
      .then((data) => {
        if (!isMounted) return;
        if (data.trendingAnime && data.trendingAnime.length > 0) {
          let list = data.trendingAnime;
          if (genre !== "All") {
            const gLower = genre.toLowerCase();
            list = list.filter((item) =>
              item.genres.some((g) => g.toLowerCase() === gLower)
            );
          }
          setAnimeList(list.map((item, idx) => mapToTrendingAnimeItem(item, idx)));
        } else {
          setAnimeList(getMockTrending(period, genre));
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setAnimeList(getMockTrending(period, genre));
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
  };
}
