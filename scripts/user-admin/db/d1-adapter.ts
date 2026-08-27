import { execSync } from "node:child_process";
import { hashPassword } from "@/lib/auth/password";
import { sqlEscape } from "../lib/sql-helpers";
import type { DbTarget, UserItem, CreateUserInput, UpdateUserInput } from "../types";

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

export async function listD1Users(target: DbTarget, searchFilter?: string): Promise<UserItem[]> {
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

export async function createD1User(target: DbTarget, input: CreateUserInput): Promise<UserItem> {
  const flag = target === "d1-remote" ? "--remote" : "--local";
  const userId = input.id || crypto.randomUUID();
  const passwordHash = await hashPassword(input.password);
  const displayName = input.displayName || input.username;
  const role = input.role || "user";
  const status = input.status || "active";
  const membershipTier = input.membershipTier || (role === "super_admin" ? "vip_pro" : "free");
  const nowMs = Date.now();

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

export async function updateD1User(
  target: DbTarget,
  existingUser: UserItem,
  input: UpdateUserInput
): Promise<UserItem> {
  const flag = target === "d1-remote" ? "--remote" : "--local";
  const nowMs = Date.now();
  const sets: string[] = [`updated_at = ${nowMs}`];

  if (input.username) sets.push(`username = ${sqlEscape(input.username)}`);
  if (input.email) sets.push(`email = ${sqlEscape(input.email)}`);
  if (input.displayName) sets.push(`display_name = ${sqlEscape(input.displayName)}`);
  if (input.role) sets.push(`role = ${sqlEscape(input.role)}`);
  if (input.status) sets.push(`status = ${sqlEscape(input.status)}`);
  if (input.membershipTier) sets.push(`membership_tier = ${sqlEscape(input.membershipTier)}`);
  if (input.password && input.password.trim()) {
    const passwordHash = await hashPassword(input.password);
    sets.push(`password_hash = ${sqlEscape(passwordHash)}`);
  }

  runD1Query(flag, `UPDATE users SET ${sets.join(", ")} WHERE id = ${sqlEscape(existingUser.id)}`);
  const updatedList = await listD1Users(target);
  return updatedList.find((u) => u.id === existingUser.id)!;
}

export async function deleteD1UsersBatch(target: DbTarget, targetIds: string[]): Promise<number> {
  if (targetIds.length === 0) return 0;
  const flag = target === "d1-remote" ? "--remote" : "--local";
  const inClause = targetIds.map((id) => sqlEscape(id)).join(", ");

  try {
    runD1Query(flag, `DELETE FROM user_settings WHERE user_id IN (${inClause})`);
  } catch {}
  runD1Query(flag, `DELETE FROM users WHERE id IN (${inClause})`);
  return targetIds.length;
}
