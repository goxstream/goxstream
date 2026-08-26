"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Info,
  ChevronDown,
  ChevronUp,
  Tag,
  Building2,
  Film,
  Mic,
  Clock,
  CalendarDays,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AnimeItem } from "@/types/anime";

interface AnimeMetadataProps {
  anime: AnimeItem;
}

export function AnimeMetadata({ anime }: AnimeMetadataProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-8">
      {/* Left 2 Columns: Full Synopsis & Detailed Info */}
      <div className="lg:col-span-2 space-y-6">
        {/* Synopsis Section */}
        <Card className="border-border/60 bg-card/50 shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Info className="size-5 text-primary" />
              <span>Sinopsis & Cerita</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p
              className={`text-sm text-foreground/90 leading-relaxed ${
                !isExpanded ? "line-clamp-4" : ""
              }`}
            >
              {anime.synopsis}
            </p>

            {anime.synopsis.length > 180 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1 pt-1"
              >
                {isExpanded ? (
                  <>
                    <span>Tampilkan Lebih Sedikit</span>
                    <ChevronUp className="size-3.5" />
                  </>
                ) : (
                  <>
                    <span>Baca Selengkapnya</span>
                    <ChevronDown className="size-3.5" />
                  </>
                )}
              </button>
            )}
          </CardContent>
        </Card>

        {/* Genres Section */}
        <Card className="border-border/60 bg-card/50 shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Tag className="size-4 text-primary" />
              <span>Kategori & Genre</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {anime.genres.map((genre) => (
                <Link key={genre} href={`/browse?genre=${encodeURIComponent(genre)}`}>
                  <Badge
                    variant="secondary"
                    className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer text-xs py-1 px-3"
                  >
                    {genre}
                  </Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Detailed Specification Grid */}
      <Card className="border-border/60 bg-card/50 shadow-xs h-fit">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <ShieldCheck className="size-4 text-primary" />
            <span>Informasi Detail</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          <div className="flex justify-between items-center py-1.5 border-b border-border/40">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Building2 className="size-3.5" /> Studio
            </span>
            <span className="font-semibold text-foreground">{anime.studio}</span>
          </div>

          <div className="flex justify-between items-center py-1.5 border-b border-border/40">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Film className="size-3.5" /> Format & Tipe
            </span>
            <span className="font-semibold text-foreground">{anime.type}</span>
          </div>

          <div className="flex justify-between items-center py-1.5 border-b border-border/40">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <CalendarDays className="size-3.5" /> Musim Rilis
            </span>
            <span className="font-semibold text-foreground">
              {anime.season} {anime.year}
            </span>
          </div>

          <div className="flex justify-between items-center py-1.5 border-b border-border/40">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Mic className="size-3.5" /> Audio / Sulit Suara
            </span>
            <span className="font-semibold text-foreground">{anime.subOrDub}</span>
          </div>

          <div className="flex justify-between items-center py-1.5 border-b border-border/40">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Clock className="size-3.5" /> Total Episode
            </span>
            <span className="font-semibold text-foreground">
              {anime.episodesCount} Episode
            </span>
          </div>

          <div className="flex justify-between items-center py-1.5">
            <span className="text-muted-foreground">Status Tayang</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {anime.status}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
