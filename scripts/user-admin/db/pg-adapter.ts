import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq, or, ilike, inArray } from "drizzle-orm";
import { users, userSettings } from "@/lib/db/schema/pg/users";
import { hashPassword } from "@/lib/auth/password";
import type { UserItem, CreateUserInput, UpdateUserInput } from "../types";

function getPgDb() {
  const dbUrl = process.env.DB_URL || process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error("Missing DB_URL or DATABASE_URL environment variable.");
  }
  const client = postgres(dbUrl, { max: 1 });
  const db = drizzle(client);
  return { client, db };
}

export async function listPgUsers(searchFilter?: string): Promise<UserItem[]> {
  const { client, db } = getPgDb();
  try {
    let records;
    if (searchFilter && searchFilter.trim()) {
      const q = `%${searchFilter.trim()}%`;
      records = await db
        .select()
        .from(users)
        .where(
          or(
            ilike(users.username, q),
            ilike(users.email, q),
            ilike(users.displayName, q),
            ilike(users.role, q)
          )
        );
    } else {
      records = await db.select().from(users);
    }
    return records.map((u) => ({
      id: u.id,
      username: u.username,
      email: u.email,
      displayName: u.displayName ?? u.username,
      role: u.role,
      status: u.status,
      membershipTier: u.membershipTier ?? "free",
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
      lastActiveAt: u.lastActiveAt,
    }));
  } finally {
    await client.end();
  }
}

export async function createPgUser(input: CreateUserInput): Promise<UserItem> {
  const { client, db } = getPgDb();
  const userId =
    input.id || `usr_${input.role || "user"}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
  const passwordHash = await hashPassword(input.password);
  const displayName = input.displayName || input.username;
  const role = input.role || "user";
  const status = input.status || "active";
  const membershipTier = input.membershipTier || (role === "super_admin" ? "vip_pro" : "free");
  const now = new Date();

  try {
    await db.insert(users).values({
      id: userId,
      username: input.username,
      email: input.email,
      passwordHash,
      displayName,
      role,
      status,
      membershipTier,
      createdAt: now,
      updatedAt: now,
      lastActiveAt: now,
    });

    await db.insert(userSettings).values({
      userId,
      defaultQuality: "1080p",
      defaultSubtitle: "indonesia",
      autoPlayNext: true,
      autoSkipIntro: false,
      preferredAudio: "japanese",
      newEpisodeAlerts: true,
      watchlistUpdates: true,
      marketingEmails: false,
      publicWatchlist: true,
    });

    return {
      id: userId,
      username: input.username,
      email: input.email,
      displayName,
      role,
      status,
      membershipTier,
      createdAt: now,
      updatedAt: now,
      lastActiveAt: now,
    };
  } finally {
    await client.end();
  }
}

export async function updatePgUser(existingUser: UserItem, input: UpdateUserInput): Promise<UserItem> {
  const { client, db } = getPgDb();
  const now = new Date();
  let passwordHash: string | undefined = undefined;

  if (input.password && input.password.trim()) {
    passwordHash = await hashPassword(input.password);
  }

  try {
    const updateData: Record<string, any> = { updatedAt: now };
    if (input.username) updateData.username = input.username;
    if (input.email) updateData.email = input.email;
    if (input.displayName) updateData.displayName = input.displayName;
    if (input.role) updateData.role = input.role;
    if (input.status) updateData.status = input.status;
    if (input.membershipTier) updateData.membershipTier = input.membershipTier;
    if (passwordHash) updateData.passwordHash = passwordHash;

    await db.update(users).set(updateData).where(eq(users.id, existingUser.id));
    const updatedList = await listPgUsers();
    return updatedList.find((u) => u.id === existingUser.id)!;
  } finally {
    await client.end();
  }
}

export async function deletePgUsersBatch(targetIds: string[]): Promise<number> {
  if (targetIds.length === 0) return 0;
  const { client, db } = getPgDb();
  try {
    try {
      await db.delete(userSettings).where(inArray(userSettings.userId, targetIds));
    } catch {}
    await db.delete(users).where(inArray(users.id, targetIds));
    return targetIds.length;
  } finally {
    await client.end();
  }
}
