export type Role = "super_admin" | "admin" | "content_manager" | "moderator" | "user";
export type MembershipTier = "free" | "vip_pro";

const ROLE_HIERARCHY: Record<Role, number> = {
  user: 1,
  moderator: 2,
  content_manager: 3,
  admin: 4,
  super_admin: 5,
};

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
 * Free tier is limited to 720p and below; VIP Pro unlocks 1080p and auto high-bitrate.
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
