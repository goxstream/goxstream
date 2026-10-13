"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Play, Film } from "lucide-react";
import type { AnimeItem, EpisodeItem } from "@/types/anime";

interface EpisodeListCardProps {
  anime: AnimeItem;
  episodes: EpisodeItem[];
  currentEpisodeNumber: number;
}

export function EpisodeListCard({ anime, episodes, currentEpisodeNumber }: EpisodeListCardProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEpisodes = episodes.filter(
    (ep) =>
      ep.episodeNumber.toString().includes(searchQuery.trim()) ||
      ep.episodeTitle.toLowerCase().includes(searchQuery.toLowerCase().trim()),
  );

  return (
    <div className="bg-card border-border/60 rounded-xl border p-4 shadow-xs">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Film className="text-primary h-4 w-4 shrink-0" />
          <h2 className="text-foreground text-sm font-bold">Episode List</h2>
        </div>
        <Badge variant="secondary" className="rounded-md px-2 font-mono text-[11px]">
          {episodes.length} Episodes
        </Badge>
      </div>

      {/* Search Episode Filter */}
      <div className="relative mb-3">
        <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-3.5 w-3.5" />
        <Input
          type="text"
          placeholder="Search episode or number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-background border-border/60 focus-visible:ring-primary/20 h-8 rounded-lg pl-8 text-xs"
        />
      </div>

      {/* Episode Items Container */}
      <div className="scrollbar-thumb-muted-foreground/20 flex max-h-[380px] scrollbar-thin flex-col gap-1.5 overflow-y-auto pr-1">
        {filteredEpisodes.length > 0 ? (
          filteredEpisodes.map((ep) => {
            const isCurrent = ep.episodeNumber === currentEpisodeNumber;
            return (
              <Link
                key={ep.id}
                href={`/anime/${anime.slug}/${ep.episodeNumber}`}
                className={`flex items-center justify-between rounded-lg border p-2.5 transition-all ${
                  isCurrent
                    ? "bg-primary/10 border-primary/40 text-primary font-medium shadow-xs"
                    : "bg-background/50 hover:bg-muted/60 border-border/40 text-foreground hover:border-border/80"
                }`}
              >
                <div className="flex min-w-0 items-center gap-2.5 pr-2">
                  <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md font-mono text-xs ${
                      isCurrent
                        ? "bg-primary text-primary-foreground font-bold"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isCurrent ? <Play className="h-3 w-3 fill-current" /> : ep.episodeNumber}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`truncate text-xs ${isCurrent ? "text-primary font-semibold" : "text-foreground"}`}
                    >
                      {ep.episodeTitle}
                    </p>
                    <span className="text-muted-foreground block text-[10px]">
                      {ep.duration} • {ep.releasedAt}
                    </span>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  {ep.isSub && (
                    <span className="py-0.2 bg-muted text-muted-foreground rounded px-1 font-mono text-[9px]">
                      SUB
                    </span>
                  )}
                </div>
              </Link>
            );
          })
        ) : (
          <p className="text-muted-foreground py-4 text-center text-xs">
            No episodes matching search.
          </p>
        )}
      </div>
    </div>
  );
}
