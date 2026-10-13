import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import {
  getUserWatchlist,
  addToWatchlist,
  updateWatchlistStatus,
  removeFromWatchlist,
} from "@/lib/db/queries/watchlist";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await getUserWatchlist(user.id);
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as Record<string, any>;
  const { animeId, status } = body;
  if (!animeId) {
    return NextResponse.json({ error: "Anime ID required" }, { status: 400 });
  }

  const result = await addToWatchlist(user.id, animeId, status);
  return NextResponse.json({ success: true, result });
}

export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as Record<string, any>;
  const { animeId, status, isFavorite } = body;

  if (!animeId) {
    return NextResponse.json({ error: "Anime ID required" }, { status: 400 });
  }

  const result = await updateWatchlistStatus(user.id, animeId, status, isFavorite);
  return NextResponse.json({ success: true, result });
}

export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const animeId = searchParams.get("animeId");
  if (!animeId) {
    return NextResponse.json({ error: "Anime ID required" }, { status: 400 });
  }

  await removeFromWatchlist(user.id, animeId);
  return NextResponse.json({ success: true });
}
