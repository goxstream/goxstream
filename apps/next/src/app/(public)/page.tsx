import { HeroSection } from "./components/hero-section";
import { TrendingSection } from "./components/trending-section";
import { LatestEpisodesSection } from "./components/latest-episodes-section";
import { FeaturesSection } from "./components/features-section";
import { CtaSection } from "./components/cta-section";

export default function HomePage() {
  return (
    <div className="pt-6 pb-6 px-4 sm:px-6 lg:px-8">
      <HeroSection />
      <TrendingSection />
      <LatestEpisodesSection />
      <FeaturesSection />
      <CtaSection />
    </div>
  );
}
