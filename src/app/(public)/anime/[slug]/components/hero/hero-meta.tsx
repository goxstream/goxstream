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
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-28 rounded-full" />
          </div>
          <Skeleton className="h-8 sm:h-9 lg:h-10 w-4/5 max-w-xl rounded-md" />
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
        <div className="flex flex-wrap items-center gap-2 mb-1">
          {anime.isTrending && (
            <Badge variant="secondary" className="gap-1 border-primary/30 text-primary text-xs font-semibold">
              <Sparkles className="size-3" /> Trending #1
            </Badge>
          )}
          <Badge variant="outline" className="text-xs border-border/80">
            {anime.studio}
          </Badge>
          <Badge variant="outline" className="text-xs border-border/80">
            {anime.season} {anime.year}
          </Badge>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
          {anime.title}
        </h1>

        {anime.japaneseTitle && (
          <p className="text-sm sm:text-base text-muted-foreground font-medium">
            {anime.japaneseTitle}
          </p>
        )}
      </div>

      {/* Synopsis Short Preview */}
      <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed max-w-3xl">
        {anime.synopsis}
      </p>

      {/* Quick Specs Pill Row */}
      <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-muted-foreground font-medium py-1">
        <div className="flex items-center gap-1.5 text-foreground">
          <Tv className="size-4 text-primary" />
          <span>{anime.episodesCount} Episode{anime.episodesCount > 1 ? "s" : ""}</span>
        </div>
        <span className="text-border">•</span>
        <div className="flex items-center gap-1.5 text-foreground">
          <Calendar className="size-4 text-primary" />
          <span>{anime.season} {anime.year}</span>
        </div>
        <span className="text-border">•</span>
        <div className="flex items-center gap-1.5 text-foreground">
          <Star className="size-4 text-amber-500 fill-amber-500" />
          <span>{anime.rating ? anime.rating.toFixed(2) : "N/A"} Score</span>
        </div>
      </div>
    </div>
  );
}
