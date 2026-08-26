"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoriesHeader } from "./components/categories-header";
import { CategoriesStats } from "./components/categories-stats";
import { CategoriesTable } from "./components/categories-table";
import { GenresGrid } from "./components/genres-grid";
import { CategoryAddSheet } from "./components/category-add-sheet";
import { useDashboardCategories } from "@/hooks/use-dashboard-categories";
import { MOCK_GENRES } from "./constants";
import type { CategoryItem, GenreItem, FormatCategoryCode, GenreGroup } from "./types";

export default function CategoriesPage() {
  const { categories, isLoading, setCategories } = useDashboardCategories();
  const [genres, setGenres] = useState<GenreItem[]>(MOCK_GENRES);

  // Sheet State
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetType, setSheetType] = useState<"category" | "genre">("category");

  const handleOpenAddSheet = (type: "category" | "genre") => {
    setSheetType(type);
    setSheetOpen(true);
  };

  // Category Handlers
  const handleToggleCategoryStatus = (id: string) => {
    setCategories((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isActive: !item.isActive } : item))
    );
  };

  const handleDeleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddCategory = (data: {
    code: FormatCategoryCode;
    name: string;
    slug: string;
    description: string;
  }) => {
    const newItem: CategoryItem = {
      id: `cat-${Date.now()}`,
      code: data.code,
      name: data.name,
      slug: data.slug,
      animeCount: 0,
      description: data.description,
      isActive: true,
      updatedAt: new Date().toISOString(),
    };
    setCategories((prev) => [newItem, ...prev]);
  };

  // Genre Handlers
  const handleToggleGenreStatus = (id: string) => {
    setGenres((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isActive: !item.isActive } : item))
    );
  };

  const handleDeleteGenre = (id: string) => {
    setGenres((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddGenre = (data: {
    name: string;
    slug: string;
    group: GenreGroup;
    description: string;
  }) => {
    const newItem: GenreItem = {
      id: `gen-${Date.now()}`,
      name: data.name,
      slug: data.slug,
      group: data.group,
      animeCount: 0,
      description: data.description,
      colorBadge: "default",
      isActive: true,
    };
    setGenres((prev) => [newItem, ...prev]);
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <CategoriesHeader onOpenAddSheet={handleOpenAddSheet} />

      {/* Stats Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-24 w-full rounded-xl bg-card border border-border/60" />
          <Skeleton className="h-24 w-full rounded-xl bg-card border border-border/60" />
          <Skeleton className="h-24 w-full rounded-xl bg-card border border-border/60" />
          <Skeleton className="h-24 w-full rounded-xl bg-card border border-border/60" />
        </div>
      ) : (
        <CategoriesStats categories={categories} genres={genres} />
      )}

      {/* Tabs Layout for Categories Format vs Genre Taxonomy */}
      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="w-full sm:w-auto grid grid-cols-2 rounded-lg bg-muted/60 p-1 mb-4">
          <TabsTrigger value="categories" className="rounded-md text-xs font-semibold">
            Media Format Categories ({categories.length})
          </TabsTrigger>
          <TabsTrigger value="genres" className="rounded-md text-xs font-semibold">
            Genres & Themes ({genres.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="focus-visible:outline-none">
          {isLoading ? (
            <Skeleton className="h-64 w-full rounded-xl bg-card border border-border/60" />
          ) : (
            <CategoriesTable
              categories={categories}
              onToggleStatus={handleToggleCategoryStatus}
              onDeleteCategory={handleDeleteCategory}
              onEditCategory={() => {}}
            />
          )}
        </TabsContent>

        <TabsContent value="genres" className="focus-visible:outline-none">
          <GenresGrid
            genres={genres}
            onToggleStatus={handleToggleGenreStatus}
            onDeleteGenre={handleDeleteGenre}
            onEditGenre={() => {}}
          />
        </TabsContent>
      </Tabs>

      {/* Slide-over Form Sheet */}
      <CategoryAddSheet
        open={sheetOpen}
        type={sheetType}
        onOpenChange={setSheetOpen}
        onAddCategory={handleAddCategory}
        onAddGenre={handleAddGenre}
      />
    </div>
  );
}
