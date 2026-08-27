import { eq, or } from "drizzle-orm";
import { getDb } from "../index";
import { users, userSettings, sessions, watchlists, watchHistories } from "../schema";
import type { InferInsertModel } from "drizzle-orm";
import type { UserProfile } from "@/types/user";
import { getCurrentUser } from "@/lib/auth/session";

export type UserSettingsInput = Partial<InferInsertModel<typeof userSettings>>;


export async function createSession(userId: string, userAgent?: string, ipAddress?: string) {
  const db = await getDb();
  const token = `sess_${crypto.randomUUID()}`;
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await db.insert(sessions).values({
    token,
    userId,
    expiresAt,
    userAgent,
    ipAddress,
  });

  return token;
}

export async function getSessionByToken(token: string) {
  const db = await getDb();
  const sessionRecord = await db.query.sessions.findFirst({
    where: eq(sessions.token, token),
    with: {
      user: true,
    },
  });

  if (!sessionRecord || !sessionRecord.user) return null;

  if (new Date(sessionRecord.expiresAt) <= new Date()) {
    await db.delete(sessions).where(eq(sessions.token, token));
    return null;
  }

  return sessionRecord;
}

export async function deleteSession(token: string) {
  const db = await getDb();
  await db.delete(sessions).where(eq(sessions.token, token));
}

export async function deleteUserSessions(userId: string) {
  const db = await getDb();
  await db.delete(sessions).where(eq(sessions.userId, userId));
}

export async function getUserById(id: string) {
  const db = await getDb();
  return db.query.users.findFirst({
    where: eq(users.id, id),
    with: {
      settings: true,
    },
  });
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  return db.query.users.findFirst({
    where: eq(users.email, email),
    with: {
      settings: true,
    },
  });
}

export async function getUserByUsername(username: string) {
  const db = await getDb();
  return db.query.users.findFirst({
    where: eq(users.username, username),
    with: {
      settings: true,
    },
  });
}

export async function updateUserSettings(userId: string, data: UserSettingsInput) {
  const db = await getDb();
  return db
    .insert(userSettings)
    .values({ userId, ...data })
    .onConflictDoUpdate({
      target: userSettings.userId,
      set: data,
    })
    .returning();
}

export async function loginUserAccount(usernameOrEmail: string) {
  const db = await getDb();
  return db.query.users.findFirst({
    where: or(
      eq(users.username, usernameOrEmail),
      eq(users.email, usernameOrEmail)
    ),
  });
}

export async function registerUserAccount(data: {
  username: string;
  email: string;
  passwordHash: string;
  displayName?: string;
}) {
  const db = await getDb();
  const newId = crypto.randomUUID();
  await db.insert(users).values({
    id: newId,
    username: data.username,
    email: data.email,
    passwordHash: data.passwordHash,
    displayName: data.displayName || data.username,
    role: "user",
    status: "active",
    membershipTier: "free",
  });
  return newId;
}

export async function getActiveUserSession() {
  const db = await getDb();
  try {
    const activeUser = await db.query.users.findFirst();
    if (activeUser) {
      return {
        id: activeUser.id,
        username: activeUser.username,
        displayName: activeUser.displayName,
        email: activeUser.email,
        avatarUrl: activeUser.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        bannerUrl: activeUser.bannerUrl || "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80",
        role: activeUser.role || "admin",
        isVip: activeUser.membershipTier === "vip" || activeUser.membershipTier === "ultra_vip",
      };
    }
  } catch {
    // Fallback
  }

  return {
    id: "usr-admin",
    username: "alex_admin",
    displayName: "Alex Rivera",
    email: "alex@goxstream.com",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80",
    role: "admin",
    isVip: true,
  };
}

export async function getCurrentUserProfile(): Promise<UserProfile> {
  const db = await getDb();
  try {
    const sessionUser = await getCurrentUser();
    const userId = sessionUser?.id;

    if (userId) {
      const dbUser = await db.query.users.findFirst({
        where: eq(users.id, userId),
        with: {
          settings: true,
        },
      });

      if (dbUser) {
        const userWatchlist = await db.query.watchlists.findMany({
          where: eq(watchlists.userId, userId),
        }).catch(() => []);

        const userHistory = await db.query.watchHistories.findMany({
          where: eq(watchHistories.userId, userId),
        }).catch(() => []);

        const animeCompleted = userWatchlist.filter((w: any) => w.status === "completed").length;
        const episodesWatched = userHistory.length;
        const totalSecondsWatched = userHistory.reduce((acc: number, h: any) => acc + (h.progressSeconds || 0), 0);
        const hoursWatched = Math.round(totalSecondsWatched / 3600);


        return {
          id: dbUser.id,
          username: dbUser.username,
          displayName: dbUser.displayName,
          email: dbUser.email,
          avatarUrl: dbUser.avatarUrl || undefined,
          bannerUrl: dbUser.bannerUrl || undefined,
          joinDate: dbUser.createdAt
            ? new Date(dbUser.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
            : "Jan 2025",
          isVip: dbUser.membershipTier === "vip_pro" || dbUser.membershipTier === "vip",
          vipTier: dbUser.membershipTier === "vip_pro" ? "VIP Pro" : dbUser.membershipTier === "vip" ? "VIP Supporter" : undefined,
          bio: dbUser.bio || "Anime enthusiast & community reviewer.",
          stats: {
            animeCompleted,
            episodesWatched,
            hoursWatched,
            watchlistCount: userWatchlist.length,
            favoriteGenres: [
              { genre: "Action", percentage: 40 },
              { genre: "Fantasy", percentage: 35 },
              { genre: "Sci-Fi", percentage: 25 },
            ],
          },
        };
      }
    }
  } catch {
    // Fallback if db empty or unauthenticated
  }

  return {
    id: "guest",
    username: "guest_user",
    displayName: "Guest User",
    email: "guest@goxstream.com",
    avatarUrl: undefined,
    bannerUrl: undefined,
    joinDate: "Jan 2026",
    isVip: false,
    bio: "Welcome to GoxStream!",
    stats: {
      animeCompleted: 0,
      episodesWatched: 0,
      hoursWatched: 0,
      watchlistCount: 0,
      favoriteGenres: [],
    },
  };
}

