"use client";

import Link from "next/link";
import { Play, Clock, CheckCircle2, Star, Radio } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { TIMEZONE_CONFIG } from "@/lib/constants";
import type { ScheduleItem } from "@/types/schedule";

interface TimelineViewProps {
  items: ScheduleItem[];
  dayLabel: string;
}

export function TimelineView({ items, dayLabel }: TimelineViewProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border/60 rounded-xl bg-card/30">
        <Clock className="w-12 h-12 text-muted-foreground/50 mb-3" />
        <h3 className="text-lg font-semibold text-foreground">No Release Schedule Found</h3>
        <p className="text-sm text-muted-foreground max-w-md mt-1">
          No anime releases found for {dayLabel} matching your search query.
        </p>
      </div>
    );
  }

  return (
    <div className="relative pl-4 md:pl-8 space-y-6 before:absolute before:left-2 md:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-border/60">
      {items.map((item) => {
        const isAiringNow = item.status === "airing_now";
        const isUpcoming = item.status === "upcoming";
        const isAired = item.status === "aired";

        return (
          <div key={item.id} className="relative group">
            {/* Timeline node icon */}
            <div className="absolute -left-4 md:-left-8 top-4 -translate-x-1/2 flex items-center justify-center w-5 h-5 md:w-6 md:h-6 rounded-full bg-background border border-border shadow-xs z-10">
              {isAiringNow && (
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
              )}
              {isUpcoming && <Clock className="w-3.5 h-3.5 text-primary" />}
              {isAired && <CheckCircle2 className="w-3.5 h-3.5 text-muted-foreground" />}
            </div>

            {/* Main card */}
            <div className="rounded-xl border border-border/60 bg-card/60 hover:bg-card/90 hover:border-border transition-all duration-200 p-4 md:p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                {/* Anime cover thumbnail */}
                <Link
                  href={`/anime/${item.slug}`}
                  className="relative shrink-0 w-24 sm:w-28 aspect-2/3 rounded-lg overflow-hidden border border-border/40 group/cover"
                >
                  <div
                    className="absolute inset-0 transition-transform duration-300 group-hover/cover:scale-105"
                    style={{ background: item.coverImage }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Episode pill */}
                  <div className="absolute top-1.5 left-1.5">
                    <Badge className="bg-black/70 text-white text-[10px] px-1.5 py-0.5 border-0 font-medium">
                      Ep {item.episodeNumber}
                    </Badge>
                  </div>

                  {/* Play icon hover overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/cover:opacity-100 transition-opacity bg-black/40">
                    <Play className="w-6 h-6 text-white fill-white" />
                  </div>
                </Link>

                {/* Info & Metadata */}
                <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
                  <div>
                    {/* Time & Status Row */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge variant="outline" className="font-mono text-xs font-semibold bg-background/80">
                        {item.airTime} {TIMEZONE_CONFIG.defaultShortLabel}
                      </Badge>

                      {isAiringNow && (
                        <Badge className="bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 gap-1 animate-pulse text-[11px] font-bold">
                          <Radio className="w-3 h-3" />
                          <span>AIRING NOW</span>
                        </Badge>
                      )}

                      {isUpcoming && item.countdownText && (
                        <Badge variant="secondary" className="gap-1 text-xs text-primary bg-primary/10 border-primary/20">
                          <Clock className="w-3 h-3" />
                          <span>{item.countdownText}</span>
                        </Badge>
                      )}

                      {isAired && (
                        <Badge variant="outline" className="text-xs text-muted-foreground border-border/60">
                          Released
                        </Badge>
                      )}

                      <Badge variant="secondary" className="text-[10px] uppercase font-semibold tracking-wider">
                        {item.subOrDub}
                      </Badge>
                    </div>

                    {/* Anime Title */}
                    <Link
                      href={`/anime/${item.slug}`}
                      className="group-hover:text-primary transition-colors inline-block"
                    >
                      <h3 className="text-base md:text-lg font-bold text-foreground line-clamp-1 leading-snug">
                        {item.title}
                      </h3>
                    </Link>

                    {item.japaneseTitle && (
                      <p className="text-xs text-muted-foreground/80 line-clamp-1 mb-2">
                        {item.japaneseTitle}
                      </p>
                    )}

                    {/* Studio, Rating & Season info */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mb-3">
                      <span className="font-medium text-foreground">{item.studio}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-amber-400 font-semibold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {item.rating.toFixed(2)}
                      </span>
                      <span>•</span>
                      <span>
                        {item.season} {item.year}
                      </span>
                    </div>

                    {/* Genres */}
                    <div className="flex flex-wrap gap-1.5">
                      {item.genres.map((genre) => (
                        <Badge
                          key={genre}
                          variant="secondary"
                          className="text-[10px] px-2 py-0.5 bg-muted/60 text-muted-foreground"
                        >
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Quick Action */}
                  <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Episode {item.episodeNumber} Simulcast Release
                    </span>
                    <Link
                      href={`/anime/${item.slug}`}
                      className={buttonVariants({ variant: "default", size: "sm", className: "h-8 gap-1.5 text-xs font-semibold" })}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Watch Episode {item.episodeNumber}</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
