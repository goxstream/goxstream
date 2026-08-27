"use client";

import { ANIME_GENRES } from "@/lib/constants";

export interface GenreRibbonProps {
  selectedGenre: string;
  onGenreChange: (genre: string) => void;
}

export function GenreRibbon({ selectedGenre, onGenreChange }: GenreRibbonProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar scroll-smooth">
      {ANIME_GENRES.map((g) => {
        const isSelected = selectedGenre === g || (g === "All" && selectedGenre === "All");
        return (
          <button
            key={g}
            type="button"
            onClick={() => onGenreChange(g)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-150 shrink-0 border ${
              isSelected
                ? "bg-primary text-primary-foreground border-primary shadow-xs shadow-primary/20"
                : "bg-card text-muted-foreground border-border/80 hover:text-foreground hover:bg-muted/80 hover:border-border"
            }`}
          >
            {g}
          </button>
        );
      })}
    </div>
  );
}
