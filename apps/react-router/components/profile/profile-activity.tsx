"use client";

import { Link } from "react-router";
import { Play, ArrowRight, Star, History } from "lucide-react";
import { Badge } from "@goxstream/ui/components/badge";
import { buttonVariants } from "@goxstream/ui/components/button";
import { Progress } from "@goxstream/ui/components/progress";
import { getImageStyle } from "@/lib/utils";
import { Skeleton } from "@goxstream/ui/components/skeleton";
import type { WatchlistItem, WatchHistoryItem } from "@/types/user";

interface ProfileActivityProps {
  watchlist?: WatchlistItem[];
  history?: WatchHistoryItem[];
  isLoading?: boolean;
}

export function ProfileActivity({ watchlist, history, isLoading }: ProfileActivityProps) {
  if (isLoading || !watchlist || !history) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="border-border/60 bg-card flex flex-col gap-4 rounded-xl border p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between gap-3">
                <Skeleton className="size-12 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3.5 w-1/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="border-border/60 bg-card flex flex-col gap-4 rounded-xl border p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-28 w-full rounded-md" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const favorites = watchlist.filter((w) => w.isFavorite);
  const continueWatching = history.filter((h) => h.progressPercent < 100).slice(0, 3);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Continue Watching */}
      <div className="border-border/60 bg-card flex flex-col gap-4 rounded-xl border p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="text-primary size-4" />
            <h3 className="text-foreground text-sm font-semibold">Continue Watching</h3>
          </div>
          <Link
            to="/history"
            className="text-primary flex items-center gap-1 text-xs font-medium hover:underline"
          >
            View History <ArrowRight className="size-3" />
          </Link>
        </div>

        {continueWatching.length === 0 ? (
          <div className="text-muted-foreground py-8 text-center text-xs">
            No active watching sessions. Start streaming an episode!
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {continueWatching.map((item) => {
              const isGradient = item.animeCover && item.animeCover.startsWith("linear-gradient");

              return (
                <div
                  key={item.id}
                  className="group border-border/50 bg-background/50 hover:bg-muted/40 flex items-center justify-between gap-3 rounded-lg border p-3 transition-colors"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="bg-muted relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg text-xs font-bold text-white shadow-xs">
                      {isGradient ? (
                        <div
                          className="absolute inset-0 size-full"
                          style={getImageStyle(item.animeCover)}
                        />
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
                      <Play className="relative z-20 size-4 fill-white opacity-90 transition-transform group-hover:scale-110" />
                    </div>
                    <div className="flex min-w-0 flex-col">
                      <span className="text-foreground truncate text-xs font-medium">
                        {item.animeTitle}
                      </span>
                      <span className="text-muted-foreground text-[11px]">
                        Ep. {item.episodeNumber}: {item.episodeTitle}
                      </span>
                      <div className="mt-1.5 flex w-36 items-center gap-2">
                        <Progress value={item.progressPercent} className="bg-muted h-1" />
                        <span className="text-muted-foreground font-mono text-[10px]">
                          {item.progressPercent}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link
                    to={`/anime/${item.animeSlug}/${item.episodeNumber}`}
                    className={buttonVariants({
                      variant: "ghost",
                      size: "icon-sm",
                      className: "text-primary hover:bg-primary/10 shrink-0 rounded-lg",
                    })}
                  >
                    <Play className="fill-primary size-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Favorite Titles */}
      <div className="border-border/60 bg-card flex flex-col gap-4 rounded-xl border p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="size-4 fill-amber-500 text-amber-500" />
            <h3 className="text-foreground text-sm font-semibold">Favorite Anime</h3>
          </div>
          <Link
            to="/watchlist"
            className="text-primary flex items-center gap-1 text-xs font-medium hover:underline"
          >
            Full Watchlist <ArrowRight className="size-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {favorites.slice(0, 3).map((item) => {
            const isGradient =
              item.anime.coverImage && item.anime.coverImage.startsWith("linear-gradient");

            return (
              <Link
                key={item.id}
                to={`/anime/${item.anime.slug}`}
                className="group border-border/40 hover:border-primary/50 bg-background/50 hover:bg-muted/40 flex flex-col gap-1.5 rounded-lg border p-2 transition-all"
              >
                <div className="bg-muted relative flex h-28 w-full items-end overflow-hidden rounded-md p-2 text-white shadow-xs">
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
                  <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <Badge
                    variant="secondary"
                    className="relative z-20 h-4 gap-0.5 border-amber-500/30 bg-amber-500/20 px-1 py-0 text-[9px] text-amber-300"
                  >
                    <Star className="size-2.5 fill-amber-400" />
                    {item.anime.rating ? item.anime.rating.toFixed(1) : "N/A"}
                  </Badge>
                </div>
                <span className="text-foreground group-hover:text-primary truncate text-xs font-semibold transition-colors">
                  {item.anime.title}
                </span>
                <span className="text-muted-foreground text-[10px]">
                  {item.anime.genres.slice(0, 2).join(" • ")}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
