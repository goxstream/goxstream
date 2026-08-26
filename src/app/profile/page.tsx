import { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { UserHubNav } from "@/components/user-hub-nav";
import { SiteFooter } from "@/components/site-footer";
import { ProfileHeader } from "./components/profile-header";
import { ProfileStats } from "./components/profile-stats";
import { ProfileActivity } from "./components/profile-activity";
import { getCurrentUserProfile } from "@/lib/db/queries/users";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "User Profile | GoxStream Anime Platform",
  description: "View your anime statistics, streaming activity, and favorite genres.",
};

export default async function ProfilePage() {
  const user = await getCurrentUserProfile();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SiteHeader />
      <UserHubNav />
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <ProfileHeader user={user} />
          <ProfileStats stats={user.stats} />
          <ProfileActivity watchlist={[]} history={[]} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
