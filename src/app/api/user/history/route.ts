import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import {
  getUserWatchHistory,
  recordWatchHistory,
  clearUserWatchHistory,
} from "@/lib/db/queries/history";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const history = await getUserWatchHistory(user.id);
  return NextResponse.json({ history });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as Record<string, any>;
  const result = await recordWatchHistory({
    userId: user.id,
    animeId: body.animeId,
    episodeId: body.episodeId,
    episodeNumber: body.episodeNumber,
    progressPercent: body.progressPercent || 0,
    durationSeconds: body.durationSeconds || 0,
    progressSeconds: body.progressSeconds || 0,
  });
  return NextResponse.json({ success: true, result });
}


export async function DELETE() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await clearUserWatchHistory(user.id);
  return NextResponse.json({ success: true });
}
