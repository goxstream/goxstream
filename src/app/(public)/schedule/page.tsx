"use client";

import { EpisodeCard } from "@/components/episode-card";
import { ScheduleHeader } from "./components/schedule-header";
import { DaySelectorTabs } from "./components/day-selector-tabs";
import { TimelineView } from "./components/timeline-view";
import { GridView } from "./components/grid-view";
import { useScheduleView } from "./hooks/use-schedule-view";

export default function SchedulePage() {
  const {
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
  } = useScheduleView();

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 space-y-6 max-w-7xl">
      {/* 1. Header Section */}
      <ScheduleHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        activeDayLabel={activeDayInfo?.label || "Hari Ini"}
        totalShowsCount={currentItems.length}
      />

      {/* 2. 7-Day Selector Tabs */}
      <DaySelectorTabs
        activeDay={activeDay}
        todayDay={todayDay}
        onSelectDay={setActiveDay}
        dayCounts={dayCounts}
      />

      {/* 3. Schedule Content Display / Inline Skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 py-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <EpisodeCard key={i} isLoading={true} />
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
