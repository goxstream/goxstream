"use client";

import { Sparkles, Tv, Calendar, Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import type { AnimeItem } from "@/types/anime";

interface HeroMetaProps {
  anime?: AnimeItem | null;
  isLoading?: boolean;
}

export function HeroMeta({ anime, isLoading }: HeroMetaProps) {
  if (isLoading || !anime) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-28 rounded-full" />
          </div>
          <Skeleton className="h-8 w-4/5 max-w-xl rounded-md sm:h-9 lg:h-10" />
          <Skeleton className="h-5 w-1/3 rounded-md" />
        </div>

        <div className="space-y-2 py-1">
          <Skeleton className="h-4 w-full max-w-2xl rounded" />
          <Skeleton className="h-4 w-11/12 rounded" />
          <Skeleton className="h-4 w-3/4 rounded" />
        </div>

        <div className="flex flex-wrap items-center gap-3 py-1">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-4 w-28 rounded" />
          <Skeleton className="h-4 w-24 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Anime Titles & Badges */}
      <div className="space-y-2">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          {anime.isTrending && (
            <Badge
              variant="secondary"
              className="border-primary/30 text-primary gap-1 text-xs font-semibold"
            >
              <Sparkles className="size-3" /> Trending #1
            </Badge>
          )}
          <Badge variant="outline" className="border-border/80 text-xs">
            {anime.studio}
          </Badge>
          <Badge variant="outline" className="border-border/80 text-xs">
            {anime.season} {anime.year}
          </Badge>
        </div>

        <h1 className="text-foreground text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
          {anime.title}
        </h1>

        {anime.japaneseTitle && (
          <p className="text-muted-foreground text-sm font-medium sm:text-base">
            {anime.japaneseTitle}
          </p>
        )}
      </div>

      {/* Synopsis Short Preview */}
      <p className="text-muted-foreground line-clamp-3 max-w-3xl text-sm leading-relaxed">
        {anime.synopsis}
      </p>

      {/* Quick Specs Pill Row */}
      <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-2 py-1 text-xs font-medium">
        <div className="text-foreground flex items-center gap-1.5">
          <Tv className="text-primary size-4" />
          <span>
            {anime.episodesCount} Episode{anime.episodesCount > 1 ? "s" : ""}
          </span>
        </div>
        <span className="text-border">•</span>
        <div className="text-foreground flex items-center gap-1.5">
          <Calendar className="text-primary size-4" />
          <span>
            {anime.season} {anime.year}
          </span>
        </div>
        <span className="text-border">•</span>
        <div className="text-foreground flex items-center gap-1.5">
          <Star className="size-4 fill-amber-500 text-amber-500" />
          <span>{anime.rating ? anime.rating.toFixed(2) : "N/A"} Score</span>
        </div>
      </div>
    </div>
  );
}
