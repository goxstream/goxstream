"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { SeasonsHeader } from "./components/seasons-header";
import { SeasonsStats } from "./components/seasons-stats";
import { SeasonsMatrix } from "./components/seasons-matrix";
import { SeasonsTable } from "./components/seasons-table";
import { SeasonAddSheet } from "./components/season-add-sheet";
import { useDashboardSeasons } from "@/hooks/use-dashboard-seasons";
import { MOCK_BROADCAST_ANIME } from "./constants";
import type { SeasonItem, BroadcastSlotAnime, SeasonQuarter } from "./types";

export default function SeasonsPage() {
  const { seasons, isLoading, setSeasons } = useDashboardSeasons();
  const [animeSlots, setAnimeSlots] = useState<BroadcastSlotAnime[]>(MOCK_BROADCAST_ANIME);
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedQuarter, setSelectedQuarter] = useState<SeasonQuarter>("SUMMER");
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);

  const activeSeasonName = `${selectedQuarter.charAt(0) + selectedQuarter.slice(1).toLowerCase()} ${selectedYear}`;

  const handleToggleSeasonStatus = (id: string) => {
    setSeasons((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
  };

  const handleSetCurrentSeason = (id: string) => {
    setSeasons((prev) =>
      prev.map((s) => ({ ...s, isCurrent: s.id === id }))
    );
  };

  const handleDeleteSeason = (id: string) => {
    setSeasons((prev) => prev.filter((s) => s.id !== id));
  };

  const handleAddSeason = (data: {
    year: number;
    quarter: SeasonQuarter;
    startDate: string;
    endDate: string;
  }) => {
    const quarterFormatted = data.quarter.charAt(0) + data.quarter.slice(1).toLowerCase();
    const newSeason: SeasonItem = {
      id: `seas-${data.year}-${data.quarter.toLowerCase()}`,
      year: data.year,
      quarter: data.quarter,
      name: `${quarterFormatted} ${data.year}`,
      startDate: data.startDate,
      endDate: data.endDate,
      totalAnime: 0,
      isCurrent: false,
      isActive: true,
    };
    setSeasons((prev) => [newSeason, ...prev]);
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <SeasonsHeader
        selectedYear={selectedYear}
        selectedQuarter={selectedQuarter}
        onYearChange={setSelectedYear}
        onQuarterChange={setSelectedQuarter}
        onOpenAddSheet={() => setIsAddSheetOpen(true)}
      />

      {/* Stats Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-24 w-full rounded-xl bg-card border border-border/60" />
          <Skeleton className="h-24 w-full rounded-xl bg-card border border-border/60" />
          <Skeleton className="h-24 w-full rounded-xl bg-card border border-border/60" />
          <Skeleton className="h-24 w-full rounded-xl bg-card border border-border/60" />
        </div>
      ) : (
        <SeasonsStats animeList={animeSlots} seasonName={activeSeasonName} />
      )}

      {/* Day-by-Day Broadcast Matrix */}
      <SeasonsMatrix animeList={animeSlots} />

      {/* All Seasons Overview Table */}
      <div className="flex flex-col gap-3 pt-4 border-t border-border/60">
        <h2 className="text-lg font-bold text-foreground">Season Master Directory</h2>
        {isLoading ? (
          <Skeleton className="h-64 w-full rounded-xl bg-card border border-border/60" />
        ) : (
          <SeasonsTable
            seasons={seasons}
            onToggleStatus={handleToggleSeasonStatus}
            onSetCurrent={handleSetCurrentSeason}
            onDeleteSeason={handleDeleteSeason}
            onEditSeason={() => {}}
          />
        )}
      </div>

      {/* Add Season Slide-over Sheet */}
      <SeasonAddSheet
        open={isAddSheetOpen}
        onOpenChange={setIsAddSheetOpen}
        onAddSeason={handleAddSeason}
      />
    </div>
  );
}
