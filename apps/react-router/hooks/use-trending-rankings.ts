import { useState, useEffect } from "react";
import type { TrendingAnimeItem, TrendingPeriod, AnimeItem } from "@/types/anime";
import { apiClient } from "@/lib/api-client";

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

    apiClient<{ success: boolean; data: any[] }>("/v1/anime?sort=popular&limit=25")
      .then((res) => {
        if (!isMounted) return;
        let items: AnimeItem[] = (res.data || []).map((a: any) => ({
          id: a.id,
          slug: a.slug,
          title: a.titleRomaji || a.titleEnglish || "Untitled Anime",
          japaneseTitle: a.titleJapanese,
          synopsis: a.synopsis || "",
          coverImage: a.coverImage || "",
          bannerImage: a.bannerImage || a.coverImage,
          rating: a.rating ?? 0,
          episodesCount: a.episodesCount ?? 0,
          status: (a.status === "ongoing"
            ? "Ongoing"
            : a.status === "completed"
              ? "Completed"
              : "Upcoming") as any,
          type: (a.type?.toUpperCase() || "TV") as any,
          season: a.seasonName || "",
          year: a.seasonYear ?? 2026,
          genres: Array.isArray(a.genres)
            ? a.genres.map((g: any) => (typeof g === "string" ? g : g.name))
            : [],
          studio: Array.isArray(a.studios)
            ? a.studios.map((s: any) => (typeof s === "string" ? s : s.name)).join(", ")
            : "Studio",
          isTrending: true,
          isFeatured: Boolean(a.isFeatured),
          subOrDub: (a.subOrDub?.toUpperCase() || "SUB") as any,
        }));

        if (genre !== "All") {
          const gLower = genre.toLowerCase();
          items = items.filter((item) => item.genres.some((g) => g.toLowerCase() === gLower));
        }

        setAnimeList(items.map((item, idx) => mapToTrendingAnimeItem(item, idx)));
      })
      .catch(() => {
        if (!isMounted) return;
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
  };
}
