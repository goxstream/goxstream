import { NextResponse } from "next/server";
import { getUserWatchlistItems, addUserWatchlistItem } from "@/lib/db/queries/user-activity";

export async function GET() {
  const items = await getUserWatchlistItems();
  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      animeId?: string;
      status?: string;
      episode?: number;
      isFavorite?: boolean;
    };
    const { animeId, status, episode, isFavorite } = body;

    if (!animeId) {
      return NextResponse.json({ error: "animeId is required" }, { status: 400 });
    }

    const newId = await addUserWatchlistItem({
      animeId,
      status,
      episode,
      isFavorite,
    });

    return NextResponse.json({ success: true, id: newId });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to update watchlist" }, { status: 500 });
  }
}
