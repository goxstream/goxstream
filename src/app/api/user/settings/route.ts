import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { getUserById, updateUserSettings, updateUserProfile } from "@/lib/db/queries/users";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUser = await getUserById(user.id);
  return NextResponse.json({
    settings: {
      profile: {
        displayName: dbUser?.displayName || user.displayName,
        bio: dbUser?.bio || "",
        avatarUrl: dbUser?.avatarUrl || "",
      },
      player: {
        defaultQuality: dbUser?.settings?.defaultQuality || "1080p",
        defaultSubtitle: dbUser?.settings?.defaultSubtitle || "id",
        autoPlayNext: dbUser?.settings?.autoPlayNext ?? true,
        autoSkipIntro: dbUser?.settings?.autoSkipIntro ?? false,
        preferredAudio: dbUser?.settings?.preferredAudio || "japanese",
      },
      notifications: {
        newEpisodeAlerts: dbUser?.settings?.newEpisodeAlerts ?? true,
        watchlistUpdates: dbUser?.settings?.watchlistUpdates ?? true,
        marketingEmails: dbUser?.settings?.marketingEmails ?? false,
        publicWatchlist: dbUser?.settings?.publicWatchlist ?? true,
      },
    },
  });
}

export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as Record<string, any>;

  if (body.profile) {
    await updateUserProfile(user.id, {
      displayName: body.profile.displayName,
      bio: body.profile.bio,
      avatarUrl: body.profile.avatarUrl,
    });
  }

  if (body.player || body.notifications) {

    await updateUserSettings(user.id, {
      defaultQuality: body.player?.defaultQuality,
      defaultSubtitle: body.player?.defaultSubtitle,
      autoPlayNext: body.player?.autoPlayNext,
      autoSkipIntro: body.player?.autoSkipIntro,
      preferredAudio: body.player?.preferredAudio,
      newEpisodeAlerts: body.notifications?.newEpisodeAlerts,
      watchlistUpdates: body.notifications?.watchlistUpdates,
      marketingEmails: body.notifications?.marketingEmails,
      publicWatchlist: body.notifications?.publicWatchlist,
    });
  }

  return NextResponse.json({ success: true });
}
