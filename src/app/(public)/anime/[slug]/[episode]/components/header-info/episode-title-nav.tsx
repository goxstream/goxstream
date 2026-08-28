"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { AnimeItem, EpisodeItem } from "@/types/anime";

interface EpisodeTitleNavProps {
  anime: AnimeItem;
  episode: EpisodeItem;
  prevEpisode?: EpisodeItem;
  nextEpisode?: EpisodeItem;
}

export function EpisodeTitleNav({
  anime,
  episode,
  prevEpisode,
  nextEpisode,
}: EpisodeTitleNavProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 flex-wrap mb-1.5">
          <Link
            href={`/anime/${anime.slug}`}
            className="text-xs font-semibold text-primary hover:underline"
          >
            {anime.title}
          </Link>
          <span className="text-muted-foreground/60 text-xs">•</span>
          <Badge variant="outline" className="text-xs py-0 px-2 rounded-md font-mono border-border/60">
            Episode {episode.episodeNumber}
          </Badge>
          {episode.isSub && (
            <Badge variant="secondary" className="text-[10px] py-0 px-1.5 rounded-sm bg-primary/10 text-primary border border-primary/20">
              SUB
            </Badge>
          )}
          {episode.isDub && (
            <Badge variant="secondary" className="text-[10px] py-0 px-1.5 rounded-sm bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              DUB
            </Badge>
          )}
        </div>

        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
          {episode.episodeTitle}
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Released {episode.releasedAt} • Duration: {episode.duration}
        </p>
      </div>

      {/* Prev / Next Episode Controls */}
      <div className="flex items-center gap-2">
        {prevEpisode ? (
          <Link
            href={`/anime/${anime.slug}/${prevEpisode.episodeNumber}`}
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className: "h-9 px-3 rounded-lg border-border/60 text-xs",
            })}
          >
            <ChevronLeft className="w-4 h-4 mr-1 shrink-0" />
            Previous Ep
          </Link>
        ) : (
          <Button
            variant="outline"
            size="sm"
            disabled
            className="h-9 px-3 rounded-lg border-border/60 text-xs opacity-50"
          >
            <ChevronLeft className="w-4 h-4 mr-1 shrink-0" />
            Previous Ep
          </Button>
        )}

        {nextEpisode ? (
          <Link
            href={`/anime/${anime.slug}/${nextEpisode.episodeNumber}`}
            className={buttonVariants({
              variant: "default",
              size: "sm",
              className: "h-9 px-3 rounded-lg text-xs shadow-xs",
            })}
          >
            Next Ep
            <ChevronRight className="w-4 h-4 ml-1 shrink-0" />
          </Link>
        ) : (
          <Button
            variant="outline"
            size="sm"
            disabled
            className="h-9 px-3 rounded-lg border-border/60 text-xs opacity-50"
          >
            Next Ep
            <ChevronRight className="w-4 h-4 ml-1 shrink-0" />
          </Button>
        )}
      </div>
    </div>
  );
}
