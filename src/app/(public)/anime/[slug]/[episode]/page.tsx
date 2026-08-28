"use client";

import { use, useState } from "react";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { useWatchDetails } from "@/hooks/use-watch-details";
import { EpisodeHeaderInfo } from "./components/episode-header-info";
import { EpisodeSidebar } from "./components/episode-sidebar";
import { CommentsSection } from "./components/comments-section";

const VideoPlayer = dynamic(
  () => import("./components/video-player").then((mod) => mod.VideoPlayer),
  {
    ssr: false,
    loading: () => (
      <Skeleton className="w-full aspect-video rounded-xl bg-muted/60 animate-pulse" />
    ),
  }
);

interface WatchPageProps {
  params: Promise<{ slug: string; episode: string }>;
}

export default function WatchEpisodePage({ params }: WatchPageProps) {
  const { slug, episode: epParam } = use(params);
  const { details, episodes, recommendations, isLoading, notFoundError } = useWatchDetails(
    slug,
    epParam
  );

  const [activeSourceId, setActiveSourceId] = useState(
    details?.sources[0]?.id || "server-alpha"
  );
  const [isCinemaMode, setIsCinemaMode] = useState(false);

  if (notFoundError) {
    notFound();
  }

  if (isLoading || !details) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="w-full space-y-6">
          <Skeleton className="w-full aspect-video rounded-2xl" />
          <div className="space-y-3">
            <Skeleton className="h-7 w-2/3 rounded-md" />
            <Skeleton className="h-4 w-1/3 rounded-md" />
          </div>
          <div className="space-y-4 pt-4">
            <Skeleton className="h-6 w-40 rounded-md" />
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
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
  const activeSource =
    sources.find((s) => s.id === activeSourceId) || sources[0];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="relative">
        {/* Cinema Mode Backdrop Dimmer */}
        {isCinemaMode && (
          <div
            onClick={() => setIsCinemaMode(false)}
            className="fixed inset-0 z-40 bg-black/90 backdrop-blur-md transition-opacity duration-300"
            title="Click to exit Cinema Mode"
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
          {/* Main Video & Discussion Area */}
          <div
            className={`lg:col-span-8 flex flex-col transition-all duration-300 ${
              isCinemaMode ? "relative z-50 ring-2 ring-primary/40 rounded-xl shadow-2xl bg-black" : ""
            }`}
          >
            {/* 1. Vidstack Video Player Section */}
            <VideoPlayer
              currentSource={activeSource}
              title={`${anime.title} - Episode ${episode.episodeNumber}`}
              poster={episode.thumbnail}
              nextEpisode={nextEpisode}
              animeSlug={anime.slug}
            />

            {/* 2. Episode Header & Controls Section */}
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

            {/* 3. Community Comments Section */}
            <CommentsSection />
          </div>

          {/* 4. Episode Navigation & Recommendations Sidebar */}
          <div className={`lg:col-span-4 ${isCinemaMode ? "opacity-20 pointer-events-none transition-opacity" : ""}`}>
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
