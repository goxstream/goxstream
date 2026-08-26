"use client";

import { useState, useMemo } from "react";
import { DAYS_OF_WEEK_MAP } from "@/lib/constants";
import { getCurrentDayOfWeek, getScheduleByDay, MOCK_SCHEDULE_ITEMS } from "@/lib/mock-schedule";
import type { DayOfWeek, ScheduleViewMode } from "@/types/schedule";
import { ScheduleHeader } from "./schedule-header";
import { DaySelectorTabs } from "./day-selector-tabs";
import { TimelineView } from "./timeline-view";
import { GridView } from "./grid-view";

export function ScheduleContent() {
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

      {/* Main Schedule View (Timeline or Grid) */}
      <div className="mt-4">
        {viewMode === "timeline" ? (
          <TimelineView items={currentItems} dayLabel={activeDayInfo?.label || ""} />
        ) : (
          <GridView items={currentItems} dayLabel={activeDayInfo?.label || ""} />
        )}
      </div>
    </div>
  );
}
