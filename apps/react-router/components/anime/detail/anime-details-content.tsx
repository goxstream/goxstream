import { useParams, Link } from "react-router";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@goxstream/ui/components/button";
import { useAnimeDetails } from "@/hooks/use-anime-details";
import { AnimeHero } from "./anime-hero";
import { AnimeMetadata } from "./anime-metadata";
import { EpisodeList } from "./episode-list";
import { AnimeRecommendations } from "./anime-recommendations";

export function AnimeDetailsContent() {
  const { slug } = useParams<{ slug: string }>();
  const { anime, episodes, recommendations, isLoading, notFoundError } = useAnimeDetails(slug || "");

  if (notFoundError) {
    return (
      <div className="container mx-auto flex min-h-[50vh] flex-col items-center justify-center px-4 py-16 text-center">
        <div className="bg-destructive/10 text-destructive mb-4 flex size-14 items-center justify-center rounded-full">
          <AlertCircle className="size-7" />
        </div>
        <h1 className="text-foreground text-2xl font-bold">Anime Not Found</h1>
        <p className="text-muted-foreground mt-2 max-w-md text-sm">
          The requested anime series or movie could not be found. It may have been removed or the URL is incorrect.
        </p>
        <Button asChild className="mt-6 gap-2">
          <Link to="/browse">
            <ArrowLeft className="size-4" />
            <span>Back to Catalog</span>
          </Link>
        </Button>
      </div>
    );
  }

  const latestEpNum =
    episodes && episodes.length > 0 ? Math.max(...episodes.map((e) => e.episodeNumber)) : 1;

  return (
    <div className="flex-1 space-y-6">
      <AnimeHero anime={anime} latestEpisodeNum={latestEpNum} isLoading={isLoading} />

      <div className="container mx-auto space-y-8 px-4">
        <AnimeMetadata anime={anime} isLoading={isLoading} />
        <EpisodeList episodes={episodes} animeSlug={anime?.slug || slug} isLoading={isLoading} />
        {recommendations && recommendations.length > 0 && (
          <AnimeRecommendations recommendations={recommendations} />
        )}
      </div>
    </div>
  );
}
