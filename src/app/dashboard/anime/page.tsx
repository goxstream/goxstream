"use client";

import { useState, useEffect, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimeHeader } from "./components/anime-header";
import { AnimeFilters } from "./components/anime-filters";
import { AnimeTable } from "./components/anime-table";
import { AnimeAddSheet } from "./components/anime-add-sheet";
import { AnimeEditSheet } from "./components/edit/anime-edit-sheet";
import { useDashboardAnime } from "@/hooks/use-dashboard-anime";
import type { AnimeItem, AnimeFilterState } from "./types";

export default function AnimeCatalogPage() {
  const { animeList: fetchedAnime, isLoading } = useDashboardAnime();
  const [animeList, setAnimeList] = useState<AnimeItem[]>([]);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [mobileEditAnime, setMobileEditAnime] = useState<AnimeItem | null>(null);

  useEffect(() => {
    if (fetchedAnime && fetchedAnime.length > 0) {
      const mapped: AnimeItem[] = fetchedAnime.map((item: any) => ({
        id: item.id,
        titleRomaji: item.title,
        titleEnglish: item.title,
        titleJapanese: item.japaneseTitle,
        slug: item.slug,
        type: item.type || "TV",
        status: item.status || "Ongoing",
        season: { year: item.year || 2026, season: item.season || "Spring" },
        seasonYear: item.year || 2026,
        episodes: item.episodesCount || 0,
        episodesCount: item.episodesCount || 0,
        durationPerEp: "24m",
        coverImage: item.coverImage || "",
        bannerImage: item.bannerImage || "",
        synopsis: item.synopsis || "",
        rating: item.rating || 0,
        studios: [item.studio || "Studio"],
        genres: item.genres || [],
        featured: false,
        trending: false,
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: item.updatedAt || new Date().toISOString(),
      }));
      setAnimeList(mapped);
    }
  }, [fetchedAnime]);



  // Filter state
  const [filters, setFilters] = useState<AnimeFilterState>({
    search: "",
    status: "all",
    genre: "all",
    season: "all",
    type: "all",
  });

  const handleFilterChange = (key: keyof AnimeFilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      status: "all",
      genre: "all",
      season: "all",
      type: "all",
    });
  };

  // Filtered dataset
  const filteredAnimeList = useMemo(() => {
    return animeList.filter((anime) => {
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const matchesTitle =
          anime.titleRomaji.toLowerCase().includes(query) ||
          anime.titleEnglish.toLowerCase().includes(query) ||
          anime.titleJapanese?.toLowerCase().includes(query);
        const matchesStudio = anime.studios.some((s) => s.toLowerCase().includes(query));
        const matchesId = anime.id.toLowerCase().includes(query);
        if (!matchesTitle && !matchesStudio && !matchesId) return false;
      }

      if (filters.status !== "all" && anime.status !== filters.status) return false;
      if (filters.type !== "all" && anime.type !== filters.type) return false;
      if (filters.genre !== "all" && !anime.genres.includes(filters.genre)) return false;

      return true;
    });
  }, [animeList, filters]);

  // CRUD Handlers
  const handleAddAnime = (newAnime: Omit<AnimeItem, "id" | "createdAt" | "updatedAt">) => {
    const anime: AnimeItem = {
      ...newAnime,
      id: `ani-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setAnimeList((prev) => [anime, ...prev]);
  };

  const handleUpdateAnime = (updatedAnime: AnimeItem) => {
    setAnimeList((prev) =>
      prev.map((item) => (item.id === updatedAnime.id ? updatedAnime : item))
    );
  };

  const handleDeleteAnime = (id: string) => {
    setAnimeList((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-7xl mx-auto w-full">
      {/* Header & Stats */}
      <AnimeHeader
        animeList={animeList}
        onOpenAddSheet={() => setIsAddSheetOpen(true)}
      />

      {/* Filter Bar */}
      <AnimeFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />

      {/* Main Table */}
      {isLoading ? (
        <Skeleton className="h-96 w-full rounded-xl bg-card border border-border/60" />
      ) : (
        <AnimeTable
          animeList={filteredAnimeList}
          onUpdateAnime={handleUpdateAnime}
          onDeleteAnime={handleDeleteAnime}
          onOpenMobileEdit={(anime) => setMobileEditAnime(anime)}
        />
      )}

      {/* Compact Add Anime Slide-over Sheet */}
      <AnimeAddSheet
        open={isAddSheetOpen}
        onOpenChange={setIsAddSheetOpen}
        onAddAnime={handleAddAnime}
      />

      {/* Adaptive Mobile Edit Sheet */}
      <AnimeEditSheet
        anime={mobileEditAnime}
        open={Boolean(mobileEditAnime)}
        onOpenChange={(open) => !open && setMobileEditAnime(null)}
        onSave={handleUpdateAnime}
      />
    </div>
  );
}
