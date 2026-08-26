import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { watchHistories } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import type { WatchHistoryItem } from "@/types/user";

export async function GET() {
  try {
    const db = await getDb();
    const records = await db.query.watchHistories.findMany({
      limit: 50,
      orderBy: [desc(watchHistories.lastWatchedAt)],
      with: {
        anime: true,
        episode: true,
      },
    });

    if (records && records.length > 0) {
      const items: WatchHistoryItem[] = records.map((h: any) => ({
        id: h.id,
        animeId: h.animeId,
        animeTitle: h.anime?.titleEnglish || h.anime?.titleRomaji || "Anime",
        animeSlug: h.anime?.slug || "anime",
        animeCover: h.anime?.coverImage || "",
        episodeNumber: h.episode?.episodeNumber || h.episodeNumber || 1,
        episodeTitle: h.episode?.title || `Episode ${h.episode?.episodeNumber || h.episodeNumber || 1}`,
        watchedSeconds: h.progressSeconds || 0,
        durationSeconds: h.durationSeconds || 1440,
        progressPercent: h.durationSeconds
          ? Math.min(100, Math.round((h.progressSeconds / h.durationSeconds) * 100))
          : h.progressPercent || 0,
        lastWatchedAt: h.lastWatchedAt ? new Date(h.lastWatchedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Today",
      }));
      return NextResponse.json({ items });
    }
  } catch {
    // Fallback
  }

  return NextResponse.json({ items: [] });
}
