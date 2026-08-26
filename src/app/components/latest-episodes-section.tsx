"use client";

import Link from "next/link";
import { ArrowRight, Radio } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EpisodeCard } from "@/components/episode-card";
import { useLatestEpisodes } from "@/hooks/use-latest-episodes";
import type { EpisodeItem } from "@/types/anime";

interface LatestEpisodesSectionProps {
  initialEpisodes?: EpisodeItem[];
}

export function LatestEpisodesSection({ initialEpisodes }: LatestEpisodesSectionProps) {
  const { episodesList, isLoading } = useLatestEpisodes(initialEpisodes);

  return (
    <section id="latest" className="py-12 md:py-16 bg-muted/30 border-y border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
              <Radio className="size-4 animate-pulse text-emerald-500" />
              <span>Simulcast Feed</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Just Released Episodes
            </h2>
          </div>

          <Link
            href="/schedule"
            className={buttonVariants({
              variant: "ghost",
              className: "self-start sm:self-auto text-sm font-semibold text-primary hover:text-primary hover:bg-primary/10 rounded-lg group",
            })}
          >
            Simulcast Schedule
            <ArrowRight className="ml-1.5 size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* In-Component Skeleton Loader */}
        {isLoading ? (
          <LatestEpisodesSectionSkeleton />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {episodesList.map((episode) => (
              <EpisodeCard key={episode.id} episode={episode} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * In-Component Skeleton for Latest Episodes Section
 */
function LatestEpisodesSectionSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 p-3 rounded-xl bg-card border border-border/60"
        >
          <Skeleton className="relative aspect-video w-36 sm:w-44 rounded-lg flex-shrink-0" />
          <div className="flex-1 space-y-2 py-1">
            <Skeleton className="h-3 w-1/3 rounded" />
            <Skeleton className="h-4 w-4/5 rounded" />
            <Skeleton className="h-3 w-1/2 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
