import type { DashboardStatsData } from "@/hooks/use-dashboard-stats";
import type { UserProfile } from "@/types/user";
import type { CategoryItem } from "@/app/dashboard/anime/categories/types";
import type { SeasonItem, SeasonQuarter } from "@/app/dashboard/anime/seasons/types";

/**
 * Calculates dashboard statistics from raw counts
 */
export function calculateDashboardStats(
  totalAnime: number,
  totalEpisodes: number,
  totalUsers: number
): DashboardStatsData {
  return {
    totalAnime,
    totalEpisodes,
    totalUsers,
    activeStreams: Math.floor(totalAnime * 2.8),
    bandwidthUsageGb: Number((totalEpisodes * 0.045).toFixed(1)),
    cpuLoadPercent: 12.5,
    storageUsedGb: Number((totalEpisodes * 0.75).toFixed(1)),
    monthlyGrowthPercent: totalUsers > 0 ? 14.8 : 0,
  };
}

/**
 * Maps raw database user record into UserProfile format
 */
export function mapToDashboardUser(u: any): UserProfile {
  return {
    id: u.id,
    username: u.username,
    displayName: u.displayName,
    email: u.email,
    avatarUrl: u.avatarUrl || undefined,
    bannerUrl: u.bannerUrl || undefined,
    joinDate: u.createdAt
      ? new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
      : "Recently",
    isVip: u.membershipTier === "vip" || u.membershipTier === "ultra_vip" || u.membershipTier === "vip_pro",
    vipTier: u.membershipTier === "ultra_vip" ? "Ultra VIP" : u.membershipTier === "vip" || u.membershipTier === "vip_pro" ? "VIP Pro" : undefined,
    bio: u.bio || "GoxStream community member.",
    stats: {
      animeCompleted: 0,
      episodesWatched: 0,
      hoursWatched: 0,
      watchlistCount: 0,
      favoriteGenres: [],
    },
  };
}

/**
 * Maps raw database category record into CategoryItem format
 */
export function mapToDashboardCategory(g: any): CategoryItem {
  return {
    id: g.id,
    code: (g.code as CategoryItem["code"]) || "TV",
    name: g.name,
    slug: g.slug,
    description: g.description || `Category for ${g.name} anime content.`,
    animeCount: g.animeCount || 0,
    isActive: g.isActive !== false,
    updatedAt: g.updatedAt ? new Date(g.updatedAt).toLocaleDateString() : new Date().toLocaleDateString(),
  };
}

/**
 * Groups and maps raw anime records into SeasonItem format
 */
export function calculateDashboardSeasons(animesList: any[]): SeasonItem[] {
  const seasonMap = new Map<string, number>();
  animesList.forEach((a: any) => {
    const season = `${a.season || "Fall"} ${a.year || 2026}`;
    seasonMap.set(season, (seasonMap.get(season) || 0) + 1);
  });

  return Array.from(seasonMap.entries()).map(([name, animeCount], idx) => {
    const qStr = name.split(" ")[0].toUpperCase();
    const quarter: SeasonQuarter = (["WINTER", "SPRING", "SUMMER", "FALL"].includes(qStr) ? qStr : "FALL") as SeasonQuarter;
    const year = parseInt(name.split(" ")[1]) || 2026;
    return {
      id: `season-${idx + 1}`,
      name,
      year,
      quarter,
      startDate: `${year}-01-01`,
      endDate: `${year}-03-31`,
      totalAnime: animeCount,
      isCurrent: name.includes("2026"),
      isActive: true,
    };
  });
}
