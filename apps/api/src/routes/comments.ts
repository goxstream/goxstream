import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import type { CloudflareEnv } from "@shionstream/cloudflare";
import { requireAuth, optionalAuth } from "@shionstream/auth";
import { getDb, comments, commentLikes, commentReports } from "@shionstream/db";
import { eq, desc, sql } from "drizzle-orm";

type AuthUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: string;
};

type AuthSession = {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
};

// ── Shared Schemas ─────────────────────────────────────────────────────
const ErrorSchema = z.object({
  success: z.literal(false),
  error: z.string(),
});

const CommentItemSchema = z.object({
  id: z.string(),
  animeId: z.string(),
  episodeId: z.string(),
  userId: z.string().nullable().optional(),
  guestName: z.string().nullable().optional(),
  parentId: z.string().nullable().optional(),
  content: z.string(),
  isSpoiler: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  likes: z.number(),
  dislikes: z.number(),
});

// ── Route Definitions ──────────────────────────────────────────────────

// GET /v1/comments
const getCommentsRoute = createRoute({
  method: "get",
  path: "/v1/comments",
  tags: ["Comments"],
  summary: "Get Episode Comments",
  description:
    "Retrieves threaded comments for an episode, ordered by newest first, with like/dislike counts.",
  request: {
    query: z.object({
      episodeId: z.string().min(1),
    }),
  },
  responses: {
    200: {
      description: "Comments list",
      content: {
        "application/json": {
          schema: z.object({
            success: z.literal(true),
            data: z.array(CommentItemSchema),
          }),
        },
      },
    },
    400: {
      description: "Missing episodeId",
      content: { "application/json": { schema: ErrorSchema } },
    },
  },
});

// POST /v1/comments
const createCommentRoute = createRoute({
  method: "post",
  path: "/v1/comments",
  tags: ["Comments"],
  summary: "Create Comment",
  description:
    "Creates a new comment or reply on an episode. Supports both authenticated users and guests (guest requires name and email).",
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            animeId: z.string().min(1),
            episodeId: z.string().min(1),
            content: z.string().min(1).max(2000),
            parentId: z.string().optional(),
            isSpoiler: z.boolean().optional().default(false),
            guestName: z.string().optional(),
            guestEmail: z.string().email().optional(),
          }),
        },
      },
    },
  },
  responses: {
    201: {
      description: "Comment created",
      content: {
        "application/json": {
          schema: z.object({
            success: z.literal(true),
            data: CommentItemSchema,
          }),
        },
      },
    },
    400: {
      description: "Validation error",
      content: { "application/json": { schema: ErrorSchema } },
    },
  },
});

