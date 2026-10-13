"use client";

import { Plus, Tags, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CategoriesHeaderProps {
  onOpenAddSheet: (type: "category" | "genre") => void;
}

export function CategoriesHeader({ onOpenAddSheet }: CategoriesHeaderProps) {
  return (
    <div className="border-border/60 flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="text-foreground flex items-center gap-2 text-2xl font-bold tracking-tight">
          <Layers className="text-primary size-6" />
          Categories & Genres
        </h1>
        <p className="text-muted-foreground text-sm">
          Manage media format categories, genres, demographic tags, and taxonomy structures for your
          anime catalog.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onOpenAddSheet("genre")}
          className="gap-1.5 rounded-lg"
        >
          <Tags className="size-4" />
          Add Genre Tag
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={() => onOpenAddSheet("category")}
          className="gap-1.5 rounded-lg"
        >
          <Plus className="size-4" />
          Add Category
        </Button>
      </div>
    </div>
  );
}
