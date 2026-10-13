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
      <div className="border-border/60 bg-card/30 flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center">
        <Clock className="text-muted-foreground/50 mb-3 h-12 w-12" />
        <h3 className="text-foreground text-lg font-semibold">No Release Schedule Found</h3>
        <p className="text-muted-foreground mt-1 max-w-md text-sm">
          No anime releases found for {dayLabel} matching your search query.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => {
        const isAiringNow = item.status === "airing_now";
        const isUpcoming = item.status === "upcoming";
        const isGradient = item.coverImage && item.coverImage.startsWith("linear-gradient");

        return (
          <div
            key={item.id}
            className="group border-border/60 bg-card/60 hover:bg-card hover:border-border flex flex-col overflow-hidden rounded-xl border shadow-xs transition-all duration-200"
          >
            {/* Cover image container */}
            <Link
              href={`/anime/${item.slug}`}
              className="bg-muted relative aspect-16/9 overflow-hidden"
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
              <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5">
                <Badge className="border-0 bg-black/75 font-mono text-[11px] text-white">
                  {item.airTime} {TIMEZONE_CONFIG.defaultShortLabel}
                </Badge>
              </div>

              {/* Status pill top-right */}
              <div className="absolute top-2 right-2 z-10">
                {isAiringNow ? (
                  <Badge className="animate-pulse gap-1 bg-emerald-500 text-[10px] font-bold text-white">
                    <Radio className="h-3 w-3" />
                    LIVE
                  </Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className="border-0 bg-black/60 text-[10px] text-white backdrop-blur-xs"
                  >
                    Ep {item.episodeNumber}
                  </Badge>
                )}
              </div>

              {/* Hover play icon */}
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-full shadow-md">
                  <Play className="ml-0.5 h-5 w-5 fill-current" />
                </div>
              </div>
            </Link>

            {/* Info body */}
            <div className="flex flex-1 flex-col justify-between p-4">
              <div>
                {/* Title */}
                <Link href={`/anime/${item.slug}`}>
                  <h3 className="text-foreground group-hover:text-primary line-clamp-1 text-sm font-bold transition-colors md:text-base">
                    {item.title}
                  </h3>
                </Link>

                {/* Studio & Rating */}
                <div className="text-muted-foreground mt-1.5 mb-2.5 flex items-center justify-between text-xs">
                  <span className="truncate">{item.studio}</span>
                  <span className="flex shrink-0 items-center gap-1 font-medium text-amber-400">
                    <Star className="h-3 w-3 fill-amber-400" />
                    {item.rating ? item.rating.toFixed(2) : "N/A"}
                  </span>
                </div>

                {/* Countdown / Status indicator */}
                {isUpcoming && item.countdownText && (
                  <p className="text-primary mb-2 flex items-center gap-1 text-xs font-medium">
                    <Clock className="h-3 w-3 shrink-0" />
                    <span className="truncate">{item.countdownText}</span>
                  </p>
                )}

                {/* Genres */}
                <div className="flex flex-wrap gap-1">
                  {item.genres.slice(0, 3).map((genre) => (
                    <span
                      key={genre}
                      className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 text-[10px]"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer action button */}
              <div className="border-border/40 mt-4 border-t pt-3">
                <Link
                  href={`/anime/${item.slug}/${item.episodeNumber}`}
                  className={buttonVariants({
                    variant: "secondary",
                    size: "sm",
                    className: "h-8 w-full justify-center gap-1.5 text-xs font-medium",
                  })}
                >
                  <Play className="h-3 w-3 fill-current" />
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
