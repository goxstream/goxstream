import { Suspense } from "react";
import type { Metadata } from "next";
import { TrendingClientPage } from "./components/trending-client-page";
import TrendingLoading from "./loading";

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
    <Suspense fallback={<TrendingLoading />}>
      <TrendingClientPage />
    </Suspense>
  );
}
