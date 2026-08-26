"use client";

import { Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ANIME_GENRES } from "../../constants";

interface AddSheetGenresTabProps {
  studios: string;
  setStudios: (v: string) => void;
  selectedGenres: string[];
  toggleGenre: (genre: string) => void;
}

export function AddSheetGenresTab({
  studios,
  setStudios,
  selectedGenres,
  toggleGenre,
}: AddSheetGenresTabProps) {
  return (
    <div className="space-y-3.5 focus-visible:outline-hidden">
      <div className="space-y-1.5">
        <Label htmlFor="studios" className="text-xs font-medium">
          Studio(s)
        </Label>
        <Input
          id="studios"
          placeholder="e.g. MAPPA, Wit Studio"
          value={studios}
          onChange={(e) => setStudios(e.target.value)}
          className="h-9 text-xs"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-medium">Select Genres</Label>
        <div className="flex flex-wrap gap-1.5 p-2 bg-muted/30 rounded-lg border border-border/60 max-h-48 overflow-y-auto">
          {ANIME_GENRES.map((genre) => {
            const isSelected = selectedGenres.includes(genre);
            return (
              <Badge
                key={genre}
                variant={isSelected ? "default" : "outline"}
                className={`cursor-pointer text-[11px] px-2 py-0.5 transition-colors ${
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                }`}
                onClick={() => toggleGenre(genre)}
              >
                {isSelected && <Check className="h-3 w-3 mr-1" />}
                {genre}
              </Badge>
            );
          })}
        </div>
      </div>
    </div>
  );
}
