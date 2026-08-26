import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HeroSection } from "@/app/components/hero-section";
import { TrendingSection } from "@/app/components/trending-section";
import { LatestEpisodesSection } from "@/app/components/latest-episodes-section";
import { FeaturesSection } from "@/app/components/features-section";
import { CtaSection } from "@/app/components/cta-section";
import { getFeaturedAnime, getTrendingAnime, getAllGenres } from "@/lib/db/queries/anime";
import { getLatestEpisodes } from "@/lib/db/queries/episodes";

export default async function HomePage() {
  const [featuredAnime, trendingAnime, genresList, latestEpisodes] = await Promise.all([
    getFeaturedAnime().catch(() => null),
    getTrendingAnime(10).catch(() => []),
    getAllGenres().catch(() => []),
    getLatestEpisodes(6).catch(() => []),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <SiteHeader />
      <main className="flex-1">
        <HeroSection featuredAnime={featuredAnime} />
        <TrendingSection trendingAnime={trendingAnime} genresList={genresList} />
        <LatestEpisodesSection latestEpisodes={latestEpisodes} />
        <FeaturesSection />
        <CtaSection />
      </main>
      <SiteFooter />
    </div>
  );
}
