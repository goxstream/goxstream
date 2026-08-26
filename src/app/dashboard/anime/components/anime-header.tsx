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
  const draftCount = animeList.filter((a) => a.status === "Draft").length;

  return (
    <div className="flex flex-col gap-5">
      {/* Title & Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Anime Catalog
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your streaming anime titles, metadata, and status in one compact view.
          </p>
        </div>

        <Button
          onClick={onOpenAddSheet}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-xs gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Anime</span>
        </Button>
      </div>

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="p-3.5 border-border/60 shadow-xs flex items-center justify-between bg-card/60">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Total Titles</p>
            <p className="text-xl font-semibold text-foreground mt-0.5">{totalAnime}</p>
          </div>
          <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Film className="h-4 w-4" />
          </div>
        </Card>

        <Card className="p-3.5 border-border/60 shadow-xs flex items-center justify-between bg-card/60">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Currently Airing</p>
            <p className="text-xl font-semibold text-emerald-500 mt-0.5">{airingCount}</p>
          </div>
          <div className="h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <Radio className="h-4 w-4" />
          </div>
        </Card>

        <Card className="p-3.5 border-border/60 shadow-xs flex items-center justify-between bg-card/60">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Finished</p>
            <p className="text-xl font-semibold text-blue-500 mt-0.5">{finishedCount}</p>
          </div>
          <div className="h-9 w-9 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <CheckCircle className="h-4 w-4" />
          </div>
        </Card>

        <Card className="p-3.5 border-border/60 shadow-xs flex items-center justify-between bg-card/60">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Drafts & Upcoming</p>
            <p className="text-xl font-semibold text-amber-500 mt-0.5">{draftCount}</p>
          </div>
          <div className="h-9 w-9 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <FileEdit className="h-4 w-4" />
          </div>
        </Card>
      </div>
    </div>
  );
}
