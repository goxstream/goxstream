"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { VercelSpinner } from "@/components/vercel-spinner";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { getImageStyle } from "@/lib/utils";
import { useHeroSlides } from "@/hooks/use-hero-slides";
import type { AnimeItem } from "@/types/anime";

interface HeroSectionProps {
  initialFeaturedAnime?: AnimeItem | null;
}

export function HeroSection({ initialFeaturedAnime }: HeroSectionProps) {
  const { api, setApi, slideItems, currentSlide, count, isLoading } =
    useHeroSlides(initialFeaturedAnime);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  return (
    <section className="bg-card text-card-foreground border-border/60 group relative mx-auto w-full max-w-[1400px] overflow-hidden rounded-3xl border shadow-xl">
      {isLoading ? (
        <div className="relative flex min-h-[380px] w-full items-center justify-center p-6 sm:min-h-[480px] lg:min-h-[640px]">
          <Skeleton className="size-full rounded-2xl" />
        </div>
      ) : (
        <Carousel setApi={setApi} opts={{ loop: true }} className="w-full">
          <CarouselContent>
            {slideItems.map((item) => {
              const isGradient = item.image.startsWith("linear-gradient");
              const isLoaded = loadedImages[item.id] || false;

              return (
                <CarouselItem key={item.id} className="relative w-full pl-0">
                  <Link
                    href={`/anime/${item.slug}/${item.episodeNumber || 1}`}
                    className="group/card bg-card relative flex w-full flex-col overflow-hidden sm:block sm:min-h-[480px] lg:min-h-[640px]"
                  >
                    {/* Layer 0: Background Anime Poster/Banner & Contrast Gradients */}
                    <div className="bg-muted relative z-0 aspect-video w-full overflow-hidden sm:absolute sm:inset-0 sm:size-full">
                      {/* Grid Pattern & Ambient Glow at the backmost layer */}
                      <div className="bg-grid-pattern pointer-events-none absolute inset-0 z-0 opacity-70 mix-blend-overlay" />
                      <div className="bg-primary/30 pointer-events-none absolute -top-36 left-1/2 z-0 h-[350px] w-[600px] -translate-x-1/2 rounded-full blur-[120px]" />

                      {!isGradient && !isLoaded && (
                        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-xs transition-opacity duration-300">
                          <VercelSpinner size="lg" />
                        </div>
                      )}

                      {isGradient ? (
                        <div
                          className="absolute inset-0 size-full"
                          style={getImageStyle(item.image)}
                        />
                      ) : (
                        <img
                          src={item.image}
                          alt={item.title}
                          loading="eager"
                          decoding="async"
                          onLoad={() => setLoadedImages((prev) => ({ ...prev, [item.id]: true }))}
                          className={`absolute inset-0 size-full object-cover object-center transition-opacity duration-500 ${
                            isLoaded ? "opacity-100" : "opacity-0"
                          }`}
                          onError={(e) => {
                            setLoadedImages((prev) => ({ ...prev, [item.id]: true }));
                            (e.target as HTMLImageElement).style.opacity = "0";
                          }}
                        />
                      )}

                      {/* Gradient Overlays for readable text contrast & ambient depth */}
                      <div className="from-card via-card/65 to-card/25 absolute inset-0 hidden bg-gradient-to-t opacity-20 transition-opacity duration-300 sm:block dark:opacity-100" />
                      <div className="from-card/90 via-card/45 absolute inset-0 hidden bg-gradient-to-r to-transparent opacity-25 transition-opacity duration-300 sm:block dark:opacity-100" />
                    </div>

                    {/* Layer 20: Anime Information Content Overlay */}
                    <div className="bg-card relative z-20 flex w-full max-w-4xl flex-col justify-end space-y-3 p-5 text-left sm:absolute sm:inset-0 sm:size-full sm:min-h-[480px] sm:space-y-4 sm:bg-transparent sm:p-10 lg:min-h-[640px] lg:p-14">
                      {/* Eyebrow Badges Row */}
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <Badge className="bg-primary hover:bg-primary/90 text-primary-foreground animate-pulse px-3 py-1 text-xs font-bold tracking-wider uppercase">
                          <Sparkles className="mr-1.5 size-3.5" />
                          {item.badgeText}
                        </Badge>

                        {item.episodeNumber && (
                          <Badge
                            variant="outline"
                            className="bg-background/60 border-border/80 text-foreground px-2.5 py-1 text-xs font-semibold backdrop-blur-md"
                          >
                            Episode {item.episodeNumber}
                          </Badge>
                        )}

                        {item.rating && (
                          <Badge className="flex items-center gap-1 border border-amber-500/30 bg-black/75 px-2.5 py-1 text-xs font-bold text-amber-400 backdrop-blur-md">
                            <Star className="size-3.5 fill-amber-400 stroke-amber-400" />
                            {item.rating.toFixed(1)}
                          </Badge>
                        )}
                      </div>

                      {/* Anime Title */}
                      <div className="space-y-1">
                        <h1 className="text-foreground group-hover/card:text-primary line-clamp-2 text-2xl leading-[1.1] font-black tracking-tight transition-colors duration-300 sm:text-5xl lg:text-6xl">
                          {item.title}
                        </h1>

                        {item.japaneseTitle && (
                          <p className="text-muted-foreground line-clamp-1 text-xs font-medium opacity-80 sm:text-sm">
                            {item.japaneseTitle}
                          </p>
                        )}
                      </div>

                      {/* Synopsis (If available) */}
                      {item.synopsis && (
                        <p className="text-muted-foreground line-clamp-2 max-w-2xl text-[11px] leading-relaxed sm:text-sm lg:text-base">
                          {item.synopsis}
                        </p>
                      )}

                      {/* Genre Tags & Season Info */}
                      <div className="flex flex-wrap items-center gap-2 pt-2">
                        {item.season && (
                          <span className="text-primary text-xs font-semibold tracking-wide uppercase">
                            {item.season} {item.year}
                          </span>
                        )}
                        {item.season && item.genres.length > 0 && (
                          <span className="text-muted-foreground text-xs">•</span>
                        )}
                        {item.genres.slice(0, 4).map((genre) => (
                          <span
                            key={genre}
                            className="bg-background/80 border-border/60 text-muted-foreground rounded-full border px-2.5 py-0.5 text-[11px] font-medium backdrop-blur-md"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
              );
            })}
          </CarouselContent>

          {/* Navigation Controls (If more than 1 slide) */}
          {slideItems.length > 1 && (
            <>
              <CarouselPrevious className="bg-background/70 border-border/60 left-4 z-30 size-10 rounded-full opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100" />
              <CarouselNext className="bg-background/70 border-border/60 right-4 z-30 size-10 rounded-full opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100" />

              {/* Bottom Dot Indicators */}
              <div className="absolute right-6 bottom-4 z-30 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/60 px-3 py-1.5 backdrop-blur-md">
                {Array.from({ length: count }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => api?.scrollTo(idx)}
                    className={`size-2 rounded-full transition-all duration-300 ${
                      idx === currentSlide
                        ? "bg-primary w-5"
                        : "bg-muted-foreground/40 hover:bg-muted-foreground"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </Carousel>
      )}
    </section>
  );
}
