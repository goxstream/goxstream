"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GenreMultiSelectCombobox } from "../taxonomy/genre-multiselect-combobox";

interface InlineEditGenresProps {
  selectedGenres: string[];
  setSelectedGenres: (genres: string[]) => void;
  synopsis: string;
  setSynopsis: (v: string) => void;
}

export function InlineEditGenres({
  selectedGenres,
  setSelectedGenres,
  synopsis,
  setSynopsis,
}: InlineEditGenresProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <Label className="text-[11px] font-medium">Genres</Label>
        <GenreMultiSelectCombobox
          selectedGenres={selectedGenres}
          onChange={setSelectedGenres}
        />
      </div>

      <div className="space-y-1">
        <Label className="text-[11px] font-medium">Synopsis</Label>
        <Textarea
          value={synopsis}
          onChange={(e) => setSynopsis(e.target.value)}
          rows={2}
          className="text-xs resize-none"
        />
      </div>
    </div>
  );
}
