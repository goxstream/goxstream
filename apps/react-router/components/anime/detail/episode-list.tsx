import { useState, useMemo } from "react";
import { Link } from "react-router";
import { Play, Search, LayoutGrid, List, Clock, Sparkles } from "lucide-react";
import { Skeleton } from "@goxstream/ui/components/skeleton";
import { Input } from "@goxstream/ui/components/input";
import { Button } from "@goxstream/ui/components/button";
import { Badge } from "@goxstream/ui/components/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@goxstream/ui/components/card";
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
    episodes.length > 0 ? Math.max(...episodes.map((e) => e.episodeNumber)) : 1;

  return (
    <section id="episodes" className="my-8 scroll-mt-20">
      <Card className="border-border/60 bg-card/40 shadow-xs">
        <CardHeader className="flex flex-col justify-between gap-4 pb-4 sm:flex-row sm:items-center">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-lg font-bold">
              <Play className="text-primary size-5 fill-current" />
              <span>Available Episodes</span>
              <Badge variant="secondary" className="ml-2 font-mono text-xs">
                {episodes.length}
              </Badge>
            </CardTitle>
            <p className="text-muted-foreground text-xs">
              Select an episode below to begin high-definition simulcast streaming.
            </p>
          </div>

          {/* Search & View Mode Switcher */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative w-full sm:w-48">
              <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
              <Input
                placeholder="Search episode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-background/80 border-border/80 h-8 pl-8 text-xs"
              />
            </div>

            <div className="bg-muted/60 border-border/60 flex items-center gap-0.5 rounded-lg border p-0.5">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
                className="size-7"
                aria-label="Grid View"
              >
                <LayoutGrid className="size-3.5" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
                className="size-7"
                aria-label="List View"
              >
                <List className="size-3.5" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Episode Range Navigation Buttons if > 12 episodes */}
          {ranges.length > 1 && (
            <div className="border-border/40 flex flex-wrap items-center gap-1.5 border-b pb-3">
              {ranges.map((range) => (
                <button
                  key={range.value}
                  type="button"
                  onClick={() => setActiveRange(range.value)}
                  className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                    activeRange === range.value
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          )}

          {/* Episode Items */}
          {filteredEpisodes.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground text-sm font-medium">
                No episodes found matching your filter.
              </p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {filteredEpisodes.map((episode) => {
                const isLatest = episode.episodeNumber === latestEpNumber;
                const isGradient =
                  episode.thumbnail && episode.thumbnail.startsWith("linear-gradient");

                return (
                  <Link
                    key={episode.id}
                    to={`/anime/${animeSlug}/${episode.episodeNumber}`}
                    className="group border-border/60 bg-card hover:border-primary/50 relative flex flex-col overflow-hidden rounded-xl border transition-all duration-200 hover:shadow-xs"
                  >
                    {/* Thumbnail */}
                    <div className="bg-muted relative aspect-video w-full overflow-hidden">
                      {isGradient ? (
                        <div
                          className="h-full w-full transition-transform duration-300 group-hover:scale-105"
                          style={getImageStyle(episode.thumbnail)}
                        />
                      ) : (
                        <img
                          src={episode.thumbnail || ""}
                          alt={episode.episodeTitle}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.opacity = "0";
                          }}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                        <div className="bg-primary/90 text-primary-foreground flex size-9 items-center justify-center rounded-full shadow-xs">
                          <Play className="ml-0.5 size-4 fill-current" />
                        </div>
                      </div>

                      {/* Top Badges */}
                      <div className="absolute top-1.5 left-1.5 z-10">
                        <Badge className="border-0 bg-black/75 px-1.5 py-0.5 font-mono text-[10px] text-white">
                          EP {episode.episodeNumber}
                        </Badge>
                      </div>

                      {isLatest && (
                        <div className="absolute top-1.5 right-1.5 z-10">
                          <Badge className="bg-primary border-0 px-1.5 py-0.5 text-[9px] font-bold text-white uppercase">
                            Latest
                          </Badge>
                        </div>
                      )}

                      {/* Duration */}
                      <div className="absolute right-1.5 bottom-1.5 z-10 text-[10px] font-medium text-white/90">
                        {episode.duration}
                      </div>
                    </div>

                    {/* Meta info */}
                    <div className="flex flex-1 flex-col justify-between p-2.5">
                      <h4 className="group-hover:text-primary line-clamp-1 text-xs font-semibold transition-colors">
                        {episode.episodeTitle}
                      </h4>
                      <div className="text-muted-foreground mt-1 flex items-center justify-between text-[10px]">
                        <span>{episode.isSub ? "SUB" : "DUB"}</span>
                        <span>{episode.releasedAt}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="divide-border/40 divide-y">
              {filteredEpisodes.map((episode) => (
                <Link
                  key={episode.id}
                  to={`/anime/${animeSlug}/${episode.episodeNumber}`}
                  className="hover:bg-muted/40 group flex items-center justify-between gap-4 p-3 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground group-hover:text-primary font-mono text-xs font-bold transition-colors">
                      #{episode.episodeNumber}
                    </span>
                    <div>
                      <h4 className="group-hover:text-primary text-sm font-semibold transition-colors">
                        {episode.episodeTitle}
                      </h4>
                      <p className="text-muted-foreground text-xs">{episode.releasedAt}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground font-mono text-xs">
                      {episode.duration}
                    </span>
                    <Button size="sm" variant="ghost" className="size-8 p-0">
                      <Play className="size-3.5 fill-current" />
                    </Button>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
