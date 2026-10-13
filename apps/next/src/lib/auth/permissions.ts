export type Role = "super_admin" | "admin" | "content_manager" | "moderator" | "user";
export type MembershipTier = "free" | "vip_pro";

export type PermissionScope =
  // Anime Catalog Scopes
  | "anime:read"
  | "anime:create"
  | "anime:update"
  | "anime:delete"

  // Episode & Video Stream Scopes
  | "episodes:read"
  | "episodes:create"
  | "episodes:update"
  | "episodes:publish"
  | "episodes:delete"

  // Community & Comments Scopes
  | "comments:read"
  | "comments:moderate"
  | "comments:delete"

  // User & Staff Management Scopes
  | "users:read"
  | "users:update"
  | "users:suspend"

  // Analytics Scopes
  | "analytics:read"

  // System & Infrastructure Scopes
  | "system:read"
  | "system:update";

const ROLE_HIERARCHY: Record<Role, number> = {
  user: 1,
  moderator: 2,
  content_manager: 3,
  admin: 4,
  super_admin: 5,
};

export const ROLE_DEFAULT_SCOPES: Record<Role, PermissionScope[]> = {
  super_admin: [
    "anime:read",
    "anime:create",
    "anime:update",
    "anime:delete",
    "episodes:read",
    "episodes:create",
    "episodes:update",
    "episodes:publish",
    "episodes:delete",
    "comments:read",
    "comments:moderate",
    "comments:delete",
    "users:read",
    "users:update",
    "users:suspend",
    "analytics:read",
    "system:read",
    "system:update",
  ],
  admin: [
    "anime:read",
    "anime:create",
    "anime:update",
    "anime:delete",
    "episodes:read",
    "episodes:create",
    "episodes:update",
    "episodes:publish",
    "episodes:delete",
    "comments:read",
    "comments:moderate",
    "comments:delete",
    "users:read",
    "users:update",
    "users:suspend",
    "analytics:read",
  ],
  content_manager: [
    "anime:read",
    "anime:create",
    "anime:update",
    "episodes:read",
    "episodes:create",
    "episodes:update",
    "episodes:publish",
    "analytics:read",
  ],
  moderator: [
    "comments:read",
    "comments:moderate",
    "comments:delete",
    "users:read",
    "users:suspend",
  ],
  user: [],
};

/**
 * Returns default permission scopes for a given role.
 */
export function getRoleDefaultScopes(role: Role): PermissionScope[] {
  return ROLE_DEFAULT_SCOPES[role] ?? [];
}

/**
 * Checks if a user's role satisfies the required roles or hierarchy level.
 */
export function hasRole(userRole: Role | undefined | null, allowedRoles: Role[]): boolean {
  if (!userRole) return false;
  const userLevel = ROLE_HIERARCHY[userRole] ?? 0;
  return allowedRoles.some((role) => userLevel >= (ROLE_HIERARCHY[role] ?? 99));
}

/**
 * Checks if a user has access to VIP Pro exclusive episodes/content.
 */
export function canAccessVipContent(user: { membership_tier?: MembershipTier | string | null } | null): boolean {
  return user?.membership_tier === "vip_pro";
}

/**
 * Checks if a user can stream video in a given quality level.
 * Free tier is limited to 720p and below; VIP Pro unlocks 1080p.
 */
export function canAccessQuality(
  user: { membership_tier?: MembershipTier | string | null } | null,
  quality: string
): boolean {
  if (quality === "1080p") {
    return user?.membership_tier === "vip_pro";
  }
  return true;
}

/**
 * Checks if a user has a specific granular scope permission.
 * Regular users (role = 'user') have zero staff scope permissions (always return false).
 */
export function hasPermission(
  user: { role?: Role | null; permissions?: string[] | null } | null,
  requiredPermission: PermissionScope
): boolean {
  if (!user || !user.role) return false;

  // Regular users have no administration/staff permissions
  if (user.role === "user") return false;

  // Super Admin has unrestricted access to all scopes
  if (user.role === "super_admin") return true;

  // Evaluate user custom permissions or fallback to role defaults
  const userScopes = (user.permissions && user.permissions.length > 0)
    ? (user.permissions as PermissionScope[])
    : getRoleDefaultScopes(user.role);

  return userScopes.includes(requiredPermission);
}
