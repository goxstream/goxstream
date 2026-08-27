"use client";

import { Flame, Calendar, Trophy, LayoutList, Grid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { TrendingPeriod } from "@/types/anime";

interface TrendingTabsProps {
  activePeriod: TrendingPeriod;
  onPeriodChange: (period: TrendingPeriod) => void;
  viewMode: "list" | "grid";
  onViewModeChange: (mode: "list" | "grid") => void;
  totalCount: number;
}

const PERIODS: Array<{
  id: TrendingPeriod;
  label: string;
  sublabel: string;
  icon: React.ElementType;
}> = [
  {
    id: "weekly",
    label: "Trending Now",
    sublabel: "Weekly Rank",
    icon: Flame,
  },
  {
    id: "monthly",
    label: "Monthly Hype",
    sublabel: "Past 30 Days",
    icon: Calendar,
  },
  {
    id: "all-time",
    label: "Top Trending",
    sublabel: "All-Time Leaders",
    icon: Trophy,
  },
];

export function TrendingTabs({
  activePeriod,
  onPeriodChange,
  viewMode,
  onViewModeChange,
  totalCount,
}: TrendingTabsProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
      {/* Time Horizon Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1 bg-muted/60 rounded-xl border border-border/40">
        {PERIODS.map((period) => {
          const Icon = period.icon;
          const isActive = activePeriod === period.id;

          return (
            <button
              key={period.id}
              onClick={() => onPeriodChange(period.id)}
              className={cn(
                "flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold border transition-colors duration-150 cursor-pointer select-none",
                isActive
                  ? "bg-background text-foreground shadow-xs border-border/60"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-background/40"
              )}
            >
              <Icon
                className={cn(
                  "size-4 shrink-0 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              />
              <div className="flex flex-col text-left">
                <span className="leading-none">{period.label}</span>
                <span className="text-[10px] text-muted-foreground font-normal mt-0.5">
                  {period.sublabel}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Right Controls: Count & View Switcher */}
      <div className="flex items-center justify-between sm:justify-end gap-3">
        <span className="text-xs text-muted-foreground font-medium">
          Showing <span className="font-bold text-foreground">{totalCount}</span> anime
        </span>

        {/* View Mode Toggle Buttons */}
        <div className="flex items-center gap-1 p-1 bg-muted/60 rounded-lg border border-border/40">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onViewModeChange("list")}
            className={cn(
              "size-7 rounded-md border transition-colors",
              viewMode === "list"
                ? "bg-background text-foreground shadow-xs border-border/60"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
            aria-label="List View"
          >
            <LayoutList className="size-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onViewModeChange("grid")}
            className={cn(
              "size-7 rounded-md border transition-colors",
              viewMode === "grid"
                ? "bg-background text-foreground shadow-xs border-border/60"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
            aria-label="Grid View"
          >
            <Grid className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
