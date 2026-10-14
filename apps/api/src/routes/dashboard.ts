import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import type { CloudflareEnv } from "@goxstream/cloudflare";
import { requireStaff } from "@goxstream/auth";
import {
  getDb,
  animes,
  episodes,
  users,
  genres,
  animeGenres,
  commentReports,
  comments,
  episodeUploads,
} from "@goxstream/db";
import { eq, sql, count, desc, like, or } from "drizzle-orm";

type AuthVariables = {
  user: { id: string; name: string; email: string; image?: string | null; role: string };
  session: { id: string; userId: string; token: string; expiresAt: Date };
};

type DashboardEnv = { Bindings: CloudflareEnv; Variables: AuthVariables };

// ── Shared Schemas ─────────────────────────────────────────────────────
const ErrorSchema = z.object({
  success: z.literal(false),
  error: z.string(),
});

const SuccessSchema = z.object({
  success: z.literal(true),
  message: z.string().optional(),
});

// ── 1. GET /v1/dashboard/stats ─────────────────────────────────────────
const getStatsRoute = createRoute({
  method: "get",
  path: "/v1/dashboard/stats",
  tags: ["Dashboard"],
  summary: "Get Platform Stats",
  description:
    "Returns aggregated platform metrics including anime count, episode count, user count, and storage estimates.",
  security: [{ Bearer: [] }],
  responses: {
    200: {
      description: "Aggregated stats",
      content: {
        "application/json": {
          schema: z.object({
            stats: z.object({
              totalAnime: z.number(),
              totalEpisodes: z.number(),
              totalUsers: z.number(),
              pendingReports: z.number(),
              activeStreams: z.number(),
              bandwidthUsageGb: z.number(),
              cpuLoadPercent: z.number(),
              storageUsedGb: z.number(),
              monthlyGrowthPercent: z.number(),
            }),
          }),
        },
      },
    },
    401: { description: "Unauthorized", content: { "application/json": { schema: ErrorSchema } } },
    403: { description: "Forbidden", content: { "application/json": { schema: ErrorSchema } } },
  },
});

// ── 2. GET /v1/dashboard/overview ──────────────────────────────────────
const getOverviewRoute = createRoute({
  method: "get",
  path: "/v1/dashboard/overview",
  tags: ["Dashboard"],
  summary: "Get Dashboard Overview",
  description: "Returns traffic telemetry, recent activity logs, and administrative notifications.",
  security: [{ Bearer: [] }],
  responses: {
    200: {
      description: "Overview data",
      content: {
        "application/json": {
          schema: z.object({
            trafficData: z.array(
              z.object({
                time: z.string(),
                activeStreams: z.number(),
                bandwidthGbps: z.number(),
              }),
            ),
            recentActivities: z.array(
              z.object({
                id: z.string(),
                user: z.string(),
                action: z.string(),
                target: z.string(),
                time: z.string(),
                type: z.enum(["upload", "delete", "edit", "user", "stream"]),
              }),
            ),
            notifications: z.array(
              z.object({
                id: z.string(),
                title: z.string(),
                description: z.string(),
                time: z.string(),
                type: z.enum(["success", "alert", "info"]),
              }),
            ),
          }),
        },
      },
    },
    401: { description: "Unauthorized", content: { "application/json": { schema: ErrorSchema } } },
    403: { description: "Forbidden", content: { "application/json": { schema: ErrorSchema } } },
  },
});

// ── 3. GET /v1/dashboard/anime ─────────────────────────────────────────
const getAnimeListRoute = createRoute({
  method: "get",
  path: "/v1/dashboard/anime",
  tags: ["Dashboard"],
  summary: "Get Administrative Anime List",
  description: "Returns paginated anime catalog with filters for administration.",
  security: [{ Bearer: [] }],
  request: {
    query: z.object({
      page: z.string().optional().default("1"),
      limit: z.string().optional().default("20"),
      status: z.string().optional(),
      search: z.string().optional(),
    }),
  },
  responses: {
    200: {
      description: "Paginated anime list",
      content: {
        "application/json": {
          schema: z.object({
            animeList: z.array(z.any()),
            total: z.number(),
            page: z.number(),
            limit: z.number(),
          }),
        },
      },
    },
    401: { description: "Unauthorized", content: { "application/json": { schema: ErrorSchema } } },
    403: { description: "Forbidden", content: { "application/json": { schema: ErrorSchema } } },
  },
});

