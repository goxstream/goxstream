import { useState, useEffect } from "react";
import type { AnimeItem } from "@/types/anime";
import { apiClient } from "@/lib/api-client";

export function useTrendingAnime(initialTrending?: AnimeItem[], initialGenres?: string[]) {
  const [trendingAnime, setTrendingAnime] = useState<AnimeItem[]>(initialTrending || []);
  const [genresList, setGenresList] = useState<string[]>(initialGenres || []);
  const [isLoading, setIsLoading] = useState(!initialTrending || initialTrending.length === 0);

  useEffect(() => {
    if (initialTrending && initialTrending.length > 0) return;

    let isMounted = true;
    apiClient<{ success: boolean; data: any[] }>("/v1/anime?sort=popular&limit=12")
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
          isTrending: true,
          isFeatured: Boolean(a.isFeatured),
          subOrDub: (a.subOrDub?.toUpperCase() || "SUB") as any,
        }));

        setTrendingAnime(items);

        // Extract unique genres
        const uniqueGenres = Array.from(
          new Set(items.flatMap((item) => item.genres).filter(Boolean)),
        );
        setGenresList(uniqueGenres);
      })
      .catch(() => {
        if (!isMounted) return;
        setTrendingAnime([]);
        setGenresList([]);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [initialTrending]);

  return {
    trendingAnime,
    genresList: genresList.length > 0 ? ["All", ...genresList] : ["All"],
    isLoading,
  };
}
