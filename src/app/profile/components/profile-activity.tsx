"use client";

import Link from "next/link";
import { Play, ArrowRight, Star, History, Bookmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { WatchlistItem, WatchHistoryItem } from "@/types/user";

interface ProfileActivityProps {
  watchlist: WatchlistItem[];
  history: WatchHistoryItem[];
}

export function ProfileActivity({ watchlist, history }: ProfileActivityProps) {
  const favorites = watchlist.filter((w) => w.isFavorite);
  const continueWatching = history.filter((h) => h.progressPercent < 100).slice(0, 3);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Continue Watching Progress */}
      <div className="p-5 rounded-xl border border-border/60 bg-card flex flex-col gap-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="size-4 text-primary" />
            <h3 className="font-semibold text-sm text-foreground">Continue Watching</h3>
          </div>
          <Link
            href="/history"
            className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
          >
            View History <ArrowRight className="size-3" />
          </Link>
        </div>

        {continueWatching.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-xs">
            No active watching sessions. Start streaming an episode!
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {continueWatching.map((item) => (
              <div
                key={item.id}
                className="group p-3 rounded-lg border border-border/50 bg-background/50 hover:bg-muted/40 transition-colors flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="size-12 rounded-lg shrink-0 flex items-center justify-center relative overflow-hidden text-xs font-bold text-white shadow-xs"
                    style={{ background: item.animeCover }}
                  >
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                    <Play className="size-4 fill-white relative z-10 opacity-90 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-medium text-xs text-foreground truncate">
                      {item.animeTitle}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Ep. {item.episodeNumber}: {item.episodeTitle}
                    </span>
                    <div className="flex items-center gap-2 mt-1.5 w-36">
                      <Progress value={item.progressPercent} className="h-1 bg-muted" />
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {item.progressPercent}%
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/anime/${item.animeSlug}/${item.episodeNumber}`}
                  className={buttonVariants({
                    variant: "ghost",
                    size: "icon-sm",
                    className: "rounded-lg text-primary hover:bg-primary/10 shrink-0",
                  })}
                >
                  <Play className="size-4 fill-primary" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Favorite Titles */}
      <div className="p-5 rounded-xl border border-border/60 bg-card flex flex-col gap-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="size-4 text-amber-500 fill-amber-500" />
            <h3 className="font-semibold text-sm text-foreground">Favorite Anime</h3>
          </div>
          <Link
            href="/watchlist"
            className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
          >
            Full Watchlist <ArrowRight className="size-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {favorites.slice(0, 3).map((item) => (
            <Link
              key={item.id}
              href={`/anime/${item.anime.slug}`}
              className="group flex flex-col gap-1.5 p-2 rounded-lg border border-border/40 hover:border-primary/50 bg-background/50 hover:bg-muted/40 transition-all"
            >
              <div
                className="h-28 w-full rounded-md relative overflow-hidden flex items-end p-2 text-white shadow-xs"
                style={{ background: item.anime.coverImage }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <Badge variant="secondary" className="relative z-10 text-[9px] px-1 py-0 h-4 bg-amber-500/20 text-amber-300 border-amber-500/30 gap-0.5">
                  <Star className="size-2.5 fill-amber-400" />
                  {item.anime.rating}
                </Badge>
              </div>
              <span className="font-semibold text-xs text-foreground truncate group-hover:text-primary transition-colors">
                {item.anime.title}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {item.anime.genres.slice(0, 2).join(" • ")}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
