import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AnimeDetailsClient } from "./components/anime-details-client";

interface AnimePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: AnimePageProps): Promise<Metadata> {
  const { slug } = await params;
  const formattedTitle = slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  return {
    title: `${formattedTitle} - Stream Online | GoxStream`,
    description: `Stream ${formattedTitle} in 1080p HD quality on GoxStream with zero ad interruptions.`,
  };
}

export default function AnimeDetailsPage({ params }: AnimePageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <SiteHeader />
      <AnimeDetailsClient paramsPromise={params} />
      <SiteFooter />
    </div>
  );
}
