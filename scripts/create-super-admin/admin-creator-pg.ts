import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { users, userSettings } from "@/lib/db/schema/pg";
import type { CreateSuperAdminInput } from "./admin-creator-d1";

export async function runCreateSuperAdminPG(input: CreateSuperAdminInput) {
  const dbUrl = process.env.DB_URL || process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error("[CREATE ADMIN PG] Missing DB_URL or DATABASE_URL environment variable.");
  }

  console.log("=========================================================");
  console.log(`[CREATE ADMIN PG] Creating Super Admin user (PostgreSQL Target)`);
  console.log(`[CREATE ADMIN PG] Username: ${input.username}`);
  console.log(`[CREATE ADMIN PG] Email:    ${input.email}`);
  console.log("=========================================================");

  const client = postgres(dbUrl);
  const db = drizzle(client);

  try {
    const now = new Date();

    await db.insert(users).values({
      id: input.id,
      username: input.username,
      email: input.email,
      passwordHash: input.passwordHash,
      displayName: input.displayName,
      role: "super_admin",
      status: "active",
      membershipTier: "vip_pro",
      createdAt: now,
      updatedAt: now,
      lastActiveAt: now,
    });

    await db.insert(userSettings).values({
      userId: input.id,
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

    console.log("=========================================================");
    console.log("[CREATE ADMIN PG] Super Admin successfully created in PostgreSQL!");
    console.log("=========================================================");
  } catch (error) {
    console.error("[CREATE ADMIN PG] Error creating Super Admin user:", error);
    throw error;
  } finally {
    await client.end();
  }
}
