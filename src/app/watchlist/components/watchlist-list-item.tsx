"use client";

import Link from "next/link";
import { Play, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { WatchlistItem } from "@/types/user";

interface WatchlistListItemProps {
  item: WatchlistItem;
  onToggleFavorite: (id: string) => void;
  onRemove: (id: string) => void;
}

export function WatchlistListItem({
  item,
  onToggleFavorite,
  onRemove,
}: WatchlistListItemProps) {
  return (
    <div className="p-3 rounded-xl border border-border/60 bg-card hover:border-primary/40 transition-colors flex items-center justify-between gap-4 shadow-xs">
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="size-14 rounded-lg shrink-0 overflow-hidden relative"
          style={{ background: item.anime.coverImage }}
        />
        <div className="flex flex-col min-w-0">
          <Link
            href={`/anime/${item.anime.slug}`}
            className="font-bold text-sm text-foreground hover:text-primary transition-colors truncate"
          >
            {item.anime.title}
          </Link>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
            <span>{item.anime.type}</span>
            <span>•</span>
            <span className="capitalize">{item.status.replace("_", " ")}</span>
            <span>•</span>
            <span className="font-mono">
              Ep. {item.currentEpisode}/{item.totalEpisodes}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => onToggleFavorite(item.id)}
          className="p-2 rounded-lg text-amber-500 hover:bg-amber-500/10"
        >
          <Star className={`size-4 ${item.isFavorite ? "fill-amber-500" : ""}`} />
        </button>
        <Link
          href={`/anime/${item.anime.slug}`}
          className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 flex items-center gap-1.5"
        >
          <Play className="size-3 fill-primary-foreground" />
          Watch
        </Link>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => onRemove(item.id)}
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  );
}
