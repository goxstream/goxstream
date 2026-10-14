import { DAYS_OF_WEEK_MAP } from "@/lib/constants";
import type { DayOfWeek } from "@/types/schedule";
import { Badge } from "@goxstream/ui/components/badge";
import { cn } from "@/lib/utils";

interface DaySelectorTabsProps {
  activeDay: DayOfWeek;
  todayDay: DayOfWeek;
  onSelectDay: (day: DayOfWeek) => void;
  dayCounts: Record<DayOfWeek, number>;
}

export function DaySelectorTabs({
  activeDay,
  todayDay,
  onSelectDay,
  dayCounts,
}: DaySelectorTabsProps) {
  return (
    <div className="w-full scrollbar-none overflow-x-auto pb-1">
      <div className="bg-card/40 border-border/60 flex min-w-max items-center gap-1.5 rounded-xl border p-1">
        {DAYS_OF_WEEK_MAP.map((day) => {
          const isActive = activeDay === day.id;
          const isToday = todayDay === day.id;
          const count = dayCounts[day.id] || 0;

          return (
            <button
              key={day.id}
              onClick={() => onSelectDay(day.id as DayOfWeek)}
              className={cn(
                "relative flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 focus:outline-none",
                isActive
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              )}
            >
              <span className="flex items-center gap-1.5">
                <span className="font-semibold">{day.label}</span>
                {isToday && (
                  <span
                    className={cn(
                      "rounded-md px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase",
                      isActive
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "border border-emerald-500/30 bg-emerald-500/15 text-emerald-500",
                    )}
                  >
                    TODAY
                  </span>
                )}
              </span>

              <Badge
                variant="secondary"
                className={cn(
                  "h-5 min-w-[20px] justify-center rounded-full px-1.5 text-[11px] font-semibold",
                  isActive
                    ? "bg-primary-foreground/25 text-primary-foreground"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {count}
              </Badge>

              {/* Bottom active dot line */}
              {isActive && (
                <span className="bg-primary-foreground absolute -bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