// POST /v1/comments/{id}/like
const likeCommentRoute = createRoute({
  method: "post",
  path: "/v1/comments/{id}/like",
  tags: ["Comments"],
  summary: "Like or Dislike Comment",
  description:
    "Adds or toggles a like/dislike reaction on a comment. Upserts on [commentId, userId].",
  security: [{ Bearer: [] }],
  request: {
    params: z.object({ id: z.string().min(1) }),
    body: {
      content: {
        "application/json": {
          schema: z.object({
            isDislike: z.boolean().default(false),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Reaction recorded",
      content: {
        "application/json": {
          schema: z.object({ success: z.literal(true), message: z.string() }),
        },
      },
    },
    401: { description: "Unauthorized", content: { "application/json": { schema: ErrorSchema } } },
  },
});

// POST /v1/comments/{id}/report
const reportCommentRoute = createRoute({
  method: "post",
  path: "/v1/comments/{id}/report",
  tags: ["Comments"],
  summary: "Report Comment",
  description: "Submits a comment to the moderation queue with a reason.",
  request: {
    params: z.object({ id: z.string().min(1) }),
    body: {
      content: {
        "application/json": {
          schema: z.object({
            reason: z.string().min(1).max(500),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Report submitted",
      content: {
        "application/json": {
          schema: z.object({ success: z.literal(true), message: z.string() }),
        },
      },
    },
  },
});

// ── App ────────────────────────────────────────────────────────────────

export const commentsApp = new OpenAPIHono<{
  Bindings: CloudflareEnv;
  Variables: { user: AuthUser | null; session: AuthSession | null };
}>();

// GET /v1/comments — Public
commentsApp.openapi(getCommentsRoute, async (c) => {
  const db = getDb(c.env.DB);
  const { episodeId } = c.req.valid("query");

  const rows = await db
    .select()
    .from(comments)
    .where(eq(comments.episodeId, episodeId))
    .orderBy(desc(comments.createdAt));

  // Batch-fetch like/dislike counts for all returned comments
  const commentIds = rows.map((r) => r.id);
  const likeCounts: Record<string, { likes: number; dislikes: number }> = {};

  if (commentIds.length > 0) {
    const likeRows = await db
      .select({
        commentId: commentLikes.commentId,
        isDislike: commentLikes.isDislike,
        count: sql<number>`count(*)`,
      })
      .from(commentLikes)
      .where(
        sql`${commentLikes.commentId} IN (${sql.join(
          commentIds.map((id) => sql`${id}`),
          sql`, `,
        )})`,
      )
      .groupBy(commentLikes.commentId, commentLikes.isDislike);

    for (const row of likeRows) {
      if (!likeCounts[row.commentId]) {
        likeCounts[row.commentId] = { likes: 0, dislikes: 0 };
      }
      if (row.isDislike) {
        likeCounts[row.commentId].dislikes = row.count;
      } else {
        likeCounts[row.commentId].likes = row.count;
      }
    }
  }

  return c.json(
    {
      success: true as const,
      data: rows.map((row) => ({
        id: row.id,
        animeId: row.animeId,
        episodeId: row.episodeId,
        userId: row.userId,
        guestName: row.guestName,
        parentId: row.parentId,
        content: row.content,
        isSpoiler: Boolean(row.isSpoiler),
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
        likes: likeCounts[row.id]?.likes ?? 0,
        dislikes: likeCounts[row.id]?.dislikes ?? 0,
      })),
    },
    200,
  );
});

// POST /v1/comments — Optional auth (guests allowed)
commentsApp.use("/v1/comments", optionalAuth);

commentsApp.openapi(createCommentRoute, async (c) => {
  const db = getDb(c.env.DB);
  const user = c.var.user;
  const body = c.req.valid("json");

  // Guest validation: require name + email if not authenticated
  if (!user && (!body.guestName || !body.guestEmail)) {
    return c.json(
      { success: false as const, error: "Guest comments require guestName and guestEmail" },
      400,
    );
  }

  const newComment = await db
    .insert(comments)
    .values({
      animeId: body.animeId,
      episodeId: body.episodeId,
      userId: user?.id ?? null,
      guestName: user ? null : (body.guestName ?? null),
      guestEmail: user ? null : (body.guestEmail ?? null),
      parentId: body.parentId ?? null,
      content: body.content,
      isSpoiler: body.isSpoiler,
    })
    .returning();

  const created = newComment[0];

  return c.json(
    {
      success: true as const,
      data: {
        id: created.id,
        animeId: created.animeId,
        episodeId: created.episodeId,
        userId: created.userId,
        guestName: created.guestName,
        parentId: created.parentId,
        content: created.content,
        isSpoiler: Boolean(created.isSpoiler),
        createdAt: created.createdAt.toISOString(),
        updatedAt: created.updatedAt.toISOString(),
        likes: 0,
        dislikes: 0,
      },
    },
    201,
  );
});

// POST /v1/comments/:id/like — Requires auth
commentsApp.use("/v1/comments/:id/like", requireAuth);

commentsApp.openapi(likeCommentRoute, async (c) => {
  const db = getDb(c.env.DB);
  const user = c.var.user!;
  const { id: commentId } = c.req.valid("param");
  const { isDislike } = c.req.valid("json");

  await db
    .insert(commentLikes)
    .values({
      commentId,
      userId: user.id,
      isDislike,
    })
    .onConflictDoUpdate({
      target: [commentLikes.commentId, commentLikes.userId],
      set: { isDislike, createdAt: new Date() },
    });

  return c.json(
    {
      success: true as const,
      message: isDislike ? "Disliked" : "Liked",
    },
    200,
  );
});

// POST /v1/comments/:id/report — Optional auth
commentsApp.use("/v1/comments/:id/report", optionalAuth);

commentsApp.openapi(reportCommentRoute, async (c) => {
  const db = getDb(c.env.DB);
  const user = c.var.user;
  const { id: commentId } = c.req.valid("param");
  const { reason } = c.req.valid("json");

  await db.insert(commentReports).values({
    commentId,
    userId: user?.id ?? null,
    reason,
  });

  return c.json(
    {
      success: true as const,
      message: "Report submitted",
    },
    200,
  );
});
