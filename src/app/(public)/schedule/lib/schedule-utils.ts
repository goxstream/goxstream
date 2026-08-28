import type { DayOfWeek } from "@/types/schedule";

export function getCurrentDayOfWeek(): DayOfWeek {
  const dayIndex = new Date().getDay();
  const dayMap: Record<number, DayOfWeek> = {
    0: "sunday",
    1: "monday",
    2: "tuesday",
    3: "wednesday",
    4: "thursday",
    5: "friday",
    6: "saturday",
  };
  return dayMap[dayIndex] || "wednesday";
}
