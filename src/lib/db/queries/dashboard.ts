import { count, eq, desc, sql } from "drizzle-orm";
import { getDb } from "../index";
import { animes, episodes, users, genres, sessions, watchHistories } from "../schema";
import type { DashboardStatsData } from "@/hooks/use-dashboard-stats";
import type { UserProfile } from "@/types/user";
import type { CategoryItem } from "@/app/dashboard/anime/categories/types";
import type { SeasonItem } from "@/app/dashboard/anime/seasons/types";
import type { RoleDefinition } from "@/app/dashboard/users/roles/types";
import type { ReportedComment } from "@/app/dashboard/users/moderation/types";
import {
  calculateDashboardStats,
  mapToDashboardUser,
  mapToDashboardCategory,
  calculateDashboardSeasons,
} from "./dashboard.mappers";

/**
 * Real Database Query Layer for Dashboard Control Center
 * Uses Drizzle ORM to execute count() and findMany() queries on D1 / PostgreSQL.
 */

export async function getDashboardStats(): Promise<DashboardStatsData> {
  const db = await getDb();

  try {
    const [animeRes] = await db.select({ count: count() }).from(animes);
    const [episodeRes] = await db.select({ count: count() }).from(episodes);
    const [userRes] = await db.select({ count: count() }).from(users);

    const totalAnime = animeRes?.count || 0;
    const totalEpisodes = episodeRes?.count || 0;
    const totalUsers = userRes?.count || 0;

    // Active streams from active sessions
    const [activeStreamsRes] = await db
      .select({ count: count() })
      .from(sessions)
      .where(sql`expires_at > ${new Date()}`);
    const activeStreams = activeStreamsRes?.count || 0;

    // Storage used: calculate from actual video duration sum of episodes
    const [episodesSum] = await db
      .select({ sumDuration: sql<number>`SUM(duration_seconds)` })
      .from(episodes);
    const totalDurationSeconds = Number(episodesSum?.sumDuration) || 0;
    const storageUsedGb = Number((totalDurationSeconds * 0.00043).toFixed(1)); // ~26 MB per minute

    // Bandwidth used: calculate from actual progress seconds sum in watch histories
    const [watchHistSum] = await db
      .select({ sumProgress: sql<number>`SUM(progress_seconds)` })
      .from(watchHistories);
    const totalProgressSeconds = Number(watchHistSum?.sumProgress) || 0;
    const bandwidthUsageGb = Number((totalProgressSeconds * 0.00043).toFixed(1));

    // User growth: compare last 30 days registration to the previous 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);

    const [newUsersRes] = await db
      .select({ count: count() })
      .from(users)
      .where(sql`created_at >= ${thirtyDaysAgo}`);

    const [oldUsersRes] = await db
      .select({ count: count() })
      .from(users)
      .where(sql`created_at >= ${sixtyDaysAgo} AND created_at < ${thirtyDaysAgo}`);

    const newUsersCount = newUsersRes?.count || 0;
    const oldUsersCount = oldUsersRes?.count || 0;

    const monthlyGrowthPercent = oldUsersCount > 0 
      ? Number(((newUsersCount - oldUsersCount) / oldUsersCount * 100).toFixed(1))
      : newUsersCount > 0 ? 100.0 : 0.0;

    return calculateDashboardStats(
      totalAnime,
      totalEpisodes,
      totalUsers,
      activeStreams,
      bandwidthUsageGb,
      storageUsedGb,
      monthlyGrowthPercent
    );
  } catch {
    return {
      totalAnime: 0,
      totalEpisodes: 0,
      totalUsers: 0,
      activeStreams: 0,
      bandwidthUsageGb: 0,
      cpuLoadPercent: 0,
      storageUsedGb: 0,
      monthlyGrowthPercent: 0,
    };
  }
}

export async function getDashboardUsers(): Promise<UserProfile[]> {
  const db = await getDb();

  try {
    const userRecords = await db.query.users.findMany({
      limit: 50,
      orderBy: [desc(users.createdAt)],
    });

    if (userRecords && userRecords.length > 0) {
      return userRecords.map(mapToDashboardUser);
    }
  } catch {
    // Return empty array
  }

  return [];
}

export async function getDashboardCategories(): Promise<CategoryItem[]> {
  const db = await getDb();

  try {
    const genreRecords = await db.query.genres.findMany({ limit: 50 });
    if (genreRecords && genreRecords.length > 0) {
      return genreRecords.map(mapToDashboardCategory);
    }
  } catch {
    // Return empty array
  }

  return [];
}

export async function getDashboardSeasons(): Promise<SeasonItem[]> {
  const db = await getDb();
  try {
    const seasonAnimes = await db.query.animes.findMany({ limit: 100 });
    if (seasonAnimes && seasonAnimes.length > 0) {
      return calculateDashboardSeasons(seasonAnimes);
    }
  } catch {
    // Return empty array
  }

  return [];
}

export async function getDashboardRoles(): Promise<RoleDefinition[]> {
  const db = await getDb();

  try {
    const [adminCount] = await db.select({ count: count() }).from(users).where(eq(users.role, "admin"));
    const [superAdminCount] = await db.select({ count: count() }).from(users).where(eq(users.role, "super_admin"));
    const [userCount] = await db.select({ count: count() }).from(users).where(eq(users.role, "user"));

    return [
      {
        id: "role-1",
        name: "Super Admin",
        slug: "super_admin",
        description: "Full system access including infrastructure and billing management.",
        memberCount: superAdminCount?.count || 0,
        permissions: ["all"],
      },
      {
        id: "role-2",
        name: "Administrator",
        slug: "admin",
        description: "Can manage anime titles, users, and moderation queues.",
        memberCount: adminCount?.count || 0,
        permissions: ["content.manage", "users.manage", "moderation.manage"],
      },
      {
        id: "role-3",
        name: "Regular User",
        slug: "regular_user",
        description: "Standard streaming member with personal watchlist and history.",
        memberCount: userCount?.count || 0,
        permissions: ["stream.watch", "watchlist.manage"],
      },
    ];
  } catch {
    return [];
  }
}

export async function getDashboardModeration(): Promise<ReportedComment[]> {
  return [];
}
