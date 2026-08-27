"use client";

import Link from "next/link";
import { Search, Clock, LayoutGrid, ListFilter, Globe, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
    <div className="flex flex-col gap-5 rounded-xl border border-border/60 bg-card/60 p-5 md:p-6 backdrop-blur-xs">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <ChevronRight className="size-3 text-muted-foreground/60" />
        <span className="text-foreground font-medium">Anime Schedule</span>
      </nav>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
            <span className="inline-flex items-center justify-center p-1.5 rounded-lg bg-primary/10 text-primary">
              <Clock className="w-5 h-5" />
            </span>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Weekly Release Schedule
            </h1>
            <Badge variant="outline" className="gap-1 bg-background/50 border-border/80 text-muted-foreground text-xs">
              <Globe className="w-3 h-3 text-primary" />
              <span>{TIMEZONE_CONFIG.defaultLabel}</span>
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Track weekly anime episode release times in real-time. Displaying {totalShowsCount} shows for <span className="font-medium text-foreground">{activeDayLabel}</span>.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="inline-flex items-center rounded-lg border border-border/60 bg-muted/40 p-1">
            <Button
              variant={viewMode === "timeline" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("timeline")}
              className="gap-1.5 h-8 text-xs font-medium"
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>Timeline</span>
            </Button>
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("grid")}
              className="gap-1.5 h-8 text-xs font-medium"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid Card</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Filter / Search input strip */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search anime title, studio, or genre in schedule..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-10 bg-background/60 border-border/60 focus-visible:ring-1 focus-visible:ring-primary text-sm"
        />
      </div>
    </div>
  );
}
