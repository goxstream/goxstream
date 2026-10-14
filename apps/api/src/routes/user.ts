import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import type { CloudflareEnv } from "@goxstream/cloudflare";
import { requireAuth } from "@goxstream/auth";
import { getDb, users, userSettings, watchlists, watchHistories } from "@goxstream/db";
import { eq, and, desc } from "drizzle-orm";

type AuthVariables = {
  user: { id: string; name: string; email: string; image?: string | null; role: string };
  session: { id: string; userId: string; token: string; expiresAt: Date };
};

type UserEnv = { Bindings: CloudflareEnv; Variables: AuthVariables };

// ── Shared Response Schemas ────────────────────────────────────────────
const ErrorSchema = z.object({
  success: z.literal(false),
  error: z.string(),
});

const SuccessSchema = z.object({
  success: z.literal(true),
  message: z.string().optional(),
});

// ── Route Definitions ──────────────────────────────────────────────────

// GET /v1/user/profile
const getProfileRoute = createRoute({
  method: "get",
  path: "/v1/user/profile",
  tags: ["User"],
  summary: "Get User Profile",
  description:
    "Retrieves the authenticated user's profile with activity summary (watchlist count and recent history count).",
  security: [{ Bearer: [] }],
  responses: {
    200: {
      description: "User profile",
      content: {
        "application/json": {
          schema: z.object({
            success: z.literal(true),
            data: z.object({
              id: z.string(),
              name: z.string(),
              email: z.string(),
              image: z.string().nullable().optional(),
              role: z.string(),
              activity: z.object({
                watchlistCount: z.number(),
                historyCount: z.number(),
              }),
            }),
          }),
        },
      },
    },
    401: { description: "Unauthorized", content: { "application/json": { schema: ErrorSchema } } },
  },
});

// GET /v1/user/settings
const getSettingsRoute = createRoute({
  method: "get",
  path: "/v1/user/settings",
  tags: ["User"],
  summary: "Get User Settings",
  description: "Retrieves player preferences and notification settings for the authenticated user.",
  security: [{ Bearer: [] }],
  responses: {
    200: {
      description: "User settings",
      content: {
        "application/json": {
          schema: z.object({
            success: z.literal(true),
            data: z.object({
              player: z.object({
                defaultQuality: z.string(),
                defaultSubtitle: z.string(),
                autoPlayNext: z.boolean(),
                autoSkipIntro: z.boolean(),
                preferredAudio: z.string(),
              }),
              notifications: z.object({
                newEpisodeAlerts: z.boolean(),
                watchlistUpdates: z.boolean(),
                marketingEmails: z.boolean(),
                publicWatchlist: z.boolean(),
              }),
            }),
          }),
        },
      },
    },
    401: { description: "Unauthorized", content: { "application/json": { schema: ErrorSchema } } },
  },
});

// PATCH /v1/user/settings
const updateSettingsRoute = createRoute({
  method: "patch",
  path: "/v1/user/settings",
  tags: ["User"],
  summary: "Update User Settings",
  description: "Updates player preferences and notification settings.",
  security: [{ Bearer: [] }],
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            profile: z
              .object({
                displayName: z.string().optional(),
                bio: z.string().optional(),
                avatarUrl: z.string().optional(),
              })
              .optional(),
            player: z
              .object({
                defaultQuality: z.string().optional(),
                defaultSubtitle: z.string().optional(),
                autoPlayNext: z.boolean().optional(),
                autoSkipIntro: z.boolean().optional(),
                preferredAudio: z.string().optional(),
              })
              .optional(),
            notifications: z
              .object({
                newEpisodeAlerts: z.boolean().optional(),
                watchlistUpdates: z.boolean().optional(),
                marketingEmails: z.boolean().optional(),
                publicWatchlist: z.boolean().optional(),
              })
              .optional(),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Settings updated",
      content: { "application/json": { schema: SuccessSchema } },
    },
    401: { description: "Unauthorized", content: { "application/json": { schema: ErrorSchema } } },
  },
});

// GET /v1/user/watchlist
const getWatchlistRoute = createRoute({
  method: "get",
  path: "/v1/user/watchlist",
  tags: ["User"],
  summary: "Get User Watchlist",
  description: "Retrieves the authenticated user's anime watchlist with optional status filter.",
  security: [{ Bearer: [] }],
  request: {
    query: z.object({
      status: z.string().optional(),
    }),
  },
  responses: {
    200: {
      description: "Watchlist items",
      content: {
        "application/json": {
          schema: z.object({
            success: z.literal(true),
            data: z.array(
              z.object({
                id: z.string(),
                animeId: z.string(),
                status: z.string(),
                isFavorite: z.boolean(),
                currentEpisode: z.number(),
                userRating: z.number().nullable().optional(),
                createdAt: z.string(),
                updatedAt: z.string(),
              }),
            ),
          }),
        },
      },
    },
    401: { description: "Unauthorized", content: { "application/json": { schema: ErrorSchema } } },
  },
});

