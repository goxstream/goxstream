import { useState, useEffect } from "react";
import type { EpisodeItem } from "@/types/anime";
import { animeApi } from "@/lib/api-client";

export function useLatestEpisodes(initialEpisodes?: EpisodeItem[]) {
  const [episodesList, setEpisodesList] = useState<EpisodeItem[]>(initialEpisodes || []);
  const [isLoading, setIsLoading] = useState(!initialEpisodes || initialEpisodes.length === 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialEpisodes && initialEpisodes.length > 0) return;

    let isMounted = true;
    setError(null);

    animeApi
      .v1AnimeGet({ limit: "8" })
      .then((res) => {
        if (!isMounted) return;
        const items: EpisodeItem[] = (res.data || []).map((a) => ({
          id: `ep-${a.id}-${a.episodesCount || 1}`,
          animeId: a.id,
          animeSlug: a.slug,
          animeTitle: a.titleRomaji || a.titleEnglish || "Untitled",
          episodeNumber: a.episodesCount || 1,
          episodeTitle: `Episode ${a.episodesCount || 1}`,
          thumbnail: a.bannerImage || a.coverImage || "",
          duration: a.durationPerEp || "24m",
          releasedAt: "Today",
          isSub: true,
          isDub: a.subOrDub?.includes("DUB") ?? false,
        }));
        setEpisodesList(items);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : "Failed to load latest episodes");
        setEpisodesList([]);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [initialEpisodes]);

  return {
    episodesList,
    isLoading,
    error,
  };
}
