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
  const progressPercent = Math.min(
    100,
    (item.currentEpisode / (item.totalEpisodes || 1)) * 100
  );

  return (
    <div className="group rounded-xl border border-border/60 bg-card overflow-hidden hover:border-primary/40 transition-all flex flex-col justify-between shadow-xs">
      <div
        className="relative h-44 w-full overflow-hidden"
        style={{ background: item.anime.coverImage }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-card via-black/30 to-black/10" />

        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
          <Badge
            variant="secondary"
            className="capitalize text-[10px] px-2 py-0.5 font-bold bg-background/80 backdrop-blur-md border border-border/50 text-foreground"
          >
            {item.status.replace("_", " ")}
          </Badge>
        </div>

        <button
          onClick={() => onToggleFavorite(item.id)}
          className="absolute top-2.5 right-2.5 size-7 rounded-lg bg-background/80 backdrop-blur-md border border-border/50 flex items-center justify-center text-amber-500 hover:scale-110 transition-transform z-10"
        >
          <Star className={`size-3.5 ${item.isFavorite ? "fill-amber-500" : ""}`} />
        </button>

        <Link
          href={`/anime/${item.anime.slug}`}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 backdrop-blur-xs transition-opacity z-0"
        >
          <div className="size-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg transform group-hover:scale-105 transition-transform">
            <Play className="size-5 fill-primary-foreground ml-0.5" />
          </div>
        </Link>
      </div>

      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <Link
            href={`/anime/${item.anime.slug}`}
            className="font-bold text-sm text-foreground hover:text-primary transition-colors line-clamp-1 block"
          >
            {item.anime.title}
          </Link>
          <span className="text-[11px] text-muted-foreground block mt-0.5">
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
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs mt-auto">
          <DropdownMenu>
            <DropdownMenuTrigger render={<button className="flex items-center gap-1 font-medium text-muted-foreground hover:text-foreground text-[11px] px-2 py-1 rounded-md hover:bg-muted/60" />}>
              <span className="capitalize">{item.status.replace("_", " ")}</span>
              <ChevronDown className="size-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-36 bg-popover/95 backdrop-blur-md border border-border/80 p-1 text-xs">
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
