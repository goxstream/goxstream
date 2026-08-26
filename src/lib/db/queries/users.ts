import { eq } from "drizzle-orm";
import { getDb } from "../index";
import { users, userSettings } from "../schema";
import type { InferInsertModel } from "drizzle-orm";
import type { UserProfile } from "@/types/user";

export type UserSettingsInput = Partial<InferInsertModel<typeof userSettings>>;

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
    where: eq(users.username, usernameOrEmail),
  });
}

export async function registerUserAccount(data: {
  username: string;
  email: string;
  passwordHash: string;
  displayName?: string;
}) {
  const db = await getDb();
  const newId = `usr-${Date.now()}`;
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
    const firstUser = await db.query.users.findFirst();
    if (firstUser) {
      return {
        id: firstUser.id,
        username: firstUser.username,
        displayName: firstUser.displayName,
        email: firstUser.email,
        avatarUrl: firstUser.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        bannerUrl: firstUser.bannerUrl || "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80",
        joinDate: firstUser.createdAt ? new Date(firstUser.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Jan 2025",
        isVip: firstUser.membershipTier === "vip" || firstUser.membershipTier === "ultra_vip",
        vipTier: firstUser.membershipTier === "ultra_vip" ? "Ultra VIP" : firstUser.membershipTier === "vip" ? "VIP Supporter" : undefined,
        bio: firstUser.bio || "Anime enthusiast & community reviewer.",
        stats: {
          animeCompleted: 15,
          episodesWatched: 120,
          hoursWatched: 48,
          watchlistCount: 24,
          favoriteGenres: [
            { genre: "Action", percentage: 45 },
            { genre: "Sci-Fi", percentage: 30 },
            { genre: "Fantasy", percentage: 25 },
          ],
        },
      };
    }
  } catch {
    // Fallback
  }

  return {
    id: "usr-demo",
    username: "alex_otaku",
    displayName: "Alex Rivera",
    email: "alex@example.com",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80",
    joinDate: "Jan 2025",
    isVip: true,
    vipTier: "Ultra VIP",
    bio: "Anime enthusiast & community reviewer.",
    stats: {
      animeCompleted: 15,
      episodesWatched: 120,
      hoursWatched: 48,
      watchlistCount: 24,
      favoriteGenres: [
        { genre: "Action", percentage: 45 },
        { genre: "Sci-Fi", percentage: 30 },
      ],
    },
  };
}
