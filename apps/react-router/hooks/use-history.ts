"use client";

import { useState, useEffect } from "react";
import { userApi } from "@/lib/api-client";
import type { WatchHistoryItem } from "@/types/user";

export function useHistory() {
  const [historyList, setHistoryList] = useState<WatchHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    userApi
      .v1UserHistoryGet()
      .then((res) => {
        if (!isMounted) return;
        const rawHistory = (res as any).data || [];
        const formatted: WatchHistoryItem[] = rawHistory.map((h: any) => ({
          id: h.id,
          animeId: h.animeId,
          animeSlug: h.anime?.slug || `anime-${h.animeId}`,
          animeTitle: h.anime?.title || "Anime Series",
          animeCover: h.anime?.coverImage || "",
          episodeNumber: h.episodeNumber || 1,
          episodeTitle: h.episode?.title || `Episode ${h.episodeNumber || 1}`,
          progressPercent: h.progressPercent || 0,
          durationSeconds: h.durationSeconds || 0,
          watchedSeconds: h.progressSeconds || 0,
          lastWatchedAt: h.lastWatchedAt
            ? new Date(h.lastWatchedAt).toLocaleDateString()
            : "Recently",
        }));
        setHistoryList(formatted);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : "Failed to load watch history");
        setHistoryList([]);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRemoveItem = (id: string) => {
    userApi.v1UserHistoryIdDelete({ id }).catch(() => {});
    setHistoryList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAll = () => {
    userApi.v1UserHistoryDelete().catch(() => {});
    setHistoryList([]);
  };

  return {
    historyList,
    isLoading,
    error,
    handleRemoveItem,
    handleClearAll,
  };
}
