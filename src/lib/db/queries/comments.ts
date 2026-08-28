import { getDb } from "../index";
import { comments } from "../schema";
import { eq, desc } from "drizzle-orm";

export async function getCommentsByEpisodeId(episodeId: string) {
  try {
    const db = await getDb();
    const rootComments = await db
      .select()
      .from(comments)
      .where(eq(comments.episodeId, episodeId))
      .orderBy(desc(comments.createdAt));

    return rootComments;
  } catch (error) {
    console.error("Failed to fetch comments from DB:", error);
    return [];
  }
}

export async function createComment(data: {
  animeId: string;
  episodeId: string;
  parentId?: string;
  content: string;
  isSpoiler?: boolean;
  guestName?: string;
  userId?: string;
}) {
  try {
    const db = await getDb();
    const newComment = await db
      .insert(comments)
      .values({
        id: crypto.randomUUID(),
        animeId: data.animeId,
        episodeId: data.episodeId,
        parentId: data.parentId || null,
        content: data.content,
        isSpoiler: data.isSpoiler || false,
        guestName: data.guestName || "Guest Otaku",
        userId: data.userId || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return newComment[0];
  } catch (error) {
    console.error("Failed to insert comment into DB:", error);
    return null;
  }
}
