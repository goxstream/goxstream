"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Play,
  Search,
  LayoutGrid,
  List,
  Clock,
  Sparkles,
} from "lucide-react";
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
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
            <div className="space-y-1">
              <Skeleton className="h-6 w-48 rounded" />
              <Skeleton className="h-3 w-64 rounded" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <EpisodeCard key={i} isLoading={true} />
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  const latestEpNumber = episodes.length > 0 ? Math.max(...episodes.map((e) => e.episodeNumber)) : 0;

  return (
    <section id="episodes" className="my-8 scroll-mt-20">
      <Card className="border-border/60 bg-card/40 shadow-xs">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
          <div className="space-y-1">
            <CardTitle className="text-xl font-extrabold flex items-center gap-2">
              <Play className="size-5 text-primary fill-primary" />
              <span>Episode List ({episodes.length})</span>
            </CardTitle>
            <p className="text-xs text-muted-foreground">
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
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search episode # or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs border-border/80"
              />
            </div>

            {/* Range Selector Tabs */}
            {ranges.length > 1 && (
              <Tabs value={activeRange} onValueChange={setActiveRange} className="w-full sm:w-auto">
                <TabsList className="h-9 p-1 bg-muted/60 flex-wrap">
                  {ranges.map((r) => (
                    <TabsTrigger
                      key={r.value}
                      value={r.value}
                      className="text-xs h-7 px-2.5 font-medium"
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
            <div className="text-center py-12 border border-dashed border-border/60 rounded-xl">
              <p className="text-sm font-semibold text-muted-foreground">
                No episodes found
              </p>
              <p className="text-xs text-muted-foreground/80 mt-1">
                Try adjusting your search query or episode filter.
              </p>
            </div>
          ) : viewMode === "grid" ? (
            /* Grid View Mode */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredEpisodes.map((ep) => {
                const isLatest = ep.episodeNumber === latestEpNumber;
                const isGradient = ep.thumbnail && ep.thumbnail.startsWith("linear-gradient");

                return (
                  <Link
                    key={ep.id}
                    href={`/anime/${animeSlug}/${ep.episodeNumber}`}
                    className="group relative flex flex-col rounded-xl overflow-hidden border border-border/60 bg-card hover:border-primary/50 transition-all duration-200 hover:shadow-xs"
                  >
                    {/* Thumbnail Poster */}
                    <div className="relative aspect-video w-full overflow-hidden bg-muted">
                      {isGradient ? (
                        <div
                          className="w-full h-full transition-transform duration-300 group-hover:scale-105"
                          style={getImageStyle(ep.thumbnail)}
                        />
                      ) : (
                        <img
                          src={ep.thumbnail || ""}
                          alt={ep.episodeTitle}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.opacity = "0";
                          }}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="size-10 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center shadow-lg">
                          <Play className="size-5 fill-primary-foreground ml-0.5" />
                        </div>
                      </div>

                      {/* Episode Number Badge */}
                      <div className="absolute top-2 left-2 flex items-center gap-1">
                        <Badge className="bg-black/70 backdrop-blur-md text-white border-white/20 text-[11px] font-bold">
                          EP {ep.episodeNumber}
                        </Badge>
                        {isLatest && (
                          <Badge className="bg-emerald-500 text-white text-[10px] font-bold gap-0.5">
                            <Sparkles className="size-2.5" /> NEW
                          </Badge>
                        )}
                      </div>

                      {/* Audio & Duration Badges */}
                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-white/90 font-medium">
                        <span>{ep.isSub && ep.isDub ? "SUB & DUB" : ep.isSub ? "SUB" : "DUB"}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="size-3" />
                          {ep.duration}
                        </span>
                      </div>
                    </div>

                    {/* Card Content Info */}
                    <div className="p-3 space-y-1">
                      <h4 className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {ep.episodeTitle}
                      </h4>
                      <p className="text-[11px] text-muted-foreground flex items-center justify-between">
                        <span>{ep.releasedAt}</span>
                        <span className="text-primary font-medium text-[10px] group-hover:underline">
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
            <div className="divide-y divide-border/40 border border-border/60 rounded-xl overflow-hidden">
              {filteredEpisodes.map((ep) => {
                const isLatest = ep.episodeNumber === latestEpNumber;
                return (
                  <Link
                    key={ep.id}
                    href={`/anime/${animeSlug}/${ep.episodeNumber}`}
                    className="group flex items-center justify-between p-3 bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="size-8 rounded-lg bg-primary/10 text-primary font-extrabold text-xs flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        {ep.episodeNumber}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors truncate">
                            {ep.episodeTitle}
                          </h4>
                          {isLatest && (
                            <Badge className="bg-emerald-500 text-white text-[9px] font-bold py-0 px-1.5 shrink-0">
                              NEW
                            </Badge>
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground flex items-center gap-2 mt-0.5">
                          <span>{ep.duration}</span>
                          <span>•</span>
                          <span>{ep.releasedAt}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <Badge variant="outline" className="text-[10px] hidden sm:inline-flex border-border/80">
                        {ep.isSub && ep.isDub ? "SUB & DUB" : ep.isSub ? "SUB" : "DUB"}
                      </Badge>
                      <Button size="xs" variant="ghost" className="size-8 p-0 group-hover:text-primary">
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
