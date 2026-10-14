import { TrendingHeader } from "@/components/trending/trending-header";
import { TrendingContent } from "@/components/trending/trending-content";

export function meta() {
  return [
    { title: "Anime Trending Leaderboard - GoxStream" },
    {
      name: "description",
      content:
        "Discover top trending anime series and movies ranked by weekly views, monthly hype, and all-time popularity.",
    },
  ];
}

export default function TrendingPage() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <TrendingHeader />
      <TrendingContent />
    </div>
  );
}
