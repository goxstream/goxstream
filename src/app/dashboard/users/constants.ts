import type { UserAccount } from "./types";

export const MOCK_USERS: UserAccount[] = [];

export const ROLE_OPTIONS = [
  { label: "All Roles", value: "all" },
  { label: "Admin", value: "admin" },
  { label: "User", value: "user" },
];

export const STATUS_OPTIONS = [
  { label: "All Statuses", value: "all" },
  { label: "Active", value: "active" },
  { label: "Suspended", value: "suspended" },
];

export const TIER_OPTIONS = [
  { label: "All Tiers", value: "all" },
  { label: "Free Member", value: "free" },
  { label: "VIP Supporter", value: "vip" },
];
