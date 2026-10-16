import { Flame, Calendar, Trophy, LayoutList, Grid } from "lucide-react";
import { Button } from "@shionstream/ui/components/button";
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
    <div className="border-border/60 flex flex-col justify-between gap-4 border-b pb-4 sm:flex-row sm:items-center">
      {/* Time Horizon Tabs */}
      <div className="bg-muted/60 border-border/40 flex flex-wrap items-center gap-2 rounded-xl border p-1">
        {PERIODS.map((period) => {
          const Icon = period.icon;
          const isActive = activePeriod === period.id;

          return (
            <button
              key={period.id}
              onClick={() => onPeriodChange(period.id)}
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-lg border px-3.5 py-2 text-xs font-semibold transition-colors duration-150 select-none sm:text-sm",
                isActive
                  ? "bg-background text-foreground border-border/60 shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/40 border-transparent",
              )}
            >
              <Icon
                className={cn(
                  "size-4 shrink-0 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              />
              <div className="flex flex-col text-left">
                <span className="leading-none">{period.label}</span>
                <span className="text-muted-foreground mt-0.5 text-[10px] font-normal">
                  {period.sublabel}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Right Controls: Count & View Switcher */}
      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <span className="text-muted-foreground text-xs font-medium">
          Showing <span className="text-foreground font-bold">{totalCount}</span> anime
        </span>

        {/* View Mode Toggle Buttons */}
        <div className="bg-muted/60 border-border/40 flex items-center gap-1 rounded-lg border p-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onViewModeChange("list")}
            className={cn(
              "size-7 rounded-md border transition-colors",
              viewMode === "list"
                ? "bg-background text-foreground border-border/60 shadow-xs"
                : "text-muted-foreground hover:text-foreground border-transparent",
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
                ? "bg-background text-foreground border-border/60 shadow-xs"
                : "text-muted-foreground hover:text-foreground border-transparent",
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
