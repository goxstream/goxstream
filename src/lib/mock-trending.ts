import type { TrendingAnimeItem, TrendingPeriod } from "@/types/anime";
import { FEATURED_ANIME, TRENDING_ANIME, EXTRA_ANIME } from "./mock-anime";

// Enriched dataset with trending metrics, view stats, and rank changes
export const MOCK_TRENDING_LIST: TrendingAnimeItem[] = [
  {
    ...FEATURED_ANIME,
    rank: 1,
    previousRank: 2,
    weeklyViews: 1485000,
    monthlyViews: 5920000,
    totalViews: 24500000,
    weeklyGrowth: "+42%",
    trendScore: 9850,
  },
  {
    ...TRENDING_ANIME[0], // Demon Slayer: Infinity Castle
    rank: 2,
    previousRank: 1,
    weeklyViews: 1320000,
    monthlyViews: 5410000,
    totalViews: 28900000,
    weeklyGrowth: "+18%",
    trendScore: 9620,
  },
  {
    ...TRENDING_ANIME[1], // Jujutsu Kaisen: Culling Game
    rank: 3,
    previousRank: 4,
    weeklyViews: 1190000,
    monthlyViews: 4890000,
    totalViews: 31200000,
    weeklyGrowth: "+25%",
    trendScore: 9410,
  },
  {
    ...TRENDING_ANIME[3], // Frieren S2
    rank: 4,
    previousRank: 3,
    weeklyViews: 980000,
    monthlyViews: 4120000,
    totalViews: 19800000,
    weeklyGrowth: "+12%",
    trendScore: 9150,
  },
  {
    ...TRENDING_ANIME[2], // Chainsaw Man Reze Arc
    rank: 5,
    previousRank: 6,
    weeklyViews: 910000,
    monthlyViews: 3850000,
    totalViews: 16400000,
    weeklyGrowth: "+31%",
    trendScore: 8980,
  },
  {
    ...TRENDING_ANIME[4], // SPY x FAMILY S3
    rank: 6,
    previousRank: 5,
    weeklyViews: 840000,
    monthlyViews: 3500000,
    totalViews: 15200000,
    weeklyGrowth: "+8%",
    trendScore: 8750,
  },
  {
    ...EXTRA_ANIME[2], // Oshi no Ko Season 3
    rank: 7,
    previousRank: 9,
    weeklyViews: 790000,
    monthlyViews: 3100000,
    totalViews: 12800000,
    weeklyGrowth: "+29%",
    trendScore: 8520,
  },
  {
    ...EXTRA_ANIME[0], // Bleach: TYBW
    rank: 8,
    previousRank: 7,
    weeklyViews: 720000,
    monthlyViews: 2950000,
    totalViews: 21400000,
    weeklyGrowth: "+5%",
    trendScore: 8390,
  },
  {
    ...EXTRA_ANIME[1], // Attack on Titan: The Last Attack
    rank: 9,
    previousRank: 8,
    weeklyViews: 690000,
    monthlyViews: 2800000,
    totalViews: 42100000,
    weeklyGrowth: "+15%",
    trendScore: 8250,
  },
  {
    ...EXTRA_ANIME[8], // One Punch Man Season 3
    rank: 10,
    previousRank: 12,
    weeklyViews: 650000,
    monthlyViews: 2600000,
    totalViews: 11500000,
    weeklyGrowth: "NEW",
    trendScore: 8100,
  },
  {
    ...EXTRA_ANIME[3], // Vinland Saga Season 3
    rank: 11,
    previousRank: 10,
    weeklyViews: 580000,
    monthlyViews: 2400000,
    totalViews: 9800000,
    weeklyGrowth: "+14%",
    trendScore: 7850,
  },
  {
    ...EXTRA_ANIME[4], // Cyberpunk Edgerunners Overdrive
    rank: 12,
    previousRank: 15,
    weeklyViews: 530000,
    monthlyViews: 2150000,
    totalViews: 8400000,
    weeklyGrowth: "NEW",
    trendScore: 7600,
  },
  {
    ...EXTRA_ANIME[5], // Kaguya-sama
    rank: 13,
    previousRank: 11,
    weeklyViews: 490000,
    monthlyViews: 1980000,
    totalViews: 14200000,
    weeklyGrowth: "-2%",
    trendScore: 7410,
  },
  {
    ...EXTRA_ANIME[6], // Mob Psycho 100 III
    rank: 14,
    previousRank: 13,
    weeklyViews: 460000,
    monthlyViews: 1850000,
    totalViews: 18900000,
    weeklyGrowth: "-4%",
    trendScore: 7250,
  },
  {
    ...EXTRA_ANIME[7], // Your Name
    rank: 15,
    previousRank: 14,
    weeklyViews: 420000,
    monthlyViews: 1720000,
    totalViews: 56000000,
    weeklyGrowth: "+3%",
    trendScore: 7100,
  },
];

// Extract unique genres across all trending items
export const MOCK_TRENDING_GENRES = [
  "All",
  ...Array.from(
    new Set(MOCK_TRENDING_LIST.flatMap((anime) => anime.genres))
  ).sort(),
];

// Helper to filter and sort trending items by period and genre
export function getTrendingAnime(
  period: TrendingPeriod = "weekly",
  genre: string = "All"
): TrendingAnimeItem[] {
  let items = [...MOCK_TRENDING_LIST];

  // 1. Multi-genre filter (checks if the anime contains the selected genre)
  if (genre !== "All") {
    items = items.filter((anime) =>
      anime.genres.some((g) => g.toLowerCase() === genre.toLowerCase())
    );
  }

  // 2. Sort according to period metrics
  items.sort((a, b) => {
    if (period === "weekly") {
      return b.weeklyViews - a.weeklyViews;
    }
    if (period === "monthly") {
      return b.monthlyViews - a.monthlyViews;
    }
    // All-time top trending
    return b.totalViews - a.totalViews;
  });

  // 3. Re-assign dynamic rank numbers for filtered view
  return items.map((anime, index) => ({
    ...anime,
    rank: index + 1,
  }));
}
