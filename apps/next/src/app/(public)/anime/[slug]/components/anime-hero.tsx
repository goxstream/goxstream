"use client";

import type { AnimeItem } from "@/types/anime";
import { HeroBreadcrumb } from "./hero/hero-breadcrumb";
import { HeroPoster } from "./hero/hero-poster";
import { HeroMeta } from "./hero/hero-meta";
import { HeroActions } from "./hero/hero-actions";

interface AnimeHeroProps {
  anime?: AnimeItem | null;
  latestEpisodeNum?: number;
  isLoading?: boolean;
}

export function AnimeHero({ anime, latestEpisodeNum, isLoading }: AnimeHeroProps) {
  const isLoaded = !isLoading && !!anime;

  return (
    <section className="relative overflow-hidden border-b border-border/60 bg-card/30">
      {/* Background Banner Backdrop with Ambient Glow */}
      {isLoaded && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-35 dark:opacity-25">
          <img
            src={anime.bannerImage || anime.coverImage || ""}
            alt={anime.title}
            loading="eager"
            decoding="async"
            className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full blur-3xl opacity-70 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.opacity = "0";
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
      )}

      <div className="container relative z-10 mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumb Navigation */}
        <HeroBreadcrumb title={anime?.title} isLoading={isLoading} />

        {/* Hero Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr] gap-8 items-start">
          {/* Poster Image Card */}
          <HeroPoster anime={anime} isLoading={isLoading} />

          {/* Anime Meta & Actions */}
          <div className="flex flex-col gap-4 text-left">
            <HeroMeta anime={anime} isLoading={isLoading} />
            <HeroActions slug={anime?.slug} latestEpisodeNum={latestEpisodeNum} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </section>
  );
}
