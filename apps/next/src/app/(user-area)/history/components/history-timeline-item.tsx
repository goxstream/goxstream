"use client";

import Link from "next/link";
import { Play, Trash2, Clock, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getImageStyle } from "@/lib/utils";
import type { WatchHistoryItem } from "@/types/user";

interface HistoryTimelineItemProps {
  item: WatchHistoryItem;
  onRemove: (id: string) => void;
}

export function HistoryTimelineItem({ item, onRemove }: HistoryTimelineItemProps) {
  const isGradient = item.animeCover && item.animeCover.startsWith("linear-gradient");

  return (
    <div className="group border-border/60 bg-card hover:border-primary/40 flex flex-col justify-between gap-4 rounded-xl border p-4 shadow-xs transition-all sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-start gap-4 sm:items-center">
        <div className="bg-muted relative flex h-20 w-32 shrink-0 items-center justify-center overflow-hidden rounded-lg text-white shadow-xs">
          {isGradient ? (
            <div className="absolute inset-0 size-full" style={getImageStyle(item.animeCover)} />
          ) : (
            <img
              src={item.animeCover || ""}
              alt={item.animeTitle}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 size-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.opacity = "0";
              }}
            />
          )}
          <div className="absolute inset-0 z-10 bg-black/30 transition-colors group-hover:bg-black/10" />
          <Link
            href={`/anime/${item.animeSlug}/${item.episodeNumber}`}
            className="bg-primary/90 text-primary-foreground relative z-20 flex size-9 items-center justify-center rounded-full shadow-md transition-transform hover:scale-110"
          >
            <Play className="fill-primary-foreground ml-0.5 size-4" />
          </Link>

          <div className="absolute right-1 bottom-1 z-20 rounded bg-black/80 px-1.5 py-0.5 font-mono text-[9px] font-bold text-white backdrop-blur-xs">
            {item.progressPercent}%
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/anime/${item.animeSlug}`}
              className="text-foreground hover:text-primary truncate text-sm font-bold transition-colors"
            >
              {item.animeTitle}
            </Link>
            <Badge variant="outline" className="h-4 px-1.5 py-0 font-mono text-[10px]">
              Ep. {item.episodeNumber}
            </Badge>
          </div>

          <span className="text-muted-foreground mt-0.5 line-clamp-1 text-xs">
            {item.episodeTitle}
          </span>

          <div className="text-muted-foreground mt-2 flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1">
              <Clock className="text-muted-foreground/70 size-3" />
              {item.lastWatchedAt}
            </span>
            <span>•</span>
            <span className="text-foreground/80 font-mono">
              {Math.floor(item.watchedSeconds / 60)}m / {Math.floor(item.durationSeconds / 60)}m
            </span>
          </div>

          <div className="mt-2 w-full max-w-md">
            <Progress value={item.progressPercent} className="bg-muted h-1.5" />
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 self-end sm:self-center">
        <Link
          href={`/anime/${item.animeSlug}/${item.episodeNumber}`}
          className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors"
        >
          <RotateCcw className="size-3.5" />
          Resume Ep. {item.episodeNumber}
        </Link>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => onRemove(item.id)}
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  );
}
