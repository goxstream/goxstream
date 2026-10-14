import { useState, useEffect } from "react";
import type { ScheduleItem, DayOfWeek } from "@/types/schedule";
import { apiClient } from "@/lib/api-client";

const DAYS_OF_WEEK: DayOfWeek[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export function useScheduleAnime() {
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    apiClient<{ success: boolean; data: any[] }>("/v1/anime?limit=50")
      .then((res) => {
        if (!isMounted) return;
        const items: ScheduleItem[] = (res.data || []).map((a: any, idx: number) => {
          const day = a.schedule?.releaseDay?.toLowerCase() || DAYS_OF_WEEK[idx % 7];
          const time = a.schedule?.releaseTime || "19:00";
          return {
            id: a.id,
            animeId: a.id,
            slug: a.slug,
            title: a.titleRomaji || a.titleEnglish || "Untitled Anime",
            japaneseTitle: a.titleJapanese,
            coverImage: a.coverImage || "",
            bannerImage: a.bannerImage || a.coverImage,
            airDay: (DAYS_OF_WEEK.includes(day as DayOfWeek) ? day : "monday") as DayOfWeek,
            airTime: time,
            episodeNumber: a.schedule?.episodeNumber || a.episodesCount || 1,
            status: a.schedule?.status === "airing_now" ? "airing_now" : "upcoming",
            genres: Array.isArray(a.genres)
              ? a.genres.map((g: any) => (typeof g === "string" ? g : g.name))
              : [],
            rating: a.rating ?? 0,
            studio: Array.isArray(a.studios)
              ? a.studios.map((s: any) => (typeof s === "string" ? s : s.name)).join(", ")
              : "Studio",
            subOrDub: (a.subOrDub?.toUpperCase() || "SUB") as any,
            season: a.seasonName || "",
            year: a.seasonYear ?? 2026,
            isPopular: Boolean(a.isTrending),
          };
        });
        setScheduleItems(items);
      })
      .catch(() => {
        if (!isMounted) return;
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
  };
}
