"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Bookmark, Share2, Check, AlertCircle } from "lucide-react";
import type { AnimeItem } from "@/types/anime";

interface EpisodeActionBarProps {
  anime: AnimeItem;
  isCinemaMode: boolean;
  onToggleCinemaMode: () => void;
}

export function EpisodeActionBar({
  anime,
  isCinemaMode,
  onToggleCinemaMode,
}: EpisodeActionBarProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [reported, setReported] = useState(false);

  // Initialize favorite / watchlist status from localStorage
  useEffect(() => {
    if (!anime?.slug || typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("goxstream_favorites");
      if (stored) {
        const favs: string[] = JSON.parse(stored);
        if (Array.isArray(favs) && favs.includes(anime.slug)) {
          setIsBookmarked(true);
        }
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [anime?.slug]);

  const handleToggleWatchlist = () => {
    if (!anime?.slug) return;
    const nextState = !isBookmarked;
    setIsBookmarked(nextState);

    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("goxstream_favorites");
        let favs: string[] = stored ? JSON.parse(stored) : [];
        if (!Array.isArray(favs)) favs = [];

        if (nextState) {
          if (!favs.includes(anime.slug)) favs.push(anime.slug);
        } else {
          favs = favs.filter((slug) => slug !== anime.slug);
        }
        localStorage.setItem("goxstream_favorites", JSON.stringify(favs));
      } catch {
        // Ignore localStorage errors
      }
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReportIssue = () => {
    setReported(true);
    setTimeout(() => setReported(false), 3000);
  };

  return (
    <div className="flex items-center justify-between gap-2 flex-wrap">
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleCinemaMode}
          className={`h-8 text-xs rounded-lg border-border/60 w-[150px] min-w-[150px] justify-center ${
            isCinemaMode ? "bg-primary/10 text-primary border-primary/30" : ""
          }`}
        >
          {isCinemaMode ? (
            <>
              <Sun className="w-3.5 h-3.5 mr-1.5 shrink-0" />
              Exit Cinema Mode
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 mr-1.5 shrink-0" />
              Cinema Mode
            </>
          )}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleToggleWatchlist}
          className={`h-8 text-xs rounded-lg border-border/60 w-[155px] min-w-[155px] justify-center ${
            isBookmarked ? "text-amber-500 border-amber-500/30 bg-amber-500/10" : ""
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 mr-1.5 shrink-0 ${isBookmarked ? "fill-amber-500" : ""}`} />
          {isBookmarked ? "Watchlisted" : "Add to Watchlist"}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          className="h-8 text-xs rounded-lg border-border/60 w-[125px] min-w-[125px] justify-center"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-500 shrink-0" />
              Copied Link!
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 mr-1.5 shrink-0" />
              Share
            </>
          )}
        </Button>
      </div>

      <Button
        variant={reported ? "secondary" : "ghost"}
        size="sm"
        onClick={handleReportIssue}
        className={`h-8 text-xs rounded-lg w-[130px] min-w-[130px] justify-center ${
          reported ? "text-emerald-500 bg-emerald-500/10" : "text-muted-foreground hover:text-destructive"
        }`}
      >
        {reported ? (
          <>
            <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-500 shrink-0" />
            Reported!
          </>
        ) : (
          <>
            <AlertCircle className="w-3.5 h-3.5 mr-1.5 shrink-0" />
            Report Issue
          </>
        )}
      </Button>
    </div>
  );
}
