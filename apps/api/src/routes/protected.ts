import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import type { CloudflareEnv } from "@goxstream/cloudflare";
import { requireAuth } from "@goxstream/auth";

const protectedSampleRoute = createRoute({
  method: "get",
  path: "/sample",
  tags: ["Sample"],
  summary: "Protected Sample Endpoint",
  description: "Example endpoint that requires a valid Better Auth session or Bearer token.",
  security: [{ Bearer: [] }],
  responses: {
    200: {
      description: "User is authenticated",
      content: {
        "application/json": {
          schema: z.object({
            success: z.literal(true),
            message: z.string(),
            user: z.object({
              id: z.string(),
              name: z.string(),
              email: z.string(),
              role: z.string(),
            }),
          }),
        },
      },
    },
    401: {
      description: "Unauthorized",
      content: {
        "application/json": {
          schema: z.object({
            success: z.literal(false),
            error: z.string(),
          }),
        },
      },
    },
  },
});

export const protectedApp = new OpenAPIHono<{
  Bindings: CloudflareEnv;
  Variables: {
    user: { id: string; name: string; email: string; role: string };
    session: { id: string; userId: string; token: string; expiresAt: Date };
  };
}>();

// Apply Better Auth session validation middleware
protectedApp.use("/sample", requireAuth);

protectedApp.openapi(protectedSampleRoute, (c) => {
  const user = c.var.user;
  return c.json(
    {
      success: true as const,
      message: "Authentication successful! Protected resource accessed.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
    200,
  );
});
