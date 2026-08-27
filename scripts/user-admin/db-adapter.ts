import { execSync } from "node:child_process";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq, or, ilike } from "drizzle-orm";
import { users, userSettings } from "@/lib/db/schema/pg/users";
import { hashPassword } from "@/lib/auth/password";
import type { DbTarget, UserItem, CreateUserInput, UpdateUserInput } from "./types";

function getPgDb() {
  const dbUrl = process.env.DB_URL || process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error("Missing DB_URL or DATABASE_URL environment variable.");
  }
  const client = postgres(dbUrl, { max: 1 });
  const db = drizzle(client);
  return { client, db };
}

function runD1Query(flag: "--local" | "--remote", sqlCommand: string): any[] {
  try {
    const output = execSync(
      `npx wrangler d1 execute goxstream ${flag} --json --command=${JSON.stringify(sqlCommand)}`,
      {
        stdio: ["ignore", "pipe", "pipe"],
        env: { ...process.env, CI: "true", WRANGLER_SEND_METRICS: "false" },
      }
    ).toString();
    const parsed = JSON.parse(output);
    if (Array.isArray(parsed) && parsed[0]?.results) {
      return parsed[0].results;
    }
    return [];
  } catch (err: any) {
    throw new Error(`D1 Query Error: ${err.message || String(err)}`);
  }
}

function sqlEscape(val: string | number | null | undefined): string {
  if (val === null || val === undefined) return "NULL";
  if (typeof val === "number") return String(val);
  return `'${String(val).replace(/'/g, "''")}'`;
}

