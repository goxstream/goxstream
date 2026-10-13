"use client";

import { useState, useMemo, useRef } from "react";
import { Check } from "lucide-react";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox";
import { ANIME_GENRES } from "@/lib/constants";
import { cn } from "@/lib/utils";

import type { BaseGenreMultiSelectComboboxProps } from "../../types";

export function BaseGenreMultiSelectCombobox({
  value,
  onValueChange,
  className,
  contentClassName,
}: BaseGenreMultiSelectComboboxProps) {
  const [query, setQuery] = useState("");
  const inputContainerRef = useRef<HTMLDivElement>(null);

  // Parse comma-separated value into array of selected genres
  const selectedGenres = useMemo(() => {
    if (!value || value === "All") return [];
    return value
      .split(",")
      .map((g) => g.trim())
      .filter(Boolean);
  }, [value]);

  // Filterable genres list (excluding 'All' from search options)
  const availableGenres = useMemo(() => {
    return ANIME_GENRES.filter((g) => g !== "All");
  }, []);

  // Filter genres based on user input query
  const filteredGenres = useMemo(() => {
    if (!query.trim()) return availableGenres;
    const lowerQuery = query.toLowerCase();
    return availableGenres.filter((g) => g.toLowerCase().includes(lowerQuery));
  }, [availableGenres, query]);

  // Compute placeholder text
  const placeholderText = useMemo(() => {
    if (selectedGenres.length === 0) return "All Genres";
    if (selectedGenres.length === 1) return selectedGenres[0];
    return `${selectedGenres.length} Genres Selected`;
  }, [selectedGenres]);

  const toggleGenre = (genreName: string) => {
    if (genreName === "All") {
      onValueChange("All");
      return;
    }

    let nextGenres: string[];
    if (selectedGenres.includes(genreName)) {
      nextGenres = selectedGenres.filter((g) => g !== genreName);
    } else {
      nextGenres = [...selectedGenres, genreName];
    }

    if (nextGenres.length === 0) {
      onValueChange("All");
    } else {
      onValueChange(nextGenres.join(","));
    }
  };

  return (
    <div className="flex w-full flex-col gap-1.5">
      <label className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
        Genres
      </label>

      <Combobox>
        <div ref={inputContainerRef} className="relative w-full">
          <ComboboxInput
            value={query}
            onInput={(e: React.FormEvent<HTMLInputElement>) => {
              setQuery(e.currentTarget.value);
            }}
            placeholder={placeholderText}
            showTrigger
            className={cn(
              "bg-card border-border/80 focus-within:border-primary/50 h-10 w-full rounded-xl border text-xs font-medium shadow-xs transition-colors",
              className,
            )}
          />
        </div>

        <ComboboxContent
          anchor={inputContainerRef}
          sideOffset={6}
          align="start"
          className={cn(
            "bg-popover border-border/60 z-50 !w-[var(--anchor-width)] !max-w-[var(--anchor-width)] !min-w-[var(--anchor-width)] rounded-xl border p-1 shadow-md",
            contentClassName,
          )}
        >
          <ComboboxList className="no-scrollbar max-h-56">
            {/* 'All Genres' Reset Option */}
            <ComboboxItem
              value="All"
              onClick={() => {
                onValueChange("All");
                setQuery("");
              }}
              className="hover:bg-accent hover:text-accent-foreground flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium transition-colors"
            >
              <span>All Genres</span>
              {selectedGenres.length === 0 && <Check className="text-primary size-3.5 shrink-0" />}
            </ComboboxItem>

            {filteredGenres.length === 0 ? (
              <ComboboxEmpty className="text-muted-foreground px-2 py-3 text-center text-xs">
                No genre found
              </ComboboxEmpty>
            ) : (
              filteredGenres.map((genre) => {
                const isSelected = selectedGenres.includes(genre);
                return (
                  <ComboboxItem
                    key={genre}
                    value={genre}
                    onClick={() => toggleGenre(genre)}
                    className={cn(
                      "hover:bg-accent hover:text-accent-foreground flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium transition-colors",
                      isSelected && "bg-primary/10 text-primary",
                    )}
                  >
                    <span>{genre}</span>
                    {isSelected && <Check className="text-primary size-3.5 shrink-0" />}
                  </ComboboxItem>
                );
              })
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}
