"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, X, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { ANIME_GENRES } from "../../constants";

interface GenreMultiSelectComboboxProps {
  selectedGenres: string[];
  onChange: (genres: string[]) => void;
}

export function GenreMultiSelectCombobox({
  selectedGenres,
  onChange,
}: GenreMultiSelectComboboxProps) {
  const [open, setOpen] = useState(false);

  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      onChange(selectedGenres.filter((g) => g !== genre));
    } else {
      onChange([...selectedGenres, genre]);
    }
  };

  const removeGenre = (genre: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selectedGenres.filter((g) => g !== genre));
  };

  return (
    <div className="space-y-2">
      {/* Combobox Trigger Button */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            type="button"
            role="combobox"
            className="border-border/60 bg-background/80 h-9 w-full justify-between text-xs"
          >
            <div className="flex items-center gap-1.5 truncate">
              <Tag className="text-muted-foreground h-3.5 w-3.5 shrink-0" />
              <span>
                {selectedGenres.length === 0
                  ? "Search & select genres..."
                  : `${selectedGenres.length} genre(s) selected`}
              </span>
            </div>
            <ChevronsUpDown className="text-muted-foreground h-3.5 w-3.5 shrink-0 opacity-70" />
          </Button>
        </PopoverTrigger>

        <PopoverContent align="start" className="w-[300px] p-0 text-xs">
          <Command>
            <CommandInput placeholder="Search genre..." className="h-8 text-xs" />
            <CommandList className="max-h-48">
              <CommandEmpty className="text-muted-foreground py-2 text-center text-xs">
                No genre found.
              </CommandEmpty>
              <CommandGroup>
                {ANIME_GENRES.map((genre) => {
                  const isSelected = selectedGenres.includes(genre);
                  return (
                    <CommandItem
                      key={genre}
                      onSelect={() => toggleGenre(genre)}
                      className="flex cursor-pointer items-center justify-between text-xs"
                    >
                      <span>{genre}</span>
                      {isSelected && <Check className="text-primary h-3.5 w-3.5" />}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected Genres Badges Display */}
      {selectedGenres.length > 0 && (
        <div className="bg-muted/20 border-border/60 flex max-h-28 flex-wrap gap-1 overflow-y-auto rounded-md border p-2">
          {selectedGenres.map((genre) => (
            <Badge
              key={genre}
              variant="secondary"
              className="bg-primary/10 text-primary border-primary/20 flex items-center gap-1 px-2 py-0.5 text-[10px] font-normal"
            >
              <span>{genre}</span>
              <button
                type="button"
                onClick={(e) => removeGenre(genre, e)}
                className="hover:text-destructive ml-0.5 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
