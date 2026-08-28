import type { Metadata } from "next";
import { TrendingClientPage } from "./components/trending-client-page";

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
  return <TrendingClientPage />;
}
