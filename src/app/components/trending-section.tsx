"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { AnimeCard } from "@/components/anime-card";
import { TRENDING_ANIME, GENRES_LIST } from "@/lib/mock-anime";

export function TrendingSection() {
  const [selectedGenre, setSelectedGenre] = useState("All");

  const filteredAnime =
    selectedGenre === "All"
      ? TRENDING_ANIME
      : TRENDING_ANIME.filter((item) =>
          item.genres.some((g) => g.toLowerCase() === selectedGenre.toLowerCase())
        );

  return (
    <section id="trending" className="py-12 md:py-16 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
              <Sparkles className="size-4" />
              <span>Trending Series</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Most Popular Right Now
            </h2>
          </div>

          <Link
            href="#all-anime"
            className={buttonVariants({
              variant: "ghost",
              className: "self-start sm:self-auto text-sm font-semibold text-primary hover:text-primary hover:bg-primary/10 rounded-lg group",
            })}
          >
            View Complete Library
            <ArrowRight className="ml-1.5 size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Genre Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          {GENRES_LIST.map((genre) => {
            const isActive = selectedGenre === genre;
            return (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {filteredAnime.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-xl bg-card border border-border">
            <p className="text-sm text-muted-foreground">
              No trending anime found in the "{selectedGenre}" category right now.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
