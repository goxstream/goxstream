import React from "react";
import { render } from "ink";
import meow from "meow";
import { App } from "./ui/App";
import { scanAvailableDatabases } from "./db-scanner";
import { listUsers, createUser, updateUser, deleteUser } from "./db-adapter";
import type { DbTarget } from "./types";
import Table from "cli-table3";

const cli = meow(
  `
  Usage
    $ pnpm user-admin [command] [options]

  Commands
    list                Display users in CLI table
    create              Create a new user
    edit                Edit user details
    delete              Delete a user
    help                Show help details

  Options
    --db, -d            Database target ("postgres" | "d1-local" | "d1-remote")
    --username, -u      Username for create/edit/delete
    --email, -e         Email address
    --password, -p      Password
    --role, -r          Role ("super_admin" | "admin" | "user" | "moderator")
    --status, -s        Status ("active" | "inactive" | "suspended" | "banned")
    --display-name, -n  Display Name
    --non-interactive   Run without interactive Ink TUI

  Examples
    $ pnpm user-admin
    $ pnpm user-admin list --db=postgres
    $ pnpm user-admin create --username=admin2 --email=admin2@goxstream.com --password=Pass123! --role=super_admin --db=postgres
`,
  {
    importMeta: import.meta,
    flags: {
      db: { type: "string", shortFlag: "d" },
      username: { type: "string", shortFlag: "u" },
      email: { type: "string", shortFlag: "e" },
      password: { type: "string", shortFlag: "p" },
      role: { type: "string", shortFlag: "r" },
      status: { type: "string", shortFlag: "s" },
      displayName: { type: "string", shortFlag: "n" },
      nonInteractive: { type: "boolean", default: false },
    },
  }
);

async function main() {
  const command = cli.input[0] ? cli.input[0].toLowerCase() : undefined;
  const flags = cli.flags;

  const isNonInteractive =
    flags.nonInteractive ||
    (command === "create" && flags.username && flags.email && flags.password) ||
    (command === "delete" && flags.username) ||
    (command === "list" && flags.db);

  if (command === "help") {
    cli.showHelp(0);
    return;
  }

  if (isNonInteractive && command) {
    // 1. Resolve DB Target
    let target: DbTarget | undefined = (flags.db as DbTarget) || undefined;
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

    // 2. Handle Non-Interactive Commands
    if (command === "list") {
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

    if (command === "create") {
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

    if (command === "edit") {
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

    if (command === "delete") {
      if (!flags.username) {
        console.error("Error: Missing required flag for delete (--username).");
        process.exit(1);
      }
      await deleteUser(target, flags.username as string);
      console.log(`\n=========================================================`);
      console.log(`SUCCESS: Deleted user '${flags.username}' from ${target.toUpperCase()}`);
      console.log(`=========================================================`);
      process.exit(0);
    }
  }

  // 3. Interactive TUI Mode
  render(
    <App
      initialTarget={flags.db as DbTarget}
      initialAction={command}
      initialFlags={flags as Record<string, any>}
    />
  );
}

main().catch((err) => {
  console.error("Unexpected Error in User Admin CLI:", err);
  process.exit(1);
});
