import type { UserItem } from "../types";

export function formatRole(role: string): string {
  const roleColor =
    role === "super_admin"
      ? "\x1b[35m"
      : role === "admin"
      ? "\x1b[33m"
      : "\x1b[32m";
  return `${roleColor}${role}\x1b[0m`;
}

export function formatStatus(status: string): string {
  const statusColor = status === "active" ? "\x1b[32m" : "\x1b[31m";
  return `${statusColor}${status}\x1b[0m`;
}

export function formatUserRow(user: UserItem): string[] {
  return [
    user.id,
    user.username,
    user.email,
    formatRole(user.role),
    formatStatus(user.status),
    user.membershipTier || "free",
  ];
}
