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
    return value.split(",").map((g) => g.trim()).filter(Boolean);
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
    <div className="w-full flex flex-col gap-1.5">
      <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
        Genres
      </label>

      <Combobox>
        <div ref={inputContainerRef} className="w-full relative">
          <ComboboxInput
            value={query}
            onInput={(e: React.FormEvent<HTMLInputElement>) => {
              setQuery(e.currentTarget.value);
            }}
            placeholder={placeholderText}
            showTrigger
            className={cn(
              "w-full h-10 text-xs font-medium bg-card rounded-xl border border-border/80 shadow-xs focus-within:border-primary/50 transition-colors",
              className
            )}
          />
        </div>

        <ComboboxContent
          anchor={inputContainerRef}
          sideOffset={6}
          align="start"
          className={cn(
            "!w-[var(--anchor-width)] !min-w-[var(--anchor-width)] !max-w-[var(--anchor-width)] z-50 bg-popover border border-border/60 shadow-md rounded-xl p-1",
            contentClassName
          )}
        >
          <ComboboxList className="max-h-56 no-scrollbar">
            {/* 'All Genres' Reset Option */}
            <ComboboxItem
              value="All"
              onClick={() => {
                onValueChange("All");
                setQuery("");
              }}
              className="text-xs py-2 px-2.5 rounded-lg cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground font-medium flex items-center justify-between"
            >
              <span>All Genres</span>
              {selectedGenres.length === 0 && (
                <Check className="size-3.5 text-primary shrink-0" />
              )}
            </ComboboxItem>

            {filteredGenres.length === 0 ? (
              <ComboboxEmpty className="text-xs py-3 px-2 text-center text-muted-foreground">
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
                      "text-xs py-2 px-2.5 rounded-lg cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground font-medium flex items-center justify-between",
                      isSelected && "bg-primary/10 text-primary"
                    )}
                  >
                    <span>{genre}</span>
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
  );
}
