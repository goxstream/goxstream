"use client";

import { Tv, PlayCircle, Clock, CalendarCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { BroadcastSlotAnime } from "../types";

interface SeasonsStatsProps {
  animeList: BroadcastSlotAnime[];
  seasonName: string;
}

export function SeasonsStats({ animeList, seasonName }: SeasonsStatsProps) {
  const totalScheduled = animeList.length;
  const totalEpisodes = animeList.reduce((sum, a) => sum + a.episodeCount, 0);
  const totalAirableToday = animeList.filter((a) => a.airDay === "FRIDAY" || a.airDay === "SATURDAY").length;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Scheduled */}
      <Card className="rounded-xl border-border/60 bg-card/60 shadow-xs">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {seasonName} Catalog
            </span>
            <span className="text-2xl font-bold text-foreground">
              {totalScheduled} Airing Anime
            </span>
            <span className="text-xs text-muted-foreground">
              Active broadcast slots
            </span>
          </div>
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Tv className="size-5" />
          </div>
        </CardContent>
      </Card>

      {/* Total Episodes */}
      <Card className="rounded-xl border-border/60 bg-card/60 shadow-xs">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Season Episodes
            </span>
            <span className="text-2xl font-bold text-foreground">
              {totalEpisodes} Episodes
            </span>
            <span className="text-xs text-muted-foreground">
              Scheduled seasonal output
            </span>
          </div>
          <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
            <PlayCircle className="size-5" />
          </div>
        </CardContent>
      </Card>

      {/* Weekend Peak Airing */}
      <Card className="rounded-xl border-border/60 bg-card/60 shadow-xs">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Weekend Airings
            </span>
            <span className="text-2xl font-bold text-foreground">
              {totalAirableToday} Prime Titles
            </span>
            <span className="text-xs text-muted-foreground">
              Friday & Saturday slots
            </span>
          </div>
          <div className="flex size-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
            <Clock className="size-5" />
          </div>
        </CardContent>
      </Card>

      {/* Season Status */}
      <Card className="rounded-xl border-border/60 bg-card/60 shadow-xs">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Season Status
            </span>
            <span className="text-2xl font-bold text-foreground text-emerald-500">
              Active Broadcast
            </span>
            <span className="text-xs text-muted-foreground">
              Weekly sync active
            </span>
          </div>
          <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
            <CalendarCheck className="size-5" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
