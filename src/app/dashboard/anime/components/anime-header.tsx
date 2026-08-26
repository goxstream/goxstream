"use client";

import { Plus, Film, Radio, CheckCircle, FileEdit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { AnimeItem } from "../types";

interface AnimeHeaderProps {
  animeList: AnimeItem[];
  onOpenAddSheet: () => void;
}

export function AnimeHeader({ animeList, onOpenAddSheet }: AnimeHeaderProps) {
  const totalAnime = animeList.length;
  const airingCount = animeList.filter((a) => a.status === "Airing").length;
  const finishedCount = animeList.filter((a) => a.status === "Finished").length;
  const draftCount = animeList.filter((a) => a.status === "Draft" || a.status === "Upcoming").length;

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      {/* Title & Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Anime Catalog
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Manage streaming titles, metadata, and status in one compact view.
          </p>
        </div>

        <Button
          onClick={onOpenAddSheet}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-xs gap-1.5 self-start sm:self-auto text-xs h-9 px-3.5 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Anime</span>
        </Button>
      </div>

      {/* Metric Summary Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        <Card className="p-3 sm:p-3.5 border-border/60 shadow-xs flex items-center justify-between bg-card/60 min-h-[72px]">
          <div>
            <p className="text-[11px] sm:text-xs font-medium text-muted-foreground">Total Titles</p>
            <p className="text-lg sm:text-xl font-bold text-foreground mt-0.5">{totalAnime}</p>
          </div>
          <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Film className="h-4 w-4" />
          </div>
        </Card>

        <Card className="p-3 sm:p-3.5 border-border/60 shadow-xs flex items-center justify-between bg-card/60 min-h-[72px]">
          <div>
            <p className="text-[11px] sm:text-xs font-medium text-muted-foreground">Currently Airing</p>
            <p className="text-lg sm:text-xl font-bold text-emerald-500 mt-0.5">{airingCount}</p>
          </div>
          <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
            <Radio className="h-4 w-4" />
          </div>
        </Card>

        <Card className="p-3 sm:p-3.5 border-border/60 shadow-xs flex items-center justify-between bg-card/60 min-h-[72px]">
          <div>
            <p className="text-[11px] sm:text-xs font-medium text-muted-foreground">Finished</p>
            <p className="text-lg sm:text-xl font-bold text-blue-500 mt-0.5">{finishedCount}</p>
          </div>
          <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
            <CheckCircle className="h-4 w-4" />
          </div>
        </Card>

        <Card className="p-3 sm:p-3.5 border-border/60 shadow-xs flex items-center justify-between bg-card/60 min-h-[72px]">
          <div>
            <p className="text-[11px] sm:text-xs font-medium text-muted-foreground">Drafts & Upcoming</p>
            <p className="text-lg sm:text-xl font-bold text-amber-500 mt-0.5">{draftCount}</p>
          </div>
          <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
            <FileEdit className="h-4 w-4" />
          </div>
        </Card>
      </div>
    </div>
  );
}
