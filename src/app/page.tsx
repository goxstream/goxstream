import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HeroSection } from "@/app/components/hero-section";
import { TrendingSection } from "@/app/components/trending-section";
import { LatestEpisodesSection } from "@/app/components/latest-episodes-section";
import { FeaturesSection } from "@/app/components/features-section";
import { CtaSection } from "@/app/components/cta-section";

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
