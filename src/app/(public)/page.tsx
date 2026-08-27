import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HeroSection } from "./components/hero-section";
import { TrendingSection } from "./components/trending-section";
import { LatestEpisodesSection } from "./components/latest-episodes-section";
import { FeaturesSection } from "./components/features-section";
import { CtaSection } from "./components/cta-section";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <TrendingSection />
        <LatestEpisodesSection />
        <FeaturesSection />
        <CtaSection />
      </main>
      <SiteFooter />
    </div>
  );
}
