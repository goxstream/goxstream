import { desc, eq } from "drizzle-orm";
import { getDb } from "../index";
import { watchlists, watchHistories } from "../schema";
import type { WatchlistItem, WatchHistoryItem } from "@/types/user";

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
      return records.map((w: any) => ({
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
      return records.map((h: any) => ({
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
    }
  } catch {
    // Fallback
  }

  return [];
}
