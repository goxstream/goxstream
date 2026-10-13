"use client";

import { useState, useEffect } from "react";
import type { ScheduleItem } from "@/types/schedule";
import type { ScheduleAnimeResponse } from "@/lib/api/types";

export function useScheduleAnime() {
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetch("/api/anime/schedule")
      .then((res) => res.json() as Promise<ScheduleAnimeResponse>)
      .then((data) => {
        if (!isMounted) return;
        if (data.scheduleItems) {
          setScheduleItems(data.scheduleItems);
        }
      })
      .catch(() => {
        // Fallback if empty
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
