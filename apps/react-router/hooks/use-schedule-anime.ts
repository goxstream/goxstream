import { useState, useEffect } from "react";
import type { ScheduleItem, DayOfWeek } from "@/types/schedule";
import { animeApi } from "@/lib/api-client";

/**
 * NOTE: The current /v1/anime endpoint does NOT provide schedule-specific fields
 * (airDay, airTime, broadcast status). These fields are mapped from whatever the
 * API returns. When a dedicated schedule endpoint is available, this hook should
 * be updated to use it.
 * See: docs/DEVELOPER_NOTES.md — "Missing API Data Fields"
 */
export function useScheduleAnime() {
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    animeApi
      .v1AnimeGet({ limit: "50" })
      .then((res) => {
        if (!isMounted) return;
        const items: ScheduleItem[] = (res.data || []).map((a) => {
          // Use broadcast data from API if available, otherwise leave empty
          const raw = a as unknown as Record<string, unknown>;
          const broadcastDay = raw.broadcastDay as DayOfWeek | undefined;
          const broadcastTime = raw.broadcastTime as string | undefined;

          return {
            id: a.id,
            animeId: a.id,
            slug: a.slug,
            title: a.titleRomaji || a.titleEnglish || "Untitled Anime",
            japaneseTitle: a.titleJapanese,
            coverImage: a.coverImage || "",
            bannerImage: a.bannerImage || a.coverImage,
            airDay: broadcastDay || ("" as DayOfWeek),
            airTime: broadcastTime || "",
            episodeNumber: a.episodesCount || 0,
            status: "upcoming" as const,
            genres: [],
            rating: a.rating ?? 0,
            studio: "",
            subOrDub: (a.subOrDub?.toUpperCase() === "DUB" ? "DUB" : "SUB") as ScheduleItem["subOrDub"],
            season: a.seasonName || "",
            year: a.seasonYear ?? 0,
            isPopular: a.isTrending,
          };
        });
        setScheduleItems(items);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : "Failed to load schedule");
        setScheduleItems([]);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    scheduleItems,
    isLoading,
    error,
  };
}
