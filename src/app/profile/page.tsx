import { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { UserHubNav } from "@/components/user-hub-nav";
import { SiteFooter } from "@/components/site-footer";
import { ProfileHeader } from "./components/profile-header";
import { ProfileStats } from "./components/profile-stats";
import { ProfileActivity } from "./components/profile-activity";
import { MOCK_USER_PROFILE, MOCK_WATCHLIST, MOCK_WATCH_HISTORY } from "@/lib/mock-user";

export const metadata: Metadata = {
  title: "User Profile | GoxStream Anime Platform",
  description: "View your anime statistics, streaming activity, and favorite genres.",
};

export default function ProfilePage() {
  const user = MOCK_USER_PROFILE;
  const watchlist = MOCK_WATCHLIST;
  const history = MOCK_WATCH_HISTORY;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SiteHeader />
      <UserHubNav />
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <ProfileHeader user={user} />
          <ProfileStats stats={user.stats} />
          <ProfileActivity watchlist={watchlist} history={history} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
