import { Link } from "react-router";
import { Search, Clock, LayoutGrid, ListFilter, Globe, ChevronRight } from "lucide-react";
import { Input } from "@goxstream/ui/components/input";
import { Button } from "@goxstream/ui/components/button";
import { Badge } from "@goxstream/ui/components/badge";
import { TIMEZONE_CONFIG } from "@/lib/constants";
import type { ScheduleViewMode } from "@/types/schedule";

interface ScheduleHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: ScheduleViewMode;
  onViewModeChange: (mode: ScheduleViewMode) => void;
  activeDayLabel: string;
  totalShowsCount: number;
}

export function ScheduleHeader({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  activeDayLabel,
  totalShowsCount,
}: ScheduleHeaderProps) {
  return (
    <div className="border-border/60 bg-card/60 flex flex-col gap-5 rounded-xl border p-5 backdrop-blur-xs md:p-6">
      {/* Breadcrumb Navigation */}
      <nav className="text-muted-foreground flex items-center gap-2 text-xs">
        <Link to="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <ChevronRight className="text-muted-foreground/60 size-3" />
        <span className="text-foreground font-medium">Anime Schedule</span>
      </nav>

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="mb-1.5 flex flex-wrap items-center gap-2.5">
            <span className="bg-primary/10 text-primary inline-flex items-center justify-center rounded-lg p-1.5">
              <Clock className="h-5 w-5" />
            </span>
            <h1 className="text-foreground text-2xl font-bold tracking-tight md:text-3xl">
              Weekly Release Schedule
            </h1>
            <Badge
              variant="outline"
              className="bg-background/50 border-border/80 text-muted-foreground gap-1 text-xs"
            >
              <Globe className="text-primary h-3 w-3" />
              <span>{TIMEZONE_CONFIG.defaultLabel}</span>
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            Track weekly anime episode release times in real-time. Displaying {totalShowsCount}{" "}
            shows for <span className="text-foreground font-medium">{activeDayLabel}</span>.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="border-border/60 bg-muted/40 inline-flex items-center rounded-lg border p-1">
            <Button
              variant={viewMode === "timeline" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("timeline")}
              className="h-8 gap-1.5 text-xs font-medium"
            >
              <ListFilter className="h-3.5 w-3.5" />
              <span>Timeline</span>
            </Button>
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("grid")}
              className="h-8 gap-1.5 text-xs font-medium"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Grid Card</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Filter / Search input strip */}
      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          type="search"
          placeholder="Search anime title, studio, or genre in schedule..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="bg-background/60 border-border/60 focus-visible:ring-primary h-10 pl-9 text-sm focus-visible:ring-1"
        />
      </div>
    </div>
  );
}
