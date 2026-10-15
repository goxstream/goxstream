import { EpisodeCard } from "@/components/anime/episode-card";
import { ScheduleHeader } from "./schedule-header";
import { DaySelectorTabs } from "./day-selector-tabs";
import { TimelineView } from "./timeline-view";
import { GridView } from "./grid-view";
import { useScheduleView } from "@/hooks/use-schedule-view";
import { ApiError } from "@/components/api-error";

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
    error,
  } = useScheduleView();

  return (
    <div className="container mx-auto max-w-7xl space-y-6 px-4 py-6 md:py-8">
      <ScheduleHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        activeDayLabel={activeDayInfo?.label || "Today"}
        totalShowsCount={currentItems.length}
      />

      <DaySelectorTabs
        activeDay={activeDay}
        todayDay={todayDay}
        onSelectDay={setActiveDay}
        dayCounts={dayCounts}
      />

      {error ? (
        <ApiError message={error} onRetry={() => window.location.reload()} />
      ) : isLoading ? (
        <div className="grid grid-cols-1 gap-4 py-4 lg:grid-cols-2">
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
