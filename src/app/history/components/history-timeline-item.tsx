"use client";

import Link from "next/link";
import { Play, Trash2, Clock, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { WatchHistoryItem } from "@/types/user";

interface HistoryTimelineItemProps {
  item: WatchHistoryItem;
  onRemove: (id: string) => void;
}

export function HistoryTimelineItem({ item, onRemove }: HistoryTimelineItemProps) {
  return (
    <div className="group p-4 rounded-xl border border-border/60 bg-card hover:border-primary/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
      <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
        <div
          className="h-20 w-32 rounded-lg shrink-0 overflow-hidden relative shadow-xs flex items-center justify-center text-white"
          style={{ background: item.animeCover }}
        >
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
          <Link
            href={`/anime/${item.animeSlug}/${item.episodeNumber}`}
            className="size-9 rounded-full bg-primary/90 hover:scale-110 transition-transform flex items-center justify-center text-primary-foreground relative z-10 shadow-md"
          >
            <Play className="size-4 fill-primary-foreground ml-0.5" />
          </Link>

          <div className="absolute bottom-1 right-1 bg-black/80 backdrop-blur-xs text-[9px] px-1.5 py-0.5 rounded font-mono font-bold text-white z-10">
            {item.progressPercent}%
          </div>
        </div>

        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={`/anime/${item.animeSlug}`}
              className="font-bold text-sm text-foreground hover:text-primary transition-colors truncate"
            >
              {item.animeTitle}
            </Link>
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 font-mono">
              Ep. {item.episodeNumber}
            </Badge>
          </div>

          <span className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
            {item.episodeTitle}
          </span>

          <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-2">
            <span className="flex items-center gap-1">
              <Clock className="size-3 text-muted-foreground/70" />
              {item.lastWatchedAt}
            </span>
            <span>•</span>
            <span className="font-mono text-foreground/80">
              {Math.floor(item.watchedSeconds / 60)}m / {Math.floor(item.durationSeconds / 60)}m
            </span>
          </div>

          <div className="w-full max-w-md mt-2">
            <Progress value={item.progressPercent} className="h-1.5 bg-muted" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
        <Link
          href={`/anime/${item.animeSlug}/${item.episodeNumber}`}
          className="px-3 py-1.5 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground text-xs font-semibold transition-colors flex items-center gap-1.5"
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
