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
    <div className="border-border/60 group relative aspect-video w-full overflow-hidden rounded-xl border bg-black shadow-sm">
      <MediaPlayer
        title={title}
        src={currentSource.url}
        controls
        aspectRatio={16 / 9}
        className="h-full w-full overflow-hidden font-sans text-white"
      >
        <MediaOutlet>
          <MediaPoster
            src={poster}
            alt={title}
            className="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100"
          />
        </MediaOutlet>
      </MediaPlayer>

      {/* Overlay controls */}
      {nextEpisode && (
        <div className="pointer-events-auto absolute top-4 right-4 z-20 flex items-center gap-2">
          <Link
            href={`/anime/${animeSlug}/${nextEpisode.episodeNumber}`}
            className={buttonVariants({
              variant: "default",
              size: "sm",
              className:
                "bg-primary text-primary-foreground hover:bg-primary/90 h-8 rounded-md px-3 text-xs font-medium shadow-xs",
            })}
          >
            <span>Next Ep</span>
            <ChevronRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
