"use client";

import { useState, useMemo } from "react";
import { DAYS_OF_WEEK_MAP } from "@/lib/constants";
import { getCurrentDayOfWeek, getScheduleByDay } from "@/lib/mock-schedule";
import { Skeleton } from "@/components/ui/skeleton";
import { useScheduleAnime } from "@/hooks/use-schedule-anime";
import type { DayOfWeek, ScheduleViewMode } from "@/types/schedule";
import { ScheduleHeader } from "./schedule-header";
import { DaySelectorTabs } from "./day-selector-tabs";
import { TimelineView } from "./timeline-view";
import { GridView } from "./grid-view";

export function ScheduleContent() {
  const { isLoading } = useScheduleAnime();
  const todayDay = useMemo(() => getCurrentDayOfWeek(), []);
  const [activeDay, setActiveDay] = useState<DayOfWeek>(todayDay);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ScheduleViewMode>("timeline");

  // Calculate number of shows for each day (considering search query if typed)
  const dayCounts = useMemo(() => {
    const counts = {} as Record<DayOfWeek, number>;
    DAYS_OF_WEEK_MAP.forEach((day) => {
      counts[day.id as DayOfWeek] = getScheduleByDay(day.id as DayOfWeek, searchQuery).length;
    });
    return counts;
  }, [searchQuery]);

  // Current items for selected day & filter
  const currentItems = useMemo(() => {
    return getScheduleByDay(activeDay, searchQuery);
  }, [activeDay, searchQuery]);

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
