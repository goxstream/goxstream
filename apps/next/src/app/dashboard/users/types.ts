export type UserRole = "super_admin" | "admin" | "content_manager" | "moderator" | "user";

export type UserStatus = "active" | "suspended" | "pending";

export type MembershipTier = "free" | "vip_pro";

export interface UserWatchHistorySummary {
  totalWatchedEpisodes: number;
  totalWatchTimeHours: number;
  favoriteGenre: string;
  lastWatchedTitle: string;
  lastWatchedAt: string;
}

export interface UserAccount {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  role: UserRole;
  status: UserStatus;
  membershipTier: MembershipTier;
  createdAt: string;
  lastActiveAt: string;
  watchHistory: UserWatchHistorySummary;
}

export interface UserFilters {
  search: string;
  role: string;
  status: string;
  membershipTier: string;
}
