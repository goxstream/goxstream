import { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { UserHubNav } from "@/components/user-hub-nav";
import { SiteFooter } from "@/components/site-footer";
import { WatchlistClientPage } from "./components/watchlist-client-page";

export const metadata: Metadata = {
  title: "My Watchlist | GoxStream Anime Platform",
  description: "Manage your saved anime series, track watch progress, and sort your library.",
};

export default function WatchlistPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SiteHeader />
      <UserHubNav />
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <WatchlistClientPage />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
