"use client";

import { useState } from "react";
import Link from "next/link";
import { Play, Star, Tv } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { VercelSpinner } from "@/components/vercel-spinner";
import { getImageStyle } from "@/lib/utils";
import type { AnimeItem } from "@/types/anime";

interface AnimeCardProps {
  anime?: AnimeItem;
  isLoading?: boolean;
  priority?: boolean;
  variant?: "grid" | "list";
}

export function AnimeCard({ anime, isLoading, variant = "grid" }: AnimeCardProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  if (isLoading || !anime) {
    if (variant === "list") {
      return (
        <Card className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-card border border-border/70">
          <div className="flex items-center gap-4 flex-1 w-full">
            <Skeleton className="size-16 sm:size-20 rounded-lg shrink-0" />
            <div className="space-y-2 flex-1 min-w-0">
              <Skeleton className="h-5 w-2/3 rounded" />
              <Skeleton className="h-3 w-1/3 rounded" />
              <Skeleton className="h-3 w-1/2 rounded" />
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Skeleton className="h-4 w-20 rounded" />
            <Skeleton className="h-4 w-12 rounded" />
          </div>
        </Card>
      );
    }

    return (
      <Card className="flex flex-col rounded-xl overflow-hidden bg-card border border-border/80 p-0 gap-0">
        <Skeleton className="aspect-[3/4] w-full rounded-none" />
        <div className="p-3.5 flex flex-col gap-2 bg-card">
          <Skeleton className="h-4 w-4/5 rounded" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-1/2 rounded" />
            <Skeleton className="h-3 w-1/4 rounded" />
          </div>
        </div>
      </Card>
    );
  }

  const isGradient = anime.coverImage && anime.coverImage.startsWith("linear-gradient");

  if (variant === "list") {
    return (
      <Link
        href={`/anime/${anime.slug}`}
        className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-card border border-border/70 hover:border-primary/60 transition-all duration-200"
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Thumbnail Artwork Area with VercelSpinner Overlay */}
          <div className="relative size-16 sm:size-20 rounded-lg shrink-0 overflow-hidden bg-muted flex items-center justify-center">
            {!isGradient && !isImageLoaded && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-xs transition-opacity duration-300">
                <VercelSpinner size="sm" />
              </div>
            )}

            {isGradient ? (
              <div
                className="absolute inset-0 size-full"
                style={getImageStyle(anime.coverImage)}
              />
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
                  const target = e.target as HTMLImageElement;
                  target.style.opacity = "0";
                }}
              />
            )}
            <Play className="relative size-6 text-white/80 fill-white/80 group-hover:scale-110 transition-transform z-10" />
          </div>

          {/* Info */}
          <div className="space-y-1 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-base text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                {anime.title}
              </h3>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                {anime.type}
              </Badge>
            </div>
            {anime.japaneseTitle && (
              <p className="text-xs text-muted-foreground/80 line-clamp-1">
                {anime.japaneseTitle}
              </p>
            )}
            <p className="text-xs text-muted-foreground line-clamp-1">
              {anime.genres.join(" • ")}
            </p>
          </div>
        </div>

        {/* Stats & Actions */}
        <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto text-xs text-muted-foreground border-t sm:border-t-0 border-border/40 pt-2 sm:pt-0">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-semibold text-amber-500">
              <Star className="size-3.5 fill-amber-500 stroke-amber-500" />
              {anime.rating ? anime.rating.toFixed(1) : "N/A"}
            </span>
            <span>{anime.year}</span>
            <span className="flex items-center gap-1">
              <Tv className="size-3.5" />
              {anime.episodesCount} Eps
            </span>
          </div>
          <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-semibold">
            {anime.status}
          </Badge>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/anime/${anime.slug}`}
      className="group flex flex-col rounded-xl overflow-hidden bg-card border border-border/80 hover:border-primary/60 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {/* Poster Artwork Area */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
        {/* Vercel Spinner Overlay while image loads */}
        {!isGradient && !isImageLoaded && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-xs transition-opacity duration-300">
            <VercelSpinner size="md" />
          </div>
        )}

        {/* Poster Artwork / Gradient Fallback */}
        {isGradient ? (
          <div
            className="absolute inset-0 size-full transition-transform duration-500 group-hover:scale-105"
            style={getImageStyle(anime.coverImage)}
          />
        ) : (
          /* Native <img> Tag with Lazy Loading & Fallback */
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
              const target = e.target as HTMLImageElement;
              target.style.opacity = "0";
            }}
          />
        )}

        {/* Abstract SVG Pattern overlay for gradients */}
        {isGradient && (
          <div className="absolute inset-0 opacity-20 mix-blend-overlay">
            <svg className="size-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none">
              <defs>
                <pattern id={`grid-${anime.id}`} width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill={`url(#grid-${anime.id})`} />
            </svg>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
          <Badge className="bg-background/85 text-foreground backdrop-blur-md border border-border/60 text-[10px] font-bold tracking-wide px-2 py-0.5">
            {anime.subOrDub}
          </Badge>

          <Badge className="bg-black/70 text-amber-400 backdrop-blur-md border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 flex items-center gap-1">
            <Star className="size-3 fill-amber-400 stroke-amber-400" />
            {anime.rating ? anime.rating.toFixed(1) : "N/A"}
          </Badge>
        </div>

        {/* Hover Overlay with Play Icon */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10 backdrop-blur-[2px]">
          <div className="size-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center border border-primary-foreground/20 transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play className="size-6 fill-primary-foreground stroke-primary-foreground ml-0.5" />
          </div>
        </div>

        {/* Bottom Card Shadow Gradient */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/80 to-transparent z-0" />
      </div>

      {/* Card Info Content */}
      <div className="p-3.5 flex flex-col gap-1.5 flex-1 bg-card">
        <h3 className="font-bold text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {anime.title}
        </h3>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="line-clamp-1">{anime.genres.slice(0, 2).join(" • ")}</span>
          <span className="font-medium shrink-0 flex items-center gap-1">
            <Tv className="size-3 text-muted-foreground" />
            Ep {anime.latestEpisode || anime.episodesCount}
          </span>
        </div>
      </div>
    </Link>
  );
}
