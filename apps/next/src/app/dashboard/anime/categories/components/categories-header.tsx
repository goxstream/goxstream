"use client";

import { Plus, Tags, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CategoriesHeaderProps {
  onOpenAddSheet: (type: "category" | "genre") => void;
}

export function CategoriesHeader({ onOpenAddSheet }: CategoriesHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-5">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Layers className="size-6 text-primary" />
          Categories & Genres
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage media format categories, genres, demographic tags, and taxonomy structures for your anime catalog.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onOpenAddSheet("genre")}
          className="rounded-lg gap-1.5"
        >
          <Tags className="size-4" />
          Add Genre Tag
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={() => onOpenAddSheet("category")}
          className="rounded-lg gap-1.5"
        >
          <Plus className="size-4" />
          Add Category
        </Button>
      </div>
    </div>
  );
}
