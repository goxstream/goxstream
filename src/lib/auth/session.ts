import { cookies } from "next/headers";
import type { Role, MembershipTier } from "./permissions";

export const SESSION_COOKIE_NAME = "goxstream_session";

export interface SessionUser {
  id: string;
  username: string;
  email: string;
  displayName: string;
  avatarUrl?: string | null;
  role: Role;
  status: "active" | "suspended" | "pending";
  membershipTier: MembershipTier;
}

export interface SessionState {
  user: SessionUser | null;
  expiresAt?: Date | null;
}

/**
 * Reads the session cookie from Next.js server headers.
 */
export async function getSessionCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value;
}

/**
 * Gets the active user session in Server Components, Route Handlers, and Server Actions.
 * Returns null if unauthenticated or session expired.
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const token = await getSessionCookie();
  if (!token) return null;

  // Placeholder for session lookup via database / better-auth
  // When session store is fully wired with DB: fetch from sessions table by token
  return null;
}
