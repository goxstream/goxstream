"use client";

import { useState, useMemo, useRef } from "react";
import { Filter, Check, X, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox";
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
  const [query, setQuery] = useState("");
  const inputContainerRef = useRef<HTMLDivElement>(null);

  const availableGenres = useMemo(() => {
    return genres.filter((g) => g !== "All");
  }, [genres]);

  const filteredGenres = useMemo(() => {
    if (!query.trim()) return availableGenres;
    const lowerQuery = query.toLowerCase();
    return availableGenres.filter((g) => g.toLowerCase().includes(lowerQuery));
  }, [availableGenres, query]);

  const isFiltered = selectedGenre !== "All" && Boolean(selectedGenre);

  return (
    <div className="space-y-3 p-4 rounded-2xl bg-card border border-border/80 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
          <Filter className="size-3.5 text-primary" />
          <span>Filter Trending by Genre</span>
        </div>

        {/* Combobox Dropdown */}
        <div className="w-full sm:w-64">
          <Combobox>
            <div ref={inputContainerRef} className="w-full relative">
              <ComboboxInput
                value={query}
                onInput={(e: React.FormEvent<HTMLInputElement>) => {
                  setQuery(e.currentTarget.value);
                }}
                placeholder={isFiltered ? selectedGenre : "Select Genre..."}
                showTrigger
                className="w-full h-9 text-xs font-medium bg-background rounded-xl border border-border/80 shadow-xs focus-within:border-primary/50"
              />
            </div>

            <ComboboxContent
              anchor={inputContainerRef}
              sideOffset={6}
              align="end"
              className="!w-[var(--anchor-width)] !min-w-[var(--anchor-width)] !max-w-[var(--anchor-width)] z-50 bg-popover border border-border/60 shadow-md rounded-xl p-1"
            >
              <ComboboxList className="max-h-56 no-scrollbar">
                <ComboboxItem
                  value="All"
                  onClick={() => {
                    onGenreSelect("All");
                    setQuery("");
                  }}
                  className="text-xs py-2 px-2.5 rounded-lg cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground font-medium flex items-center justify-between"
                >
                  <span>All Genres</span>
                  {!isFiltered && (
                    <Check className="size-3.5 text-primary shrink-0" />
                  )}
                </ComboboxItem>

                {filteredGenres.length === 0 ? (
                  <ComboboxEmpty className="text-xs py-3 px-2 text-center text-muted-foreground">
                    No genre found
                  </ComboboxEmpty>
                ) : (
                  filteredGenres.map((g) => {
                    const isSelected = selectedGenre.toLowerCase() === g.toLowerCase();
                    return (
                      <ComboboxItem
                        key={g}
                        value={g}
                        onClick={() => {
                          onGenreSelect(g);
                          setQuery("");
                        }}
                        className={cn(
                          "text-xs py-2 px-2.5 rounded-lg cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground font-medium flex items-center justify-between",
                          isSelected && "bg-primary/10 text-primary font-bold"
                        )}
                      >
                        <span>{g}</span>
                        {isSelected && (
                          <Check className="size-3.5 text-primary shrink-0" />
                        )}
                      </ComboboxItem>
                    );
                  })
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>
      </div>

      {/* Active Selected Genre Badge & Reset Bar */}
      {isFiltered && (
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/40">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">Active Filter:</span>
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary border border-primary/20 text-xs font-semibold px-2.5 py-1 flex items-center gap-1.5 rounded-lg"
            >
              <span>Genre: {selectedGenre}</span>
              <button
                type="button"
                onClick={() => onGenreSelect("All")}
                className="hover:opacity-75 cursor-pointer"
                aria-label="Remove selected genre filter"
              >
                <X className="size-3" />
              </button>
            </Badge>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onGenreSelect("All")}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 font-medium cursor-pointer"
          >
            <RotateCcw className="size-3" />
            Reset Filter
          </Button>
        </div>
      )}
    </div>
  );
}
