import { writeFileSync, mkdirSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";

export interface CreateSuperAdminInput {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  displayName: string;
  isRemote?: boolean;
}

function sqlEscape(val: string | null | undefined): string {
  if (val === null || val === undefined) return "NULL";
  return `'${val.replace(/'/g, "''")}'`;
}

export async function runCreateSuperAdminD1(input: CreateSuperAdminInput) {
  const targetEnv = input.isRemote ? "REMOTE" : "LOCAL";
  console.log("=========================================================");
  console.log(`[CREATE ADMIN D1] Creating Super Admin user (${targetEnv} D1 Target)`);
  console.log(`[CREATE ADMIN D1] Username: ${input.username}`);
  console.log(`[CREATE ADMIN D1] Email:    ${input.email}`);
  console.log("=========================================================");

  const now = Date.now();

  const sqlStatements = [
    `-- Auto-generated Super Admin Creation Script for GoxStream D1`,
    `INSERT INTO "users" (`,
    `  "id", "username", "email", "password_hash", "display_name",`,
    `  "role", "status", "membership_tier", "created_at", "updated_at", "last_active_at"`,
    `) VALUES (`,
    `  ${sqlEscape(input.id)}, ${sqlEscape(input.username)}, ${sqlEscape(input.email)}, ${sqlEscape(input.passwordHash)}, ${sqlEscape(input.displayName)},`,
    `  'super_admin', 'active', 'vip_pro', ${now}, ${now}, ${now}`,
    `);`,
    ``,
    `INSERT INTO "user_settings" (`,
    `  "user_id", "default_quality", "default_subtitle", "auto_play_next", "auto_skip_intro",`,
    `  "preferred_audio", "new_episode_alerts", "watchlist_updates", "marketing_emails", "public_watchlist"`,
    `) VALUES (`,
    `  ${sqlEscape(input.id)}, '1080p', 'indonesia', 1, 0, 'japanese', 1, 1, 0, 1`,
    `);`,
  ].join("\n");

  const tempDirPath = join(process.cwd(), "drizzle", "d1");
  mkdirSync(tempDirPath, { recursive: true });

  const tempFilePath = join(tempDirPath, `temp-create-admin-${Date.now()}.sql`);
  writeFileSync(tempFilePath, sqlStatements, "utf-8");

  const flag = input.isRemote ? "--remote" : "--local";
  const wranglerCmd = `npx wrangler d1 execute goxstream ${flag} --file=${tempFilePath}`;

  try {
    console.log(`[CREATE ADMIN D1] Executing Wrangler command: ${wranglerCmd}`);
    execSync(wranglerCmd, { stdio: "inherit" });
    console.log("=========================================================");
    console.log(`[CREATE ADMIN D1] Super Admin successfully created in ${targetEnv} D1!`);
    console.log("=========================================================");
  } catch (error) {
    console.error("[CREATE ADMIN D1] Failed to create Super Admin user:", error);
    throw error;
  } finally {
    try {
      unlinkSync(tempFilePath);
    } catch {}
  }
}
