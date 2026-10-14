import { useState, useEffect } from "react";
import type { EpisodeWatchDetails, EpisodeItem, AnimeItem, StreamSource } from "@/types/anime";
import { apiClient } from "@/lib/api-client";

function parseEpisodeNumber(epParam: string): number {
  const match = epParam.match(/\d+/);
  return match ? parseInt(match[0], 10) : 1;
}

export function useWatchDetails(slug: string, episodeNumParam: string) {
  const [details, setDetails] = useState<EpisodeWatchDetails | null>(null);
  const [episodes, setEpisodes] = useState<EpisodeItem[]>([]);
  const [recommendations, setRecommendations] = useState<AnimeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFoundError, setNotFoundError] = useState(false);

  const epNum = parseEpisodeNumber(episodeNumParam);

  useEffect(() => {
    if (!slug) return;

    let isMounted = true;
    setIsLoading(true);
    setNotFoundError(false);

    Promise.all([
      apiClient<{ success: boolean; data: any }>(`/v1/anime/${slug}`).catch(() => null),
      apiClient<{ success: boolean; data: any[] }>(`/v1/anime/${slug}/episodes`).catch(() => null),
      apiClient<{ success: boolean; data: any[] }>(`/v1/anime?limit=8&sort=popular`).catch(() => null),
    ])
      .then(async ([animeRes, episodesRes, recRes]) => {
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

        const rawEpisodes = episodesRes?.data || [];
        const mappedEpisodes: EpisodeItem[] = rawEpisodes.map((ep: any) => ({
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

        // Find current episode matching epNum or fallback to first
        let currentEpisode = mappedEpisodes.find((e) => e.episodeNumber === epNum);
        if (!currentEpisode && mappedEpisodes.length > 0) {
          currentEpisode = mappedEpisodes[0];
        }

        if (!currentEpisode) {
          // Virtual episode if none in database yet
          currentEpisode = {
            id: `ep-${epNum}`,
            animeId: a.id,
            animeSlug: a.slug,
            animeTitle: mappedAnime.title,
            episodeNumber: epNum,
            episodeTitle: `Episode ${epNum}`,
            thumbnail: a.coverImage || "",
            duration: "24m",
            releasedAt: "Just now",
            isSub: true,
            isDub: false,
          };
        }

        // Fetch stream sources for the episode
        let streamSources: StreamSource[] = [];
        if (currentEpisode.id && !currentEpisode.id.startsWith("ep-")) {
          const streamRes = await apiClient<{
            success: boolean;
            sources: any[];
          }>(`/v1/episodes/${currentEpisode.id}/stream`).catch(() => null);

          if (streamRes && streamRes.sources && streamRes.sources.length > 0) {
            streamSources = streamRes.sources.map((s: any) => ({
              id: s.id,
              serverName: s.serverName || "Primary Stream",
              quality: s.quality || "1080p",
              url: s.streamUrl,
              type: s.format === "hls" ? "hls" : "mp4",
              isPrimary: Boolean(s.isPrimary),
              qualityUrls: {
                url1080p: s.url1080p || undefined,
                url720p: s.url720p || undefined,
                url480p: s.url480p || undefined,
                url360p: s.url360p || undefined,
              },
            }));
          }
        }

        // Fallback default demo stream source if none returned from DB
        if (streamSources.length === 0) {
          streamSources = [
            {
              id: "server-alpha",
              serverName: "FastStream Alpha (1080p)",
              quality: "1080p",
              url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
              type: "mp4",
              isPrimary: true,
            },
            {
              id: "server-beta",
              serverName: "Backup Stream Beta (720p)",
              quality: "720p",
              url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
              type: "mp4",
              isPrimary: false,
            },
          ];
        }

        const currentIndex = mappedEpisodes.findIndex(
          (e) => e.episodeNumber === currentEpisode?.episodeNumber,
        );
        const prevEpisode = currentIndex > 0 ? mappedEpisodes[currentIndex - 1] : undefined;
        const nextEpisode =
          currentIndex >= 0 && currentIndex < mappedEpisodes.length - 1
            ? mappedEpisodes[currentIndex + 1]
            : undefined;

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

        setDetails({
          anime: mappedAnime,
          episode: currentEpisode,
          prevEpisode,
          nextEpisode,
          sources: streamSources,
        });
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
  }, [slug, epNum]);

  return {
    details,
    episodes,
    recommendations,
    isLoading,
    notFoundError,
  };
}
