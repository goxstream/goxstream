import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import type { CloudflareEnv } from "@goxstream/cloudflare";
import { requireStaff } from "@goxstream/auth";
import { getDb, episodes, episodeUploads, animes } from "@goxstream/db";
import { eq, and } from "drizzle-orm";

type AuthVariables = {
  user: { id: string; name: string; email: string; image?: string | null; role: string };
  session: { id: string; userId: string; token: string; expiresAt: Date };
};

type UploadEnv = { Bindings: CloudflareEnv; Variables: AuthVariables };

// ── Shared Schemas ─────────────────────────────────────────────────────
const ErrorSchema = z.object({
  success: z.literal(false),
  error: z.string(),
});

const UploadHlsResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    url: z.string(),
    key: z.string(),
    sizeBytes: z.number(),
    totalFiles: z.number(),
  }),
});

const UploadImageResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    url: z.string(),
    key: z.string(),
    sizeBytes: z.number(),
  }),
});

// ── Route Definitions ──────────────────────────────────────────────────

// 1. POST /v1/upload/hls
const uploadHlsRoute = createRoute({
  method: "post",
  path: "/v1/upload/hls",
  tags: ["Upload"],
  summary: "Upload HLS Package to Cloudflare R2",
  description: "Ingests multi-resolution HLS package (master playlist, variants, and .ts segment chunks) directly into Cloudflare R2 object storage.",
  security: [{ Bearer: [] }],
  responses: {
    200: {
      description: "HLS package successfully uploaded",
      content: { "application/json": { schema: UploadHlsResponseSchema } },
    },
    400: { description: "Bad request", content: { "application/json": { schema: ErrorSchema } } },
    401: { description: "Unauthorized", content: { "application/json": { schema: ErrorSchema } } },
    403: { description: "Forbidden", content: { "application/json": { schema: ErrorSchema } } },
    500: { description: "Internal upload failure", content: { "application/json": { schema: ErrorSchema } } },
  },
});

// 2. POST /v1/upload/image
const uploadImageRoute = createRoute({
  method: "post",
  path: "/v1/upload/image",
  tags: ["Upload"],
  summary: "Upload Image to Cloudflare R2",
  description: "Uploads posters, banners, or avatars directly to Cloudflare R2.",
  security: [{ Bearer: [] }],
  responses: {
    200: {
      description: "Image successfully uploaded",
      content: { "application/json": { schema: UploadImageResponseSchema } },
    },
    400: { description: "Bad request", content: { "application/json": { schema: ErrorSchema } } },
    401: { description: "Unauthorized", content: { "application/json": { schema: ErrorSchema } } },
    403: { description: "Forbidden", content: { "application/json": { schema: ErrorSchema } } },
    500: { description: "Internal upload failure", content: { "application/json": { schema: ErrorSchema } } },
  },
});

// ── App Implementation ─────────────────────────────────────────────────
export const uploadApp = new OpenAPIHono<UploadEnv>();

// Apply staff auth middleware across all upload routes
uploadApp.use("/v1/upload/*", requireStaff);