// POST /v1/user/watchlist
const addWatchlistRoute = createRoute({
  method: "post",
  path: "/v1/user/watchlist",
  tags: ["User"],
  summary: "Add to Watchlist",
  description:
    "Adds an anime to the user's watchlist. Upserts if the anime already exists in the watchlist.",
  security: [{ Bearer: [] }],
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            animeId: z.string().min(1),
            status: z.string().optional().default("plan_to_watch"),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Added to watchlist",
      content: { "application/json": { schema: SuccessSchema } },
    },
    401: { description: "Unauthorized", content: { "application/json": { schema: ErrorSchema } } },
  },
});

// PATCH /v1/user/watchlist/{animeId}
const updateWatchlistRoute = createRoute({
  method: "patch",
  path: "/v1/user/watchlist/{animeId}",
  tags: ["User"],
  summary: "Update Watchlist Entry",
  description: "Updates status or favorite flag for a specific anime in the user's watchlist.",
  security: [{ Bearer: [] }],
  request: {
    params: z.object({ animeId: z.string().min(1) }),
    body: {
      content: {
        "application/json": {
          schema: z.object({
            status: z.string().optional(),
            isFavorite: z.boolean().optional(),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Watchlist updated",
      content: { "application/json": { schema: SuccessSchema } },
    },
    401: { description: "Unauthorized", content: { "application/json": { schema: ErrorSchema } } },
  },
});

// DELETE /v1/user/watchlist/{animeId}
const deleteWatchlistRoute = createRoute({
  method: "delete",
  path: "/v1/user/watchlist/{animeId}",
  tags: ["User"],
  summary: "Remove from Watchlist",
  description: "Removes an anime from the user's watchlist.",
  security: [{ Bearer: [] }],
  request: {
    params: z.object({ animeId: z.string().min(1) }),
  },
  responses: {
    200: { description: "Removed", content: { "application/json": { schema: SuccessSchema } } },
    401: { description: "Unauthorized", content: { "application/json": { schema: ErrorSchema } } },
  },
});

// GET /v1/user/history
const getHistoryRoute = createRoute({
  method: "get",
  path: "/v1/user/history",
  tags: ["User"],
  summary: "Get Watch History",
  description: "Retrieves the authenticated user's watch history sorted by most recent.",
  security: [{ Bearer: [] }],
  request: {
    query: z.object({
      limit: z.string().optional().default("50"),
    }),
  },
  responses: {
    200: {
      description: "Watch history",
      content: {
        "application/json": {
          schema: z.object({
            success: z.literal(true),
            data: z.array(
              z.object({
                id: z.string(),
                animeId: z.string(),
                episodeId: z.string(),
                episodeNumber: z.number().nullable().optional(),
                progressPercent: z.number(),
                durationSeconds: z.number(),
                progressSeconds: z.number(),
                lastWatchedAt: z.string(),
              }),
            ),
          }),
        },
      },
    },
    401: { description: "Unauthorized", content: { "application/json": { schema: ErrorSchema } } },
  },
});

// POST /v1/user/history
const recordHistoryRoute = createRoute({
  method: "post",
  path: "/v1/user/history",
  tags: ["User"],
  summary: "Record Playback Progress",
  description:
    "Records or updates playback progress for an episode (heartbeat). Upserts on [userId, episodeId].",
  security: [{ Bearer: [] }],
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            animeId: z.string().min(1),
            episodeId: z.string().min(1),
            episodeNumber: z.number().optional(),
            progressPercent: z.number().min(0).max(100).default(0),
            durationSeconds: z.number().min(0).default(0),
            progressSeconds: z.number().min(0).default(0),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Progress recorded",
      content: { "application/json": { schema: SuccessSchema } },
    },
    401: { description: "Unauthorized", content: { "application/json": { schema: ErrorSchema } } },
  },
});

// DELETE /v1/user/history/{id}
const deleteHistoryItemRoute = createRoute({
  method: "delete",
  path: "/v1/user/history/{id}",
  tags: ["User"],
  summary: "Delete History Item",
  description: "Deletes a single watch history record.",
  security: [{ Bearer: [] }],
  request: {
    params: z.object({ id: z.string().min(1) }),
  },
  responses: {
    200: { description: "Deleted", content: { "application/json": { schema: SuccessSchema } } },
    401: { description: "Unauthorized", content: { "application/json": { schema: ErrorSchema } } },
  },
});

// DELETE /v1/user/history
const clearHistoryRoute = createRoute({
  method: "delete",
  path: "/v1/user/history",
  tags: ["User"],
  summary: "Clear All History",
  description: "Clears the authenticated user's entire watch history.",
  security: [{ Bearer: [] }],
  responses: {
    200: {
      description: "History cleared",
      content: { "application/json": { schema: SuccessSchema } },
    },
    401: { description: "Unauthorized", content: { "application/json": { schema: ErrorSchema } } },
  },
});

// ── App & Middleware ───────────────────────────────────────────────────

export const userApp = new OpenAPIHono<UserEnv>();

// Apply auth middleware to all /v1/user/* routes
userApp.use("/v1/user/*", requireAuth);

// ── Implementations ───────────────────────────────────────────────────

// GET /v1/user/profile
userApp.openapi(getProfileRoute, async (c) => {
  const db = getDb(c.env.DB);
  const user = c.var.user;

  const [wlCount, histCount] = await Promise.all([
    db
      .select({ count: eq(watchlists.userId, user.id) })
      .from(watchlists)
      .where(eq(watchlists.userId, user.id)),
    db
      .select({ count: eq(watchHistories.userId, user.id) })
      .from(watchHistories)
      .where(eq(watchHistories.userId, user.id)),
  ]);

  return c.json(
    {
      success: true as const,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image ?? null,
        role: user.role,
        activity: {
          watchlistCount: wlCount.length,
          historyCount: histCount.length,
        },
      },
    },
    200,
  );
});

// GET /v1/user/settings
userApp.openapi(getSettingsRoute, async (c) => {
  const db = getDb(c.env.DB);
  const user = c.var.user;

  const settings = await db
    .select()
    .from(userSettings)
    .where(eq(userSettings.userId, user.id))
    .limit(1);
  const s = settings[0];

  return c.json(
    {
      success: true as const,
      data: {
        player: {
          defaultQuality: s?.defaultQuality ?? "1080p",
          defaultSubtitle: s?.defaultSubtitle ?? "indonesia",
          autoPlayNext: s?.autoPlayNext ?? true,
          autoSkipIntro: s?.autoSkipIntro ?? false,
          preferredAudio: s?.preferredAudio ?? "japanese",
        },
        notifications: {
          newEpisodeAlerts: s?.newEpisodeAlerts ?? true,
          watchlistUpdates: s?.watchlistUpdates ?? true,
          marketingEmails: s?.marketingEmails ?? false,
          publicWatchlist: s?.publicWatchlist ?? true,
        },
      },
    },
    200,
  );
});

// PATCH /v1/user/settings
userApp.openapi(updateSettingsRoute, async (c) => {
  const db = getDb(c.env.DB);
  const user = c.var.user;
  const body = c.req.valid("json");

  if (body.profile) {
    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (body.profile.displayName !== undefined) updateData.name = body.profile.displayName;
    if (body.profile.avatarUrl !== undefined) updateData.image = body.profile.avatarUrl;
    await db.update(users).set(updateData).where(eq(users.id, user.id));
  }

  if (body.player || body.notifications) {
    const settingsData: Record<string, unknown> = {};
    if (body.player?.defaultQuality !== undefined)
      settingsData.defaultQuality = body.player.defaultQuality;
    if (body.player?.defaultSubtitle !== undefined)
      settingsData.defaultSubtitle = body.player.defaultSubtitle;
    if (body.player?.autoPlayNext !== undefined)
      settingsData.autoPlayNext = body.player.autoPlayNext;
    if (body.player?.autoSkipIntro !== undefined)
      settingsData.autoSkipIntro = body.player.autoSkipIntro;
    if (body.player?.preferredAudio !== undefined)
      settingsData.preferredAudio = body.player.preferredAudio;
    if (body.notifications?.newEpisodeAlerts !== undefined)
      settingsData.newEpisodeAlerts = body.notifications.newEpisodeAlerts;
    if (body.notifications?.watchlistUpdates !== undefined)
      settingsData.watchlistUpdates = body.notifications.watchlistUpdates;
    if (body.notifications?.marketingEmails !== undefined)
      settingsData.marketingEmails = body.notifications.marketingEmails;
    if (body.notifications?.publicWatchlist !== undefined)
      settingsData.publicWatchlist = body.notifications.publicWatchlist;

    if (Object.keys(settingsData).length > 0) {
      await db
        .insert(userSettings)
        .values({ userId: user.id, ...settingsData } as typeof userSettings.$inferInsert)
        .onConflictDoUpdate({
          target: userSettings.userId,
          set: settingsData,
        });
    }
  }

  return c.json({ success: true as const, message: "Settings updated" }, 200);
});

// GET /v1/user/watchlist
userApp.openapi(getWatchlistRoute, async (c) => {
  const db = getDb(c.env.DB);
  const user = c.var.user;
  const { status } = c.req.valid("query");

  const conditions = [eq(watchlists.userId, user.id)];
  if (status) conditions.push(eq(watchlists.status, status));

  const items = await db
    .select()
    .from(watchlists)
    .where(and(...conditions))
    .orderBy(desc(watchlists.updatedAt));

  return c.json(
    {
      success: true as const,
      data: items.map((item) => ({
        ...item,
        isFavorite: Boolean(item.isFavorite),
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      })),
    },
    200,
  );
});

// POST /v1/user/watchlist
userApp.openapi(addWatchlistRoute, async (c) => {
  const db = getDb(c.env.DB);
  const user = c.var.user;
  const { animeId, status } = c.req.valid("json");

  await db
    .insert(watchlists)
    .values({ userId: user.id, animeId, status })
    .onConflictDoUpdate({
      target: [watchlists.userId, watchlists.animeId],
      set: { status, updatedAt: new Date() },
    });

  return c.json({ success: true as const, message: "Added to watchlist" }, 200);
});

// PATCH /v1/user/watchlist/:animeId
userApp.openapi(updateWatchlistRoute, async (c) => {
  const db = getDb(c.env.DB);
  const user = c.var.user;
  const { animeId } = c.req.valid("param");
  const body = c.req.valid("json");

  const updateData: Record<string, unknown> = { updatedAt: new Date() };
  if (body.status !== undefined) updateData.status = body.status;
  if (body.isFavorite !== undefined) updateData.isFavorite = body.isFavorite;

  await db
    .update(watchlists)
    .set(updateData)
    .where(and(eq(watchlists.userId, user.id), eq(watchlists.animeId, animeId)));

  return c.json({ success: true as const, message: "Watchlist updated" }, 200);
});

// DELETE /v1/user/watchlist/:animeId
userApp.openapi(deleteWatchlistRoute, async (c) => {
  const db = getDb(c.env.DB);
  const user = c.var.user;
  const { animeId } = c.req.valid("param");

  await db
    .delete(watchlists)
    .where(and(eq(watchlists.userId, user.id), eq(watchlists.animeId, animeId)));

  return c.json({ success: true as const, message: "Removed from watchlist" }, 200);
});

// GET /v1/user/history
userApp.openapi(getHistoryRoute, async (c) => {
  const db = getDb(c.env.DB);
  const user = c.var.user;
  const { limit } = c.req.valid("query");
  const parsedLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));

  const items = await db
    .select()
    .from(watchHistories)
    .where(eq(watchHistories.userId, user.id))
    .orderBy(desc(watchHistories.lastWatchedAt))
    .limit(parsedLimit);

  return c.json(
    {
      success: true as const,
      data: items.map((item) => ({
        ...item,
        lastWatchedAt: item.lastWatchedAt.toISOString(),
      })),
    },
    200,
  );
});

