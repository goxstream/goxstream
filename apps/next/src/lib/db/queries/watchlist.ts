import { eq, and, desc } from "drizzle-orm";
import { getDb } from "../index";
import { watchlists } from "../schema";

export async function getUserWatchlist(userId: string) {
  const db = await getDb();
  try {
    return await db.query.watchlists.findMany({
      where: eq(watchlists.userId, userId),
      with: {
        anime: true,
      },
      orderBy: [desc(watchlists.updatedAt)],
    });
  } catch {
    return [];
  }
}


export async function addToWatchlist(userId: string, animeId: string, status = "plan_to_watch") {
  const db = await getDb();
  return db
    .insert(watchlists)
    .values({
      userId,
      animeId,
      status,
    })
    .onConflictDoUpdate({
      target: [watchlists.userId, watchlists.animeId],
      set: { status, updatedAt: new Date() },
    })
    .returning();
}

export async function updateWatchlistStatus(userId: string, animeId: string, status: string, isFavorite?: boolean) {
  const db = await getDb();
  const updateData: Record<string, any> = { status, updatedAt: new Date() };
  if (isFavorite !== undefined) {
    updateData.isFavorite = isFavorite;
  }
  return db
    .update(watchlists)
    .set(updateData)
    .where(and(eq(watchlists.userId, userId), eq(watchlists.animeId, animeId)))
    .returning();
}

export async function removeFromWatchlist(userId: string, animeId: string) {
  const db = await getDb();
  return db
    .delete(watchlists)
    .where(and(eq(watchlists.userId, userId), eq(watchlists.animeId, animeId)));
}
