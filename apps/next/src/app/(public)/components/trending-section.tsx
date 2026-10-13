"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimeCard } from "@/components/anime-card";
import { useTrendingAnime } from "@/hooks/use-trending-anime";
import type { AnimeItem } from "@/types/anime";

interface TrendingSectionProps {
  initialTrending?: AnimeItem[];
  initialGenres?: string[];
}

export function TrendingSection({ initialTrending, initialGenres }: TrendingSectionProps) {
  const [selectedGenre, setSelectedGenre] = useState("All");
  const { trendingAnime, genresList, isLoading } = useTrendingAnime(initialTrending, initialGenres);

  const filteredAnime =
    selectedGenre === "All"
      ? trendingAnime
      : trendingAnime.filter((item) =>
          item.genres.some((g) => g.toLowerCase() === selectedGenre.toLowerCase()),
        );

  return (
    <section id="trending" className="bg-background py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="space-y-1">
            <div className="text-primary flex items-center gap-2 text-xs font-bold tracking-wider uppercase">
              <Sparkles className="size-4" />
              <span>Trending Series</span>
            </div>
            <h2 className="text-foreground text-2xl font-extrabold tracking-tight sm:text-3xl">
              Most Popular Right Now
            </h2>
          </div>

          <Link
            href="/browse"
            className={buttonVariants({
              variant: "ghost",
              className:
                "text-primary hover:text-primary hover:bg-primary/10 group self-start rounded-lg text-sm font-semibold sm:self-auto",
            })}
          >
            View Complete Library
            <ArrowRight className="ml-1.5 size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* In-Component Skeleton Loader */}
        {isLoading ? (
          <div className="space-y-6">
            <div className="flex items-center gap-2 overflow-hidden pb-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-7 w-20 flex-shrink-0 rounded-full" />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 lg:grid-cols-5">
              {Array.from({ length: 10 }).map((_, i) => (
                <AnimeCard key={i} isLoading={true} />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Genre Filter Tabs */}
            <div className="mb-6 flex scrollbar-none items-center gap-2 overflow-x-auto pb-3">
              {genresList.slice(0, 10).map((genre) => {
                const isActive = selectedGenre.toLowerCase() === genre.toLowerCase();
                return (
                  <button
                    key={genre}
                    onClick={() => setSelectedGenre(genre)}
                    className={`rounded-full px-4 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                    }`}
                  >
                    {genre}
                  </button>
                );
              })}
            </div>

            {/* Anime Cards Grid */}
            {filteredAnime.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 lg:grid-cols-5">
                {filteredAnime.map((anime) => (
                  <AnimeCard key={anime.id} anime={anime} />
                ))}
              </div>
            ) : (
              <div className="bg-card border-border rounded-xl border p-12 text-center">
                <p className="text-muted-foreground text-sm">
                  No trending anime found in the "{selectedGenre}" category right now.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
