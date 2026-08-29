import { getDb } from "../index";
import { schedules } from "../schema";
import { mapToScheduleItem } from "./schedule.mappers";
import type { ScheduleItem } from "@/types/schedule";

/**
 * Fetches all real schedule items from database with anime relations
 */
export async function getAnimeScheduleItems(): Promise<ScheduleItem[]> {
  const db = await getDb();
  
  try {
    const rawList = await db.query.schedules.findMany({
      limit: 50,
      with: {
        anime: {
          with: {
            animeGenres: {
              with: {
                genre: true,
              },
            },
            animeStudios: {
              with: {
                studio: true,
              },
            },
          },
        },
      },
    });

    if (!rawList || rawList.length === 0) {
      return [];
    }

    return rawList.map(mapToScheduleItem);
  } catch (error) {
    console.error("Failed to query schedules from database:", error);
    return [];
  }
}
