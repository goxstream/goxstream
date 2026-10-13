import { cookies } from "next/headers";
import type { Role, MembershipTier } from "./permissions";
import { getSessionByToken, getUserById } from "@/lib/db/queries/users";

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

  try {
    const sessionRecord = await getSessionByToken(token);
    if (sessionRecord?.user) {
      const u = sessionRecord.user;
      return {
        id: u.id,
        username: u.username,
        email: u.email,
        displayName: u.displayName,
        avatarUrl: u.avatarUrl,
        role: (u.role as Role) || "user",
        status: (u.status as "active" | "suspended" | "pending") || "active",
        membershipTier: (u.membershipTier as MembershipTier) || "free",
      };
    }

    // Fallback lookup if token is raw user ID (e.g. dev legacy)
    const dbUser = await getUserById(token);
    if (!dbUser) return null;

    return {
      id: dbUser.id,
      username: dbUser.username,
      email: dbUser.email,
      displayName: dbUser.displayName,
      avatarUrl: dbUser.avatarUrl,
      role: (dbUser.role as Role) || "user",
      status: (dbUser.status as "active" | "suspended" | "pending") || "active",
      membershipTier: (dbUser.membershipTier as MembershipTier) || "free",
    };
  } catch {
    return null;
  }
}
