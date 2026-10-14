import { useState, useEffect } from "react";
import type { EpisodeItem } from "@/types/anime";
import { apiClient } from "@/lib/api-client";

export function useLatestEpisodes(initialEpisodes?: EpisodeItem[]) {
  const [episodesList, setEpisodesList] = useState<EpisodeItem[]>(initialEpisodes || []);
  const [isLoading, setIsLoading] = useState(!initialEpisodes || initialEpisodes.length === 0);

  useEffect(() => {
    if (initialEpisodes && initialEpisodes.length > 0) return;

    let isMounted = true;
    apiClient<{ success: boolean; data: any[] }>("/v1/anime?limit=8")
      .then((res) => {
        if (!isMounted) return;
        const items: EpisodeItem[] = (res.data || []).map((a: any) => ({
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
      .catch(() => {
        if (!isMounted) return;
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
  };
}
