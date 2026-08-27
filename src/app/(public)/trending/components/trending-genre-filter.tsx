"use client";

import { Filter } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrendingGenreFilterProps {
  genres: string[];
  selectedGenre: string;
  onGenreSelect: (genre: string) => void;
}

export function TrendingGenreFilter({
  genres,
  selectedGenre,
  onGenreSelect,
}: TrendingGenreFilterProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
        <div className="flex items-center gap-1.5">
          <Filter className="size-3.5 text-primary" />
          <span>Filter Trending by Genre:</span>
        </div>
        {selectedGenre !== "All" && (
          <button
            onClick={() => onGenreSelect("All")}
            className="text-primary hover:underline font-semibold cursor-pointer"
          >
            Reset filter
          </button>
        )}
      </div>

      {/* Scrollable Horizontal Genre Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {genres.map((genre) => {
          const isSelected = selectedGenre.toLowerCase() === genre.toLowerCase();

          return (
            <button
              key={genre}
              onClick={() => onGenreSelect(genre)}
              className={cn(
                "whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer border",
                isSelected
                  ? "bg-primary text-primary-foreground border-primary shadow-xs"
                  : "bg-muted/50 text-muted-foreground border-border/60 hover:bg-muted hover:text-foreground"
              )}
            >
              {genre}
            </button>
          );
        })}
      </div>
    </div>
  );
}
