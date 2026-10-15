"use client";

import { useEffect, useState, lazy, Suspense } from "react";
import { Link } from "react-router";
import { buttonVariants } from "@goxstream/ui/components/button";
import { ChevronRight } from "lucide-react";
import type { StreamSource, EpisodeItem } from "@/types/anime";

// Client-only dynamic import to prevent SSR evaluation of @vidstack/react in Cloudflare Worker isolates
const VideoPlayerClient = lazy(() => import("./video-player-client"));

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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="border-border/60 group relative aspect-video w-full overflow-hidden rounded-xl border bg-black shadow-xs">
      {isMounted ? (
        <Suspense
          fallback={
            <div className="relative h-full w-full">
              <img src={poster} alt={title} className="h-full w-full object-cover opacity-80" />
            </div>
          }
        >
          <VideoPlayerClient title={title} src={currentSource.url} poster={poster} />
        </Suspense>
      ) : (
        <div className="relative h-full w-full">
          <img src={poster} alt={title} className="h-full w-full object-cover opacity-80" />
        </div>
      )}

      {/* Overlay Next Ep button */}
      {nextEpisode && (
        <div className="pointer-events-auto absolute top-4 right-4 z-20 flex items-center gap-2">
          <Link
            to={`/anime/${animeSlug}/${nextEpisode.episodeNumber}`}
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
