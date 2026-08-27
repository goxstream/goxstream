"use client";

import { useState, useEffect } from "react";
import type { WatchHistoryItem } from "@/types/user";

export function useHistory() {
  const [historyList, setHistoryList] = useState<WatchHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchHistory() {
      try {
        const res = await fetch("/api/user/history");
        if (res.ok) {
          const data = (await res.json()) as { history?: any[] };
          if (isMounted) {
            const formatted = (data.history || []).map((h) => ({
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
              lastWatchedAt: h.lastWatchedAt ? new Date(h.lastWatchedAt).toLocaleDateString() : "Recently",
            }));
            setHistoryList(formatted);
          }
        }
      } catch {
        if (isMounted) {
          setHistoryList([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchHistory();

    return () => {
      isMounted = false;
    };
  }, []);


  const handleRemoveItem = (id: string) => {
    setHistoryList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAll = () => {
    setHistoryList([]);
  };

  return {
    historyList,
    handleRemoveItem,
    handleClearAll,
  };
}
