"use client";

import Link from "next/link";
import { Play, Clock, Star, Radio } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { TIMEZONE_CONFIG } from "@/lib/constants";
import { getImageStyle } from "@/lib/utils";
import type { ScheduleItem } from "@/types/schedule";

interface GridViewProps {
  items: ScheduleItem[];
  dayLabel: string;
}

export function GridView({ items, dayLabel }: GridViewProps) {
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
      {items.map((item) => {
        const isAiringNow = item.status === "airing_now";
        const isUpcoming = item.status === "upcoming";
        const isGradient = item.coverImage && item.coverImage.startsWith("linear-gradient");

        return (
          <div
            key={item.id}
            className="group flex flex-col rounded-xl border border-border/60 bg-card/60 hover:bg-card hover:border-border transition-all duration-200 overflow-hidden shadow-xs"
          >
            {/* Cover image container */}
            <Link
              href={`/anime/${item.slug}`}
              className="relative aspect-16/9 overflow-hidden bg-muted"
            >
              {isGradient ? (
                <div
                  className="absolute inset-0 transition-transform duration-300 group-hover:scale-105"
                  style={getImageStyle(item.coverImage)}
                />
              ) : (
                <img
                  src={item.coverImage || ""}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.opacity = "0";
                  }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              {/* Time pill top-left */}
              <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10">
                <Badge className="bg-black/75 text-white font-mono text-[11px] border-0">
                  {item.airTime} {TIMEZONE_CONFIG.defaultShortLabel}
                </Badge>
              </div>

              {/* Status pill top-right */}
              <div className="absolute top-2 right-2 z-10">
                {isAiringNow ? (
                  <Badge className="bg-emerald-500 text-white font-bold text-[10px] gap-1 animate-pulse">
                    <Radio className="w-3 h-3" />
                    LIVE
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-black/60 backdrop-blur-xs text-white text-[10px] border-0">
                    Ep {item.episodeNumber}
                  </Badge>
                )}
              </div>

              {/* Hover play icon */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 z-10">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-md">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </div>
              </div>
            </Link>

            {/* Info body */}
            <div className="flex-1 p-4 flex flex-col justify-between">
              <div>
                {/* Title */}
                <Link href={`/anime/${item.slug}`}>
                  <h3 className="font-bold text-sm md:text-base text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                </Link>

                {/* Studio & Rating */}
                <div className="flex items-center justify-between text-xs text-muted-foreground mt-1.5 mb-2.5">
                  <span className="truncate">{item.studio}</span>
                  <span className="flex items-center gap-1 text-amber-400 font-medium shrink-0">
                    <Star className="w-3 h-3 fill-amber-400" />
                    {item.rating ? item.rating.toFixed(2) : "N/A"}
                  </span>
                </div>

                {/* Countdown / Status indicator */}
                {isUpcoming && item.countdownText && (
                  <p className="text-xs text-primary font-medium flex items-center gap-1 mb-2">
                    <Clock className="w-3 h-3 shrink-0" />
                    <span className="truncate">{item.countdownText}</span>
                  </p>
                )}

                {/* Genres */}
                <div className="flex flex-wrap gap-1">
                  {item.genres.slice(0, 3).map((genre) => (
                    <span
                      key={genre}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer action button */}
              <div className="mt-4 pt-3 border-t border-border/40">
                <Link
                  href={`/anime/${item.slug}/${item.episodeNumber}`}
                  className={buttonVariants({
                    variant: "secondary",
                    size: "sm",
                    className: "w-full text-xs gap-1.5 h-8 justify-center font-medium",
                  })}
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Watch Episode {item.episodeNumber}</span>
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
