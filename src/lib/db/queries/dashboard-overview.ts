import { desc, sql, count } from "drizzle-orm";
import { getDb } from "../index";
import { serverNodes, watchHistories, episodes, comments } from "../schema";
import {
  mapToWorkspaceItem,
  mapToActivityLogItem,
  mapToTrafficData,
  generateDynamicNotifications,
} from "./dashboard-overview.mappers";
import type { WorkspaceItem, ActivityLogItem } from "@/app/dashboard/types";

/**
 * Fetches workspaces mapped directly from server nodes
 */
export async function getDashboardWorkspacesData(): Promise<WorkspaceItem[]> {
  const db = await getDb();
  try {
    const raw = await db.query.serverNodes.findMany({ limit: 10 });
    return (raw || []).map(mapToWorkspaceItem);
  } catch (error) {
    console.error("Failed to query workspaces:", error);
    return [];
  }
}

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
 * Combines and maps the latest episodes and user comments into a unified activity audit log
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

    const latestComments = await db.query.comments.findMany({
      limit: 3,
      orderBy: [desc(comments.createdAt)],
    });

    const combined = [
      ...latestEpisodes.map((ep: any) => ({
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
 * Aggregates alert states and latest assets into live notifications
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

    const [commCountRes] = await db.select({ count: count() }).from(comments);
    const [nodeCountRes] = await db.select({ count: count() }).from(serverNodes);

    return generateDynamicNotifications(
      latestEpisode,
      commCountRes?.count || 0,
      nodeCountRes?.count || 0
    );
  } catch (error) {
    console.error("Failed to query notifications:", error);
    return [];
  }
}
