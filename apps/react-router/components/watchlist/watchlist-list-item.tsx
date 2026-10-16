"use client";

import { Link } from "react-router";
import { Play, Star, Trash2 } from "lucide-react";
import { Button } from "@shionstream/ui/components/button";
import { getImageStyle } from "@/lib/utils";
import type { WatchlistItem } from "@/types/user";

interface WatchlistListItemProps {
  item: WatchlistItem;
  onToggleFavorite: (id: string) => void;
  onRemove: (id: string) => void;
}

export function WatchlistListItem({ item, onToggleFavorite, onRemove }: WatchlistListItemProps) {
  const isGradient = item.anime.coverImage && item.anime.coverImage.startsWith("linear-gradient");

  return (
    <div className="border-border/60 bg-card hover:border-primary/40 flex items-center justify-between gap-4 rounded-xl border p-3 shadow-xs transition-colors">
      <div className="flex min-w-0 items-center gap-3">
        <div className="bg-muted relative size-14 shrink-0 overflow-hidden rounded-lg">
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
        </div>
        <div className="flex min-w-0 flex-col">
          <Link
            to={`/anime/${item.anime.slug}`}
            className="text-foreground hover:text-primary truncate text-sm font-bold transition-colors"
          >
            {item.anime.title}
          </Link>
          <div className="text-muted-foreground mt-0.5 flex items-center gap-2 text-xs">
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

      <div className="flex shrink-0 items-center gap-2">
        <button
          onClick={() => onToggleFavorite(item.id)}
          className="rounded-lg p-2 text-amber-500 hover:bg-amber-500/10"
        >
          <Star className={`size-4 ${item.isFavorite ? "fill-amber-500" : ""}`} />
        </button>
        <Link
          to={`/anime/${item.anime.slug}`}
          className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold"
        >
          <Play className="fill-primary-foreground size-3" />
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
