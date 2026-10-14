import { useState } from "react";
import { Link } from "react-router";
import { Crown, Star, Eye, ArrowUp, ArrowDown, Play } from "lucide-react";
import { Button } from "@goxstream/ui/components/button";
import { cn, getImageStyle } from "@/lib/utils";
import type { TrendingAnimeItem, TrendingPeriod } from "@/types/anime";

interface TrendingItemCardProps {
  anime: TrendingAnimeItem;
  period: TrendingPeriod;
  viewMode: "list" | "grid";
}

export function TrendingItemCard({ anime, period, viewMode }: TrendingItemCardProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const primaryGenre = anime.genres[0] || "Anime";
  const secondaryGenres = anime.genres.slice(1);
  const isGradient = anime.coverImage && anime.coverImage.startsWith("linear-gradient");

  const viewsDisplay =
    period === "weekly"
      ? `${(anime.weeklyViews / 1000000).toFixed(2)}M weekly`
      : period === "monthly"
        ? `${(anime.monthlyViews / 1000000).toFixed(2)}M monthly`
        : `${(anime.totalViews / 1000000).toFixed(1)}M total`;

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

  const renderRankChange = () => {
    if (anime.weeklyGrowth === "NEW") {
      return (
        <span className="bg-primary/15 text-primary rounded px-1.5 py-0.5 text-[10px] font-bold">
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
    return <span className="text-muted-foreground text-[11px] font-medium">-</span>;
  };

  if (viewMode === "grid") {
    return (
      <div className="group bg-card border-border/60 hover:border-primary/50 relative flex flex-col justify-between overflow-hidden rounded-xl border shadow-xs transition-all">
        {/* Cover Image Container */}
        <div className="bg-muted relative aspect-[2/3] w-full overflow-hidden">
          {isGradient ? (
            <div
              className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
              style={getImageStyle(anime.coverImage)}
            />
          ) : (
            <img
              src={anime.coverImage || ""}
              alt={anime.title}
              loading="lazy"
              decoding="async"
              onLoad={() => setIsImageLoaded(true)}
              className={`absolute inset-0 size-full object-cover transition-all duration-500 group-hover:scale-105 ${
                isImageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onError={(e) => {
                setIsImageLoaded(true);
                (e.target as HTMLImageElement).style.opacity = "0";
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

          {/* Floating Rank Badge */}
          <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5">
            <div
              className={cn(
                "flex size-8 items-center justify-center rounded-lg border text-sm shadow-xs",
                getRankBadgeStyle(anime.rank),
              )}
            >
              {anime.rank === 1 ? <Crown className="size-4" /> : `#${anime.rank}`}
            </div>
            {renderRankChange()}
          </div>

          {/* Sub / Dub tag */}
          <div className="absolute top-2.5 right-2.5 z-10 rounded bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white uppercase backdrop-blur-xs">
            {anime.subOrDub}
          </div>

          {/* Bottom Card Title Overlay */}
          <div className="absolute right-2.5 bottom-2.5 left-2.5 z-10 text-white">
            <span className="bg-primary text-primary-foreground rounded px-2 py-0.5 text-[10px] font-bold">
              {primaryGenre}
            </span>
            <h3 className="group-hover:text-primary mt-1 line-clamp-1 text-sm font-bold text-white transition-colors">
              {anime.title}
            </h3>
          </div>
        </div>

        {/* Card Footer Details */}
        <div className="space-y-2 p-3 text-xs">
          <div className="text-muted-foreground flex items-center justify-between">
            <span className="truncate font-medium">{anime.studio}</span>
            <div className="flex items-center gap-1 font-bold text-amber-500">
              <Star className="size-3.5 fill-amber-500 stroke-amber-500" />
              <span>{anime.rating ? anime.rating.toFixed(2) : "N/A"}</span>
            </div>
          </div>

          <div className="border-border/40 text-muted-foreground flex items-center justify-between border-t pt-1 text-[11px]">
            <span>{viewsDisplay}</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {anime.weeklyGrowth}
            </span>
          </div>

          <Button asChild size="sm" className="h-8 w-full rounded-lg text-xs font-semibold">
            <Link to={`/anime/${anime.slug}`}>
              <Play className="mr-1.5 size-3.5 fill-current" />
              Watch Now
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // List View Layout
  return (
    <div
      className={cn(
        "group bg-card/60 hover:bg-card relative flex flex-col items-start justify-between gap-4 rounded-xl border p-4 shadow-xs transition-all sm:flex-row sm:items-center",
        anime.rank === 1
          ? "via-card to-card border-amber-500/40 bg-gradient-to-r from-amber-950/20"
          : "border-border/60 hover:border-primary/40",
      )}
    >
      {/* Left: Rank + Poster + Primary Metadata */}
      <div className="flex w-full items-center gap-4 sm:w-auto">
        {/* Rank Number & Movement */}
        <div className="flex min-w-10 flex-col items-center justify-center gap-1 text-center">
          <div
            className={cn(
              "flex size-9 items-center justify-center rounded-xl border text-sm shadow-xs",
              getRankBadgeStyle(anime.rank),
            )}
          >
            {anime.rank === 1 ? <Crown className="size-4" /> : `#${anime.rank}`}
          </div>
          {renderRankChange()}
        </div>

        {/* Thumbnail Poster */}
        <Link
          to={`/anime/${anime.slug}`}
          className="border-border/60 bg-muted relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border shadow-xs transition-transform group-hover:scale-105 sm:size-20"
        >
          {isGradient ? (
            <div className="absolute inset-0" style={getImageStyle(anime.coverImage)} />
          ) : (
            <img
              src={anime.coverImage || ""}
              alt={anime.title}
              loading="lazy"
              decoding="async"
              onLoad={() => setIsImageLoaded(true)}
              className={`absolute inset-0 size-full object-cover transition-opacity duration-300 ${
                isImageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onError={(e) => {
                setIsImageLoaded(true);
                (e.target as HTMLImageElement).style.opacity = "0";
              }}
            />
          )}
          <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-transparent" />
        </Link>

        {/* Anime Information */}
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            {/* Primary/Featured Genre Tag */}
            <span className="bg-primary/10 text-primary rounded px-2 py-0.5 text-[10px] font-extrabold tracking-wide uppercase">
              {primaryGenre}
            </span>

            {/* Additional Secondary Genres */}
            {secondaryGenres.slice(0, 2).map((g) => (
              <span
                key={g}
                className="text-muted-foreground hidden text-[11px] font-medium md:inline-block"
              >
                • {g}
              </span>
            ))}
          </div>

          <Link to={`/anime/${anime.slug}`}>
            <h3 className="text-foreground group-hover:text-primary truncate text-base font-bold transition-colors">
              {anime.title}
            </h3>
          </Link>

          <p className="text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs">
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
      <div className="border-border/40 flex w-full items-center justify-between gap-6 border-t pt-3 sm:w-auto sm:justify-end sm:border-t-0 sm:pt-0">
        {/* Rating & View Count Stats */}
        <div className="flex items-center gap-5 text-xs">
          <div className="flex items-center gap-1 font-bold text-amber-500">
            <Star className="size-4 fill-amber-500 stroke-amber-500" />
            <span className="text-sm">{anime.rating ? anime.rating.toFixed(2) : "N/A"}</span>
          </div>

          <div className="flex flex-col text-right">
            <div className="text-foreground flex items-center gap-1 font-semibold">
              <Eye className="text-primary size-3.5" />
              <span>{viewsDisplay}</span>
            </div>
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              {anime.weeklyGrowth} growth
            </span>
          </div>
        </div>

        {/* Action Button */}
        <Button asChild size="sm" className="rounded-lg text-xs font-bold shadow-xs">
          <Link to={`/anime/${anime.slug}/${anime.latestEpisode || 1}`}>
            <Play className="mr-1.5 size-3.5 fill-current" />
            Watch
          </Link>
        </Button>
      </div>
    </div>
  );
}
