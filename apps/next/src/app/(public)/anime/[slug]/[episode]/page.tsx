import type { Metadata } from "next";
import { WatchEpisodeContent } from "./components/watch-episode-content";

interface WatchPageProps {
  params: Promise<{ slug: string; episode: string }>;
}

export async function generateMetadata({ params }: WatchPageProps): Promise<Metadata> {
  const { slug, episode } = await params;
  const formattedTitle = slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  return {
    title: `Watch ${formattedTitle} Episode ${episode} - Online | GoxStream`,
    description: `Stream ${formattedTitle} Episode ${episode} in 1080p HD quality on GoxStream with zero ad interruptions.`,
  };
}

export default function WatchEpisodePage({ params }: WatchPageProps) {
  return <WatchEpisodeContent paramsPromise={params} />;
}
