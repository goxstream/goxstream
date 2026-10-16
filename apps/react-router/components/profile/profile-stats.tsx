"use client";

import { CheckCircle2, PlayCircle, Clock, Bookmark, Sparkles } from "lucide-react";
import { Progress } from "@goxstream/ui/components/progress";
import { Skeleton } from "@goxstream/ui/components/skeleton";
import type { UserProfile } from "@/types/user";

interface ProfileStatsProps {
  stats?: UserProfile["stats"] | null;
  isLoading?: boolean;
}

export function ProfileStats({ stats, isLoading }: ProfileStatsProps) {
  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:col-span-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="border-border/60 bg-card flex flex-col justify-between gap-3 rounded-xl border p-4 shadow-xs"
            >
              <Skeleton className="size-9 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-3.5 w-24" />
              </div>
            </div>
          ))}
        </div>
        <div className="border-border/60 bg-card flex flex-col gap-4 rounded-xl border p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-12" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Anime Completed",
      value: stats.animeCompleted.toLocaleString(),
      icon: CheckCircle2,
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      label: "Episodes Watched",
      value: stats.episodesWatched.toLocaleString(),
      icon: PlayCircle,
      color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    },
    {
      label: "Hours Streamed",
      value: `${stats.hoursWatched.toLocaleString()} hrs`,
      icon: Clock,
      color: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    },
    {
      label: "Watchlist Saved",
      value: stats.watchlistCount.toLocaleString(),
      icon: Bookmark,
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:col-span-2">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="border-border/60 bg-card hover:border-primary/40 flex flex-col justify-between gap-3 rounded-xl border p-4 shadow-xs transition-colors"
            >
              <div
                className={`flex size-9 items-center justify-center rounded-lg border ${card.color}`}
              >
                <Icon className="size-4" />
              </div>
              <div>
                <span className="text-foreground block text-2xl font-bold tracking-tight">
                  {card.value}
                </span>
                <span className="text-muted-foreground text-xs font-medium">{card.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Favorite Genres Card */}
      <div className="border-border/60 bg-card flex flex-col gap-4 rounded-xl border p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="text-primary size-4" />
            <h3 className="text-foreground text-sm font-semibold">Top Favorite Genres</h3>
          </div>
          <span className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
            Analytics
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {stats.favoriteGenres.map((item) => (
            <div key={item.genre} className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-foreground/90">{item.genre}</span>
                <span className="text-muted-foreground">{item.percentage}%</span>
              </div>
              <Progress value={item.percentage} className="bg-muted h-1.5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
