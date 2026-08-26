import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getEpisodeWatchDetails, getEpisodesByAnimeSlug } from "@/lib/db/queries/episodes";
import { getTrendingAnime } from "@/lib/db/queries/anime";
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
  const details = await getEpisodeWatchDetails(slug, epNum).catch(() => null);

  if (!details) {
    return {
      title: "Episode Not Found | GoxStream",
      description: "The requested anime episode could not be found.",
    };
  }

  const { anime, episode } = details;

  return {
    title: `Watch ${anime.title} Episode ${episode.episodeNumber} - Online | GoxStream`,
    description: `Stream ${anime.title} Episode ${episode.episodeNumber} in 1080p HD quality on GoxStream.`,
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
  const details = await getEpisodeWatchDetails(slug, epNum).catch(() => null);

  if (!details) {
    notFound();
  }

  const episodes = await getEpisodesByAnimeSlug(slug).catch(() => []);
  const trending = await getTrendingAnime(5).catch(() => []);
  const recommendations = trending.filter((item) => item.slug !== details.anime.slug).slice(0, 4);

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
