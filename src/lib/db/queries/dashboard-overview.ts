import { desc, sql, count } from "drizzle-orm";
import { getDb } from "../index";
import { watchHistories, episodes, comments, users, episodeUploads } from "../schema";
import {
  mapToActivityLogItem,
  mapToTrafficData,
  generateDynamicNotifications,
} from "./dashboard-overview.mappers";
import type { ActivityLogItem } from "@/app/dashboard/types";

/**
 * Fetches recent 24-hour watch history and aggregates into traffic data
 */
export async function getDashboardTrafficData() {
  const db = await getDb();
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const rawHist = await db.query.watchHistories.findMany({
      where: sql`last_watched_at >= ${twentyFourHoursAgo}`,
      limit: 1000,
    });
    return mapToTrafficData(rawHist);
  } catch (error) {
    console.error("Failed to query traffic data:", error);
    return [];
  }
}

/**
 * Combines and maps the latest episodes and user comments into a unified activity audit log.
 * Episodes include uploader info from episode_uploads join.
 * Comments include user info from users join.
 */
export async function getDashboardRecentActivities(): Promise<ActivityLogItem[]> {
  const db = await getDb();
  try {
    const latestEpisodes = await db.query.episodes.findMany({
      limit: 3,
      orderBy: [desc(episodes.createdAt)],
      with: {
        anime: true,
      },
    });

    // Fetch uploader info for each episode from episode_uploads
    const episodesWithUploaders = await Promise.all(
      latestEpisodes.map(async (ep: any) => {
        const upload = await db.query.episodeUploads.findFirst({
          where: sql`episode_id = ${ep.id}`,
          with: { user: true },
        });
        return { ...ep, upload };
      })
    );

    const latestComments = await db.query.comments.findMany({
      limit: 3,
      orderBy: [desc(comments.createdAt)],
      with: {
        user: true,
      },
    });

    const combined = [
      ...episodesWithUploaders.map((ep: any) => ({
        type: "episode" as const,
        data: ep,
        date: ep.createdAt || new Date(),
      })),
      ...latestComments.map((c: any) => ({
        type: "comment" as const,
        data: c,
        date: c.createdAt || new Date(),
      })),
    ]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 4);

    return combined.map(mapToActivityLogItem);
  } catch (error) {
    console.error("Failed to query recent activities:", error);
    return [];
  }
}

/**
 * Aggregates real database counts into live notifications
 */
export async function getDashboardNotifications() {
  const db = await getDb();
  try {
    const latestEpisode = await db.query.episodes.findFirst({
      orderBy: [desc(episodes.createdAt)],
      with: {
        anime: true,
      },
    });

    // Fetch uploader for latest episode
    let latestEpisodeWithUploader = latestEpisode as any;
    if (latestEpisode) {
      const upload = await db.query.episodeUploads.findFirst({
        where: sql`episode_id = ${latestEpisode.id}`,
        with: { user: true },
      });
      latestEpisodeWithUploader = { ...latestEpisode, upload };
    }

    const [commCountRes] = await db.select({ count: count() }).from(comments);
    const [usersCountRes] = await db.select({ count: count() }).from(users);

    return generateDynamicNotifications(
      latestEpisodeWithUploader,
      commCountRes?.count || 0,
      usersCountRes?.count || 0
    );
  } catch (error) {
    console.error("Failed to query notifications:", error);
    return [];
  }
}
