"use client";

import { useState } from "react";
import { useParams, Link } from "react-router";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@shionstream/ui/components/button";
import { Skeleton } from "@shionstream/ui/components/skeleton";
import { useWatchDetails } from "@/hooks/use-watch-details";
import { VideoPlayer } from "./video-player";
import { EpisodeHeaderInfo } from "./episode-header-info";
import { EpisodeListCard } from "./sidebar/episode-list-card";
import { AnimeRecommendations } from "../detail/anime-recommendations";

export function WatchContent() {
  const { slug, episode: episodeParam } = useParams<{
    slug: string;
    episode: string;
  }>();
  const { details, episodes, recommendations, isLoading, notFoundError } = useWatchDetails(
    slug || "",
    episodeParam || "1",
  );

  const [activeSourceId, setActiveSourceId] = useState<string>("");
  const [isCinemaMode, setIsCinemaMode] = useState(false);

  // Set initial active source when details load
  if (details && !activeSourceId && details.sources.length > 0) {
    const primary = details.sources.find((s) => s.isPrimary);
    setActiveSourceId(primary?.id || details.sources[0].id);
  }

  if (notFoundError) {
    return (
      <div className="container mx-auto flex min-h-[50vh] flex-col items-center justify-center px-4 py-16 text-center">
        <div className="bg-destructive/10 text-destructive mb-4 flex size-14 items-center justify-center rounded-full">
          <AlertCircle className="size-7" />
        </div>
        <h1 className="text-foreground text-2xl font-bold">Episode Not Found</h1>
        <p className="text-muted-foreground mt-2 max-w-md text-sm">
          The requested episode could not be found. It may have been removed or the URL is
          incorrect.
        </p>
        <Button asChild className="mt-6 gap-2">
          <Link to={slug ? `/anime/${slug}` : "/browse"}>
            <ArrowLeft className="size-4" />
            <span>Back to Series</span>
          </Link>
        </Button>
      </div>
    );
  }

  if (isLoading || !details) {
    return <WatchContentSkeleton />;
  }

  const currentSource = details.sources.find((s) => s.id === activeSourceId) || details.sources[0];

  return (
    <div className="flex-1">
      <div className="container mx-auto px-4 py-6">
        <div
          className={`grid gap-6 ${
            isCinemaMode ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-[1fr_340px]"
          }`}
        >
          {/* Main Content Column */}
          <div className="flex flex-col gap-0">
            {/* Video Player */}
            <VideoPlayer
              currentSource={currentSource}
              title={`${details.anime.title} - Episode ${details.episode.episodeNumber}`}
              poster={details.episode.thumbnail || details.anime.coverImage}
              nextEpisode={details.nextEpisode}
              animeSlug={details.anime.slug}
            />

            {/* Episode Header Info (Title, Server, Actions, Synopsis) */}
            <EpisodeHeaderInfo
              anime={details.anime}
              episode={details.episode}
              sources={details.sources}
              activeSourceId={activeSourceId}
              onSelectSource={setActiveSourceId}
              prevEpisode={details.prevEpisode}
              nextEpisode={details.nextEpisode}
              isCinemaMode={isCinemaMode}
              onToggleCinemaMode={() => setIsCinemaMode(!isCinemaMode)}
            />
          </div>

          {/* Sidebar: Episode List */}
          {!isCinemaMode && (
            <aside className="lg:sticky lg:top-20 lg:h-fit">
              <EpisodeListCard
                anime={details.anime}
                episodes={episodes}
                currentEpisodeNumber={details.episode.episodeNumber}
              />
            </aside>
          )}
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="mt-8">
            <AnimeRecommendations recommendations={recommendations} />
          </div>
        )}
      </div>
    </div>
  );
}

function WatchContentSkeleton() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        <div className="flex flex-col gap-4">
          {/* Video Player Skeleton */}
          <Skeleton className="aspect-video w-full rounded-xl" />
          {/* Title and Meta Skeleton */}
          <div className="space-y-3 py-4">
            <Skeleton className="h-5 w-2/3 rounded" />
            <Skeleton className="h-7 w-4/5 rounded" />
            <Skeleton className="h-4 w-1/3 rounded" />
          </div>
          {/* Server Bar Skeleton */}
          <Skeleton className="h-14 w-full rounded-xl" />
          {/* Action Bar Skeleton */}
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-8 w-36 rounded-lg" />
            <Skeleton className="h-8 w-40 rounded-lg" />
            <Skeleton className="h-8 w-28 rounded-lg" />
          </div>
          {/* Synopsis Skeleton */}
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>

        {/* Sidebar Skeleton */}
        <div className="border-border/60 space-y-3 rounded-xl border p-4">
          <Skeleton className="h-5 w-32 rounded" />
          <Skeleton className="h-8 w-full rounded-lg" />
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