// POST /v1/user/history
userApp.openapi(recordHistoryRoute, async (c) => {
  const db = getDb(c.env.DB);
  const user = c.var.user;
  const body = c.req.valid("json");

  await db
    .insert(watchHistories)
    .values({
      userId: user.id,
      animeId: body.animeId,
      episodeId: body.episodeId,
      episodeNumber: body.episodeNumber,
      progressPercent: body.progressPercent,
      durationSeconds: body.durationSeconds,
      progressSeconds: body.progressSeconds,
      lastWatchedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [watchHistories.userId, watchHistories.episodeId],
      set: {
        progressPercent: body.progressPercent,
        progressSeconds: body.progressSeconds,
        durationSeconds: body.durationSeconds,
        lastWatchedAt: new Date(),
      },
    });

  return c.json({ success: true as const, message: "Progress recorded" }, 200);
});

// DELETE /v1/user/history/:id
userApp.openapi(deleteHistoryItemRoute, async (c) => {
  const db = getDb(c.env.DB);
  const user = c.var.user;
  const { id } = c.req.valid("param");

  await db
    .delete(watchHistories)
    .where(and(eq(watchHistories.id, id), eq(watchHistories.userId, user.id)));

  return c.json({ success: true as const, message: "History item deleted" }, 200);
});

// DELETE /v1/user/history
userApp.openapi(clearHistoryRoute, async (c) => {
  const db = getDb(c.env.DB);
  const user = c.var.user;

  await db.delete(watchHistories).where(eq(watchHistories.userId, user.id));

  return c.json({ success: true as const, message: "All history cleared" }, 200);
});
