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
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Total Episodes
            </p>
            <p className="text-2xl font-bold text-foreground mt-1">
              {stats.totalEpisodes.toLocaleString()}
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
            <Film className="size-5" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Published
            </p>
            <p className="text-2xl font-bold text-emerald-500 mt-1">
              {stats.publishedEpisodes.toLocaleString()}
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-500">
            <CheckCircle2 className="size-5" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Draft / Processing
            </p>
            <p className="text-2xl font-bold text-amber-500 mt-1">
              {stats.draftEpisodes.toLocaleString()}
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-500">
            <Clock className="size-5" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Server Alerts
            </p>
            <p className="text-2xl font-bold text-destructive mt-1">
              {stats.serverIssues}
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-destructive/10 text-destructive">
            <AlertTriangle className="size-5" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card sm:col-span-2 lg:col-span-1">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Total Streams
            </p>
            <p className="text-2xl font-bold text-foreground mt-1">
              {(stats.totalViews / 1000000).toFixed(1)}M
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-sky-500/10 text-sky-500">
            <Eye className="size-5" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
