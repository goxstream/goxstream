"use client";

import { Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ANIME_GENRES } from "../../constants";

interface InlineEditGenresProps {
  selectedGenres: string[];
  toggleGenre: (genre: string) => void;
  synopsis: string;
  setSynopsis: (v: string) => void;
}

export function InlineEditGenres({
  selectedGenres,
  toggleGenre,
  synopsis,
  setSynopsis,
}: InlineEditGenresProps) {
  return (
    <div className="space-y-3">
      {/* Genre Badges Picker */}
      <div className="space-y-1">
        <Label className="text-[11px] font-medium">Genres</Label>
        <div className="flex flex-wrap gap-1 p-2 bg-background/80 rounded-md border border-border/60 max-h-24 overflow-y-auto">
          {ANIME_GENRES.map((genre) => {
            const isSelected = selectedGenres.includes(genre);
            return (
              <Badge
                key={genre}
                variant={isSelected ? "default" : "outline"}
                className={`cursor-pointer text-[10px] px-1.5 py-0.2 transition-colors ${
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                }`}
                onClick={() => toggleGenre(genre)}
              >
                {isSelected && <Check className="h-2.5 w-2.5 mr-1" />}
                {genre}
              </Badge>
            );
          })}
        </div>
      </div>

      {/* Synopsis */}
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
