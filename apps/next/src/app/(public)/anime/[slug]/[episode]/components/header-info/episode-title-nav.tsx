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
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <div>
        <div className="mb-1.5 flex flex-wrap items-center gap-2">
          <Link
            href={`/anime/${anime.slug}`}
            className="text-primary text-xs font-semibold hover:underline"
          >
            {anime.title}
          </Link>
          <span className="text-muted-foreground/60 text-xs">•</span>
          <Badge
            variant="outline"
            className="border-border/60 text-muted-foreground bg-muted/30 rounded-md px-2 py-0.5 font-mono text-xs"
          >
            Episode {episode.episodeNumber}
          </Badge>
          {episode.isSub && (
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 rounded-sm border px-1.5 py-0 text-[10px]"
            >
              SUB
            </Badge>
          )}
          {episode.isDub && (
            <Badge
              variant="secondary"
              className="rounded-sm border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0 text-[10px] text-emerald-600 dark:text-emerald-400"
            >
              DUB
            </Badge>
          )}
        </div>

        <h1 className="text-foreground text-xl font-bold tracking-tight md:text-2xl">
          {episode.episodeTitle}
        </h1>
        <p className="text-muted-foreground mt-1 text-xs font-medium">
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
              className:
                "border-border/60 text-foreground hover:bg-muted/60 h-9 rounded-lg px-3.5 text-xs font-medium",
            })}
          >
            <ChevronLeft className="mr-1 h-4 w-4 shrink-0" />
            Previous Ep
          </Link>
        ) : (
          <Button
            variant="outline"
            size="sm"
            disabled
            className="border-border/60 text-muted-foreground h-9 rounded-lg px-3.5 text-xs font-medium opacity-50"
          >
            <ChevronLeft className="mr-1 h-4 w-4 shrink-0" />
            Previous Ep
          </Button>
        )}

        {nextEpisode ? (
          <Link
            href={`/anime/${anime.slug}/${nextEpisode.episodeNumber}`}
            className={buttonVariants({
              variant: "default",
              size: "sm",
              className:
                "bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-lg px-3.5 text-xs font-semibold shadow-xs",
            })}
          >
            Next Ep
            <ChevronRight className="ml-1 h-4 w-4 shrink-0" />
          </Link>
        ) : (
          <Button
            variant="outline"
            size="sm"
            disabled
            className="border-border/60 text-muted-foreground h-9 rounded-lg px-3.5 text-xs font-medium opacity-50"
          >
            Next Ep
            <ChevronRight className="ml-1 h-4 w-4 shrink-0" />
          </Button>
        )}
      </div>
    </div>
  );
}
