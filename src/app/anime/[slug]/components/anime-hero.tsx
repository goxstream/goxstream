"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Play,
  Bookmark,
  BookmarkCheck,
  Share2,
  Star,
  Tv,
  Calendar,
  Sparkles,
  Check,
  ChevronRight,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { AnimeItem } from "@/types/anime";

interface AnimeHeroProps {
  anime: AnimeItem;
  latestEpisodeNum?: number;
}

export function AnimeHero({ anime, latestEpisodeNum }: AnimeHeroProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section className="relative overflow-hidden border-b border-border/60 bg-card/30">
      {/* Background Banner Backdrop with Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-35 dark:opacity-25">
        <div
          className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full blur-3xl opacity-70"
          style={{ background: anime.bannerImage || anime.coverImage }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-background via-background/80 to-transparent"
        />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="size-3" />
          <Link href="/browse" className="hover:text-foreground transition-colors">
            Browse Anime
          </Link>
          <ChevronRight className="size-3" />
          <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-none">
            {anime.title}
          </span>
        </nav>

        {/* Hero Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr] gap-8 items-start">
          {/* Poster Image Card */}
          <div className="relative group mx-auto md:mx-0 w-full max-w-[260px] md:max-w-none aspect-[2/3] rounded-xl overflow-hidden shadow-md border border-border/80 bg-muted">
            <div
              className="w-full h-full transition-transform duration-500 group-hover:scale-105"
              style={{ background: anime.coverImage }}
            />
            {/* Overlay Gradient on Poster */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

            {/* Poster Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              <Badge className="bg-amber-500 text-amber-950 border-amber-400 font-bold px-2 py-0.5 text-xs shadow-xs flex items-center gap-1">
                <Star className="size-3 fill-amber-950" />
                {anime.rating.toFixed(2)}
              </Badge>
              <Badge className="bg-black/60 backdrop-blur-md text-white border-white/20 font-medium px-2 py-0.5 text-xs">
                {anime.type}
              </Badge>
            </div>

            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white/90 font-medium">
              <span>{anime.subOrDub}</span>
              <span className="bg-primary/90 text-primary-foreground px-2 py-0.5 rounded text-[11px] font-semibold">
                {anime.status}
              </span>
            </div>
          </div>

          {/* Anime Meta & Actions */}
          <div className="flex flex-col gap-4 text-left">
            {/* Anime Titles & Badges */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                {anime.isTrending && (
                  <Badge variant="secondary" className="gap-1 border-primary/30 text-primary text-xs font-semibold">
                    <Sparkles className="size-3" /> Trending #1
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs border-border/80">
                  {anime.studio}
                </Badge>
                <Badge variant="outline" className="text-xs border-border/80">
                  {anime.season} {anime.year}
                </Badge>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
                {anime.title}
              </h1>

              {anime.japaneseTitle && (
                <p className="text-sm sm:text-base text-muted-foreground font-medium">
                  {anime.japaneseTitle}
                </p>
              )}
            </div>

            {/* Synopsis Short Preview */}
            <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed max-w-3xl">
              {anime.synopsis}
            </p>

            {/* Quick Specs Pill Row */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-muted-foreground font-medium py-1">
              <div className="flex items-center gap-1.5 text-foreground">
                <Tv className="size-4 text-primary" />
                <span>{anime.episodesCount} Episode{anime.episodesCount > 1 ? "s" : ""}</span>
              </div>
              <span className="text-border">•</span>
              <div className="flex items-center gap-1.5 text-foreground">
                <Calendar className="size-4 text-primary" />
                <span>{anime.season} {anime.year}</span>
              </div>
              <span className="text-border">•</span>
              <div className="flex items-center gap-1.5 text-foreground">
                <Star className="size-4 text-amber-500 fill-amber-500" />
                <span>{anime.rating.toFixed(2)} Score</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href={`/anime/${anime.slug}#episodes`}
                className={buttonVariants({ size: "lg", className: "font-semibold shadow-xs gap-2" })}
              >
                <Play className="size-4 fill-primary-foreground" />
                <span>Watch Episode {latestEpisodeNum || 1}</span>
              </Link>

              <Button
                variant={isBookmarked ? "secondary" : "outline"}
                size="lg"
                onClick={() => setIsBookmarked(!isBookmarked)}
                className="font-medium gap-2 border-border/80"
              >
                {isBookmarked ? (
                  <>
                    <BookmarkCheck className="size-4 text-emerald-500" />
                    <span>Favorited</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="size-4" />
                    <span>Add to Favorites</span>
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={handleShare}
                className="font-medium gap-2 border-border/80"
              >
                {copied ? (
                  <>
                    <Check className="size-4 text-emerald-500" />
                    <span>Link Copied</span>
                  </>
                ) : (
                  <>
                    <Share2 className="size-4" />
                    <span>Share</span>
                  </>
                )}
              </Button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
