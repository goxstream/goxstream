"use client";

import { useState, useMemo } from "react";
import { AnimeHeader } from "./components/anime-header";
import { AnimeFilters } from "./components/anime-filters";
import { AnimeTable } from "./components/anime-table";
import { AnimeAddSheet } from "./components/anime-add-sheet";
import { MOCK_ANIME_DATA } from "./constants";
import type { AnimeItem, AnimeFilterState } from "./types";

export default function AnimeCatalogPage() {
  const [animeList, setAnimeList] = useState<AnimeItem[]>(MOCK_ANIME_DATA);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);

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
      // Search filter
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

      // Status filter
      if (filters.status !== "all" && anime.status !== filters.status) {
        return false;
      }

      // Type filter
      if (filters.type !== "all" && anime.type !== filters.type) {
        return false;
      }

      // Genre filter
      if (filters.genre !== "all" && !anime.genres.includes(filters.genre)) {
        return false;
      }

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

      {/* Main Table with Inline Accordion Edit */}
      <AnimeTable
        animeList={filteredAnimeList}
        onUpdateAnime={handleUpdateAnime}
        onDeleteAnime={handleDeleteAnime}
      />

      {/* Compact Add Anime Slide-over Sheet */}
      <AnimeAddSheet
        open={isAddSheetOpen}
        onOpenChange={setIsAddSheetOpen}
        onAddAnime={handleAddAnime}
      />
    </div>
  );
}
