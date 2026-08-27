import Table from "cli-table3";
import { scanAvailableDatabases } from "../db-scanner";
import { listUsers, createUser, updateUser, deleteUsersBatch } from "../db";
import type { DbTarget } from "../types";

export async function resolveTargetDb(requestedDb?: string): Promise<DbTarget> {
  let target: DbTarget | undefined = (requestedDb as DbTarget) || undefined;
  const scanned = await scanAvailableDatabases();
  const available = scanned.filter((t) => t.isAvailable);

  if (!target) {
    if (available.length > 0) {
      target = available[0].id;
      console.log(`[CLI USER ADMIN] Auto-selected detected database target: ${target}`);
    } else {
      console.error("Error: No available database connections detected.");
      process.exit(1);
    }
  }
  return target;
}

export async function handleListCommand(target: DbTarget): Promise<void> {
  const users = await listUsers(target);
  console.log(`\n=========================================================`);
  console.log(`[CLI USER ADMIN] User List — ${target.toUpperCase()} (${users.length} users)`);
  console.log(`=========================================================`);

  const table = new Table({
    head: ["ID", "Username", "Email", "Role", "Status", "Tier"],
  });
  users.forEach((u) => {
    table.push([u.id, u.username, u.email, u.role, u.status, u.membershipTier || "free"]);
  });
  console.log(table.toString());
  process.exit(0);
}

export async function handleCreateCommand(target: DbTarget, flags: Record<string, any>): Promise<void> {
  if (!flags.username || !flags.email || !flags.password) {
    console.error("Error: Missing required flags for create (--username, --email, --password).");
    process.exit(1);
  }
  const created = await createUser(target, {
    username: flags.username as string,
    email: flags.email as string,
    password: flags.password as string,
    displayName: (flags.displayName as string) || (flags.username as string),
    role: (flags.role as any) || "user",
    status: (flags.status as any) || "active",
  });

  console.log(`\n=========================================================`);
  console.log(`SUCCESS: Created user in ${target.toUpperCase()}:`);
  console.log(`- User ID:      ${created.id}`);
  console.log(`- Username:     ${created.username}`);
  console.log(`- Email:        ${created.email}`);
  console.log(`- Role:         ${created.role}`);
  console.log(`- Status:       ${created.status}`);
  console.log(`=========================================================`);
  process.exit(0);
}

export async function handleEditCommand(target: DbTarget, flags: Record<string, any>): Promise<void> {
  if (!flags.username) {
    console.error("Error: Missing required flag for edit (--username).");
    process.exit(1);
  }
  const updated = await updateUser(target, flags.username as string, {
    email: flags.email as string,
    password: flags.password as string,
    displayName: flags.displayName as string,
    role: flags.role as any,
    status: flags.status as any,
  });

  console.log(`\n=========================================================`);
  console.log(`SUCCESS: Updated user in ${target.toUpperCase()}:`);
  console.log(`- User ID:      ${updated.id}`);
  console.log(`- Username:     ${updated.username}`);
  console.log(`- Email:        ${updated.email}`);
  console.log(`- Role:         ${updated.role}`);
  console.log(`- Status:       ${updated.status}`);
  console.log(`=========================================================`);
  process.exit(0);
}

export async function handleDeleteCommand(target: DbTarget, flags: Record<string, any>): Promise<void> {
  if (!flags.username) {
    console.error("Error: Missing required flag for delete (--username).");
    process.exit(1);
  }
  const rawUsernames = (flags.username as string).split(",").map((s) => s.trim()).filter(Boolean);
  const count = await deleteUsersBatch(target, rawUsernames);
  console.log(`\n=========================================================`);
  console.log(`SUCCESS: Deleted ${count} user(s) (${rawUsernames.join(", ")}) from ${target.toUpperCase()}`);
  console.log(`=========================================================`);
  process.exit(0);
}
