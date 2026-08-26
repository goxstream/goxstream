import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  getEpisodesForAnime,
  getEpisodeWatchDetails,
  getRecommendedAnime,
} from "@/lib/mock-anime";
import { WatchContainer } from "./components/watch-container";

interface WatchPageProps {
  params: Promise<{ slug: string; episode: string }>;
}

function parseEpisodeNumber(epParam: string): number {
  const match = epParam.match(/\d+/);
  return match ? parseInt(match[0], 10) : 1;
}

export async function generateMetadata({ params }: WatchPageProps): Promise<Metadata> {
  const { slug, episode: epParam } = await params;
  const epNum = parseEpisodeNumber(epParam);
  const details = getEpisodeWatchDetails(slug, epNum);

  if (!details) {
    return {
      title: "Episode Not Found | GoxStream",
      description: "The requested anime episode could not be found.",
    };
  }

  const { anime, episode } = details;

  return {
    title: `Watch ${anime.title} Episode ${episode.episodeNumber} English Sub/Dub Online | GoxStream`,
    description: `Stream ${anime.title} Episode ${episode.episodeNumber} in 1080p HD quality with English subtitles and dubbing on GoxStream.`,
    openGraph: {
      title: `${anime.title} Episode ${episode.episodeNumber} | GoxStream`,
      description: anime.synopsis,
      type: "video.episode",
    },
  };
}

export default async function WatchEpisodePage({ params }: WatchPageProps) {
  const { slug, episode: epParam } = await params;
  const epNum = parseEpisodeNumber(epParam);
  const details = getEpisodeWatchDetails(slug, epNum);

  if (!details) {
    notFound();
  }

  const episodes = getEpisodesForAnime(details.anime);
  const recommendations = getRecommendedAnime(slug, 4);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <SiteHeader />

      <main className="flex-1 container mx-auto px-4 py-6">
        <WatchContainer
          details={details}
          episodes={episodes}
          recommendations={recommendations}
        />
      </main>

      <SiteFooter />
    </div>
  );
}
