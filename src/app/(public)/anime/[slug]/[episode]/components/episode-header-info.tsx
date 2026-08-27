"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Bookmark,
  Share2,
  Moon,
  Sun,
  Server,
  AlertCircle,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { AnimeItem, EpisodeItem, StreamSource } from "@/types/anime";

interface EpisodeHeaderInfoProps {
  anime: AnimeItem;
  episode: EpisodeItem;
  sources: StreamSource[];
  activeSourceId: string;
  onSelectSource: (sourceId: string) => void;
  prevEpisode?: EpisodeItem;
  nextEpisode?: EpisodeItem;
  isCinemaMode: boolean;
  onToggleCinemaMode: () => void;
}

export function EpisodeHeaderInfo({
  anime,
  episode,
  sources,
  activeSourceId,
  onSelectSource,
  prevEpisode,
  nextEpisode,
  isCinemaMode,
  onToggleCinemaMode,
}: EpisodeHeaderInfoProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-5 py-4 border-b border-border/60">
      {/* Title & Episode Navigation Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <Link
              href={`/anime/${anime.slug}`}
              className="text-xs font-semibold text-primary hover:underline"
            >
              {anime.title}
            </Link>
            <span className="text-muted-foreground/60 text-xs">•</span>
            <Badge variant="outline" className="text-xs py-0 px-2 rounded-md font-mono border-border/60">
              Episode {episode.episodeNumber}
            </Badge>
            {episode.isSub && (
              <Badge variant="secondary" className="text-[10px] py-0 px-1.5 rounded-sm bg-primary/10 text-primary border border-primary/20">
                SUB
              </Badge>
            )}
            {episode.isDub && (
              <Badge variant="secondary" className="text-[10px] py-0 px-1.5 rounded-sm bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                DUB
              </Badge>
            )}
          </div>

          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
            {episode.episodeTitle}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Released {episode.releasedAt} • Duration: {episode.duration}
          </p>
        </div>

        {/* Prev / Next Episode Controls */}
        <div className="flex items-center gap-2">
          {prevEpisode ? (
            <Link
              href={`/anime/${anime.slug}/episode-${prevEpisode.episodeNumber}`}
              className={buttonVariants({
                variant: "outline",
                size: "sm",
                className: "h-9 px-3 rounded-lg border-border/60 text-xs",
              })}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous Ep
            </Link>
          ) : (
            <Button
              variant="outline"
              size="sm"
              disabled
              className="h-9 px-3 rounded-lg border-border/60 text-xs opacity-50"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous Ep
            </Button>
          )}

          {nextEpisode ? (
            <Link
              href={`/anime/${anime.slug}/episode-${nextEpisode.episodeNumber}`}
              className={buttonVariants({
                variant: "default",
                size: "sm",
                className: "h-9 px-3 rounded-lg text-xs shadow-xs",
              })}
            >
              Next Ep
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          ) : (
            <Button
              variant="outline"
              size="sm"
              disabled
              className="h-9 px-3 rounded-lg border-border/60 text-xs opacity-50"
            >
              Next Ep
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </div>

      {/* Stream Server Switcher Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-card border border-border/60 shadow-xs">
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-primary shrink-0" />
          <span className="text-xs font-semibold text-foreground">Select Stream Server:</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {sources.map((source) => {
            const isActive = source.id === activeSourceId;
            const isPrimary = source.isPrimary || source.id === "default-r2-primary";

            return (
              <button
                key={source.id}
                onClick={() => onSelectSource(source.id)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 border ${
                  isActive
                    ? "bg-primary text-primary-foreground border-primary shadow-xs"
                    : isPrimary
                    ? "bg-primary/10 hover:bg-primary/20 text-primary border-primary/30"
                    : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground border-border/60"
                }`}
              >
                <span>{source.serverName}</span>
                <span className={`text-[10px] px-1 py-0.2 rounded font-mono ${
                  isActive
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-background/80 text-muted-foreground"
                }`}>
                  {source.quality}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleCinemaMode}
            className={`h-8 text-xs rounded-lg border-border/60 ${
              isCinemaMode ? "bg-primary/10 text-primary border-primary/30" : ""
            }`}
          >
            {isCinemaMode ? (
              <>
                <Sun className="w-3.5 h-3.5 mr-1.5" />
                Exit Cinema Mode
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 mr-1.5" />
                Cinema Mode
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`h-8 text-xs rounded-lg border-border/60 ${
              isBookmarked ? "text-amber-500 border-amber-500/30 bg-amber-500/10" : ""
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 mr-1.5 ${isBookmarked ? "fill-amber-500" : ""}`} />
            {isBookmarked ? "Watchlisted" : "Add to Watchlist"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="h-8 text-xs rounded-lg border-border/60"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
                Copied Link!
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 mr-1.5" />
                Share
              </>
            )}
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-xs text-muted-foreground hover:text-destructive rounded-lg"
        >
          <AlertCircle className="w-3.5 h-3.5 mr-1.5" />
          Report Issue
        </Button>
      </div>

      {/* Episode Synopsis */}
      <div className="text-xs text-muted-foreground leading-relaxed bg-muted/20 p-3.5 rounded-xl border border-border/40">
        <span className="font-semibold text-foreground mr-1.5">Episode Synopsis:</span>
        {anime.synopsis}
      </div>
    </div>
  );
}
