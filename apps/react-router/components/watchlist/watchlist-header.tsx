"use client";

import { Bookmark, Grid, List } from "lucide-react";
import { Button } from "@goxstream/ui/components/button";
import type { WatchlistViewMode } from "@/types/watchlist";

interface WatchlistHeaderProps {
  viewMode: WatchlistViewMode;
  onViewModeChange: (mode: WatchlistViewMode) => void;
}

export function WatchlistHeader({ viewMode, onViewModeChange }: WatchlistHeaderProps) {
  return (
    <div className="border-border/60 from-card via-card to-primary/5 flex flex-col justify-between gap-4 rounded-2xl border bg-gradient-to-r p-6 sm:flex-row sm:items-center">
      <div className="flex items-center gap-3.5">
        <div className="bg-primary/10 border-primary/20 text-primary flex size-12 items-center justify-center rounded-xl border">
          <Bookmark className="fill-primary/20 size-6" />
        </div>
        <div>
          <h1 className="text-foreground text-2xl font-extrabold tracking-tight">
            My Watchlist Library
          </h1>
          <p className="text-muted-foreground mt-0.5 text-xs">
            Manage your saved series, track episode progress, and organize favorites.
          </p>
        </div>
      </div>

      <div className="bg-muted/60 border-border/60 flex items-center gap-1.5 self-start rounded-xl border p-1 sm:self-auto">
        <Button
          variant={viewMode === "grid" ? "secondary" : "ghost"}
          size="icon-sm"
          onClick={() => onViewModeChange("grid")}
          className="rounded-lg"
        >
          <Grid className="size-4" />
        </Button>
        <Button
          variant={viewMode === "list" ? "secondary" : "ghost"}
          size="icon-sm"
          onClick={() => onViewModeChange("list")}
          className="rounded-lg"
        >
          <List className="size-4" />
        </Button>
      </div>
    </div>
  );
}
