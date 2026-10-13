import { Metadata } from "next";
import { WatchlistClientPage } from "./components/watchlist-client-page";

export const metadata: Metadata = {
  title: "My Watchlist | GoxStream Anime Platform",
  description: "Manage your saved anime series, track watch progress, and sort your library.",
};

export default function WatchlistPage() {
  return <WatchlistClientPage />;
}
