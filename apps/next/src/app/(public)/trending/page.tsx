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
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <TrendingHeader />
      <TrendingContent />
    </div>
  );
}
