import type { ScheduleSeedData, TrendingStatSeedData } from "./types";

export function generateScheduleAndStats(
  animeId: string,
  animeStatus: string,
  idx: number,
  epToGenerate: number
) {
  let schedule: ScheduleSeedData | null = null;

  if (animeStatus === "Ongoing") {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    schedule = {
      id: `sched-${animeId}`,
      animeId,
      releaseDay: days[idx % days.length],
      releaseTime: "18:00",
      episodeNumber: epToGenerate + 1,
      status: "upcoming",
      timezone: "UTC",
    };
  }

  const viewsToday = Math.floor(Math.random() * 12000) + 1500;
  const viewsThisWeek = viewsToday * 7;

  const trendingStat: TrendingStatSeedData = {
    animeId,
    rank: idx + 1,
    previousRank: idx + 1 + (Math.floor(Math.random() * 5) - 2),
    viewsToday,
    viewsThisWeek,
    weeklyViews: viewsThisWeek,
    monthlyViews: viewsThisWeek * 4,
    totalViews: viewsThisWeek * 12,
    trendScore: Number((100 - idx * 4 + Math.random() * 3).toFixed(2)),
    updatedAt: new Date(),
  };

  return { schedule, trendingStat };
}
