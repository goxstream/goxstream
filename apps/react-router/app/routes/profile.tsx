"use client";

import { useUserProfile } from "@/hooks/use-user-profile";
import { ApiError } from "@/components/api-error";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileStats } from "@/components/profile/profile-stats";
import { ProfileActivity } from "@/components/profile/profile-activity";

export default function ProfilePage() {
  const { profile, watchlist, history, isLoading, error } = useUserProfile();

  if (error) {
    return <ApiError message={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="space-y-8">
      <ProfileHeader user={profile} isLoading={isLoading} />
      <ProfileStats stats={profile?.stats} isLoading={isLoading} />
      <ProfileActivity watchlist={watchlist} history={history} isLoading={isLoading} />
    </div>
  );
}
