"use client";

import { AlertTriangle, CheckCircle2, Bot, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { ReportedComment } from "../types";

interface ModerationStatsProps {
  reports: ReportedComment[];
}

export function ModerationStats({ reports }: ModerationStatsProps) {
  const pendingCount = reports.filter((r) => r.status === "pending").length;
  const resolvedCount = reports.filter((r) => r.status === "resolved").length;
  const autoFlaggedCount = reports.filter((r) => r.flaggedBySystem).length;

  const stats = [
    {
      title: "Pending Reports",
      value: pendingCount,
      subtext: "Requires moderator review",
      icon: AlertTriangle,
    },
    {
      title: "Resolved Today",
      value: resolvedCount,
      subtext: "Handled by moderation team",
      icon: CheckCircle2,
    },
    {
      title: "Auto-Flagged (AI)",
      value: autoFlaggedCount,
      subtext: "Detected by automated filters",
      icon: Bot,
    },
    {
      title: "Avg Resolution Time",
      value: "14 mins",
      subtext: "Fast community response",
      icon: Clock,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.title} className="border-border/60 bg-card shadow-xs">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">{item.title}</span>
                <div className="flex size-8 items-center justify-center rounded-md border border-border/60 bg-muted/40 text-foreground">
                  <Icon className="size-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-bold tracking-tight text-foreground">
                {item.value}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{item.subtext}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
