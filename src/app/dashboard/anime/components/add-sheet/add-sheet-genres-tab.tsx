"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GenreMultiSelectCombobox } from "../taxonomy/genre-multiselect-combobox";

interface AddSheetGenresTabProps {
  studios: string;
  setStudios: (v: string) => void;
  selectedGenres: string[];
  setSelectedGenres: (genres: string[]) => void;
}

export function AddSheetGenresTab({
  studios,
  setStudios,
  selectedGenres,
  setSelectedGenres,
}: AddSheetGenresTabProps) {
  return (
    <div className="space-y-4 focus-visible:outline-hidden">
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

      <div className="space-y-1.5">
        <Label className="text-xs font-medium">Genres</Label>
        <GenreMultiSelectCombobox
          selectedGenres={selectedGenres}
          onChange={setSelectedGenres}
        />
      </div>
    </div>
  );
}