// 1. HLS Package Ingestion Handler
uploadApp.openapi(uploadHlsRoute, async (c) => {
  const user = c.var.user;
  if (!user) {
    return c.json({ success: false, error: "Unauthorized" }, 401);
  }

  try {
    const formData = await c.req.formData();
    const animeSlug = formData.get("animeSlug") as string | null;
    const episodeNumStr = formData.get("episodeNum") as string | null;

    if (!animeSlug || !episodeNumStr) {
      return c.json({ success: false, error: "Missing animeSlug or episodeNum parameter" }, 400);
    }

    const episodeNum = parseInt(episodeNumStr, 10);
    const bucket = c.env.MEDIA_BUCKET;
    if (!bucket) {
      return c.json({ success: false, error: "R2 MEDIA_BUCKET binding is not configured" }, 500);
    }

    const basePrefix = `episodes/${animeSlug}/ep${episodeNumStr}`;
    let totalSizeBytes = 0;
    let fileCount = 0;

    // A. Master manifest (field: "file")
    const masterFile = formData.get("file") as File | null;
    let masterKey = `${basePrefix}/master.m3u8`;
    if (masterFile && typeof masterFile.stream === "function") {
      masterKey = `${basePrefix}/${masterFile.name || "master.m3u8"}`;
      totalSizeBytes += masterFile.size || 0;
      fileCount++;
      await bucket.put(masterKey, masterFile.stream(), {
        httpMetadata: { contentType: "application/vnd.apple.mpegurl" },
      });
    }

    // B. Variant manifests (field: "variants")
    const variants = formData.getAll("variants");
    for (const item of variants) {
      if (item instanceof File && typeof item.stream === "function") {
        const variantKey = `${basePrefix}/${item.name}`;
        totalSizeBytes += item.size || 0;
        fileCount++;
        await bucket.put(variantKey, item.stream(), {
          httpMetadata: { contentType: "application/vnd.apple.mpegurl" },
        });
      }
    }

    // C. Segments chunks (field: "segments")
    const segments = formData.getAll("segments");
    for (const item of segments) {
      if (item instanceof File && typeof item.stream === "function") {
        const segmentKey = `${basePrefix}/${item.name}`;
        totalSizeBytes += item.size || 0;
        fileCount++;
        await bucket.put(segmentKey, item.stream(), {
          httpMetadata: { contentType: "video/mp2t" },
        });
      }
    }

    // D. Link metadata to D1 episode_uploads if episode exists
    const db = getDb(c.env.DB);
    const [matchedEpisode] = await db
      .select({ id: episodes.id })
      .from(episodes)
      .leftJoin(animes, eq(episodes.animeId, animes.id))
      .where(and(eq(animes.slug, animeSlug), eq(episodes.number, episodeNum)))
      .limit(1);

    if (matchedEpisode) {
      await db
        .insert(episodeUploads)
        .values({
          episodeId: matchedEpisode.id,
          userId: user.id,
          storageKey: masterKey,
          format: "hls",
          sizeBytes: totalSizeBytes,
          mimeType: "application/vnd.apple.mpegurl",
          status: "ready",
          uploadedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: episodeUploads.episodeId,
          set: {
            userId: user.id,
            storageKey: masterKey,
            sizeBytes: totalSizeBytes,
            status: "ready",
            uploadedAt: new Date(),
          },
        });
    }

    const publicUrl = `https://cdn.goxstream.tv/${masterKey}`;

    return c.json(
      {
        success: true,
        data: {
          url: publicUrl,
          key: masterKey,
          sizeBytes: totalSizeBytes,
          totalFiles: fileCount,
        },
      },
      200,
    );
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Unknown upload error";
    return c.json({ success: false, error: `Upload failed: ${errorMsg}` }, 500);
  }
});

// 2. Image Ingestion Handler
uploadApp.openapi(uploadImageRoute, async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get("file") as File | null;
    const category = (formData.get("category") as string) || "poster";

    if (!file || typeof file.stream !== "function") {
      return c.json({ success: false, error: "Missing or invalid file field in formData" }, 400);
    }

    const bucket = c.env.MEDIA_BUCKET;
    if (!bucket) {
      return c.json({ success: false, error: "R2 MEDIA_BUCKET binding is not configured" }, 500);
    }

    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const key = `images/${category}/${crypto.randomUUID()}-${sanitizedName}`;

    await bucket.put(key, file.stream(), {
      httpMetadata: { contentType: file.type || "image/jpeg" },
    });

    const publicUrl = `https://cdn.goxstream.tv/${key}`;

    return c.json(
      {
        success: true,
        data: {
          url: publicUrl,
          key,
          sizeBytes: file.size,
        },
      },
      200,
    );
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Unknown image upload error";
    return c.json({ success: false, error: `Image upload failed: ${errorMsg}` }, 500);
  }
});
