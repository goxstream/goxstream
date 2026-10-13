import { desc } from "drizzle-orm";
import { getDb } from "../index";
import { watchlists, watchHistories } from "../schema";
import type { WatchlistItem, WatchHistoryItem } from "@/types/user";
import { mapToWatchlistItem, mapToWatchHistoryItem } from "./user-activity.mappers";

export async function getUserWatchlistItems(): Promise<WatchlistItem[]> {
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
      return records.map(mapToWatchlistItem);
    }
  } catch {
    // Fallback if DB empty
  }

  return [];
}

export async function addUserWatchlistItem(params: {
  animeId: string;
  status?: string;
  episode?: number;
  isFavorite?: boolean;
}): Promise<string> {
  const db = await getDb();
  const newId = `wt-${Date.now()}`;
  await db.insert(watchlists).values({
    id: newId,
    userId: "demo-user",
    animeId: params.animeId,
    status: params.status || "watching",
    currentEpisode: params.episode || 1,
    isFavorite: Boolean(params.isFavorite),
  });
  return newId;
}

export async function getUserWatchHistoryItems(): Promise<WatchHistoryItem[]> {
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
      return records.map(mapToWatchHistoryItem);
    }
  } catch {
    // Fallback
  }

  return [];
}
