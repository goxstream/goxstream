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
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AnimeItem } from "@/types/anime";

interface AnimeMetadataProps {
  anime?: AnimeItem | null;
  isLoading?: boolean;
}

export function AnimeMetadata({ anime, isLoading }: AnimeMetadataProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (isLoading || !anime) {
    return (
      <div className="my-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="border-border/60 bg-card/50 shadow-xs">
            <CardHeader className="pb-3">
              <Skeleton className="h-6 w-40 rounded" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-5/6 rounded" />
              <Skeleton className="h-4 w-4/6 rounded" />
            </CardContent>
          </Card>
          <Card className="border-border/60 bg-card/50 shadow-xs">
            <CardHeader className="pb-3">
              <Skeleton className="h-6 w-44 rounded" />
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-20 rounded-full" />
              ))}
            </CardContent>
          </Card>
        </div>
        <Card className="border-border/60 bg-card/50 h-fit shadow-xs">
          <CardHeader className="pb-3">
            <Skeleton className="h-6 w-48 rounded" />
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between py-1">
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="h-4 w-28 rounded" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="my-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Left 2 Columns: Full Synopsis & Detailed Info */}
      <div className="space-y-6 lg:col-span-2">
        {/* Synopsis Section */}
        <Card className="border-border/60 bg-card/50 shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg font-bold">
              <Info className="text-primary size-5" />
              <span>Synopsis & Story</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p
              className={`text-foreground/90 text-sm leading-relaxed ${
                !isExpanded ? "line-clamp-4" : ""
              }`}
            >
              {anime.synopsis}
            </p>

            {anime.synopsis.length > 180 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-primary inline-flex items-center gap-1 pt-1 text-xs font-semibold hover:underline"
              >
                {isExpanded ? (
                  <>
                    <span>Show Less</span>
                    <ChevronUp className="size-3.5" />
                  </>
                ) : (
                  <>
                    <span>Read More</span>
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
            <CardTitle className="flex items-center gap-2 text-base font-bold">
              <Tag className="text-primary size-4" />
              <span>Categories & Genres</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {anime.genres.map((genre) => (
                <Link key={genre} href={`/browse?genre=${encodeURIComponent(genre)}`}>
                  <Badge
                    variant="secondary"
                    className="hover:bg-primary hover:text-primary-foreground cursor-pointer px-3 py-1 text-xs transition-colors"
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
      <Card className="border-border/60 bg-card/50 h-fit shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-bold">
            <ShieldCheck className="text-primary size-4" />
            <span>Detailed Specifications</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          <div className="border-border/40 flex items-center justify-between border-b py-1.5">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Building2 className="size-3.5" /> Studio
            </span>
            <span className="text-foreground font-semibold">{anime.studio}</span>
          </div>

          <div className="border-border/40 flex items-center justify-between border-b py-1.5">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Film className="size-3.5" /> Format & Type
            </span>
            <span className="text-foreground font-semibold">{anime.type}</span>
          </div>

          <div className="border-border/40 flex items-center justify-between border-b py-1.5">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <CalendarDays className="size-3.5" /> Release Season
            </span>
            <span className="text-foreground font-semibold">
              {anime.season} {anime.year}
            </span>
          </div>

          <div className="border-border/40 flex items-center justify-between border-b py-1.5">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Mic className="size-3.5" /> Audio / Dubbing
            </span>
            <span className="text-foreground font-semibold">{anime.subOrDub}</span>
          </div>

          <div className="border-border/40 flex items-center justify-between border-b py-1.5">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Clock className="size-3.5" /> Total Episodes
            </span>
            <span className="text-foreground font-semibold">
              {anime.episodesCount} Episode{anime.episodesCount > 1 ? "s" : ""}
            </span>
          </div>

          <div className="flex items-center justify-between py-1.5">
            <span className="text-muted-foreground">Status</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {anime.status}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
