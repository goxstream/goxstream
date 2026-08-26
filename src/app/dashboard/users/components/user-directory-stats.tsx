"use client";

import { Users, Crown, ShieldAlert, UserCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { UserAccount } from "../types";

interface UserDirectoryStatsProps {
  users: UserAccount[];
}

export function UserDirectoryStats({ users }: UserDirectoryStatsProps) {
  const totalUsers = users.length;
  const vipCount = users.filter((u) => u.membershipTier === "vip_pro").length;
  const activeCount = users.filter((u) => u.status === "active").length;
  const suspendedCount = users.filter((u) => u.status === "suspended").length;

  const stats = [
    {
      title: "Total Registered",
      value: totalUsers,
      subtext: "Platform audience & staff",
      icon: Users,
    },
    {
      title: "Active Users",
      value: activeCount,
      subtext: "Currently active accounts",
      icon: UserCheck,
    },
    {
      title: "VIP Pro Subscribers",
      value: vipCount,
      subtext: `${Math.round((vipCount / (totalUsers || 1)) * 100)}% of total audience`,
      icon: Crown,
    },
    {
      title: "Suspended Accounts",
      value: suspendedCount,
      subtext: "Requires moderation review",
      icon: ShieldAlert,
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
