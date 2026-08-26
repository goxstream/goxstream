import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { watchlists } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import type { WatchlistItem } from "@/types/user";

export async function GET() {
  try {
    const db = await getDb();
    const records = await db.query.watchlists.findMany({
      limit: 50,
      orderBy: [desc(watchlists.updatedAt)],
      with: {
        anime: true,
      },
    });

    if (records && records.length > 0) {
      const items: WatchlistItem[] = records.map((w: any) => ({
        id: w.id,
        animeId: w.animeId,
        status: (w.status as WatchlistItem["status"]) || "watching",
        currentEpisode: w.currentEpisode || 1,
        totalEpisodes: w.anime?.episodesCount || 12,
        isFavorite: Boolean(w.isFavorite),
        rating: w.rating || 0,
        notes: w.notes || "",
        updatedAt: w.updatedAt ? new Date(w.updatedAt).toISOString() : new Date().toISOString(),
        anime: {
          id: w.anime?.id || w.animeId,
          title: w.anime?.titleEnglish || w.anime?.titleRomaji || "Anime",
          slug: w.anime?.slug || "anime",
          coverImage: w.anime?.coverImage || "",
          type: w.anime?.type || "TV",
          genres: ["Action", "Fantasy"],
        },
      }));
      return NextResponse.json({ items });
    }
  } catch {
    // Fallback if DB empty
  }

  return NextResponse.json({ items: [] });
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

    const db = await getDb();
    const newId = `wt-${Date.now()}`;

    await db.insert(watchlists).values({
      id: newId,
      userId: "demo-user",
      animeId,
      status: status || "watching",
      currentEpisode: episode || 1,
      isFavorite: Boolean(isFavorite),
    });

    return NextResponse.json({ success: true, id: newId });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to update watchlist" }, { status: 500 });
  }
}
