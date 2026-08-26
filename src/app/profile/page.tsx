import { Metadata } from "next";
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
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Profile Header */}
        <ProfileHeader user={user} />

        {/* Analytics & Stats */}
        <ProfileStats stats={user.stats} />

        {/* Activity & Favorites */}
        <ProfileActivity watchlist={watchlist} history={history} />
      </div>
    </div>
  );
}
