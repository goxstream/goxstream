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

export function EpisodeListCard({
  anime,
  episodes,
  currentEpisodeNumber,
}: EpisodeListCardProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEpisodes = episodes.filter(
    (ep) =>
      ep.episodeNumber.toString().includes(searchQuery.trim()) ||
      ep.episodeTitle.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  return (
    <div className="bg-card border border-border/60 rounded-xl p-4 shadow-xs">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Film className="w-4 h-4 text-primary shrink-0" />
          <h2 className="text-sm font-bold text-foreground">Episode List</h2>
        </div>
        <Badge variant="secondary" className="text-[11px] font-mono rounded-md px-2">
          {episodes.length} Episodes
        </Badge>
      </div>

      {/* Search Episode Filter */}
      <div className="relative mb-3">
        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search episode or number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8 text-xs h-8 bg-background border-border/60 rounded-lg focus-visible:ring-primary/20"
        />
      </div>

      {/* Episode Items Container */}
      <div className="max-h-[380px] overflow-y-auto pr-1 flex flex-col gap-1.5 scrollbar-thin scrollbar-thumb-muted-foreground/20">
        {filteredEpisodes.length > 0 ? (
          filteredEpisodes.map((ep) => {
            const isCurrent = ep.episodeNumber === currentEpisodeNumber;
            return (
              <Link
                key={ep.id}
                href={`/anime/${anime.slug}/${ep.episodeNumber}`}
                className={`flex items-center justify-between p-2.5 rounded-lg border transition-all ${
                  isCurrent
                    ? "bg-primary/10 border-primary/40 text-primary font-medium shadow-xs"
                    : "bg-background/50 hover:bg-muted/60 border-border/40 text-foreground hover:border-border/80"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-mono shrink-0 ${
                      isCurrent
                        ? "bg-primary text-primary-foreground font-bold"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isCurrent ? <Play className="w-3 h-3 fill-current" /> : ep.episodeNumber}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className={`text-xs truncate ${isCurrent ? "font-semibold text-primary" : "text-foreground"}`}>
                      {ep.episodeTitle}
                    </p>
                    <span className="text-[10px] text-muted-foreground block">
                      {ep.duration} • {ep.releasedAt}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {ep.isSub && (
                    <span className="text-[9px] px-1 py-0.2 rounded bg-muted text-muted-foreground font-mono">
                      SUB
                    </span>
                  )}
                </div>
              </Link>
            );
          })
        ) : (
          <p className="text-xs text-muted-foreground text-center py-4">
            No episodes matching search.
          </p>
        )}
      </div>
    </div>
  );
}
