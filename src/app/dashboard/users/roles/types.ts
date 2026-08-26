export type PermissionCategory = "content" | "community" | "users" | "analytics" | "system";

export interface PermissionItem {
  id: string;
  key: string;
  name: string;
  description: string;
  category: PermissionCategory;
}

export interface RoleDefinition {
  id: string;
  name: string;
  slug: string;
  description: string;
  memberCount: number;
  permissions: string[]; // Permission keys
  isDefault?: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  roleSlug: string;
  joinedAt: string;
}
