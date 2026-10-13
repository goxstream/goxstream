"use client";

import Link from "next/link";
import { Play, Star, Trash2, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getImageStyle } from "@/lib/utils";
import type { WatchlistItem, WatchlistStatus } from "@/types/user";

interface WatchlistGridItemProps {
  item: WatchlistItem;
  onStatusChange: (id: string, newStatus: WatchlistStatus) => void;
  onToggleFavorite: (id: string) => void;
  onRemove: (id: string) => void;
}

export function WatchlistGridItem({
  item,
  onStatusChange,
  onToggleFavorite,
  onRemove,
}: WatchlistGridItemProps) {
  const progressPercent = Math.min(100, (item.currentEpisode / (item.totalEpisodes || 1)) * 100);
  const isGradient = item.anime.coverImage && item.anime.coverImage.startsWith("linear-gradient");

  return (
    <div className="group border-border/60 bg-card hover:border-primary/40 flex flex-col justify-between overflow-hidden rounded-xl border shadow-xs transition-all">
      <div className="bg-muted relative h-44 w-full overflow-hidden">
        {isGradient ? (
          <div
            className="absolute inset-0 size-full"
            style={getImageStyle(item.anime.coverImage)}
          />
        ) : (
          <img
            src={item.anime.coverImage || ""}
            alt={item.anime.title}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 size-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.opacity = "0";
            }}
          />
        )}
        <div className="from-card absolute inset-0 z-0 bg-gradient-to-t via-black/30 to-black/10" />

        <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5">
          <Badge
            variant="secondary"
            className="bg-background/80 border-border/50 text-foreground border px-2 py-0.5 text-[10px] font-bold capitalize backdrop-blur-md"
          >
            {item.status.replace("_", " ")}
          </Badge>
        </div>

        <button
          onClick={() => onToggleFavorite(item.id)}
          className="bg-background/80 border-border/50 absolute top-2.5 right-2.5 z-10 flex size-7 items-center justify-center rounded-lg border text-amber-500 backdrop-blur-md transition-transform hover:scale-110"
        >
          <Star className={`size-3.5 ${item.isFavorite ? "fill-amber-500" : ""}`} />
        </button>

        <Link
          href={`/anime/${item.anime.slug}`}
          className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-xs transition-opacity group-hover:opacity-100"
        >
          <div className="bg-primary text-primary-foreground flex size-12 transform items-center justify-center rounded-full shadow-lg transition-transform group-hover:scale-105">
            <Play className="fill-primary-foreground ml-0.5 size-5" />
          </div>
        </Link>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <Link
            href={`/anime/${item.anime.slug}`}
            className="text-foreground hover:text-primary line-clamp-1 block text-sm font-bold transition-colors"
          >
            {item.anime.title}
          </Link>
          <span className="text-muted-foreground mt-0.5 block text-[11px]">
            {item.anime.genres.slice(0, 3).join(" • ")}
          </span>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-[11px] font-medium">
            <span className="text-muted-foreground">Progress</span>
            <span className="text-foreground font-mono">
              Ep. {item.currentEpisode} / {item.totalEpisodes}
            </span>
          </div>
          <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
            <div
              className="bg-primary h-full rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="border-border/40 mt-auto flex items-center justify-between border-t pt-2 text-xs">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-muted-foreground hover:text-foreground hover:bg-muted/60 flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium">
                <span className="capitalize">{item.status.replace("_", " ")}</span>
                <ChevronDown className="size-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-popover/95 border-border/80 w-36 border p-1 text-xs backdrop-blur-md">
              <DropdownMenuItem onClick={() => onStatusChange(item.id, "watching")}>
                Watching
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange(item.id, "plan_to_watch")}>
                Plan to Watch
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange(item.id, "completed")}>
                Completed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange(item.id, "on_hold")}>
                On Hold
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange(item.id, "dropped")}>
                Dropped
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onRemove(item.id)}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
