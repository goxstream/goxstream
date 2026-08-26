import Link from "next/link";
import { Play, Clock, Subtitles, Mic } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { EpisodeItem } from "@/types/anime";

interface EpisodeCardProps {
  episode: EpisodeItem;
}

export function EpisodeCard({ episode }: EpisodeCardProps) {
  return (
    <Link
      href={`#watch-${episode.animeSlug}-ep${episode.episodeNumber}`}
      className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-3.5 rounded-xl bg-card border border-border/80 hover:border-primary/50 hover:bg-muted/40 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {/* Episode Thumbnail */}
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <div className="relative aspect-video w-full sm:w-44 shrink-0 rounded-lg overflow-hidden bg-muted">
          <div
            className="absolute inset-0 size-full transition-transform duration-500 group-hover:scale-105"
            style={{ background: episode.thumbnail }}
          />

          {/* Hover Play Button Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
            <div className="size-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center border border-primary-foreground/20">
              <Play className="size-4 fill-primary-foreground stroke-primary-foreground ml-0.5" />
            </div>
          </div>

          {/* Duration Badge */}
          <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/75 text-white font-mono text-[10px] font-semibold">
            {episode.duration}
          </div>
        </div>

        {/* Info on Small Screens (Inline) & Desktop */}
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-primary">
              Episode {episode.episodeNumber}
            </span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground line-clamp-1">{episode.episodeTitle}</span>
          </div>

          <h4 className="font-bold text-sm sm:text-base text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {episode.animeTitle}
          </h4>

          <div className="flex items-center gap-3 text-xs text-muted-foreground pt-0.5">
            <span className="flex items-center gap-1">
              <Clock className="size-3 text-muted-foreground" />
              {episode.releasedAt}
            </span>

            <div className="flex items-center gap-1.5">
              {episode.isSub && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-muted text-[10px] font-bold text-foreground">
                  <Subtitles className="size-3 text-primary" /> SUB
                </span>
              )}
              {episode.isDub && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-muted text-[10px] font-bold text-foreground">
                  <Mic className="size-3 text-emerald-500" /> DUB
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Watch Action Button */}
      <div className="w-full sm:w-auto flex items-center justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/60">
        <span className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-muted text-foreground text-xs font-semibold group-hover:bg-primary group-hover:text-primary-foreground transition-colors shadow-none">
          <Play className="size-3.5 fill-current" />
          Watch Now
        </span>
      </div>
    </Link>
  );
}
