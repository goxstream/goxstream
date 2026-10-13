"use client";

import * as React from "react";
import {
  Tv,
  PlayCircle,
  Users,
  Activity,
  TrendingUp,
  TrendingDown,
  Plus,
  Upload,
  RefreshCw,
  MoreHorizontal,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { useIsMounted } from "../hooks/use-mounted";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import { TRAFFIC_CHART_CONFIG } from "../constants";
import { useDashboardOverview } from "../hooks/use-dashboard-overview";

export function DashboardOverview() {
  const mounted = useIsMounted();
  const { stats, isLoading: isStatsLoading } = useDashboardStats();
  const { trafficData, recentActivities, isLoading: isOverviewLoading } = useDashboardOverview();
  const isLoading = isStatsLoading || isOverviewLoading;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 sm:p-6 lg:p-8">
      {/* Top Banner / Welcome Section */}
      <div className="border-border/60 flex flex-col justify-between gap-4 border-b pb-6 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-foreground font-brand text-2xl font-extrabold tracking-tight sm:text-3xl">
              Dashboard Control Center
            </h1>
            <Badge
              variant="outline"
              className="border-brand/30 bg-brand/10 text-brand text-xs font-semibold"
            >
              v1.0 Live
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
            Real-time infrastructure health, streaming bandwidth, catalog state, and moderation
            metrics.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            className="border-border/60 h-9 cursor-pointer gap-1.5 text-xs"
          >
            <RefreshCw className="text-muted-foreground size-3.5" />
            <span>Sync Stats</span>
          </Button>
          <Button
            size="sm"
            className="bg-brand text-brand-foreground hover:bg-brand/90 h-9 cursor-pointer gap-1.5 text-xs font-semibold"
          >
            <Plus className="size-4" />
            <span>New Anime / Episode</span>
          </Button>
        </div>
      </div>

      {/* 4 Stat Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Anime Titles */}
        <Card className="border-border/60 hover:border-border shadow-xs transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Total Active Anime
            </CardTitle>
            <div className="bg-brand/10 text-brand rounded-md p-2">
              <Tv className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24 rounded" />
            ) : (
              <div className="font-brand text-2xl font-extrabold tracking-tight">
                {stats.totalAnime.toLocaleString()}
              </div>
            )}
            <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-emerald-500">
              <TrendingUp className="size-3.5" />
              <span>+{stats.monthlyGrowthPercent}% this month</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Total Episodes Streamed */}
        <Card className="border-border/60 hover:border-border shadow-xs transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Total Episodes Streamed
            </CardTitle>
            <div className="rounded-md bg-cyan-500/10 p-2 text-cyan-400">
              <PlayCircle className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24 rounded" />
            ) : (
              <div className="font-brand text-2xl font-extrabold tracking-tight">
                {stats.totalEpisodes.toLocaleString()}
              </div>
            )}
            <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-emerald-500">
              <TrendingUp className="size-3.5" />
              <span>+142 episode uploads</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Concurrent Viewers */}
        <Card className="border-border/60 hover:border-border shadow-xs transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Concurrent Viewers
            </CardTitle>
            <div className="rounded-md bg-indigo-500/10 p-2 text-indigo-400">
              <Users className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24 rounded" />
            ) : (
              <div className="font-brand text-2xl font-extrabold tracking-tight">
                {stats.activeStreams.toLocaleString()}
              </div>
            )}
            <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-emerald-500">
              <TrendingUp className="size-3.5" />
              <span>+18.4% peak usage</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: CDN Traffic */}
        <Card className="border-border/60 hover:border-border shadow-xs transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              CDN Bandwidth
            </CardTitle>
            <div className="rounded-md bg-purple-500/10 p-2 text-purple-400">
              <Activity className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24 rounded" />
            ) : (
              <div className="font-brand text-2xl font-extrabold tracking-tight">
                {stats.bandwidthUsageGb} Gbps
              </div>
            )}
            <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-amber-500">
              <TrendingDown className="size-3.5" />
              <span>Normal operating capacity</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Streaming Traffic Chart & Quick Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Streaming Traffic Chart */}
        <Card className="border-border/60 shadow-xs lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold">
                Live Streaming Traffic & Concurrents
              </CardTitle>
              <CardDescription className="text-xs">
                Real-time active viewers and bandwidth consumption across all edge nodes today.
              </CardDescription>
            </div>
            <Badge variant="outline" className="border-brand/30 text-brand text-[11px]">
              24-Hour Graph
            </Badge>
          </CardHeader>
          <CardContent className="pt-2">
            {mounted && !isLoading ? (
              <ChartContainer config={TRAFFIC_CHART_CONFIG} className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={trafficData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorStreams" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#34d094" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#34d094" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
                    <XAxis
                      dataKey="time"
                      stroke="#888888"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="activeStreams"
                      stroke="#34d094"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorStreams)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <Skeleton className="bg-muted/30 h-72 w-full rounded-lg" />
            )}
          </CardContent>
        </Card>

        {/* Right 1 Col: Quick Control Shortcuts */}
        <Card className="border-border/60 flex flex-col justify-between shadow-xs">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-bold">
              <ShieldCheck className="text-brand size-4" />
              Quick Action Studio
            </CardTitle>
            <CardDescription className="text-xs">
              Frequent management actions for content managers & admins.
            </CardDescription>
          </CardHeader>
          <CardContent className="my-auto flex flex-col gap-2.5">
            <Button
              variant="outline"
              className="border-border/60 h-10 w-full cursor-pointer justify-start gap-2.5 text-xs font-medium"
            >
              <Plus className="text-brand size-4 shrink-0" />
              <span>Create New Anime Title Entry</span>
            </Button>
            <Button
              variant="outline"
              className="border-border/60 h-10 w-full cursor-pointer justify-start gap-2.5 text-xs font-medium"
            >
              <Upload className="size-4 shrink-0 text-cyan-400" />
              <span>Upload Episode & Subtitle Files</span>
            </Button>
            <Button
              variant="outline"
              className="border-border/60 h-10 w-full cursor-pointer justify-start gap-2.5 text-xs font-medium"
            >
              <RefreshCw className="size-4 shrink-0 text-purple-400" />
              <span>Flush CDN Cache & Edge Nodes</span>
            </Button>
            <Button
              variant="outline"
              className="border-border/60 h-10 w-full cursor-pointer justify-start gap-2.5 text-xs font-medium"
            >
              <ExternalLink className="size-4 shrink-0 text-amber-400" />
              <span>View Public Streaming Site</span>
            </Button>
          </CardContent>
          <div className="border-border/60 bg-muted/20 rounded-b-xl border-t p-4 text-center">
            <span className="text-muted-foreground text-[11px]">
              Connected Node: <strong className="text-foreground">Edge-Tokyo-01</strong> (Latency
              14ms)
            </span>
          </div>
        </Card>
      </div>

      {/* Bottom Table: Recent System & Moderation Log */}
      <Card className="border-border/60 shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold">Recent System & Studio Audit Logs</CardTitle>
            <CardDescription className="text-xs">
              Latest administrative changes, episode releases, and moderation actions.
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground cursor-pointer gap-1 text-xs"
          >
            <span>View All Logs</span>
            <MoreHorizontal className="size-3.5" />
          </Button>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow className="border-border/60">
                <TableHead className="pl-6 text-xs">Operator / User</TableHead>
                <TableHead className="text-xs">Action Performed</TableHead>
                <TableHead className="text-xs">Target Asset</TableHead>
                <TableHead className="text-xs">Time</TableHead>
                <TableHead className="pr-6 text-right text-xs">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <TableRow key={i} className="border-border/60">
                      <TableCell className="pl-6">
                        <Skeleton className="h-6 w-32 rounded" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-28 rounded" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24 rounded" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-16 rounded" />
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <Skeleton className="ml-auto h-5 w-16 rounded" />
                      </TableCell>
                    </TableRow>
                  ))
                : recentActivities.map((act) => (
                    <TableRow key={act.id} className="border-border/60">
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-2.5">
                          <Avatar className="border-border/60 size-7 rounded-md border">
                            <AvatarImage src={act.user.avatar} alt={act.user.name} />
                            <AvatarFallback className="bg-brand/10 text-brand rounded-md text-[10px] font-bold">
                              {act.user.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="text-xs leading-tight font-semibold">
                              {act.user.name}
                            </span>
                            <span className="text-muted-foreground text-[10px]">
                              {act.user.email}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs font-medium">{act.action}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">{act.target}</TableCell>
                      <TableCell className="text-muted-foreground/70 text-xs">
                        {act.timestamp}
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <Badge
                          variant="outline"
                          className={
                            act.status === "completed"
                              ? "border-emerald-500/30 bg-emerald-500/10 text-[10px] text-emerald-400"
                              : "border-amber-500/30 bg-amber-500/10 text-[10px] text-amber-400"
                          }
                        >
                          {act.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
