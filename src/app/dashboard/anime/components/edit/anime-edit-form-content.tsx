"use client";

import { useState } from "react";
import { InlineEditPoster } from "../inline-edit/inline-edit-poster";
import { InlineEditDetails } from "../inline-edit/inline-edit-details";
import { InlineEditGenres } from "../inline-edit/inline-edit-genres";
import type { AnimeItem, AnimeStatus, AnimeType, SeasonName } from "../../types";

interface AnimeEditFormContentProps {
  anime: AnimeItem;
  onSave: (updated: AnimeItem) => void;
}

export function AnimeEditFormContent({
  anime,
  onSave,
}: AnimeEditFormContentProps) {
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
    <div className="space-y-4">
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
export type { AnimeEditFormContentProps };
