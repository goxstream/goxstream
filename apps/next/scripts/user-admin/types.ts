export type DbTarget = "postgres" | "d1-local" | "d1-remote";

export interface DbTargetInfo {
  id: DbTarget;
  name: string;
  description: string;
  isAvailable: boolean;
  reason?: string;
}

export interface UserItem {
  id: string;
  username: string;
  email: string;
  displayName: string;
  role: string;
  status: string;
  membershipTier?: string;
  createdAt: Date | number | string;
  updatedAt: Date | number | string;
  lastActiveAt?: Date | number | string | null;
}

export interface CreateUserInput {
  id?: string;
  username: string;
  email: string;
  password: string;
  displayName?: string;
  role?: "super_admin" | "admin" | "user" | "moderator";
  status?: "active" | "inactive" | "suspended" | "banned";
  membershipTier?: string;
}

export interface UpdateUserInput {
  username?: string;
  email?: string;
  password?: string;
  displayName?: string;
  role?: "super_admin" | "admin" | "user" | "moderator";
  status?: "active" | "inactive" | "suspended" | "banned";
  membershipTier?: string;
}

export type ActionCommand = "list" | "create" | "edit" | "delete" | "help";
