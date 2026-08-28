import { Metadata } from "next";
import { ProfileHeader } from "./components/profile-header";
import { ProfileStats } from "./components/profile-stats";
import { ProfileActivity } from "./components/profile-activity";
import { getCurrentUserProfile, getCurrentUserActivity } from "@/lib/db/queries/users";

export const metadata: Metadata = {
  title: "User Profile | GoxStream Anime Platform",
  description: "View your anime statistics, streaming activity, and favorite genres.",
};

export default async function ProfilePage() {
  const user = await getCurrentUserProfile();
  const activity = await getCurrentUserActivity(user.id);

  return (
    <div className="space-y-8">
      <ProfileHeader user={user} />
      <ProfileStats stats={user.stats} />
      <ProfileActivity watchlist={activity.watchlist} history={activity.history} />
    </div>
  );
}
