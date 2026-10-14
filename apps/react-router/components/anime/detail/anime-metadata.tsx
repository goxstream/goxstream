import { useState } from "react";
import { Link } from "react-router";
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
import { Skeleton } from "@goxstream/ui/components/skeleton";
import { Badge } from "@goxstream/ui/components/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@goxstream/ui/components/card";
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
              <span>Synopsis</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p
              className={`text-muted-foreground text-sm leading-relaxed transition-all duration-300 ${
                !isExpanded ? "line-clamp-4" : ""
              }`}
            >
              {anime.synopsis}
            </p>
            {anime.synopsis.length > 250 && (
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-primary hover:text-primary/80 flex cursor-pointer items-center gap-1 text-xs font-semibold"
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

        {/* Genres & Tags */}
        <Card className="border-border/60 bg-card/50 shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg font-bold">
              <Tag className="text-primary size-5" />
              <span>Genres</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {anime.genres.map((genre) => (
                <Link key={genre} to={`/browse?genre=${encodeURIComponent(genre)}`}>
                  <Badge
                    variant="secondary"
                    className="hover:bg-primary/20 hover:text-primary cursor-pointer px-3 py-1 text-xs font-medium transition-colors"
                  >
                    {genre}
                  </Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Full Specifications */}
      <div>
        <Card className="border-border/60 bg-card/50 h-fit shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg font-bold">
              <Film className="text-primary size-5" />
              <span>Anime Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="border-border/40 flex items-center justify-between border-b py-2">
              <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                <Building2 className="size-3.5" /> Studio
              </span>
              <span className="text-foreground font-semibold">{anime.studio}</span>
            </div>

            <div className="border-border/40 flex items-center justify-between border-b py-2">
              <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                <Film className="size-3.5" /> Type / Format
              </span>
              <span className="text-foreground font-semibold">{anime.type}</span>
            </div>

            <div className="border-border/40 flex items-center justify-between border-b py-2">
              <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                <ShieldCheck className="size-3.5" /> Status
              </span>
              <span className="text-foreground font-semibold">{anime.status}</span>
            </div>

            <div className="border-border/40 flex items-center justify-between border-b py-2">
              <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                <Clock className="size-3.5" /> Total Episodes
              </span>
              <span className="text-foreground font-semibold">{anime.episodesCount} Episodes</span>
            </div>

            <div className="border-border/40 flex items-center justify-between border-b py-2">
              <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                <CalendarDays className="size-3.5" /> Premiered
              </span>
              <span className="text-foreground font-semibold">
                {anime.season} {anime.year}
              </span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                <Mic className="size-3.5" /> Available Audio
              </span>
              <span className="text-foreground font-semibold">{anime.subOrDub}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
