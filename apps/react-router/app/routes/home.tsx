import { HeroSection } from "@/components/home/hero-section";
import { TrendingSection } from "@/components/home/trending-section";
import { LatestEpisodesSection } from "@/components/home/latest-episodes-section";
import { FeaturesSection } from "@/components/home/features-section";
import { CtaSection } from "@/components/home/cta-section";

export function meta() {
  return [
    { title: "ShionStream — Stream High-Quality Anime Ad-Free" },
    {
      name: "description",
      content:
        "Fast discovery, high-fidelity streaming, and effortless watching. Experience your favorite anime series without ads.",
    },
  ];
}

export default function HomePage() {
  return (
    <div className="px-4 pt-6 pb-6 sm:px-6 lg:px-8">
      <HeroSection />
      <TrendingSection />
      <LatestEpisodesSection />
      <FeaturesSection />
      <CtaSection />
    </div>
  );
}
