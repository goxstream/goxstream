"use client";

import Link from "next/link";
import { Crown, Star, Eye, ArrowUp, ArrowDown, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, getImageStyle } from "@/lib/utils";
import type { TrendingAnimeItem, TrendingPeriod } from "@/types/anime";

interface TrendingItemCardProps {
  anime: TrendingAnimeItem;
  period: TrendingPeriod;
  viewMode: "list" | "grid";
}

export function TrendingItemCard({
  anime,
  period,
  viewMode,
}: TrendingItemCardProps) {
  // Primary Genre Tag (Featured Genre)
  const primaryGenre = anime.genres[0] || "Anime";
  const secondaryGenres = anime.genres.slice(1);

  // Compute views label based on active period
  const viewsDisplay =
    period === "weekly"
      ? `${(anime.weeklyViews / 1000000).toFixed(2)}M weekly`
      : period === "monthly"
      ? `${(anime.monthlyViews / 1000000).toFixed(2)}M monthly`
      : `${(anime.totalViews / 1000000).toFixed(1)}M total`;

  // Compute Rank Styling
  const getRankBadgeStyle = (rank: number) => {
    if (rank === 1) {
      return "bg-amber-500 text-amber-950 border-amber-400 font-black shadow-xs";
    }
    if (rank === 2) {
      return "bg-slate-300 dark:bg-slate-300 text-slate-900 border-slate-200 font-bold shadow-xs";
    }
    if (rank === 3) {
      return "bg-amber-700 dark:bg-amber-800 text-amber-100 border-amber-600 font-bold shadow-xs";
    }
    return "bg-muted text-foreground border-border/80 font-semibold";
  };

  // Compute Rank Movement Indicator
  const renderRankChange = () => {
    if (anime.weeklyGrowth === "NEW") {
      return (
        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary/15 text-primary">
          NEW
        </span>
      );
    }

    if (!anime.previousRank) return null;

    const diff = anime.previousRank - anime.rank;
    if (diff > 0) {
      return (
        <span className="flex items-center text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
          <ArrowUp className="size-3" />
          {diff}
        </span>
      );
    }
    if (diff < 0) {
      return (
        <span className="flex items-center text-[11px] font-bold text-rose-600 dark:text-rose-400">
          <ArrowDown className="size-3" />
          {Math.abs(diff)}
        </span>
      );
    }
    return (
      <span className="text-[11px] font-medium text-muted-foreground">
        -
      </span>
    );
  };

  if (viewMode === "grid") {
    return (
      <div className="group relative bg-card border border-border/60 rounded-xl overflow-hidden shadow-xs hover:border-primary/50 transition-all flex flex-col justify-between">
        {/* Cover Image Container */}
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-muted">
          <div
            className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
            style={getImageStyle(anime.coverImage)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

          {/* Floating Rank Badge */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
            <div
              className={cn(
                "size-8 rounded-lg flex items-center justify-center text-sm border shadow-xs",
                getRankBadgeStyle(anime.rank)
              )}
            >
              {anime.rank === 1 ? <Crown className="size-4" /> : `#${anime.rank}`}
            </div>
            {renderRankChange()}
          </div>

          {/* Sub / Dub tag */}
          <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[10px] font-bold text-white uppercase">
            {anime.subOrDub}
          </div>

          {/* Bottom Card Title Overlay */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary text-primary-foreground">
              {primaryGenre}
            </span>
            <h3 className="font-bold text-sm line-clamp-1 mt-1 text-white group-hover:text-primary transition-colors">
              {anime.title}
            </h3>
          </div>
        </div>

        {/* Card Footer Details */}
        <div className="p-3 space-y-2 text-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="font-medium truncate">{anime.studio}</span>
            <div className="flex items-center gap-1 font-bold text-amber-500">
              <Star className="size-3.5 fill-amber-500 stroke-amber-500" />
              <span>{anime.rating ? anime.rating.toFixed(2) : "N/A"}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-border/40 text-muted-foreground">
            <span>{viewsDisplay}</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {anime.weeklyGrowth}
            </span>
          </div>

          <Button
            nativeButton={false}
            render={
              <Link href={`/anime/${anime.slug}`}>
                <Play className="size-3.5 mr-1.5 fill-current" />
                Watch Now
              </Link>
            }
            size="sm"
            className="w-full rounded-lg font-semibold text-xs h-8"
          />
        </div>
      </div>
    );
  }

  // List View Layout
  return (
    <div
      className={cn(
        "group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border transition-all bg-card/60 hover:bg-card shadow-xs",
        anime.rank === 1
          ? "border-amber-500/40 bg-gradient-to-r from-amber-950/20 via-card to-card"
          : "border-border/60 hover:border-primary/40"
      )}
    >
      {/* Left: Rank + Poster + Primary Metadata */}
      <div className="flex items-center gap-4 w-full sm:w-auto">
        {/* Rank Number & Movement */}
        <div className="flex flex-col items-center justify-center min-w-10 text-center gap-1">
          <div
            className={cn(
              "size-9 rounded-xl flex items-center justify-center text-sm border shadow-xs",
              getRankBadgeStyle(anime.rank)
            )}
          >
            {anime.rank === 1 ? <Crown className="size-4" /> : `#${anime.rank}`}
          </div>
          {renderRankChange()}
        </div>

        {/* Thumbnail Poster */}
        <Link
          href={`/anime/${anime.slug}`}
          className="relative size-16 sm:size-20 rounded-lg overflow-hidden shrink-0 border border-border/60 shadow-xs group-hover:scale-105 transition-transform bg-muted"
        >
          <div
            className="absolute inset-0"
            style={getImageStyle(anime.coverImage)}
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
        </Link>

        {/* Anime Information */}
        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {/* Primary/Featured Genre Tag */}
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-primary/10 text-primary uppercase tracking-wide">
              {primaryGenre}
            </span>

            {/* Additional Secondary Genres */}
            {secondaryGenres.slice(0, 2).map((g) => (
              <span
                key={g}
                className="hidden md:inline-block text-[11px] text-muted-foreground font-medium"
              >
                • {g}
              </span>
            ))}
          </div>

          <Link href={`/anime/${anime.slug}`}>
            <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors truncate">
              {anime.title}
            </h3>
          </Link>

          <p className="text-xs text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span>{anime.studio}</span>
            <span>•</span>
            <span>{anime.type}</span>
            <span>•</span>
            <span>{anime.episodesCount} Episodes</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">{anime.status}</span>
          </p>
        </div>
      </div>

      {/* Right: Metrics & CTA Action Button */}
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-border/40">
        {/* Rating & View Count Stats */}
        <div className="flex items-center gap-5 text-xs">
          <div className="flex items-center gap-1 font-bold text-amber-500">
            <Star className="size-4 fill-amber-500 stroke-amber-500" />
            <span className="text-sm">{anime.rating ? anime.rating.toFixed(2) : "N/A"}</span>
          </div>

          <div className="flex flex-col text-right">
            <div className="flex items-center gap-1 font-semibold text-foreground">
              <Eye className="size-3.5 text-primary" />
              <span>{viewsDisplay}</span>
            </div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              {anime.weeklyGrowth} growth
            </span>
          </div>
        </div>

        {/* Action Button */}
        <Button
          nativeButton={false}
          render={
            <Link href={`/anime/${anime.slug}/${anime.latestEpisode || 1}`}>
              <Play className="size-3.5 mr-1.5 fill-current" />
              Watch
            </Link>
          }
          size="sm"
          className="rounded-lg font-bold text-xs shadow-xs"
        />
      </div>
    </div>
  );
}
