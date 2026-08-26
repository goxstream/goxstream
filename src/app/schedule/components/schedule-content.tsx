"use client";

import { useState, useMemo } from "react";
import { DAYS_OF_WEEK_MAP } from "@/lib/constants";
import { Skeleton } from "@/components/ui/skeleton";
import { useScheduleAnime } from "@/hooks/use-schedule-anime";
import type { DayOfWeek, ScheduleViewMode, ScheduleItem } from "@/types/schedule";
import { ScheduleHeader } from "./schedule-header";
import { DaySelectorTabs } from "./day-selector-tabs";
import { TimelineView } from "./timeline-view";
import { GridView } from "./grid-view";

function getCurrentDayOfWeek(): DayOfWeek {
  const dayIndex = new Date().getDay();
  const dayMap: Record<number, DayOfWeek> = {
    0: "sunday",
    1: "monday",
    2: "tuesday",
    3: "wednesday",
    4: "thursday",
    5: "friday",
    6: "saturday",
  };
  return dayMap[dayIndex] || "wednesday";
}

export function ScheduleContent() {
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

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 space-y-6 max-w-7xl">
      {/* Header section */}
      <ScheduleHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        activeDayLabel={activeDayInfo?.label || "Hari Ini"}
        totalShowsCount={currentItems.length}
      />

      {/* 7-day Tab Strip */}
      <DaySelectorTabs
        activeDay={activeDay}
        todayDay={todayDay}
        onSelectDay={setActiveDay}
        dayCounts={dayCounts}
      />

      {/* In-Component Skeleton Loader or Schedule Views */}
      {isLoading ? (
        <div className="space-y-4 py-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/60">
              <Skeleton className="h-6 w-20 rounded" />
              <Skeleton className="size-14 rounded-lg shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-1/3 rounded" />
                <Skeleton className="h-3 w-1/4 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4">
          {viewMode === "timeline" ? (
            <TimelineView items={currentItems} dayLabel={activeDayInfo?.label || ""} />
          ) : (
            <GridView items={currentItems} dayLabel={activeDayInfo?.label || ""} />
          )}
        </div>
      )}
    </div>
  );
}
