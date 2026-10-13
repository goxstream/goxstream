import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import type { CloudflareEnv } from "@goxstream/cloudflare";
import { getDb } from "@goxstream/db";
import { sql } from "drizzle-orm";

const healthRoute = createRoute({
  method: "get",
  path: "/health",
  tags: ["System"],
  summary: "Health Check",
  description: "Check if the API and Cloudflare D1 database connection are healthy.",
  responses: {
    200: {
      description: "Service is operational",
      content: {
        "application/json": {
          schema: z.object({
            status: z.enum(["ok", "degraded"]),
            timestamp: z.string(),
            database: z.string(),
          }),
        },
      },
    },
    500: {
      description: "Service is degraded",
      content: {
        "application/json": {
          schema: z.object({
            status: z.enum(["ok", "degraded"]),
            timestamp: z.string(),
            database: z.string(),
            error: z.string().optional(),
          }),
        },
      },
    },
  },
});

export const healthApp = new OpenAPIHono<{ Bindings: CloudflareEnv }>();

healthApp.openapi(healthRoute, async (c) => {
  try {
    const db = getDb(c.env.DB);
    await db.run(sql`SELECT 1`);

    return c.json(
      {
        status: "ok" as const,
        timestamp: new Date().toISOString(),
        database: "connected",
      },
      200
    );
  } catch (err: any) {
    return c.json(
      {
        status: "degraded" as const,
        timestamp: new Date().toISOString(),
        database: "disconnected",
        error: err?.message || "Database connection check failed",
      },
      500
    );
  }
});
