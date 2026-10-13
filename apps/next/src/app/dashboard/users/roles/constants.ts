import type { RoleDefinition, TeamMember, PermissionItem } from "./types";

export const MOCK_ROLES: RoleDefinition[] = [];
export const MOCK_TEAM_MEMBERS: TeamMember[] = [];

export const PERMISSION_ITEMS: PermissionItem[] = [
  { id: "p1", key: "all", name: "Super Admin", description: "Full system control", category: "system" },
  { id: "p2", key: "content.manage", name: "Manage Content", description: "Manage anime titles & episodes", category: "content" },
  { id: "p3", key: "users.manage", name: "Manage Users", description: "Manage member user accounts", category: "users" },
  { id: "p4", key: "moderation.manage", name: "Moderation", description: "Moderate comments & reports", category: "community" },
  { id: "p5", key: "stream.watch", name: "Watch Streams", description: "Access video playback", category: "analytics" },
];
