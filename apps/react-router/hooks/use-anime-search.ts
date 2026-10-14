import { useState, useEffect } from "react";
import type { AnimeItem } from "@/types/anime";
import { apiClient } from "@/lib/api-client";

export function useAnimeSearch(query: string) {
  const [results, setResults] = useState<AnimeItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const timer = setTimeout(() => {
      const endpoint = query
        ? `/v1/anime?search=${encodeURIComponent(query)}&limit=10`
        : `/v1/anime?sort=popular&limit=5`;

      apiClient<{ success: boolean; data: any[] }>(endpoint)
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
          setResults(items);
        })
        .catch(() => {
          if (!isMounted) return;
          setResults([]);
        })
        .finally(() => {
          if (isMounted) setIsLoading(false);
        });
    }, 250);

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
