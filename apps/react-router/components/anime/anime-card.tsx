import { useState } from "react";
import { Link } from "react-router";
import { Play, Star, Tv } from "lucide-react";
import { Badge } from "@goxstream/ui/components/badge";
import { Skeleton } from "@goxstream/ui/components/skeleton";
import { Card } from "@goxstream/ui/components/card";
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
        <Card className="bg-card border-border/70 flex flex-col items-start justify-between gap-4 rounded-xl border p-4 sm:flex-row sm:items-center">
          <div className="flex w-full flex-1 items-center gap-4">
            <Skeleton className="size-16 shrink-0 rounded-lg sm:size-20" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-5 w-2/3 rounded" />
              <Skeleton className="h-3 w-1/3 rounded" />
              <Skeleton className="h-3 w-1/2 rounded" />
            </div>
          </div>
          <div className="flex w-full items-center gap-3 sm:w-auto">
            <Skeleton className="h-4 w-20 rounded" />
            <Skeleton className="h-4 w-12 rounded" />
          </div>
        </Card>
      );
    }

    return (
      <Card className="bg-card border-border/80 flex flex-col gap-0 overflow-hidden rounded-xl border p-0">
        <Skeleton className="aspect-[3/4] w-full rounded-none" />
        <div className="bg-card flex flex-col gap-2 p-3.5">
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
        to={`/anime/${anime.slug}`}
        className="group bg-card border-border/70 hover:border-primary/60 flex flex-col items-start justify-between gap-4 rounded-xl border p-4 transition-all duration-200 sm:flex-row sm:items-center"
      >
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <div className="bg-muted relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg sm:size-20">
            {!isGradient && !isImageLoaded && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-xs transition-opacity duration-300">
                <VercelSpinner size="sm" />
              </div>
            )}

            {isGradient ? (
              <div className="absolute inset-0 size-full" style={getImageStyle(anime.coverImage)} />
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
            <Play className="relative z-10 size-6 fill-white/80 text-white/80 transition-transform group-hover:scale-110" />
          </div>

          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-foreground group-hover:text-primary line-clamp-1 text-base font-bold transition-colors">
                {anime.title}
              </h3>
              <Badge variant="outline" className="px-1.5 py-0 text-[10px]">
                {anime.type}
              </Badge>
            </div>
            {anime.japaneseTitle && (
              <p className="text-muted-foreground/80 line-clamp-1 text-xs">{anime.japaneseTitle}</p>
            )}
            <p className="text-muted-foreground line-clamp-1 text-xs">{anime.genres.join(" • ")}</p>
          </div>
        </div>

        <div className="text-muted-foreground border-border/40 flex w-full items-center justify-between gap-4 border-t pt-2 text-xs sm:w-auto sm:justify-end sm:border-t-0 sm:pt-0">
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
      to={`/anime/${anime.slug}`}
      className="group bg-card border-border/80 hover:border-primary/60 focus-visible:ring-ring flex flex-col overflow-hidden rounded-xl border transition-all duration-200 focus-visible:ring-2 focus-visible:outline-none"
    >
      <div className="bg-muted relative aspect-[3/4] w-full overflow-hidden">
        {!isGradient && !isImageLoaded && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-xs transition-opacity duration-300">
            <VercelSpinner size="md" />
          </div>
        )}

        {isGradient ? (
          <div
            className="absolute inset-0 size-full transition-transform duration-500 group-hover:scale-105"
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
              const target = e.target as HTMLImageElement;
              target.style.opacity = "0";
            }}
          />
        )}

        <div className="absolute top-2.5 right-2.5 left-2.5 z-10 flex items-center justify-between">
          <Badge className="bg-background/85 text-foreground border-border/60 border px-2 py-0.5 text-[10px] font-bold tracking-wide backdrop-blur-md">
            {anime.subOrDub}
          </Badge>

          <Badge className="flex items-center gap-1 border border-amber-500/30 bg-black/70 px-2 py-0.5 text-[10px] font-bold text-amber-400 backdrop-blur-md">
            <Star className="size-3 fill-amber-400 stroke-amber-400" />
            {anime.rating ? anime.rating.toFixed(1) : "N/A"}
          </Badge>
        </div>

        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
          <div className="bg-primary text-primary-foreground border-primary-foreground/20 flex size-12 scale-75 transform items-center justify-center rounded-full border transition-transform duration-300 group-hover:scale-100">
            <Play className="fill-primary-foreground stroke-primary-foreground ml-0.5 size-6" />
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-0 h-16 bg-gradient-to-t from-black/80 to-transparent" />
      </div>

      <div className="bg-card flex flex-1 flex-col gap-1.5 p-3.5">
        <h3 className="text-foreground group-hover:text-primary line-clamp-1 text-sm font-bold transition-colors">
          {anime.title}
        </h3>

        <div className="text-muted-foreground flex items-center justify-between text-xs">
          <span className="line-clamp-1">{anime.genres.slice(0, 2).join(" • ")}</span>
          <span className="flex shrink-0 items-center gap-1 font-medium">
            <Tv className="text-muted-foreground size-3" />
            Ep {anime.latestEpisode || anime.episodesCount}
          </span>
        </div>
      </div>
    </Link>
  );
}
