import React from "react";
import { Box, Text } from "ink";
import Table from "cli-table3";
import type { UserItem } from "../types";

interface UserTableProps {
  users: UserItem[];
  title?: string;
}

export const UserTable: React.FC<UserTableProps> = ({ users, title }) => {
  if (users.length === 0) {
    return (
      <Box marginY={1}>
        <Text color="yellow">No users found in database.</Text>
      </Box>
    );
  }

  const table = new Table({
    head: [
      "\x1b[36mID\x1b[0m",
      "\x1b[36mUsername\x1b[0m",
      "\x1b[36mEmail\x1b[0m",
      "\x1b[36mRole\x1b[0m",
      "\x1b[36mStatus\x1b[0m",
      "\x1b[36mTier\x1b[0m",
    ],
    style: { head: [], border: [] },
  });

  users.forEach((u) => {
    const roleColor =
      u.role === "super_admin"
        ? "\x1b[35m"
        : u.role === "admin"
        ? "\x1b[33m"
        : "\x1b[32m";

    const statusColor = u.status === "active" ? "\x1b[32m" : "\x1b[31m";

    table.push([
      u.id,
      u.username,
      u.email,
      `${roleColor}${u.role}\x1b[0m`,
      `${statusColor}${u.status}\x1b[0m`,
      u.membershipTier || "free",
    ]);
  });

  return (
    <Box flexDirection="column" marginY={1}>
      {title && (
        <Text bold color="green">
          {title} ({users.length} record{users.length > 1 ? "s" : ""})
        </Text>
      )}
      <Text>{table.toString()}</Text>
    </Box>
  );
};
