import { createMiddleware } from "hono/factory";
import type { CloudflareEnv } from "@goxstream/cloudflare";
import { getAuth } from "../server";

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

/**
 * Middleware: requires a valid Better Auth session.
 * Sets `c.var.user` and `c.var.session` on success.
 */
export const requireAuth = createMiddleware<{
  Bindings: CloudflareEnv;
  Variables: { user: AuthUser; session: AuthSession };
}>(async (c, next) => {
  const auth = getAuth(c.env);
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    return c.json({ success: false, error: "Unauthorized" }, 401);
  }

  c.set("user", session.user as AuthUser);
  c.set("session", session.session as AuthSession);
  await next();
});

/**
 * Middleware: optionally resolves a session (no 401 if absent).
 * Sets `c.var.user` and `c.var.session` if a valid session exists.
 */
export const optionalAuth = createMiddleware<{
  Bindings: CloudflareEnv;
  Variables: { user: AuthUser | null; session: AuthSession | null };
}>(async (c, next) => {
  const auth = getAuth(c.env);
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  c.set("user", session ? (session.user as AuthUser) : null);
  c.set("session", session ? (session.session as AuthSession) : null);
  await next();
});
