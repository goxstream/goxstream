"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Play, Search, LayoutGrid, List, Clock, Sparkles } from "lucide-react";
import { EpisodeCard } from "@/components/episode-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getImageStyle } from "@/lib/utils";
import type { EpisodeItem } from "@/types/anime";

interface EpisodeListProps {
  episodes?: EpisodeItem[];
  animeSlug?: string;
  isLoading?: boolean;
}

export function EpisodeList({ episodes = [], animeSlug = "", isLoading }: EpisodeListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeRange, setActiveRange] = useState<string>("all");

  // Generate Episode Ranges (e.g. 1-12, 13-24)
  const ranges = useMemo(() => {
    const rangeList: { label: string; value: string; min: number; max: number }[] = [
      { label: "All Episodes", value: "all", min: 1, max: 9999 },
    ];
    if (episodes.length > 12) {
      const step = 12;
      for (let i = 1; i <= episodes.length; i += step) {
        const max = Math.min(i + step - 1, episodes.length);
        rangeList.push({
          label: `Ep ${i} - ${max}`,
          value: `${i}-${max}`,
          min: i,
          max: max,
        });
      }
    }
    return rangeList;
  }, [episodes]);

  // Filter episodes by query and selected range
  const filteredEpisodes = useMemo(() => {
    return episodes.filter((ep) => {
      // Range check
      if (activeRange !== "all") {
        const selectedRange = ranges.find((r) => r.value === activeRange);
        if (selectedRange) {
          if (ep.episodeNumber < selectedRange.min || ep.episodeNumber > selectedRange.max) {
            return false;
          }
        }
      }

      // Query check
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase().trim();
        const numMatch = ep.episodeNumber.toString() === q;
        const titleMatch = ep.episodeTitle.toLowerCase().includes(q);
        return numMatch || titleMatch;
      }

      return true;
    });
  }, [episodes, searchQuery, activeRange, ranges]);

  if (isLoading) {
    return (
      <section id="episodes" className="my-8 scroll-mt-20">
        <Card className="border-border/60 bg-card/40 shadow-xs">
          <CardHeader className="flex flex-col justify-between gap-4 pb-4 sm:flex-row sm:items-center">
            <div className="space-y-1">
              <Skeleton className="h-6 w-48 rounded" />
              <Skeleton className="h-3 w-64 rounded" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <Card key={i} className="border-border/60 flex flex-col overflow-hidden">
                  <Skeleton className="aspect-video w-full rounded-none" />
                  <div className="space-y-1.5 p-2.5">
                    <Skeleton className="h-3 w-3/4 rounded" />
                    <Skeleton className="h-2.5 w-1/2 rounded" />
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  const latestEpNumber =
    episodes.length > 0 ? Math.max(...episodes.map((e) => e.episodeNumber)) : 0;

  return (
    <section id="episodes" className="my-8 scroll-mt-20">
      <Card className="border-border/60 bg-card/40 shadow-xs">
        <CardHeader className="flex flex-col justify-between gap-4 pb-4 sm:flex-row sm:items-center">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-xl font-extrabold">
              <Play className="text-primary fill-primary size-5" />
              <span>Episode List ({episodes.length})</span>
            </CardTitle>
            <p className="text-muted-foreground text-xs">
              Select an episode to start streaming in high definition
            </p>
          </div>

          {/* View Mode Toggle Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="h-8 px-2.5"
            >
              <LayoutGrid className="size-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-8 px-2.5"
            >
              <List className="size-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Controls Bar: Search Input & Range Selector */}
          <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
            {/* Search Input */}
            <div className="relative max-w-sm flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                placeholder="Search episode # or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-border/80 h-9 pl-9 text-xs"
              />
            </div>

            {/* Range Selector Tabs */}
            {ranges.length > 1 && (
              <Tabs value={activeRange} onValueChange={setActiveRange} className="w-full sm:w-auto">
                <TabsList className="bg-muted/60 h-9 flex-wrap p-1">
                  {ranges.map((r) => (
                    <TabsTrigger
                      key={r.value}
                      value={r.value}
                      className="h-7 px-2.5 text-xs font-medium"
                    >
                      {r.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            )}
          </div>

          {/* Episode Grid or List */}
          {filteredEpisodes.length === 0 ? (
            <div className="border-border/60 rounded-xl border border-dashed py-12 text-center">
              <p className="text-muted-foreground text-sm font-semibold">No episodes found</p>
              <p className="text-muted-foreground/80 mt-1 text-xs">
                Try adjusting your search query or episode filter.
              </p>
            </div>
          ) : viewMode === "grid" ? (
            /* Grid View Mode */
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {filteredEpisodes.map((ep) => {
                const isLatest = ep.episodeNumber === latestEpNumber;
                const isGradient = ep.thumbnail && ep.thumbnail.startsWith("linear-gradient");

                return (
                  <Link
                    key={ep.id}
                    href={`/anime/${animeSlug}/${ep.episodeNumber}`}
                    className="group border-border/60 bg-card hover:border-primary/50 relative flex flex-col overflow-hidden rounded-xl border transition-all duration-200 hover:shadow-xs"
                  >
                    {/* Thumbnail Poster */}
                    <div className="bg-muted relative aspect-video w-full overflow-hidden">
                      {isGradient ? (
                        <div
                          className="h-full w-full transition-transform duration-300 group-hover:scale-105"
                          style={getImageStyle(ep.thumbnail)}
                        />
                      ) : (
                        <img
                          src={ep.thumbnail || ""}
                          alt={ep.episodeTitle}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.opacity = "0";
                          }}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                        <div className="bg-primary/90 text-primary-foreground flex size-9 items-center justify-center rounded-full shadow-lg">
                          <Play className="fill-primary-foreground ml-0.5 size-4" />
                        </div>
                      </div>

                      {/* Episode Number Badge */}
                      <div className="absolute top-1.5 left-1.5 flex items-center gap-1">
                        <Badge className="border-white/20 bg-black/70 px-1.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
                          EP {ep.episodeNumber}
                        </Badge>
                        {isLatest && (
                          <Badge className="gap-0.5 bg-emerald-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
                            <Sparkles className="size-2" /> NEW
                          </Badge>
                        )}
                      </div>

                      {/* Audio & Duration Badges */}
                      <div className="absolute right-1.5 bottom-1.5 left-1.5 flex items-center justify-between text-[10px] font-medium text-white/90">
                        <span>{ep.isSub && ep.isDub ? "SUB & DUB" : ep.isSub ? "SUB" : "DUB"}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="size-2.5" />
                          {ep.duration}
                        </span>
                      </div>
                    </div>

                    {/* Card Content Info */}
                    <div className="space-y-1 p-2.5">
                      <h4 className="text-foreground group-hover:text-primary line-clamp-1 text-xs font-semibold transition-colors">
                        {ep.episodeTitle}
                      </h4>
                      <p className="text-muted-foreground flex items-center justify-between text-[10px]">
                        <span>{ep.releasedAt}</span>
                        <span className="text-primary text-[10px] font-medium group-hover:underline">
                          Watch →
                        </span>
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            /* Compact List View Mode */
            <div className="divide-border/40 border-border/60 divide-y overflow-hidden rounded-xl border">
              {filteredEpisodes.map((ep) => {
                const isLatest = ep.episodeNumber === latestEpNumber;
                return (
                  <Link
                    key={ep.id}
                    href={`/anime/${animeSlug}/${ep.episodeNumber}`}
                    className="group bg-card hover:bg-muted/50 flex items-center justify-between p-3 transition-colors"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-extrabold transition-colors">
                        {ep.episodeNumber}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-foreground group-hover:text-primary truncate text-xs font-semibold transition-colors">
                            {ep.episodeTitle}
                          </h4>
                          {isLatest && (
                            <Badge className="shrink-0 bg-emerald-500 px-1.5 py-0 text-[9px] font-bold text-white">
                              NEW
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground mt-0.5 flex items-center gap-2 text-[11px]">
                          <span>{ep.duration}</span>
                          <span>•</span>
                          <span>{ep.releasedAt}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      <Badge
                        variant="outline"
                        className="border-border/80 hidden text-[10px] sm:inline-flex"
                      >
                        {ep.isSub && ep.isDub ? "SUB & DUB" : ep.isSub ? "SUB" : "DUB"}
                      </Badge>
                      <Button
                        size="xs"
                        variant="ghost"
                        className="group-hover:text-primary size-8 p-0"
                      >
                        <Play className="size-4 fill-current" />
                      </Button>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
