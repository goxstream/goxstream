"use client";

import { Bookmark, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { WatchlistViewMode } from "../types";

interface WatchlistHeaderProps {
  viewMode: WatchlistViewMode;
  onViewModeChange: (mode: WatchlistViewMode) => void;
}

export function WatchlistHeader({ viewMode, onViewModeChange }: WatchlistHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border border-border/60 bg-gradient-to-r from-card via-card to-primary/5">
      <div className="flex items-center gap-3.5">
        <div className="size-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
          <Bookmark className="size-6 fill-primary/20" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            My Watchlist Library
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your saved series, track episode progress, and organize favorites.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 self-start sm:self-auto bg-muted/60 p-1 rounded-xl border border-border/60">
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
