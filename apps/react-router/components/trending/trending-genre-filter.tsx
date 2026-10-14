import { useState, useMemo, useRef } from "react";
import { Filter, Check, X, RotateCcw } from "lucide-react";
import { Badge } from "@goxstream/ui/components/badge";
import { Button } from "@goxstream/ui/components/button";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@goxstream/ui/components/combobox";
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
    <div className="bg-card border-border/80 space-y-3 rounded-2xl border p-4 shadow-xs">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="text-muted-foreground flex items-center gap-2 text-xs font-bold tracking-wider uppercase">
          <Filter className="text-primary size-3.5" />
          <span>Filter Trending by Genre</span>
        </div>

        {/* Combobox Dropdown */}
        <div className="w-full sm:w-64">
          <Combobox>
            <div ref={inputContainerRef} className="relative w-full">
              <ComboboxInput
                value={query}
                onInput={(e: React.FormEvent<HTMLInputElement>) => {
                  setQuery(e.currentTarget.value);
                }}
                placeholder={isFiltered ? selectedGenre : "Select Genre..."}
                showTrigger
                className="bg-background border-border/80 focus-within:border-primary/50 h-9 w-full rounded-xl border text-xs font-medium shadow-xs"
              />
            </div>

            <ComboboxContent
              anchor={inputContainerRef}
              sideOffset={6}
              align="end"
              className="bg-popover border-border/60 z-50 !w-[var(--anchor-width)] !max-w-[var(--anchor-width)] !min-w-[var(--anchor-width)] rounded-xl border p-1 shadow-md"
            >
              <ComboboxList className="no-scrollbar max-h-56">
                <ComboboxItem
                  value="All"
                  onClick={() => {
                    onGenreSelect("All");
                    setQuery("");
                  }}
                  className="hover:bg-accent hover:text-accent-foreground flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium transition-colors"
                >
                  <span>All Genres</span>
                  {!isFiltered && <Check className="text-primary size-3.5 shrink-0" />}
                </ComboboxItem>

                {filteredGenres.length === 0 ? (
                  <ComboboxEmpty className="text-muted-foreground px-2 py-3 text-center text-xs">
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
                          "hover:bg-accent hover:text-accent-foreground flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium transition-colors",
                          isSelected && "bg-primary/10 text-primary font-bold",
                        )}
                      >
                        <span>{g}</span>
                        {isSelected && <Check className="text-primary size-3.5 shrink-0" />}
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
        <div className="border-border/40 flex items-center justify-between gap-2 border-t pt-2">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-xs font-semibold">Active Filter:</span>
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary border-primary/20 flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold"
            >
              <span>Genre: {selectedGenre}</span>
              <button
                type="button"
                onClick={() => onGenreSelect("All")}
                className="cursor-pointer hover:opacity-75"
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
            className="text-muted-foreground hover:text-destructive flex h-7 cursor-pointer items-center gap-1 px-2 text-xs font-medium"
          >
            <RotateCcw className="size-3" />
            Reset Filter
          </Button>
        </div>
      )}
    </div>
  );
}
