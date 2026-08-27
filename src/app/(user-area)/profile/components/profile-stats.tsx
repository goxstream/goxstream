"use client";

import { CheckCircle2, PlayCircle, Clock, Bookmark, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { UserProfile } from "@/types/user";

interface ProfileStatsProps {
  stats: UserProfile["stats"];
}

export function ProfileStats({ stats }: ProfileStatsProps) {
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Stat Numeric Cards */}
      <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="p-4 rounded-xl border border-border/60 bg-card hover:border-primary/40 transition-colors flex flex-col justify-between gap-3 shadow-xs"
            >
              <div className={`size-9 rounded-lg border flex items-center justify-center ${card.color}`}>
                <Icon className="size-4" />
              </div>
              <div>
                <span className="text-2xl font-bold tracking-tight text-foreground block">
                  {card.value}
                </span>
                <span className="text-xs text-muted-foreground font-medium">
                  {card.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Favorite Genres Card */}
      <div className="p-5 rounded-xl border border-border/60 bg-card flex flex-col gap-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <h3 className="font-semibold text-sm text-foreground">Top Favorite Genres</h3>
          </div>
          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
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
              <Progress value={item.percentage} className="h-1.5 bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
