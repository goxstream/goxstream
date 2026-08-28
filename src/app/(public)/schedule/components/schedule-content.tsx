"use client";

import { EpisodeCard } from "@/components/episode-card";
import { ScheduleHeader } from "./schedule-header";
import { DaySelectorTabs } from "./day-selector-tabs";
import { TimelineView } from "./timeline-view";
import { GridView } from "./grid-view";
import { useScheduleView } from "../hooks/use-schedule-view";

export function ScheduleContent() {
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
      <ScheduleHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        activeDayLabel={activeDayInfo?.label || "Hari Ini"}
        totalShowsCount={currentItems.length}
      />

      <DaySelectorTabs
        activeDay={activeDay}
        todayDay={todayDay}
        onSelectDay={setActiveDay}
        dayCounts={dayCounts}
      />

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
