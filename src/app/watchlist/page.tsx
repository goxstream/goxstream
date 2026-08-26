import { Metadata } from "next";
import { WatchlistClientPage } from "./components/watchlist-client-page";

export const metadata: Metadata = {
  title: "My Watchlist | GoxStream Anime Platform",
  description: "Manage your saved anime series, track watch progress, and sort your library.",
};

export default function WatchlistPage() {
  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <WatchlistClientPage />
      </div>
    </div>
  );
}
