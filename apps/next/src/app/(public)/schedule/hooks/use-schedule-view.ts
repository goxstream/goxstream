import { useState, useMemo } from "react";
import { DAYS_OF_WEEK_MAP } from "@/lib/constants";
import { useScheduleAnime } from "@/hooks/use-schedule-anime";
import { getCurrentDayOfWeek } from "../lib/schedule-utils";
import type { DayOfWeek, ScheduleViewMode } from "@/types/schedule";

export function useScheduleView() {
  const { scheduleItems, isLoading } = useScheduleAnime();
  const todayDay = useMemo(() => getCurrentDayOfWeek(), []);
  const [activeDay, setActiveDay] = useState<DayOfWeek>(todayDay);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ScheduleViewMode>("timeline");

  // Calculate number of shows for each day
  const dayCounts = useMemo(() => {
    const counts = {} as Record<DayOfWeek, number>;
    DAYS_OF_WEEK_MAP.forEach((day) => {
      const dayId = day.id as DayOfWeek;
      const dayItems = scheduleItems.filter((item) => item.airDay === dayId);
      counts[dayId] = dayItems.length;
    });
    return counts;
  }, [scheduleItems]);

  // Current items for selected day & filter
  const currentItems = useMemo(() => {
    let items = scheduleItems.filter((item) => item.airDay === activeDay);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          (item.japaneseTitle && item.japaneseTitle.toLowerCase().includes(q)) ||
          item.genres.some((g) => g.toLowerCase().includes(q)) ||
          item.studio.toLowerCase().includes(q)
      );
    }

    return items.sort((a, b) => a.airTime.localeCompare(b.airTime));
  }, [scheduleItems, activeDay, searchQuery]);

  const activeDayInfo = DAYS_OF_WEEK_MAP.find((d) => d.id === activeDay);

  return {
    todayDay,
    activeDay,
    setActiveDay,
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    dayCounts,
    currentItems,
    activeDayInfo,
    isLoading,
  };
}
