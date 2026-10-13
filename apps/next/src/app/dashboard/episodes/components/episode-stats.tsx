import { Film, CheckCircle2, AlertTriangle, Eye, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { EpisodeStats } from "../types";

interface EpisodeStatsProps {
  stats: EpisodeStats;
}

export function EpisodeStatsCards({ stats }: EpisodeStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <Card className="border-border/60 bg-card">
        <CardContent className="flex items-center justify-between p-4">
          <div>
            <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Total Episodes
            </p>
            <p className="text-foreground mt-1 text-2xl font-bold">
              {stats.totalEpisodes.toLocaleString()}
            </p>
          </div>
          <div className="bg-primary/10 text-primary rounded-lg p-2.5">
            <Film className="size-5" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card">
        <CardContent className="flex items-center justify-between p-4">
          <div>
            <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Published
            </p>
            <p className="mt-1 text-2xl font-bold text-emerald-500">
              {stats.publishedEpisodes.toLocaleString()}
            </p>
          </div>
          <div className="rounded-lg bg-emerald-500/10 p-2.5 text-emerald-500">
            <CheckCircle2 className="size-5" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card">
        <CardContent className="flex items-center justify-between p-4">
          <div>
            <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Draft / Processing
            </p>
            <p className="mt-1 text-2xl font-bold text-amber-500">
              {stats.draftEpisodes.toLocaleString()}
            </p>
          </div>
          <div className="rounded-lg bg-amber-500/10 p-2.5 text-amber-500">
            <Clock className="size-5" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card">
        <CardContent className="flex items-center justify-between p-4">
          <div>
            <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Server Alerts
            </p>
            <p className="text-destructive mt-1 text-2xl font-bold">{stats.serverIssues}</p>
          </div>
          <div className="bg-destructive/10 text-destructive rounded-lg p-2.5">
            <AlertTriangle className="size-5" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card sm:col-span-2 lg:col-span-1">
        <CardContent className="flex items-center justify-between p-4">
          <div>
            <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Total Streams
            </p>
            <p className="text-foreground mt-1 text-2xl font-bold">
              {(stats.totalViews / 1000000).toFixed(1)}M
            </p>
          </div>
          <div className="rounded-lg bg-sky-500/10 p-2.5 text-sky-500">
            <Eye className="size-5" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