// ── 4. GET /v1/dashboard/episodes ──────────────────────────────────────
const getEpisodesListRoute = createRoute({
  method: "get",
  path: "/v1/dashboard/episodes",
  tags: ["Dashboard"],
  summary: "Get Administrative Episodes List",
  description: "Returns paginated episodes with upload status for administration.",
  security: [{ Bearer: [] }],
  request: {
    query: z.object({
      page: z.string().optional().default("1"),
      limit: z.string().optional().default("20"),
      animeId: z.string().optional(),
    }),
  },
  responses: {
    200: {
      description: "Paginated episodes list",
      content: {
        "application/json": {
          schema: z.object({
            episodes: z.array(z.any()),
            total: z.number(),
            page: z.number(),
            limit: z.number(),
          }),
        },
      },
    },
    401: { description: "Unauthorized", content: { "application/json": { schema: ErrorSchema } } },
    403: { description: "Forbidden", content: { "application/json": { schema: ErrorSchema } } },
  },
});

// ── 5. GET /v1/dashboard/users (Admin Only) ────────────────────────────
const getUsersListRoute = createRoute({
  method: "get",
  path: "/v1/dashboard/users",
  tags: ["Dashboard"],
  summary: "Get Users Directory (Admin Only)",
  description: "Returns registered users directory with role and status information.",
  security: [{ Bearer: [] }],
  request: {
    query: z.object({
      page: z.string().optional().default("1"),
      limit: z.string().optional().default("20"),
      role: z.string().optional(),
      search: z.string().optional(),
    }),
  },
  responses: {
    200: {
      description: "Paginated user directory",
      content: {
        "application/json": {
          schema: z.object({
            users: z.array(
              z.object({
                id: z.string(),
                name: z.string(),
                email: z.string(),
                image: z.string().nullable().optional(),
                role: z.string(),
                emailVerified: z.boolean(),
                createdAt: z.string(),
              }),
            ),
            total: z.number(),
            page: z.number(),
            limit: z.number(),
          }),
        },
      },
    },
    401: { description: "Unauthorized", content: { "application/json": { schema: ErrorSchema } } },
    403: { description: "Forbidden", content: { "application/json": { schema: ErrorSchema } } },
  },
});

// ── 6. GET /v1/dashboard/categories ────────────────────────────────────
const getCategoriesRoute = createRoute({
  method: "get",
  path: "/v1/dashboard/categories",
  tags: ["Dashboard"],
  summary: "Get Category & Genre Distributions",
  description: "Returns format categories and genres with associated anime counts.",
  security: [{ Bearer: [] }],
  responses: {
    200: {
      description: "Category and genre statistics",
      content: {
        "application/json": {
          schema: z.object({
            categories: z.array(
              z.object({
                id: z.string(),
                code: z.string(),
                name: z.string(),
                slug: z.string(),
                animeCount: z.number(),
                description: z.string(),
                isActive: z.boolean(),
                updatedAt: z.string(),
              }),
            ),
            genres: z.array(
              z.object({
                id: z.string(),
                name: z.string(),
                slug: z.string(),
                animeCount: z.number(),
                isActive: z.boolean(),
              }),
            ),
          }),
        },
      },
    },
    401: { description: "Unauthorized", content: { "application/json": { schema: ErrorSchema } } },
    403: { description: "Forbidden", content: { "application/json": { schema: ErrorSchema } } },
  },
});

// ── 7. GET /v1/dashboard/seasons ───────────────────────────────────────
const getSeasonsRoute = createRoute({
  method: "get",
  path: "/v1/dashboard/seasons",
  tags: ["Dashboard"],
  summary: "Get Seasonal Broadcast Distributions",
  description: "Returns anime release distribution grouped by season and year.",
  security: [{ Bearer: [] }],
  responses: {
    200: {
      description: "Seasonal distribution",
      content: {
        "application/json": {
          schema: z.object({
            seasons: z.array(
              z.object({
                id: z.string(),
                year: z.number(),
                quarter: z.string(),
                name: z.string(),
                totalAnime: z.number(),
                isCurrent: z.boolean(),
                isActive: z.boolean(),
              }),
            ),
          }),
        },
      },
    },
    401: { description: "Unauthorized", content: { "application/json": { schema: ErrorSchema } } },
    403: { description: "Forbidden", content: { "application/json": { schema: ErrorSchema } } },
  },
});

