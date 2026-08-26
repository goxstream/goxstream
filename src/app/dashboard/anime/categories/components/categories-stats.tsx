"use client";

import { Layers, Tags, Flame, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { CategoryItem, GenreItem } from "../types";

interface CategoriesStatsProps {
  categories: CategoryItem[];
  genres: GenreItem[];
}

export function CategoriesStats({ categories, genres }: CategoriesStatsProps) {
  const totalCategories = categories.length;
  const totalActiveGenres = genres.filter((g) => g.isActive).length;

  const topGenre = genres.reduce(
    (max, item) => (item.animeCount > max.animeCount ? item : max),
    genres[0] || { name: "N/A", animeCount: 0 }
  );

  const totalCatalogTitles = categories.reduce((sum, c) => sum + c.animeCount, 0);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Formats */}
      <Card className="rounded-xl border-border/60 bg-card/60 shadow-xs">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Media Formats
            </span>
            <span className="text-2xl font-bold text-foreground">
              {totalCategories} Categories
            </span>
            <span className="text-xs text-muted-foreground">
              TV, Movie, OVA, ONA, Special
            </span>
          </div>
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Layers className="size-5" />
          </div>
        </CardContent>
      </Card>

      {/* Active Genres */}
      <Card className="rounded-xl border-border/60 bg-card/60 shadow-xs">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Active Taxonomy Tags
            </span>
            <span className="text-2xl font-bold text-foreground">
              {totalActiveGenres} Genres
            </span>
            <span className="text-xs text-muted-foreground">
              Main, Demographic, Themes
            </span>
          </div>
          <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
            <Tags className="size-5" />
          </div>
        </CardContent>
      </Card>

      {/* Top Popular Genre */}
      <Card className="rounded-xl border-border/60 bg-card/60 shadow-xs">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Most Popular Genre
            </span>
            <span className="text-2xl font-bold text-foreground truncate max-w-[140px]">
              {topGenre.name}
            </span>
            <span className="text-xs text-muted-foreground">
              {topGenre.animeCount.toLocaleString()} Anime titles
            </span>
          </div>
          <div className="flex size-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
            <Flame className="size-5" />
          </div>
        </CardContent>
      </Card>

      {/* Total Catalog Items */}
      <Card className="rounded-xl border-border/60 bg-card/60 shadow-xs">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Total Cataloged
            </span>
            <span className="text-2xl font-bold text-foreground">
              {totalCatalogTitles.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground">
              Assigned across categories
            </span>
          </div>
          <div className="flex size-10 items-center justify-center rounded-lg bg-sky-500/10 text-sky-500">
            <AlertCircle className="size-5" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
