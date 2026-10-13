import React from "react";
import { render } from "ink";
import meow from "meow";
import { App } from "./ui/App";
import {
  resolveTargetDb,
  handleListCommand,
  handleCreateCommand,
  handleEditCommand,
  handleDeleteCommand,
} from "./cli/handlers";
import type { DbTarget } from "./types";

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

  if (command === "help") {
    cli.showHelp(0);
    return;
  }

  const isNonInteractive =
    flags.nonInteractive ||
    (command === "create" && flags.username && flags.email && flags.password) ||
    (command === "delete" && flags.username) ||
    (command === "list" && flags.db);

  if (isNonInteractive && command) {
    const target = await resolveTargetDb(flags.db as string);
    if (command === "list") await handleListCommand(target);
    if (command === "create") await handleCreateCommand(target, flags);
    if (command === "edit") await handleEditCommand(target, flags);
    if (command === "delete") await handleDeleteCommand(target, flags);
  }

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
