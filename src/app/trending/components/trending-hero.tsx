"use client";

import Link from "next/link";
import { Crown, Play, Star, Flame, Eye, TrendingUp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TrendingAnimeItem } from "@/types/anime";

interface TrendingHeroProps {
  topAnime: TrendingAnimeItem;
}

export function TrendingHero({ topAnime }: TrendingHeroProps) {
  if (!topAnime) return null;

  // Use primary genre as featured tag
  const primaryGenre = topAnime.genres[0] || "Featured";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-background to-background p-6 md:p-8 lg:p-10 shadow-sm">
      {/* Background Gradient Accent Glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 size-96 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 size-80 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Info & Actions */}
        <div className="lg:col-span-8 space-y-5">
          {/* Top Badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-amber-950 shadow-xs">
              <Crown className="size-3.5 fill-amber-950 stroke-amber-950" />
              #1 TRENDING NOW
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="size-3" />
              {topAnime.weeklyGrowth} Views
            </span>

            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
              {primaryGenre}
            </span>

            <span className="text-xs text-muted-foreground font-medium">
              {topAnime.type} • {topAnime.season} {topAnime.year}
            </span>
          </div>

          {/* Title */}
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
              {topAnime.title}
            </h1>
            {topAnime.japaneseTitle && (
              <p className="text-sm font-medium text-muted-foreground">
                {topAnime.japaneseTitle}
              </p>
            )}
          </div>

          {/* Synopsis */}
          <p className="text-sm sm:text-base text-muted-foreground line-clamp-3 max-w-3xl leading-relaxed">
            {topAnime.synopsis}
          </p>

          {/* Stats Bar */}
          <div className="flex flex-wrap items-center gap-6 pt-1 text-sm border-t border-border/60">
            <div className="flex items-center gap-1.5 font-bold text-amber-500">
              <Star className="size-4 fill-amber-500 stroke-amber-500" />
              <span>{topAnime.rating.toFixed(2)}</span>
            </div>

            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Eye className="size-4 text-primary" />
              <span className="font-semibold text-foreground">
                {(topAnime.weeklyViews / 1000000).toFixed(2)}M
              </span>
              <span>weekly views</span>
            </div>

            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Flame className="size-4 text-orange-500" />
              <span className="font-semibold text-foreground">
                Ep {topAnime.latestEpisode || topAnime.episodesCount}
              </span>
              <span>/ {topAnime.episodesCount}</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              nativeButton={false}
              render={
                <Link href={`/anime/${topAnime.slug}`}>
                  <Play className="size-4 fill-current mr-2" />
                  Watch Episode {topAnime.latestEpisode || 1}
                </Link>
              }
              size="lg"
              className="rounded-xl font-bold shadow-xs bg-amber-500 hover:bg-amber-600 text-amber-950"
            />
            <Button
              nativeButton={false}
              render={
                <Link href={`/anime/${topAnime.slug}`}>
                  <Sparkles className="size-4 mr-2 text-amber-500" />
                  View Details
                </Link>
              }
              variant="outline"
              size="lg"
              className="rounded-xl border-border/80 font-medium"
            />
          </div>
        </div>

        {/* Right Column: Visual Poster Card */}
        <div className="lg:col-span-4 flex justify-center lg:justify-end">
          <div className="relative group w-48 sm:w-56 md:w-64 aspect-[2/3] rounded-xl overflow-hidden shadow-lg border border-amber-500/30">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
              style={{ background: topAnime.coverImage }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            {/* Rank Badge Floating on Poster */}
            <div className="absolute top-3 left-3 size-10 rounded-xl bg-amber-500 text-amber-950 flex items-center justify-center font-black text-lg shadow-md border border-amber-400">
              #1
            </div>

            {/* Sub/Dub Tag */}
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-xs text-[10px] font-bold text-white uppercase tracking-wider">
              {topAnime.subOrDub}
            </div>

            {/* Poster Footer Info */}
            <div className="absolute bottom-3 left-3 right-3 text-white text-xs space-y-0.5">
              <p className="font-semibold truncate">{topAnime.studio}</p>
              <p className="text-[11px] text-zinc-300">
                {topAnime.episodesCount} Episodes • {topAnime.status}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
