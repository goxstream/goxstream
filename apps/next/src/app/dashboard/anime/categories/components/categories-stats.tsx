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
    genres[0] || { name: "N/A", animeCount: 0 },
  );

  const totalCatalogTitles = categories.reduce((sum, c) => sum + c.animeCount, 0);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Formats */}
      <Card className="border-border/60 bg-card/60 rounded-xl shadow-xs">
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Media Formats
            </span>
            <span className="text-foreground text-2xl font-bold">{totalCategories} Categories</span>
            <span className="text-muted-foreground text-xs">TV, Movie, OVA, ONA, Special</span>
          </div>
          <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
            <Layers className="size-5" />
          </div>
        </CardContent>
      </Card>

      {/* Active Genres */}
      <Card className="border-border/60 bg-card/60 rounded-xl shadow-xs">
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Active Taxonomy Tags
            </span>
            <span className="text-foreground text-2xl font-bold">{totalActiveGenres} Genres</span>
            <span className="text-muted-foreground text-xs">Main, Demographic, Themes</span>
          </div>
          <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
            <Tags className="size-5" />
          </div>
        </CardContent>
      </Card>

      {/* Top Popular Genre */}
      <Card className="border-border/60 bg-card/60 rounded-xl shadow-xs">
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Most Popular Genre
            </span>
            <span className="text-foreground max-w-[140px] truncate text-2xl font-bold">
              {topGenre.name}
            </span>
            <span className="text-muted-foreground text-xs">
              {topGenre.animeCount.toLocaleString()} Anime titles
            </span>
          </div>
          <div className="flex size-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
            <Flame className="size-5" />
          </div>
        </CardContent>
      </Card>

      {/* Total Catalog Items */}
      <Card className="border-border/60 bg-card/60 rounded-xl shadow-xs">
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Total Cataloged
            </span>
            <span className="text-foreground text-2xl font-bold">
              {totalCatalogTitles.toLocaleString()}
            </span>
            <span className="text-muted-foreground text-xs">Assigned across categories</span>
          </div>
          <div className="flex size-10 items-center justify-center rounded-lg bg-sky-500/10 text-sky-500">
            <AlertCircle className="size-5" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
