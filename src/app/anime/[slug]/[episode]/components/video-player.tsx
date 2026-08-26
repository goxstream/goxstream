"use client";

import Link from "next/link";
import { MediaPlayer, MediaOutlet, MediaPoster } from "@vidstack/react";
import { buttonVariants } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import type { StreamSource, EpisodeItem } from "@/types/anime";

interface VideoPlayerProps {
  currentSource: StreamSource;
  title: string;
  poster: string;
  nextEpisode?: EpisodeItem;
  animeSlug: string;
}

export function VideoPlayer({
  currentSource,
  title,
  poster,
  nextEpisode,
  animeSlug,
}: VideoPlayerProps) {
  return (
    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border border-border/60 shadow-sm group">
      <MediaPlayer
        title={title}
        src={currentSource.url}
        controls
        aspectRatio="16/9"
        className="w-full h-full text-white font-sans overflow-hidden"
      >
        <MediaOutlet>
          <MediaPoster
            src={poster}
            alt={title}
            className="w-full h-full object-cover opacity-80 transition-opacity group-hover:opacity-100"
          />
        </MediaOutlet>
      </MediaPlayer>

      {/* Overlay controls */}
      {nextEpisode && (
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2 pointer-events-auto">
          <Link
            href={`/anime/${animeSlug}/episode-${nextEpisode.episodeNumber}`}
            className={buttonVariants({
              variant: "default",
              size: "sm",
              className: "bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-medium h-8 px-3 rounded-md shadow-xs",
            })}
          >
            <span>Next Ep</span>
            <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>
      )}
    </div>
  );
}
