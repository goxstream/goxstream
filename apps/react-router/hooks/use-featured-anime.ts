import { useState, useEffect } from "react";
import type { AnimeItem } from "@/types/anime";
import { apiClient } from "@/lib/api-client";

export function useFeaturedAnime(initialFeaturedAnime?: AnimeItem | null) {
  const [anime, setAnime] = useState<AnimeItem | null>(initialFeaturedAnime || null);
  const [isLoading, setIsLoading] = useState(!initialFeaturedAnime);

  useEffect(() => {
    if (initialFeaturedAnime) return;

    let isMounted = true;
    apiClient<{ success: boolean; data: any[] }>("/v1/anime?sort=popular&limit=1")
      .then((res) => {
        if (!isMounted) return;
        const a = res.data?.[0];
        if (a) {
          setAnime({
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
            isTrending: Boolean(a.isTrending),
            isFeatured: true,
            subOrDub: (a.subOrDub?.toUpperCase() || "SUB") as any,
          });
        }
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
