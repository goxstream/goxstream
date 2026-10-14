import { useState } from "react";
import { Link } from "react-router";
import { Input } from "@goxstream/ui/components/input";
import { Badge } from "@goxstream/ui/components/badge";
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
                to={`/anime/${anime.slug}/${ep.episodeNumber}`}
                className={`flex items-center justify-between rounded-lg border p-2.5 transition-all ${
                  isCurrent
                    ? "bg-primary/10 border-primary/40 text-primary font-medium shadow-xs"
                    : "border-border/40 hover:bg-muted/50 hover:border-border/80 text-foreground"
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded text-xs font-bold ${
                      isCurrent
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isCurrent ? <Play className="h-3 w-3 fill-current" /> : ep.episodeNumber}
                  </div>
                  <div className="truncate">
                    <p
                      className={`truncate text-xs ${
                        isCurrent ? "font-bold" : "text-muted-foreground"
                      }`}
                    >
                      {ep.episodeTitle}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1.5">
                  <span className="text-muted-foreground font-mono text-[10px]">{ep.duration}</span>
                  <Badge
                    variant="outline"
                    className="border-border/60 text-muted-foreground px-1 py-0 text-[9px]"
                  >
                    {ep.isSub ? "SUB" : "DUB"}
                  </Badge>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="text-muted-foreground py-8 text-center text-xs">
            No episode matches "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  );
}
