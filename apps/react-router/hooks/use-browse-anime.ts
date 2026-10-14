import { useState, useEffect } from "react";
import type { AnimeItem } from "@/types/anime";
import { apiClient } from "@/lib/api-client";

export interface BrowseFilterOptions {
  genre?: string;
  query?: string;
  status?: string;
  type?: string;
}

export function useBrowseAnime(filters?: BrowseFilterOptions, initialList?: AnimeItem[]) {
  const [animeList, setAnimeList] = useState<AnimeItem[]>(initialList || []);
  const [isLoading, setIsLoading] = useState(!initialList || initialList.length === 0);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const params = new URLSearchParams();
    if (filters?.genre && filters.genre !== "All") params.set("genre", filters.genre);
    if (filters?.query) params.set("search", filters.query);
    if (filters?.status && filters.status !== "All") params.set("status", filters.status.toLowerCase());
    if (filters?.type && filters.type !== "All") params.set("type", filters.type.toLowerCase());
    params.set("limit", "100");

    apiClient<{ success: boolean; data: any[] }>(`/v1/anime?${params.toString()}`)
      .then((res) => {
        if (!isMounted) return;
        const items: AnimeItem[] = (res.data || []).map((a: any) => ({
          id: a.id,
          slug: a.slug,
          title: a.titleRomaji || a.titleEnglish || "Untitled Anime",
          japaneseTitle: a.titleJapanese,
          synopsis: a.synopsis || "",
          coverImage: a.coverImage || "",
          bannerImage: a.bannerImage || a.coverImage,
          rating: a.rating ?? 0,
          episodesCount: a.episodesCount ?? 0,
          latestEpisode: a.episodesCount ?? 0,
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
          isTrending: Boolean(a.isTrending),
          isFeatured: Boolean(a.isFeatured),
          subOrDub: (a.subOrDub?.toUpperCase() || "SUB") as any,
        }));
        setAnimeList(items);
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
  }, [filters?.genre, filters?.query, filters?.status, filters?.type]);

  return {
    animeList,
    isLoading,
  };
}
