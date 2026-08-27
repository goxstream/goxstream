import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WatchClient } from "./components/watch-client";

interface WatchPageProps {
  params: Promise<{ slug: string; episode: string }>;
}

export async function generateMetadata({ params }: WatchPageProps): Promise<Metadata> {
  const { slug, episode } = await params;
  const formattedTitle = slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  return {
    title: `Watch ${formattedTitle} Episode ${episode} - Online | GoxStream`,
    description: `Stream ${formattedTitle} Episode ${episode} in 1080p HD quality on GoxStream.`,
  };
}

export default function WatchEpisodePage({ params }: WatchPageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <SiteHeader />

      <main className="flex-1 container mx-auto px-4 py-6">
        <WatchClient paramsPromise={params} />
      </main>

      <SiteFooter />
    </div>
  );
}
