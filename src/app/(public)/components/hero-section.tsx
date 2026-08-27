"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Sparkles, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";
import { getImageStyle } from "@/lib/utils";
import { useScheduleAnime } from "@/hooks/use-schedule-anime";
import { useFeaturedAnime } from "@/hooks/use-featured-anime";
import { useTrendingAnime } from "@/hooks/use-trending-anime";
import type { AnimeItem } from "@/types/anime";

interface HeroSectionProps {
  initialFeaturedAnime?: AnimeItem | null;
}

export function HeroSection({ initialFeaturedAnime }: HeroSectionProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [count, setCount] = useState(0);

  const { scheduleItems, isLoading: isScheduleLoading } = useScheduleAnime();
  const { featuredAnime } = useFeaturedAnime(initialFeaturedAnime);
  const { trendingAnime } = useTrendingAnime();

  // Combine items: prioritize today's schedule, fallback to trending & featured
  const slideItems = useMemo(() => {
    const items: Array<{
      id: string;
      slug: string;
      title: string;
      japaneseTitle?: string;
      image: string;
      badgeText: string;
      rating?: number;
      episodeNumber?: number;
      airTime?: string;
      season?: string;
      year?: number;
      genres: string[];
      synopsis?: string;
    }> = [];

    // Filter today's schedule items
    const today = new Date()
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();

    const todayItems = scheduleItems.filter(
      (s) => s.airDay.toLowerCase() === today || s.status === "airing_now"
    );

    const sourceSchedule = todayItems.length > 0 ? todayItems : scheduleItems;

    sourceSchedule.forEach((item) => {
      items.push({
        id: `sched-${item.id}`,
        slug: item.slug,
        title: item.title,
        japaneseTitle: item.japaneseTitle,
        image: item.bannerImage || item.coverImage,
        badgeText: item.status === "airing_now" ? "AIRING NOW" : `TAYANG HARI INI (${item.airTime || "WIB"})`,
        rating: item.rating,
        episodeNumber: item.episodeNumber,
        airTime: item.airTime,
        season: item.season,
        year: item.year,
        genres: item.genres || [],
      });
    });

    // Add featured anime if not already in list
    if (featuredAnime && !items.some((i) => i.slug === featuredAnime.slug)) {
      items.push({
        id: `feat-${featuredAnime.id}`,
        slug: featuredAnime.slug,
        title: featuredAnime.title,
        japaneseTitle: featuredAnime.japaneseTitle,
        image: featuredAnime.bannerImage || featuredAnime.coverImage,
        badgeText: "SIMULCAST UNGGULAN",
        rating: featuredAnime.rating,
        episodeNumber: featuredAnime.latestEpisode || 1,
        season: featuredAnime.season,
        year: featuredAnime.year,
        genres: featuredAnime.genres || [],
        synopsis: featuredAnime.synopsis,
      });
    }

    // Add trending items up to 6 total items
    trendingAnime.forEach((anime) => {
      if (items.length < 6 && !items.some((i) => i.slug === anime.slug)) {
        items.push({
          id: `trend-${anime.id}`,
          slug: anime.slug,
          title: anime.title,
          japaneseTitle: anime.japaneseTitle,
          image: anime.bannerImage || anime.coverImage,
          badgeText: "TRENDING HARI INI",
          rating: anime.rating,
          episodeNumber: anime.latestEpisode || 1,
          season: anime.season,
          year: anime.year,
          genres: anime.genres || [],
          synopsis: anime.synopsis,
        });
      }
    });

    return items;
  }, [scheduleItems, featuredAnime, trendingAnime]);

  // Handle Carousel API state & auto-play
  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrentSlide(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrentSlide(api.selectedScrollSnap());
    });
  }, [api]);

  useEffect(() => {
    if (!api || slideItems.length <= 1) return;

    const timer = setInterval(() => {
      api.scrollNext();
    }, 6000);

    return () => clearInterval(timer);
  }, [api, slideItems.length]);

  return (
    <section className="relative w-full max-w-[1400px] mx-auto rounded-3xl overflow-hidden bg-card text-card-foreground border border-border/60 shadow-xl group">
      {isScheduleLoading && slideItems.length === 0 ? (
        <div className="relative w-full min-h-[500px] sm:min-h-[580px] flex items-center justify-center p-6">
          <Skeleton className="size-full rounded-2xl" />
        </div>
      ) : (
        <Carousel setApi={setApi} opts={{ loop: true }} className="w-full">
          <CarouselContent>
            {slideItems.map((item) => {
              const isGradient = item.image.startsWith("linear-gradient");

              return (
                <CarouselItem key={item.id} className="relative w-full pl-0">
                  {/* Clickable Full Card Link */}
                  <Link
                    href={`/anime/${item.slug}/${item.episodeNumber || 1}`}
                    className="relative block w-full min-h-[520px] sm:min-h-[600px] lg:min-h-[640px] overflow-hidden group/card"
                  >
                    {/* Layer 0: Background Anime Poster/Banner & Contrast Gradients */}
                    <div className="absolute inset-0 size-full z-0 bg-muted overflow-hidden">
                      {isGradient ? (
                        <div
                          className="absolute inset-0 size-full transition-transform duration-700 ease-out group-hover/card:scale-105"
                          style={getImageStyle(item.image)}
                        />
                      ) : (
                        <img
                          src={item.image}
                          alt={item.title}
                          loading="eager"
                          decoding="async"
                          className="absolute inset-0 size-full object-cover object-center transition-transform duration-700 ease-out group-hover/card:scale-105"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.opacity = "0";
                          }}
                        />
                      )}

                      {/* Gradient Overlays for readable text contrast & ambient depth */}
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/65 to-card/25" />
                      <div className="absolute inset-0 bg-gradient-to-r from-card/90 via-card/45 to-transparent" />
                    </div>

                    {/* Layer 10: Radial Grid Pattern Dots & Top Ambient Glow Blur (ON TOP of Image) */}
                    <div className="absolute inset-0 z-10 pointer-events-none bg-grid-pattern opacity-70 mix-blend-overlay" />
                    <div className="absolute -top-36 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-primary/30 blur-[120px] rounded-full pointer-events-none z-10" />

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