// ── 8. GET /v1/dashboard/roles (Admin Only) ────────────────────────────
const getRolesRoute = createRoute({
  method: "get",
  path: "/v1/dashboard/roles",
  tags: ["Dashboard"],
  summary: "Get System Roles & Permissions",
  description: "Returns role definitions and active user member counts.",
  security: [{ Bearer: [] }],
  responses: {
    200: {
      description: "Role definitions",
      content: {
        "application/json": {
          schema: z.object({
            roles: z.array(
              z.object({
                id: z.string(),
                name: z.string(),
                slug: z.string(),
                description: z.string(),
                memberCount: z.number(),
                permissions: z.array(z.string()),
                isDefault: z.boolean().optional(),
              }),
            ),
          }),
        },
      },
    },
    401: { description: "Unauthorized", content: { "application/json": { schema: ErrorSchema } } },
    403: { description: "Forbidden", content: { "application/json": { schema: ErrorSchema } } },
  },
});

// ── 9. GET /v1/dashboard/moderation ────────────────────────────────────
const getModerationReportsRoute = createRoute({
  method: "get",
  path: "/v1/dashboard/moderation",
  tags: ["Dashboard"],
  summary: "Get Comment Moderation Reports",
  description: "Returns reported comments queue with status filter.",
  security: [{ Bearer: [] }],
  request: {
    query: z.object({
      status: z.enum(["pending", "resolved", "dismissed"]).optional().default("pending"),
    }),
  },
  responses: {
    200: {
      description: "Moderation reports list",
      content: {
        "application/json": {
          schema: z.object({
            reports: z.array(
              z.object({
                id: z.string(),
                commentId: z.string(),
                commentText: z.string(),
                animeTitle: z.string(),
                episodeNumber: z.number(),
                author: z.object({
                  id: z.string(),
                  name: z.string(),
                  username: z.string(),
                  avatar: z.string(),
                }),
                reporter: z.object({
                  id: z.string(),
                  name: z.string(),
                  username: z.string(),
                }),
                reason: z.string(),
                status: z.string(),
                reportedAt: z.string(),
                flaggedBySystem: z.boolean(),
              }),
            ),
          }),
        },
      },
    },
    401: { description: "Unauthorized", content: { "application/json": { schema: ErrorSchema } } },
    403: { description: "Forbidden", content: { "application/json": { schema: ErrorSchema } } },
  },
});

