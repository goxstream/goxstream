import { useState, useEffect } from "react";
import type { AnimeItem, EpisodeItem } from "@/types/anime";
import { apiClient } from "@/lib/api-client";

export function useAnimeDetails(slug: string) {
  const [anime, setAnime] = useState<AnimeItem | null>(null);
  const [episodes, setEpisodes] = useState<EpisodeItem[]>([]);
  const [recommendations, setRecommendations] = useState<AnimeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFoundError, setNotFoundError] = useState(false);

  useEffect(() => {
    if (!slug) return;

    let isMounted = true;
    setIsLoading(true);
    setNotFoundError(false);

    Promise.all([
      apiClient<{ success: boolean; data: any }>(`/v1/anime/${slug}`).catch(() => null),
      apiClient<{ success: boolean; data: any[] }>(`/v1/anime/${slug}/episodes`).catch(() => null),
      apiClient<{ success: boolean; data: any[] }>(`/v1/anime?limit=8&sort=popular`).catch(
        () => null,
      ),
    ])
      .then(([animeRes, episodesRes, recRes]) => {
        if (!isMounted) return;

        if (!animeRes || !animeRes.data) {
          setNotFoundError(true);
          return;
        }

        const a = animeRes.data;
        const mappedAnime: AnimeItem = {
          id: a.id,
          slug: a.slug,
          title: a.titleRomaji || a.titleEnglish || "Untitled Anime",
          japaneseTitle: a.titleJapanese,
          synopsis: a.synopsis || "",
          coverImage: a.coverImage || "",
          bannerImage: a.bannerImage || a.coverImage,
          rating: a.rating ?? 0,
          episodesCount: a.episodesCount ?? 0,
          latestEpisode: a.episodesCount || 1,
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
        };

        const mappedEpisodes: EpisodeItem[] = (episodesRes?.data || []).map((ep: any) => ({
          id: ep.id,
          animeId: a.id,
          animeSlug: a.slug,
          animeTitle: mappedAnime.title,
          episodeNumber: ep.number,
          episodeTitle: ep.title || `Episode ${ep.number}`,
          thumbnail: ep.thumbnail || a.coverImage || "",
          duration: `${Math.round((ep.durationSeconds || 1440) / 60)}m`,
          releasedAt: ep.airDate || ep.createdAt || "",
          isSub: true,
          isDub: false,
        }));

        const mappedRecs: AnimeItem[] = (recRes?.data || [])
          .filter((r: any) => r.slug !== slug)
          .slice(0, 4)
          .map((r: any) => ({
            id: r.id,
            slug: r.slug,
            title: r.titleRomaji || r.titleEnglish || "Untitled Anime",
            japaneseTitle: r.titleJapanese,
            synopsis: r.synopsis || "",
            coverImage: r.coverImage || "",
            bannerImage: r.bannerImage || r.coverImage,
            rating: r.rating ?? 0,
            episodesCount: r.episodesCount ?? 0,
            status: "Ongoing" as any,
            type: "TV" as any,
            season: r.seasonName || "",
            year: r.seasonYear ?? 2026,
            genres: [],
            studio: "Studio",
            subOrDub: "SUB" as any,
          }));

        setAnime(mappedAnime);
        setEpisodes(mappedEpisodes);
        setRecommendations(mappedRecs);
      })
      .catch(() => {
        if (!isMounted) return;
        setNotFoundError(true);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  return {
    anime,
    episodes,
    recommendations,
    isLoading,
    notFoundError,
  };
}
