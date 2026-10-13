"use client";

import { use, useState } from "react";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { useWatchDetails } from "@/hooks/use-watch-details";
import { Button } from "@/components/ui/button";
import { Sun } from "lucide-react";
import { EpisodeHeaderInfo } from "./episode-header-info";
import { EpisodeSidebar } from "./episode-sidebar";
import { EpisodeListCard } from "./sidebar/episode-list-card";
import { CommentsSection } from "./comments-section";

const VideoPlayer = dynamic(() => import("./video-player").then((mod) => mod.VideoPlayer), {
  ssr: false,
  loading: () => <Skeleton className="bg-muted/60 aspect-video w-full animate-pulse rounded-xl" />,
});

interface WatchEpisodeContentProps {
  paramsPromise: Promise<{ slug: string; episode: string }>;
}

export function WatchEpisodeContent({ paramsPromise }: WatchEpisodeContentProps) {
  const { slug, episode: epParam } = use(paramsPromise);
  const { details, episodes, recommendations, isLoading, notFoundError } = useWatchDetails(
    slug,
    epParam,
  );

  const [activeSourceId, setActiveSourceId] = useState(details?.sources[0]?.id || "server-alpha");
  const [isCinemaMode, setIsCinemaMode] = useState(false);

  if (notFoundError) {
    notFound();
  }

  if (isLoading || !details) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="w-full space-y-6">
          <Skeleton className="aspect-video w-full rounded-2xl" />
          <div className="space-y-3">
            <Skeleton className="h-7 w-2/3 rounded-md" />
            <Skeleton className="h-4 w-1/3 rounded-md" />
          </div>
          <div className="space-y-4 pt-4">
            <Skeleton className="h-6 w-40 rounded-md" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { anime, episode, sources, prevEpisode, nextEpisode } = details;
  const activeSource = sources.find((s) => s.id === activeSourceId) || sources[0];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="relative">
        {isCinemaMode && (
          <div
            onClick={() => setIsCinemaMode(false)}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-md transition-opacity duration-300 dark:bg-black/95"
            title="Click to exit Cinema Mode"
          />
        )}

        <div className="relative grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="flex flex-col gap-5 lg:col-span-8">
            {/* Elevated Cinema Theater Control Bar & Video Player Container */}
            <div className={`transition-all duration-300 ${isCinemaMode ? "relative z-50" : ""}`}>
              {isCinemaMode && (
                <div className="mb-3 flex items-center justify-between gap-3 rounded-xl border border-white/15 bg-neutral-900/90 p-3 text-white shadow-lg backdrop-blur-md">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" />
                    <span className="text-xs font-bold tracking-tight text-white">
                      Cinema Theater Active
                    </span>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsCinemaMode(false)}
                    className="h-8 gap-1.5 rounded-lg border-white/20 bg-white/10 text-xs font-semibold text-white shadow-xs hover:bg-white/20"
                  >
                    <Sun className="h-3.5 w-3.5" />
                    Exit Cinema Mode
                  </Button>
                </div>
              )}

              <div
                className={
                  isCinemaMode
                    ? "overflow-hidden rounded-2xl border border-white/20 shadow-2xl"
                    : ""
                }
              >
                <VideoPlayer
                  currentSource={activeSource}
                  title={`${anime.title} - Episode ${episode.episodeNumber}`}
                  poster={episode.thumbnail}
                  nextEpisode={nextEpisode}
                  animeSlug={anime.slug}
                />
              </div>
            </div>

            <EpisodeHeaderInfo
              anime={anime}
              episode={episode}
              sources={sources}
              activeSourceId={activeSource.id}
              onSelectSource={(id) => setActiveSourceId(id)}
              prevEpisode={prevEpisode}
              nextEpisode={nextEpisode}
              isCinemaMode={isCinemaMode}
              onToggleCinemaMode={() => setIsCinemaMode(!isCinemaMode)}
            />

            {/* Mobile / Tablet Episode Selector (Placed immediately after EpisodeHeaderInfo & before Comments) */}
            <div className="mt-4 block lg:hidden">
              <EpisodeListCard
                anime={anime}
                episodes={episodes}
                currentEpisodeNumber={episode.episodeNumber}
              />
            </div>

            <CommentsSection animeId={anime.id} episodeId={episode.id} />
          </div>

          <div
            className={`lg:col-span-4 ${isCinemaMode ? "pointer-events-none opacity-20 transition-opacity" : ""}`}
          >
            <EpisodeSidebar
              anime={anime}
              episodes={episodes}
              currentEpisodeNumber={episode.episodeNumber}
              recommendations={recommendations}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
