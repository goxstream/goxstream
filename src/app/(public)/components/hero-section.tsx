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
    <section className="relative w-full max-w-[1400px] mx-auto rounded-3xl overflow-hidden bg-card text-card-foreground border border-border/60 shadow-xl group">
      {isLoading ? (
        <div className="relative w-full min-h-[500px] sm:min-h-[580px] flex items-center justify-center p-6">
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
                    className="relative block w-full min-h-[520px] sm:min-h-[600px] lg:min-h-[640px] overflow-hidden group/card"
                  >
                    {/* Layer 0: Background Anime Poster/Banner & Contrast Gradients */}
                    <div className="absolute inset-0 size-full z-0 bg-muted overflow-hidden">
                      {/* Grid Pattern & Ambient Glow at the backmost layer */}
                      <div className="absolute inset-0 z-0 pointer-events-none bg-grid-pattern opacity-70 mix-blend-overlay" />
                      <div className="absolute -top-36 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-primary/30 blur-[120px] rounded-full pointer-events-none z-0" />

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
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/65 to-card/25" />
                      <div className="absolute inset-0 bg-gradient-to-r from-card/90 via-card/45 to-transparent" />
                    </div>

                    {/* Layer 20: Anime Information Content Overlay */}
                    <div className="relative z-20 size-full min-h-[520px] sm:min-h-[600px] lg:min-h-[640px] flex flex-col justify-end p-6 sm:p-10 lg:p-14 text-left max-w-4xl space-y-4">
                      {/* Eyebrow Badges Row */}
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <Badge className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-3 py-1 text-xs tracking-wider uppercase animate-pulse">
                          <Sparkles className="mr-1.5 size-3.5" />
                          {item.badgeText}
                        </Badge>

                        {item.episodeNumber && (
                          <Badge variant="outline" className="bg-background/60 backdrop-blur-md border-border/80 text-foreground font-semibold px-2.5 py-1 text-xs">
                            Episode {item.episodeNumber}
                          </Badge>
                        )}

                        {item.rating && (
                          <Badge className="bg-black/75 text-amber-400 backdrop-blur-md border border-amber-500/30 text-xs font-bold px-2.5 py-1 flex items-center gap-1">
                            <Star className="size-3.5 fill-amber-400 stroke-amber-400" />
                            {item.rating.toFixed(1)}
                          </Badge>
                        )}
                      </div>

                      {/* Anime Title */}
                      <div className="space-y-1">
                        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground line-clamp-2 leading-[1.1] group-hover/card:text-primary transition-colors duration-300">
                          {item.title}
                        </h1>

                        {item.japaneseTitle && (
                          <p className="text-xs sm:text-sm text-muted-foreground font-medium line-clamp-1 opacity-80">
                            {item.japaneseTitle}
                          </p>
                        )}
                      </div>

                      {/* Synopsis (If available) */}
                      {item.synopsis && (
                        <p className="text-xs sm:text-sm lg:text-base text-muted-foreground line-clamp-2 max-w-2xl leading-relaxed">
                          {item.synopsis}
                        </p>
                      )}

                      {/* Genre Tags & Season Info */}
                      <div className="flex flex-wrap items-center gap-2 pt-2">
                        {item.season && (
                          <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                            {item.season} {item.year}
                          </span>
                        )}
                        {item.season && item.genres.length > 0 && (
                          <span className="text-xs text-muted-foreground">•</span>
                        )}
                        {item.genres.slice(0, 4).map((genre) => (
                          <span
                            key={genre}
                            className="px-2.5 py-0.5 rounded-full bg-background/80 backdrop-blur-md border border-border/60 text-[11px] font-medium text-muted-foreground"
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
              <CarouselPrevious className="left-4 z-30 size-10 rounded-full bg-background/70 backdrop-blur-md border-border/60 opacity-0 group-hover:opacity-100 transition-opacity" />
              <CarouselNext className="right-4 z-30 size-10 rounded-full bg-background/70 backdrop-blur-md border-border/60 opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Bottom Dot Indicators */}
              <div className="absolute bottom-4 right-6 z-30 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                {Array.from({ length: count }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => api?.scrollTo(idx)}
                    className={`size-2 rounded-full transition-all duration-300 ${
                      idx === currentSlide
                        ? "w-5 bg-primary"
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
