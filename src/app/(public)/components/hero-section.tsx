"use client";

import Link from "next/link";
import { Play, Sparkles, Zap, ShieldCheck, ArrowRight, Flame } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DecryptedText from "@/components/DecryptedText";
import { useFeaturedAnime } from "@/hooks/use-featured-anime";
import type { AnimeItem } from "@/types/anime";

interface HeroSectionProps {
  initialFeaturedAnime?: AnimeItem | null;
}

export function HeroSection({ initialFeaturedAnime }: HeroSectionProps) {
  const { featuredAnime: activeAnime } = useFeaturedAnime(initialFeaturedAnime);

  return (
    <section className="relative flex flex-col items-center justify-center min-h-[580px] py-16 px-4 sm:px-6 border rounded-3xl overflow-hidden mx-auto w-full max-w-[1400px] bg-card text-card-foreground border-border/60 bg-grid-pattern shadow-xl">
      {/* Background Ambient Glow */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-primary/15 blur-[120px] rounded-full pointer-events-none" />

      {/* Pill Badge */}
      <Badge variant="outline" className="gap-2 mb-8 animate-pulse">
        <Sparkles className="size-3.5" />
        <span>Simulcast Stream Engine • 1080p 60FPS</span>
      </Badge>

      {/* Main Title */}
      <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl text-center leading-[1.1] px-4">
        Discover & Stream Your Favorite <br />
        <span className="bg-gradient-to-r from-primary via-emerald-400 to-teal-400 bg-clip-text text-transparent">
          <DecryptedText
            text="Anime Worlds"
            animateOn="view"
            speed={40}
            maxIterations={8}
            sequential={true}
            revealDirection="start"
            className="bg-gradient-to-r from-primary via-emerald-400 to-teal-400 bg-clip-text text-transparent font-black"
          />
        </span>
      </h1>

      {/* Description */}
      <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl text-center px-4 leading-relaxed">
        Stream thousands of subbed and dubbed anime series with zero ad interruptions,
        lightning-fast bufferless playback, and instant simulcast releases straight from Japan.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-8 px-4">
        <Link
          href={`/anime/${activeAnime?.slug || "featured"}/1`}
          className={buttonVariants({ size: "lg", className: "font-semibold shadow-md gap-2" })}
        >
          <Play className="size-4 fill-primary-foreground stroke-primary-foreground" />
          Start Watching Now
        </Link>
        <Link
          href="#trending"
          className={buttonVariants({ variant: "outline", size: "lg", className: "font-medium gap-2" })}
        >
          Explore Trending Library <ArrowRight className="size-4 text-muted-foreground" />
        </Link>
      </div>

      {/* Highlight Stats Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-8 mt-12 pt-8 border-t border-border/40 px-6 text-center text-xs text-muted-foreground w-full max-w-3xl">
        <div className="flex items-center gap-2 justify-center">
          <Zap className="size-4 text-primary" />
          <span>Instant 5m Simulcast</span>
        </div>
        <div className="flex items-center gap-2 justify-center">
          <ShieldCheck className="size-4 text-primary" />
          <span>100% Ad-Free Experience</span>
        </div>
        <div className="col-span-2 sm:col-span-1 flex items-center gap-2 justify-center">
          <Flame className="size-4 text-amber-500" />
          <span>10,000+ Episodes</span>
        </div>
      </div>
    </section>
  );
}
