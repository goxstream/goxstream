"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { EpisodeHeaderInfo } from "./episode-header-info";
import { EpisodeSidebar } from "./episode-sidebar";
import { CommentsSection } from "./comments-section";
import type { EpisodeWatchDetails, EpisodeItem, AnimeItem } from "@/types/anime";

const VideoPlayer = dynamic(
  () => import("./video-player").then((mod) => mod.VideoPlayer),
  {
    ssr: false,
    loading: () => (
      <Skeleton className="w-full aspect-video rounded-xl bg-muted/60 animate-pulse" />
    ),
  }
);

interface WatchContainerProps {
  details: EpisodeWatchDetails;
  episodes: EpisodeItem[];
  recommendations: AnimeItem[];
}

export function WatchContainer({
  details,
  episodes,
  recommendations,
}: WatchContainerProps) {
  const { anime, episode, sources, prevEpisode, nextEpisode } = details;
  const [activeSourceId, setActiveSourceId] = useState(
    sources[0]?.id || "server-alpha"
  );
  const [isCinemaMode, setIsCinemaMode] = useState(false);

  const activeSource =
    sources.find((s) => s.id === activeSourceId) || sources[0];

  return (
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
          {/* Vidstack Video Player */}
          <VideoPlayer
            currentSource={activeSource}
            title={`${anime.title} - Episode ${episode.episodeNumber}`}
            poster={episode.thumbnail}
            nextEpisode={nextEpisode}
            animeSlug={anime.slug}
          />

          {/* Episode Info & Header */}
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

          {/* Comments Section */}
          <CommentsSection />
        </div>

        {/* Sidebar Column */}
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
  );
}
