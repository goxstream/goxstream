import { useState } from "react";
import { Link } from "react-router";
import { Play, Clock, Subtitles, Mic } from "lucide-react";
import { Skeleton } from "@shionstream/ui/components/skeleton";
import { Card } from "@shionstream/ui/components/card";
import { VercelSpinner } from "@/components/vercel-spinner";
import type { EpisodeItem } from "@/types/anime";

interface EpisodeCardProps {
  episode?: EpisodeItem;
  isLoading?: boolean;
}

export function EpisodeCard({ episode, isLoading }: EpisodeCardProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  if (isLoading || !episode) {
    return (
      <Card className="border-border/80 flex flex-col items-start justify-between gap-4 p-3.5 sm:flex-row sm:items-center">
        <div className="flex w-full min-w-0 flex-1 items-center gap-3 sm:w-auto sm:gap-4">
          <Skeleton className="aspect-video w-32 shrink-0 rounded-lg sm:w-44" />
          <div className="flex-1 space-y-2 py-0.5">
            <Skeleton className="h-3 w-1/3 rounded" />
            <Skeleton className="h-4 w-4/5 rounded" />
            <Skeleton className="h-3 w-1/2 rounded" />
          </div>
        </div>
      </Card>
    );
  }
  const watchUrl = `/anime/${episode.animeSlug}/${episode.episodeNumber}`;

  return (
    <Link
      to={watchUrl}
      className="group bg-card border-border/80 hover:border-primary/50 hover:bg-muted/40 focus-visible:ring-ring flex flex-col items-start justify-between gap-4 rounded-xl border p-3.5 transition-all duration-300 focus-visible:ring-2 focus-visible:outline-none sm:flex-row sm:items-center"
    >
      <div className="flex w-full min-w-0 flex-1 items-center gap-3 sm:w-auto sm:gap-4">
        <div className="bg-muted relative aspect-video w-32 shrink-0 overflow-hidden rounded-lg sm:w-44">
          {!isImageLoaded && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-xs transition-opacity duration-300">
              <VercelSpinner size="sm" />
            </div>
          )}

          <img
            src={episode.thumbnail || ""}
            alt={episode.animeTitle}
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

          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
            <div className="bg-primary text-primary-foreground border-primary-foreground/20 flex size-9 items-center justify-center rounded-full border">
              <Play className="fill-primary-foreground stroke-primary-foreground ml-0.5 size-4" />
            </div>
          </div>

          <div className="absolute right-1.5 bottom-1.5 rounded bg-black/75 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-white">
            {episode.duration}
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-primary text-xs font-semibold">
              Episode {episode.episodeNumber}
            </span>
            <span className="text-muted-foreground text-xs">•</span>
            <span className="text-muted-foreground line-clamp-1 text-xs">
              {episode.episodeTitle}
            </span>
          </div>

          <h4 className="text-foreground group-hover:text-primary line-clamp-1 text-sm font-bold transition-colors sm:text-base">
            {episode.animeTitle}
          </h4>

          <div className="text-muted-foreground flex items-center gap-3 pt-0.5 text-xs">
            <span className="flex items-center gap-1">
              <Clock className="text-muted-foreground size-3" />
              {episode.releasedAt}
            </span>

            <div className="flex items-center gap-1.5">
              {episode.isSub && (
                <span className="py-0.2 bg-muted text-foreground inline-flex items-center gap-0.5 rounded px-1.5 text-[10px] font-bold">
                  <Subtitles className="text-primary size-3" /> SUB
                </span>
              )}
              {episode.isDub && (
                <span className="py-0.2 bg-muted text-foreground inline-flex items-center gap-0.5 rounded px-1.5 text-[10px] font-bold">
                  <Mic className="size-3 text-emerald-500" /> DUB
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="border-border/60 flex w-full shrink-0 items-center justify-end border-t pt-2 sm:w-auto sm:border-t-0 sm:pt-0">
        <span className="bg-muted text-foreground group-hover:bg-primary group-hover:text-primary-foreground inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold shadow-none transition-colors sm:w-auto">
          <Play className="size-3.5 fill-current" />
          Watch Now
        </span>
      </div>
    </Link>
  );
}
