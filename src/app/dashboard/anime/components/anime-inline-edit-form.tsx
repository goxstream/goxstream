"use client";

import { useState } from "react";
import { X, Save, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InlineEditPoster } from "./inline-edit/inline-edit-poster";
import { InlineEditDetails } from "./inline-edit/inline-edit-details";
import { InlineEditGenres } from "./inline-edit/inline-edit-genres";
import type { AnimeItem, AnimeStatus, AnimeType, SeasonName } from "../types";

interface AnimeInlineEditFormProps {
  anime: AnimeItem;
  onSave: (updated: AnimeItem) => void;
  onCancel: () => void;
}

export function AnimeInlineEditForm({
  anime,
  onSave,
  onCancel,
}: AnimeInlineEditFormProps) {
  const [titleRomaji, setTitleRomaji] = useState(anime.titleRomaji);
  const [titleEnglish, setTitleEnglish] = useState(anime.titleEnglish);
  const [synopsis, setSynopsis] = useState(anime.synopsis);
  const [type, setType] = useState<AnimeType>(anime.type);
  const [status, setStatus] = useState<AnimeStatus>(anime.status);
  const [episodes, setEpisodes] = useState(anime.episodes);
  const [rating, setRating] = useState(anime.rating || 8.0);
  const [seasonYear, setSeasonYear] = useState(anime.season.year);
  const [seasonName, setSeasonName] = useState<SeasonName>(anime.season.season);
  const [coverImage, setCoverImage] = useState(anime.coverImage);
  const [studiosStr, setStudiosStr] = useState(anime.studios.join(", "));
  const [selectedGenres, setSelectedGenres] = useState<string[]>(anime.genres);

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleSave = () => {
    onSave({
      ...anime,
      titleRomaji,
      titleEnglish,
      synopsis,
      type,
      status,
      episodes: Number(episodes),
      rating: Number(rating),
      season: { year: Number(seasonYear), season: seasonName },
      coverImage,
      studios: studiosStr.split(",").map((s) => s.trim()).filter(Boolean),
      genres: selectedGenres,
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="p-4 bg-muted/20 border-t border-b border-border/60 rounded-md my-1 space-y-4 animate-in fade-in-50 duration-150">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-border/40 pb-2">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-primary/10 text-primary flex items-center justify-center">
            <Film className="h-3.5 w-3.5" />
          </div>
          <h4 className="text-xs font-semibold text-foreground">
            Quick Inline Edit — <span className="text-primary">{anime.titleRomaji}</span>
          </h4>
        </div>
        <div className="flex items-center gap-1.5">
          <Button size="xs" variant="ghost" onClick={onCancel} className="h-7 text-xs px-2.5">
            <X className="h-3 w-3 mr-1" />
            Cancel
          </Button>
          <Button size="xs" onClick={handleSave} className="h-7 text-xs bg-primary text-primary-foreground px-3 gap-1">
            <Save className="h-3 w-3" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Grid layout composing sub-modules */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <InlineEditPoster
          titleRomaji={titleRomaji}
          coverImage={coverImage}
          setCoverImage={setCoverImage}
        />

        <div className="md:col-span-9 space-y-3">
          <InlineEditDetails
            titleRomaji={titleRomaji}
            setTitleRomaji={setTitleRomaji}
            titleEnglish={titleEnglish}
            setTitleEnglish={setTitleEnglish}
            status={status}
            setStatus={setStatus}
            type={type}
            setType={setType}
            episodes={episodes}
            setEpisodes={setEpisodes}
            rating={rating}
            setRating={setRating}
            studiosStr={studiosStr}
            setStudiosStr={setStudiosStr}
            seasonName={seasonName}
            setSeasonName={setSeasonName}
            seasonYear={seasonYear}
            setSeasonYear={setSeasonYear}
          />

          <InlineEditGenres
            selectedGenres={selectedGenres}
            toggleGenre={toggleGenre}
            synopsis={synopsis}
            setSynopsis={setSynopsis}
          />
        </div>
      </div>
    </div>
  );
}
