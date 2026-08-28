import { NextResponse } from "next/server";
import { getCurrentUserProfile, getCurrentUserActivity } from "@/lib/db/queries/users";
import { getCurrentUser } from "@/lib/auth/session";

export async function GET() {
  try {
    const userSession = await getCurrentUser();
    if (!userSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [profile, activity] = await Promise.all([
      getCurrentUserProfile().catch(() => null),
      getCurrentUserActivity(userSession.id).catch(() => ({ watchlist: [], history: [] }))
    ]);

    if (!profile) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }

    return NextResponse.json(
      { profile, activity },
      {
        headers: {
          "Cache-Control": "private, no-cache, no-store, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("[Profile API Error]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
