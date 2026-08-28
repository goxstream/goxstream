"use client";

import { useUserProfile } from "@/hooks/use-user-profile";
import { ProfileHeader } from "./profile-header";
import { ProfileStats } from "./profile-stats";
import { ProfileActivity } from "./profile-activity";

export function ProfileContentClient() {
  const { profile, watchlist, history, isLoading, error } = useUserProfile();

  if (error) {
    return (
      <div className="p-8 text-center rounded-xl border border-destructive/20 bg-destructive/5 text-destructive text-sm font-medium">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <ProfileHeader user={profile} isLoading={isLoading} />
      <ProfileStats stats={profile?.stats} isLoading={isLoading} />
      <ProfileActivity watchlist={watchlist} history={history} isLoading={isLoading} />
    </div>
  );
}
