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
  const draftCount = animeList.filter(
    (a) => a.status === "Draft" || a.status === "Upcoming",
  ).length;

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      {/* Title & Action Row */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
            Anime Catalog
          </h1>
          <p className="text-muted-foreground mt-0.5 text-xs sm:text-sm">
            Manage streaming titles, metadata, and status in one compact view.
          </p>
        </div>

        <Button
          onClick={onOpenAddSheet}
          className="bg-primary hover:bg-primary/90 text-primary-foreground h-9 cursor-pointer gap-1.5 self-start px-3.5 text-xs font-medium shadow-xs sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Anime</span>
        </Button>
      </div>

      {/* Metric Summary Cards Grid */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
        <Card className="border-border/60 bg-card/60 flex min-h-[72px] items-center justify-between p-3 shadow-xs sm:p-3.5">
          <div>
            <p className="text-muted-foreground text-[11px] font-medium sm:text-xs">Total Titles</p>
            <p className="text-foreground mt-0.5 text-lg font-bold sm:text-xl">{totalAnime}</p>
          </div>
          <div className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg sm:h-9 sm:w-9">
            <Film className="h-4 w-4" />
          </div>
        </Card>

        <Card className="border-border/60 bg-card/60 flex min-h-[72px] items-center justify-between p-3 shadow-xs sm:p-3.5">
          <div>
            <p className="text-muted-foreground text-[11px] font-medium sm:text-xs">
              Currently Airing
            </p>
            <p className="mt-0.5 text-lg font-bold text-emerald-500 sm:text-xl">{airingCount}</p>
          </div>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 sm:h-9 sm:w-9">
            <Radio className="h-4 w-4" />
          </div>
        </Card>

        <Card className="border-border/60 bg-card/60 flex min-h-[72px] items-center justify-between p-3 shadow-xs sm:p-3.5">
          <div>
            <p className="text-muted-foreground text-[11px] font-medium sm:text-xs">Finished</p>
            <p className="mt-0.5 text-lg font-bold text-blue-500 sm:text-xl">{finishedCount}</p>
          </div>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500 sm:h-9 sm:w-9">
            <CheckCircle className="h-4 w-4" />
          </div>
        </Card>

        <Card className="border-border/60 bg-card/60 flex min-h-[72px] items-center justify-between p-3 shadow-xs sm:p-3.5">
          <div>
            <p className="text-muted-foreground text-[11px] font-medium sm:text-xs">
              Drafts & Upcoming
            </p>
            <p className="mt-0.5 text-lg font-bold text-amber-500 sm:text-xl">{draftCount}</p>
          </div>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500 sm:h-9 sm:w-9">
            <FileEdit className="h-4 w-4" />
          </div>
        </Card>
      </div>
    </div>
  );
}
