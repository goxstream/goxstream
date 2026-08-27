import { eq, desc } from "drizzle-orm";
import { getDb } from "../index";
import { watchHistories } from "../schema";

export async function getUserWatchHistory(userId: string) {
  const db = await getDb();
  try {
    return await db.query.watchHistories.findMany({
      where: eq(watchHistories.userId, userId),
      with: {
        anime: true,
        episode: true,
      },
      orderBy: [desc(watchHistories.lastWatchedAt)],
    });
  } catch {
    return [];
  }
}

export async function recordWatchHistory(data: {
  userId: string;
  animeId: string;
  episodeId: string;
  episodeNumber?: number;
  progressPercent: number;
  durationSeconds: number;
  progressSeconds: number;
}) {
  const db = await getDb();
  return db
    .insert(watchHistories)
    .values({
      ...data,
      lastWatchedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [watchHistories.userId, watchHistories.episodeId],
      set: {
        progressPercent: data.progressPercent,
        progressSeconds: data.progressSeconds,
        durationSeconds: data.durationSeconds,
        lastWatchedAt: new Date(),
      },
    })
    .returning();
}

export async function clearUserWatchHistory(userId: string) {
  const db = await getDb();
  return db.delete(watchHistories).where(eq(watchHistories.userId, userId));
}
