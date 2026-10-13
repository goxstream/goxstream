"use client";

import { Calendar, Clock, Film } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BroadcastSlotAnime, BroadcastDay } from "../types";

interface SeasonsMatrixProps {
  animeList: BroadcastSlotAnime[];
}

const DAYS: { day: BroadcastDay; label: string }[] = [
  { day: "MONDAY", label: "Monday" },
  { day: "TUESDAY", label: "Tuesday" },
  { day: "WEDNESDAY", label: "Wednesday" },
  { day: "THURSDAY", label: "Thursday" },
  { day: "FRIDAY", label: "Friday" },
  { day: "SATURDAY", label: "Saturday" },
  { day: "SUNDAY", label: "Sunday" },
];

export function SeasonsMatrix({ animeList }: SeasonsMatrixProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-foreground flex items-center gap-2 text-lg font-bold">
          <Calendar className="text-primary size-5" />
          Weekly Broadcast Schedule Matrix
        </h2>
        <span className="text-muted-foreground text-xs">
          Timings displayed in JST (Japan Standard Time)
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {DAYS.map(({ day, label }) => {
          const dayAnime = animeList.filter((a) => a.airDay === day);

          return (
            <Card
              key={day}
              className="border-border/60 bg-card/60 flex h-full flex-col rounded-xl shadow-xs"
            >
              <CardHeader className="border-border/60 bg-muted/30 border-b p-3">
                <CardTitle className="text-foreground flex items-center justify-between text-xs font-bold tracking-wider uppercase">
                  <span>{label}</span>
                  <Badge
                    variant="secondary"
                    className="flex size-5 items-center justify-center rounded-full p-0 text-[10px]"
                  >
                    {dayAnime.length}
                  </Badge>
                </CardTitle>
              </CardHeader>

              <CardContent className="flex min-h-[160px] flex-1 flex-col gap-2 p-2">
                {dayAnime.map((anime) => (
                  <div
                    key={anime.id}
                    className="border-border/40 bg-background/80 hover:border-primary/50 flex flex-col gap-1.5 rounded-lg border p-2 transition-colors"
                  >
                    <div className="text-muted-foreground flex items-center justify-between gap-1 text-[11px] font-medium">
                      <span className="flex items-center gap-1">
                        <Clock className="text-primary size-3" />
                        {anime.airTime}
                      </span>
                      <span className="bg-muted rounded px-1.5 py-0.5 font-mono text-[10px]">
                        Ep {anime.currentEpisode}/{anime.episodeCount}
                      </span>
                    </div>

                    <span className="text-foreground line-clamp-2 text-xs leading-tight font-semibold">
                      {anime.titleRomaji}
                    </span>

                    <div className="text-muted-foreground border-border/20 flex items-center justify-between border-t pt-1 text-[10px]">
                      <span className="flex items-center gap-1 truncate">
                        <Film className="size-3 shrink-0" />
                        {anime.studio}
                      </span>
                      <Badge variant="outline" className="h-4 px-1 py-0 text-[9px]">
                        {anime.licenseRegion}
                      </Badge>
                    </div>
                  </div>
                ))}

                {dayAnime.length === 0 && (
                  <div className="flex flex-1 items-center justify-center p-4 text-center">
                    <span className="text-muted-foreground/60 text-xs italic">No airings</span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
