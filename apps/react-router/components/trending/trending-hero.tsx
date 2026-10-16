import { Link } from "react-router";
import { Crown, Play, Star, Flame, Eye, TrendingUp, Sparkles } from "lucide-react";
import { Skeleton } from "@shionstream/ui/components/skeleton";
import { Button } from "@shionstream/ui/components/button";
import { getImageStyle } from "@/lib/utils";
import type { TrendingAnimeItem } from "@/types/anime";

interface TrendingHeroProps {
  topAnime?: TrendingAnimeItem | null;
  isLoading?: boolean;
}

export function TrendingHero({ topAnime, isLoading }: TrendingHeroProps) {
  if (isLoading) {
    return <Skeleton className="aspect-[21/9] w-full rounded-2xl sm:aspect-[25/8]" />;
  }

  if (!topAnime) return null;

  // Use primary genre as featured tag
  const primaryGenre = topAnime.genres[0] || "Featured";
  const isGradient = topAnime.coverImage && topAnime.coverImage.startsWith("linear-gradient");

  return (
    <div className="via-background to-background relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/40 p-6 shadow-xs md:p-8 lg:p-10">
      {/* Background Gradient Accent Glow */}
      <div className="pointer-events-none absolute -top-20 -right-20 size-96 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="bg-primary/10 pointer-events-none absolute -bottom-20 -left-20 size-80 rounded-full blur-3xl" />

      <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
        {/* Left Column: Info & Actions */}
        <div className="space-y-5 lg:col-span-8">
          {/* Top Badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-amber-950 shadow-xs">
              <Crown className="size-3.5 fill-amber-950 stroke-amber-950" />
              #1 TRENDING NOW
            </span>

            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="size-3" />
              {topAnime.weeklyGrowth} Views
            </span>

            <span className="bg-secondary text-secondary-foreground rounded-full px-2.5 py-1 text-xs font-medium">
              {primaryGenre}
            </span>

            <span className="text-muted-foreground text-xs font-medium">
              {topAnime.type} • {topAnime.season} {topAnime.year}
            </span>
          </div>

          {/* Title */}
          <div className="space-y-1">
            <h1 className="text-foreground text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">
              {topAnime.title}
            </h1>
            {topAnime.japaneseTitle && (
              <p className="text-muted-foreground text-sm font-medium">{topAnime.japaneseTitle}</p>
            )}
          </div>

          {/* Synopsis */}
          <p className="text-muted-foreground line-clamp-3 max-w-3xl text-sm leading-relaxed sm:text-base">
            {topAnime.synopsis}
          </p>

          {/* Stats Bar */}
          <div className="border-border/60 flex flex-wrap items-center gap-6 border-t pt-1 text-sm">
            <div className="flex items-center gap-1.5 font-bold text-amber-500">
              <Star className="size-4 fill-amber-500 stroke-amber-500" />
              <span>{topAnime.rating ? topAnime.rating.toFixed(2) : "N/A"}</span>
            </div>

            {topAnime.weeklyViews != null && (
              <div className="text-muted-foreground flex items-center gap-1.5">
                <Eye className="text-primary size-4" />
                <span className="text-foreground font-semibold">
                  {(topAnime.weeklyViews / 1000000).toFixed(2)}M
                </span>
                <span>weekly views</span>
              </div>
            )}

            <div className="text-muted-foreground flex items-center gap-1.5">
              <Flame className="size-4 text-orange-500" />
              <span className="text-foreground font-semibold">
                Ep {topAnime.latestEpisode || topAnime.episodesCount}
              </span>
              <span>/ {topAnime.episodesCount}</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              asChild
              size="lg"
              className="rounded-xl bg-amber-500 font-bold text-amber-950 shadow-xs hover:bg-amber-600"
            >
              <Link to={`/anime/${topAnime.slug}/${topAnime.latestEpisode || 1}`}>
                <Play className="mr-2 size-4 fill-current" />
                Watch Episode {topAnime.latestEpisode || 1}
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-border/80 rounded-xl font-medium"
            >
              <Link to={`/anime/${topAnime.slug}`}>
                <Sparkles className="mr-2 size-4 text-amber-500" />
                View Details
              </Link>
            </Button>
          </div>
        </div>

        {/* Right Column: Visual Poster Card */}
        <div className="flex justify-center lg:col-span-4 lg:justify-end">
          <div className="group bg-muted relative aspect-[2/3] w-48 overflow-hidden rounded-xl border border-amber-500/30 shadow-sm sm:w-56 md:w-64">
            {isGradient ? (
              <div
                className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                style={getImageStyle(topAnime.coverImage)}
              />
            ) : (
              <img
                src={topAnime.coverImage || ""}
                alt={topAnime.title}
                loading="eager"
                decoding="async"
                className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.opacity = "0";
                }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Rank Badge Floating on Poster */}
            <div className="absolute top-3 left-3 flex size-10 items-center justify-center rounded-xl border border-amber-400 bg-amber-500 text-lg font-black text-amber-950 shadow-xs">
              #1
            </div>

            {/* Sub/Dub Tag */}
            <div className="absolute top-3 right-3 rounded-md bg-black/60 px-2.5 py-1 text-[10px] font-bold tracking-wider text-white uppercase backdrop-blur-xs">
              {topAnime.subOrDub}
            </div>

            {/* Poster Footer Info */}
            <div className="absolute right-3 bottom-3 left-3 space-y-0.5 text-xs text-white">
              <p className="truncate font-semibold">{topAnime.studio}</p>
              <p className="text-[11px] text-zinc-300">
                {topAnime.episodesCount} Episodes • {topAnime.status}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
