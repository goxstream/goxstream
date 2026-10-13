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
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Calendar className="size-5 text-primary" />
          Weekly Broadcast Schedule Matrix
        </h2>
        <span className="text-xs text-muted-foreground">
          Timings displayed in JST (Japan Standard Time)
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {DAYS.map(({ day, label }) => {
          const dayAnime = animeList.filter((a) => a.airDay === day);

          return (
            <Card key={day} className="rounded-xl border-border/60 bg-card/60 flex flex-col h-full shadow-xs">
              <CardHeader className="p-3 border-b border-border/60 bg-muted/30">
                <CardTitle className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center justify-between">
                  <span>{label}</span>
                  <Badge variant="secondary" className="size-5 rounded-full p-0 flex items-center justify-center text-[10px]">
                    {dayAnime.length}
                  </Badge>
                </CardTitle>
              </CardHeader>

              <CardContent className="p-2 flex flex-col gap-2 flex-1 min-h-[160px]">
                {dayAnime.map((anime) => (
                  <div
                    key={anime.id}
                    className="p-2 rounded-lg border border-border/40 bg-background/80 hover:border-primary/50 transition-colors flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between gap-1 text-[11px] font-medium text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="size-3 text-primary" />
                        {anime.airTime}
                      </span>
                      <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-mono">
                        Ep {anime.currentEpisode}/{anime.episodeCount}
                      </span>
                    </div>

                    <span className="text-xs font-semibold text-foreground line-clamp-2 leading-tight">
                      {anime.titleRomaji}
                    </span>

                    <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/20">
                      <span className="truncate flex items-center gap-1">
                        <Film className="size-3 shrink-0" />
                        {anime.studio}
                      </span>
                      <Badge variant="outline" className="text-[9px] px-1 py-0 h-4">
                        {anime.licenseRegion}
                      </Badge>
                    </div>
                  </div>
                ))}

                {dayAnime.length === 0 && (
                  <div className="flex-1 flex items-center justify-center p-4 text-center">
                    <span className="text-xs text-muted-foreground/60 italic">
                      No airings
                    </span>
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