export async function listUsers(target: DbTarget, searchFilter?: string): Promise<UserItem[]> {
  if (target === "postgres") {
    const { client, db } = getPgDb();
    try {
      let query = db.select().from(users);
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
        records = await query;
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
  } else {
    const flag = target === "d1-remote" ? "--remote" : "--local";
    let whereClause = "";
    if (searchFilter && searchFilter.trim()) {
      const escaped = searchFilter.trim().replace(/'/g, "''");
      whereClause = ` WHERE username LIKE '%${escaped}%' OR email LIKE '%${escaped}%' OR display_name LIKE '%${escaped}%' OR role LIKE '%${escaped}%'`;
    }
    const results = runD1Query(flag, `SELECT * FROM users${whereClause} ORDER BY created_at DESC`);
    return results.map((u: any) => ({
      id: u.id,
      username: u.username,
      email: u.email,
      displayName: u.display_name || u.username,
      role: u.role || "user",
      status: u.status || "active",
      membershipTier: u.membership_tier || "free",
      createdAt: u.created_at,
      updatedAt: u.updated_at,
      lastActiveAt: u.last_active_at,
    }));
  }
}

export async function getUserById(target: DbTarget, idOrUsername: string): Promise<UserItem | null> {
  const usersList = await listUsers(target);
  return (
    usersList.find((u) => u.id === idOrUsername || u.username.toLowerCase() === idOrUsername.toLowerCase()) ||
    null
  );
}

export async function createUser(target: DbTarget, input: CreateUserInput): Promise<UserItem> {
  const userId =
    input.id || `usr_${input.role || "user"}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
  const passwordHash = await hashPassword(input.password);
  const displayName = input.displayName || input.username;
  const role = input.role || "user";
  const status = input.status || "active";
  const membershipTier = input.membershipTier || (role === "super_admin" ? "vip_pro" : "free");
  const now = new Date();
  const nowMs = now.getTime();

  if (target === "postgres") {
    const { client, db } = getPgDb();
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
  } else {
    const flag = target === "d1-remote" ? "--remote" : "--local";

    runD1Query(
      flag,
      `INSERT INTO users (id, username, email, password_hash, display_name, role, status, membership_tier, created_at, updated_at, last_active_at) VALUES (${sqlEscape(
        userId
      )}, ${sqlEscape(input.username)}, ${sqlEscape(input.email)}, ${sqlEscape(passwordHash)}, ${sqlEscape(
        displayName
      )}, ${sqlEscape(role)}, ${sqlEscape(status)}, ${sqlEscape(membershipTier)}, ${nowMs}, ${nowMs}, ${nowMs})`
    );

    try {
      runD1Query(
        flag,
        `INSERT INTO user_settings (user_id, default_quality, default_subtitle, auto_play_next, auto_skip_intro, preferred_audio, new_episode_alerts, watchlist_updates, marketing_emails, public_watchlist) VALUES (${sqlEscape(
          userId
        )}, '1080p', 'indonesia', 1, 0, 'japanese', 1, 1, 0, 1)`
      );
    } catch {}

    return {
      id: userId,
      username: input.username,
      email: input.email,
      displayName,
      role,
      status,
      membershipTier,
      createdAt: nowMs,
      updatedAt: nowMs,
      lastActiveAt: nowMs,
    };
  }
}

export async function updateUser(
  target: DbTarget,
  id: string,
  input: UpdateUserInput
): Promise<UserItem> {
  const existing = await getUserById(target, id);
  if (!existing) {
    throw new Error(`User with ID or username '${id}' not found.`);
  }

  const now = new Date();
  const nowMs = now.getTime();

  let passwordHash: string | undefined = undefined;
  if (input.password && input.password.trim()) {
    passwordHash = await hashPassword(input.password);
  }

  if (target === "postgres") {
    const { client, db } = getPgDb();
    try {
      const updateData: Record<string, any> = {
        updatedAt: now,
      };
      if (input.username) updateData.username = input.username;
      if (input.email) updateData.email = input.email;
      if (input.displayName) updateData.displayName = input.displayName;
      if (input.role) updateData.role = input.role;
      if (input.status) updateData.status = input.status;
      if (input.membershipTier) updateData.membershipTier = input.membershipTier;
      if (passwordHash) updateData.passwordHash = passwordHash;

      await db.update(users).set(updateData).where(eq(users.id, existing.id));

      const updated = await getUserById(target, existing.id);
      return updated!;
    } finally {
      await client.end();
    }
  } else {
    const flag = target === "d1-remote" ? "--remote" : "--local";
    const sets: string[] = [`updated_at = ${nowMs}`];

    if (input.username) sets.push(`username = ${sqlEscape(input.username)}`);
    if (input.email) sets.push(`email = ${sqlEscape(input.email)}`);
    if (input.displayName) sets.push(`display_name = ${sqlEscape(input.displayName)}`);
    if (input.role) sets.push(`role = ${sqlEscape(input.role)}`);
    if (input.status) sets.push(`status = ${sqlEscape(input.status)}`);
    if (input.membershipTier) sets.push(`membership_tier = ${sqlEscape(input.membershipTier)}`);
    if (passwordHash) sets.push(`password_hash = ${sqlEscape(passwordHash)}`);

    runD1Query(flag, `UPDATE users SET ${sets.join(", ")} WHERE id = ${sqlEscape(existing.id)}`);
    const updated = await getUserById(target, existing.id);
    return updated!;
  }
}

export async function deleteUser(target: DbTarget, id: string): Promise<boolean> {
  const existing = await getUserById(target, id);
  if (!existing) {
    throw new Error(`User with ID or username '${id}' not found.`);
  }

  if (target === "postgres") {
    const { client, db } = getPgDb();
    try {
      try {
        await db.delete(userSettings).where(eq(userSettings.userId, existing.id));
      } catch {}
      await db.delete(users).where(eq(users.id, existing.id));
      return true;
    } finally {
      await client.end();
    }
  } else {
    const flag = target === "d1-remote" ? "--remote" : "--local";
    try {
      runD1Query(flag, `DELETE FROM user_settings WHERE user_id = ${sqlEscape(existing.id)}`);
    } catch {}
    runD1Query(flag, `DELETE FROM users WHERE id = ${sqlEscape(existing.id)}`);
    return true;
  }
}
