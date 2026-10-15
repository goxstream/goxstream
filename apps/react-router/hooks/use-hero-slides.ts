import { useState, useEffect, useMemo } from "react";
import type { CarouselApi } from "@goxstream/ui/components/carousel";
import { useScheduleAnime } from "@/hooks/use-schedule-anime";
import { useFeaturedAnime } from "@/hooks/use-featured-anime";
import { useTrendingAnime } from "@/hooks/use-trending-anime";
import type { AnimeItem } from "@/types/anime";
import type { HeroSlideItem } from "@/types/hero";

export function useHeroSlides(initialFeaturedAnime?: AnimeItem | null) {
  const [api, setApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [count, setCount] = useState(0);

  const { scheduleItems, isLoading: isScheduleLoading, error: scheduleError } = useScheduleAnime();
  const { featuredAnime, error: featuredError } = useFeaturedAnime(initialFeaturedAnime);
  const { trendingAnime, error: trendingError } = useTrendingAnime();

  const slideItems = useMemo(() => {
    const items: HeroSlideItem[] = [];

    const today = new Date().toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();

    const todayItems = scheduleItems.filter(
      (s) => s.airDay.toLowerCase() === today || s.status === "airing_now",
    );

    const sourceSchedule = todayItems.length > 0 ? todayItems : scheduleItems;

    sourceSchedule.forEach((item) => {
      items.push({
        id: `sched-${item.id}`,
        slug: item.slug,
        title: item.title,
        japaneseTitle: item.japaneseTitle,
        image: item.bannerImage || item.coverImage,
        badgeText:
          item.status === "airing_now"
            ? "AIRING NOW"
            : item.airTime
              ? `AIRING TODAY (${item.airTime})`
              : "AIRING TODAY",
        rating: item.rating,
        episodeNumber: item.episodeNumber,
        airTime: item.airTime,
        season: item.season,
        year: item.year,
        genres: item.genres || [],
      });
    });

    if (featuredAnime && !items.some((i) => i.slug === featuredAnime.slug)) {
      items.push({
        id: `feat-${featuredAnime.id}`,
        slug: featuredAnime.slug,
        title: featuredAnime.title,
        japaneseTitle: featuredAnime.japaneseTitle,
        image: featuredAnime.bannerImage || featuredAnime.coverImage,
        badgeText: "FEATURED SIMULCAST",
        rating: featuredAnime.rating,
        episodeNumber: featuredAnime.latestEpisode || 1,
        season: featuredAnime.season,
        year: featuredAnime.year,
        genres: featuredAnime.genres || [],
        synopsis: featuredAnime.synopsis,
      });
    }

    trendingAnime.forEach((anime) => {
      if (items.length < 6 && !items.some((i) => i.slug === anime.slug)) {
        items.push({
          id: `trend-${anime.id}`,
          slug: anime.slug,
          title: anime.title,
          japaneseTitle: anime.japaneseTitle,
          image: anime.bannerImage || anime.coverImage,
          badgeText: "TRENDING TODAY",
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

  const error =
    slideItems.length === 0 ? scheduleError || featuredError || trendingError : null;

  return {
    api,
    setApi,
    slideItems,
    currentSlide,
    count,
    isLoading: isScheduleLoading && slideItems.length === 0,
    error,
  };
}
