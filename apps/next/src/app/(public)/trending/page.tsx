import type { Metadata } from "next";
import { TrendingHeader } from "./components/trending-header";
import { TrendingContent } from "./components/trending-content";

export const metadata: Metadata = {
  title: "Anime Trending Leaderboard | GoxStream",
  description:
    "Discover top trending anime series and movies ranked by weekly views, monthly hype, and all-time popularity. Filter by Action, Fantasy, Romance, and more.",
  openGraph: {
    title: "Anime Trending Leaderboard | GoxStream",
    description:
      "Track real-time weekly, monthly, and all-time top trending anime with multi-genre filters.",
  },
};

export default function TrendingPage() {
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
      <TrendingHeader />
      <TrendingContent />
    </div>
  );
}
