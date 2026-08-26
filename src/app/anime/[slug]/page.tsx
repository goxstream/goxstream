import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  getAnimeBySlug,
  getEpisodesForAnime,
  getRecommendedAnime,
} from "@/lib/mock-anime";
import { AnimeHero } from "./components/anime-hero";
import { AnimeMetadata } from "./components/anime-metadata";
import { EpisodeList } from "./components/episode-list";
import { AnimeRecommendations } from "./components/anime-recommendations";

interface AnimePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: AnimePageProps): Promise<Metadata> {
  const { slug } = await params;
  const anime = getAnimeBySlug(slug);

  if (!anime) {
    return {
      title: "Anime Not Found | GoxStream",
      description: "The requested anime page could not be found.",
    };
  }

  return {
    title: `${anime.title} (${anime.year}) - Stream Online | GoxStream`,
    description: `${anime.synopsis.slice(0, 160)}... Stream ${anime.title} in 1080p HD quality with English subtitles and dubbing on GoxStream.`,
    openGraph: {
      title: `${anime.title} | GoxStream`,
      description: anime.synopsis,
      type: "video.tv_show",
    },
  };
}

export default async function AnimeDetailsPage({ params }: AnimePageProps) {
  const { slug } = await params;
  const anime = getAnimeBySlug(slug);

  if (!anime) {
    notFound();
  }

  const episodes = getEpisodesForAnime(anime);
  const recommendations = getRecommendedAnime(slug, 4);
  const latestEpNum = episodes.length > 0 ? Math.max(...episodes.map((e) => e.episodeNumber)) : 1;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <SiteHeader />

      <main className="flex-1">
        <AnimeHero anime={anime} latestEpisodeNum={latestEpNum} />
        
        <div className="container mx-auto px-4">
          <AnimeMetadata anime={anime} />
          <EpisodeList episodes={episodes} animeSlug={anime.slug} />
          <AnimeRecommendations recommendations={recommendations} />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