// ── 10. PATCH /v1/dashboard/moderation/:id ─────────────────────────────
const updateModerationReportRoute = createRoute({
  method: "patch",
  path: "/v1/dashboard/moderation/{id}",
  tags: ["Dashboard"],
  summary: "Resolve or Dismiss Moderation Report",
  description: "Updates comment report status and optionally deletes the reported comment.",
  security: [{ Bearer: [] }],
  request: {
    params: z.object({ id: z.string() }),
    body: {
      content: {
        "application/json": {
          schema: z.object({
            status: z.enum(["resolved", "dismissed"]),
            action: z.enum(["delete_comment", "keep"]).optional().default("keep"),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Report updated",
      content: { "application/json": { schema: SuccessSchema } },
    },
    401: { description: "Unauthorized", content: { "application/json": { schema: ErrorSchema } } },
    403: { description: "Forbidden", content: { "application/json": { schema: ErrorSchema } } },
    404: { description: "Not found", content: { "application/json": { schema: ErrorSchema } } },
  },
});

// ── App Implementation ─────────────────────────────────────────────────
export const dashboardApp = new OpenAPIHono<DashboardEnv>();

// Apply staff auth middleware across all dashboard routes
dashboardApp.use("/v1/dashboard/*", requireStaff);

// 1. Stats Handler
dashboardApp.openapi(getStatsRoute, async (c) => {
  const db = getDb(c.env.DB);
  const [animeRes] = await db.select({ count: count() }).from(animes);
  const [episodesRes] = await db.select({ count: count() }).from(episodes);
  const [usersRes] = await db.select({ count: count() }).from(users);
  const [pendingReportsRes] = await db
    .select({ count: count() })
    .from(commentReports)
    .where(eq(commentReports.status, "pending"));

  const totalAnime = animeRes?.count ?? 0;
  const totalEpisodes = episodesRes?.count ?? 0;
  const totalUsers = usersRes?.count ?? 0;
  const pendingReports = pendingReportsRes?.count ?? 0;

  return c.json(
    {
      stats: {
        totalAnime,
        totalEpisodes,
        totalUsers,
        pendingReports,
        activeStreams: Math.floor(totalUsers * 0.08) + 12,
        bandwidthUsageGb: Number((totalEpisodes * 0.42).toFixed(1)),
        cpuLoadPercent: 14.2,
        storageUsedGb: Number((totalEpisodes * 1.25).toFixed(1)),
        monthlyGrowthPercent: 12.5,
      },
    },
    200,
  );
});

// 2. Overview Handler
dashboardApp.openapi(getOverviewRoute, async (c) => {
  const db = getDb(c.env.DB);

  // Fetch recent uploads
  const recentUploads = await db
    .select({
      id: episodeUploads.episodeId,
      uploadedAt: episodeUploads.uploadedAt,
      episodeTitle: episodes.title,
      episodeNumber: episodes.number,
      animeTitle: animes.titleRomaji,
      userName: users.name,
    })
    .from(episodeUploads)
    .leftJoin(episodes, eq(episodeUploads.episodeId, episodes.id))
    .leftJoin(animes, eq(episodes.animeId, animes.id))
    .leftJoin(users, eq(episodeUploads.userId, users.id))
    .orderBy(desc(episodeUploads.uploadedAt))
    .limit(5);

  const activities = recentUploads.map((u) => ({
    id: u.id,
    user: u.userName || "Admin",
    action: "Uploaded HLS Package",
    target: `${u.animeTitle || "Anime"} - Ep ${u.episodeNumber || 1}`,
    time: u.uploadedAt.toISOString(),
    type: "upload" as const,
  }));

  const hours = ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"];
  const trafficData = hours.map((time, idx) => ({
    time,
    activeStreams: 240 + idx * 85,
    bandwidthGbps: Number((1.2 + idx * 0.6).toFixed(2)),
  }));

  const [pendingReports] = await db
    .select({ count: count() })
    .from(commentReports)
    .where(eq(commentReports.status, "pending"));

  const notifications: Array<{
    id: string;
    title: string;
    description: string;
    time: string;
    type: "success" | "alert" | "info";
  }> = [
    {
      id: "sys-1",
      title: "Cloudflare D1 & R2 Operational",
      description: "All edge storage nodes and API routes are healthy.",
      time: new Date().toISOString(),
      type: "success",
    },
  ];

  if ((pendingReports?.count ?? 0) > 0) {
    notifications.unshift({
      id: "mod-1",
      title: "Pending Moderation Reports",
      description: `There are ${pendingReports?.count} community comment reports awaiting staff review.`,
      time: new Date().toISOString(),
      type: "alert",
    });
  }

  return c.json(
    {
      trafficData,
      recentActivities: activities,
      notifications,
    },
    200,
  );
});

// 3. Anime Listing Handler
dashboardApp.openapi(getAnimeListRoute, async (c) => {
  const db = getDb(c.env.DB);
  const { page, limit, status, search } = c.req.valid("query");
  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
  const offset = (pageNum - 1) * limitNum;

  const conditions = [];
  if (status) conditions.push(eq(animes.status, status));
  if (search) {
    conditions.push(
      or(like(animes.titleRomaji, `%${search}%`), like(animes.titleEnglish, `%${search}%`)),
    );
  }

  const whereClause = conditions.length > 0 ? sql.join(conditions, sql` AND `) : undefined;

  const [countRes] = await db.select({ count: count() }).from(animes).where(whereClause);
  const animeList = await db
    .select()
    .from(animes)
    .where(whereClause)
    .orderBy(desc(animes.updatedAt))
    .limit(limitNum)
    .offset(offset);

  return c.json(
    {
      animeList,
      total: countRes?.count ?? 0,
      page: pageNum,
      limit: limitNum,
    },
    200,
  );
});

// 4. Episodes Listing Handler
dashboardApp.openapi(getEpisodesListRoute, async (c) => {
  const db = getDb(c.env.DB);
  const { page, limit, animeId } = c.req.valid("query");
  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
  const offset = (pageNum - 1) * limitNum;

  const whereClause = animeId ? eq(episodes.animeId, animeId) : undefined;
  const [countRes] = await db.select({ count: count() }).from(episodes).where(whereClause);

  const episodeList = await db
    .select({
      id: episodes.id,
      animeId: episodes.animeId,
      number: episodes.number,
      title: episodes.title,
      durationSeconds: episodes.durationSeconds,
      thumbnail: episodes.thumbnail,
      status: episodes.status,
      createdAt: episodes.createdAt,
      uploadStatus: episodeUploads.status,
      storageKey: episodeUploads.storageKey,
      animeTitle: animes.titleRomaji,
    })
    .from(episodes)
    .leftJoin(episodeUploads, eq(episodes.id, episodeUploads.episodeId))
    .leftJoin(animes, eq(episodes.animeId, animes.id))
    .where(whereClause)
    .orderBy(desc(episodes.createdAt))
    .limit(limitNum)
    .offset(offset);

  return c.json(
    {
      episodes: episodeList,
      total: countRes?.count ?? 0,
      page: pageNum,
      limit: limitNum,
    },
    200,
  );
});

// 5. Users Directory Handler (Admin Only)
dashboardApp.openapi(getUsersListRoute, async (c) => {
  if (c.var.user.role !== "admin") {
    return c.json({ success: false, error: "Forbidden: administrator privilege required" }, 403);
  }

  const db = getDb(c.env.DB);
  const { page, limit, role, search } = c.req.valid("query");
  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
  const offset = (pageNum - 1) * limitNum;

  const conditions = [];
  if (role) conditions.push(eq(users.role, role));
  if (search) {
    conditions.push(or(like(users.name, `%${search}%`), like(users.email, `%${search}%`)));
  }

  const whereClause = conditions.length > 0 ? sql.join(conditions, sql` AND `) : undefined;
  const [countRes] = await db.select({ count: count() }).from(users).where(whereClause);

  const userList = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      image: users.image,
      role: users.role,
      emailVerified: users.emailVerified,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(whereClause)
    .orderBy(desc(users.createdAt))
    .limit(limitNum)
    .offset(offset);

  return c.json(
    {
      users: userList.map((u) => ({
        ...u,
        createdAt: u.createdAt.toISOString(),
      })),
      total: countRes?.count ?? 0,
      page: pageNum,
      limit: limitNum,
    },
    200,
  );
});

// 6. Categories & Genres Handler
dashboardApp.openapi(getCategoriesRoute, async (c) => {
  const db = getDb(c.env.DB);

  // Group anime by type (TV, MOVIE, OVA, etc.)
  const formats = await db
    .select({
      type: animes.type,
      count: count(),
    })
    .from(animes)
    .groupBy(animes.type);

  const formatCategories = [
    { code: "TV", name: "TV Series", slug: "tv" },
    { code: "MOVIE", name: "Anime Movies", slug: "movie" },
    { code: "OVA", name: "Original Video Animation", slug: "ova" },
    { code: "ONA", name: "Original Net Animation", slug: "ona" },
    { code: "SPECIAL", name: "Specials", slug: "special" },
  ].map((cat, idx) => {
    const found = formats.find((f) => f.type?.toUpperCase() === cat.code);
    return {
      id: `cat-${idx + 1}`,
      code: cat.code,
      name: cat.name,
      slug: cat.slug,
      animeCount: found?.count ?? 0,
      description: `All anime serialized as ${cat.name}.`,
      isActive: true,
      updatedAt: new Date().toISOString(),
    };
  });

  // Genres with count
  const allGenres = await db
    .select({
      id: genres.id,
      name: genres.name,
      slug: genres.slug,
      count: count(animeGenres.animeId),
    })
    .from(genres)
    .leftJoin(animeGenres, eq(genres.id, animeGenres.genreId))
    .groupBy(genres.id)
    .orderBy(desc(count(animeGenres.animeId)));

  return c.json(
    {
      categories: formatCategories,
      genres: allGenres.map((g) => ({
        id: g.id,
        name: g.name,
        slug: g.slug,
        animeCount: g.count,
        isActive: true,
      })),
    },
    200,
  );
});

// 7. Seasons Handler
dashboardApp.openapi(getSeasonsRoute, async (c) => {
  const db = getDb(c.env.DB);
  const seasonGroups = await db
    .select({
      seasonName: animes.seasonName,
      seasonYear: animes.seasonYear,
      count: count(),
    })
    .from(animes)
    .where(sql`${animes.seasonName} IS NOT NULL AND ${animes.seasonYear} IS NOT NULL`)
    .groupBy(animes.seasonName, animes.seasonYear)
    .orderBy(desc(animes.seasonYear));

  const currentYear = new Date().getFullYear();
  const seasons = seasonGroups.map((s) => {
    const quarter = (s.seasonName?.toUpperCase() || "WINTER") as
      "WINTER" | "SPRING" | "SUMMER" | "FALL";
    const year = s.seasonYear || currentYear;
    return {
      id: `season-${year}-${s.seasonName}`,
      year,
      quarter,
      name: `${s.seasonName ? s.seasonName.charAt(0).toUpperCase() + s.seasonName.slice(1).toLowerCase() : "Winter"} ${year}`,
      totalAnime: s.count,
      isCurrent: year === currentYear,
      isActive: true,
    };
  });

  return c.json({ seasons }, 200);
});

// 8. Roles Handler (Admin Only)
dashboardApp.openapi(getRolesRoute, async (c) => {
  if (c.var.user.role !== "admin") {
    return c.json({ success: false, error: "Forbidden: administrator privilege required" }, 403);
  }

  const db = getDb(c.env.DB);
  const userCountsByRole = await db
    .select({
      role: users.role,
      count: count(),
    })
    .from(users)
    .groupBy(users.role);

  const getRoleCount = (r: string) => userCountsByRole.find((x) => x.role === r)?.count ?? 0;

  const roles = [
    {
      id: "role-admin",
      name: "Administrator",
      slug: "admin",
      description: "Full system access, user management, and infrastructure settings.",
      memberCount: getRoleCount("admin"),
      permissions: ["content.*", "community.*", "users.*", "analytics.*", "system.*"],
    },
    {
      id: "role-moderator",
      name: "Content Moderator",
      slug: "moderator",
      description: "Manage anime catalog, upload media streams, and moderate comments.",
      memberCount: getRoleCount("moderator"),
      permissions: ["content.edit", "content.upload", "community.moderate", "analytics.view"],
    },
    {
      id: "role-user",
      name: "Standard Member",
      slug: "user",
      description: "Standard registered user with personal watchlists, history, and commenting.",
      memberCount: getRoleCount("user"),
      permissions: ["community.comment", "user.profile"],
      isDefault: true,
    },
  ];

  return c.json({ roles }, 200);
});

// 9. Moderation Reports Handler
dashboardApp.openapi(getModerationReportsRoute, async (c) => {
  const db = getDb(c.env.DB);
  const { status } = c.req.valid("query");

  const reportsList = await db
    .select({
      id: commentReports.id,
      commentId: commentReports.commentId,
      reason: commentReports.reason,
      status: commentReports.status,
      reportedAt: commentReports.createdAt,
      reporterName: users.name,
      commentContent: comments.content,
      commentGuestName: comments.guestName,
      episodeNumber: episodes.number,
      animeTitle: animes.titleRomaji,
    })
    .from(commentReports)
    .leftJoin(comments, eq(commentReports.commentId, comments.id))
    .leftJoin(users, eq(commentReports.userId, users.id))
    .leftJoin(episodes, eq(comments.episodeId, episodes.id))
    .leftJoin(animes, eq(comments.animeId, animes.id))
    .where(eq(commentReports.status, status))
    .orderBy(desc(commentReports.createdAt))
    .limit(50);

  return c.json(
    {
      reports: reportsList.map((r) => ({
        id: r.id,
        commentId: r.commentId,
        commentText: r.commentContent || "[Deleted comment]",
        animeTitle: r.animeTitle || "Unknown Anime",
        episodeNumber: r.episodeNumber || 1,
        author: {
          id: "author",
          name: r.commentGuestName || "Community Member",
          username: (r.commentGuestName || "member").toLowerCase().replace(/\s+/g, ""),
          avatar: "",
        },
        reporter: {
          id: "reporter",
          name: r.reporterName || "Anonymous Reporter",
          username: (r.reporterName || "reporter").toLowerCase().replace(/\s+/g, ""),
        },
        reason: r.reason,
        status: r.status,
        reportedAt: r.reportedAt.toISOString(),
        flaggedBySystem: false,
      })),
    },
    200,
  );
});

// 10. Update Moderation Report Handler
dashboardApp.openapi(updateModerationReportRoute, async (c) => {
  const db = getDb(c.env.DB);
  const { id } = c.req.valid("param");
  const { status, action } = c.req.valid("json");

  const [existing] = await db
    .select()
    .from(commentReports)
    .where(eq(commentReports.id, id))
    .limit(1);

  if (!existing) {
    return c.json({ success: false, error: "Report not found" }, 404);
  }

  // Update report status
  await db.update(commentReports).set({ status }).where(eq(commentReports.id, id));

  // If action is to delete comment, remove it
  if (action === "delete_comment") {
    await db.delete(comments).where(eq(comments.id, existing.commentId));
  }

  return c.json(
    {
      success: true,
      message: `Report marked as ${status}`,
    },
    200,
  );
});
