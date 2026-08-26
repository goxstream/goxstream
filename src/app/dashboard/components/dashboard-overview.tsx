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
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

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
import { TRAFFIC_CHART_CONFIG } from "../constants";
import { TRAFFIC_DATA, RECENT_ACTIVITIES } from "../lib/mock-data";

export function DashboardOverview() {
  const mounted = useIsMounted();

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      {/* Top Banner / Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-brand">
              Dashboard Control Center
            </h1>
            <Badge variant="outline" className="border-brand/30 bg-brand/10 text-brand text-xs font-semibold">
              v1.0 Live
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Real-time infrastructure health, streaming bandwidth, catalog state, and moderation metrics.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" className="h-9 text-xs border-border/60 gap-1.5 cursor-pointer">
            <RefreshCw className="size-3.5 text-muted-foreground" />
            <span>Sync Stats</span>
          </Button>
          <Button size="sm" className="h-9 text-xs gap-1.5 bg-brand text-brand-foreground hover:bg-brand/90 font-semibold cursor-pointer">
            <Plus className="size-4" />
            <span>New Anime / Episode</span>
          </Button>
        </div>
      </div>

      {/* 4 Stat Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Anime Titles */}
        <Card className="border-border/60 shadow-xs hover:border-border transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Active Anime
            </CardTitle>
            <div className="p-2 rounded-md bg-brand/10 text-brand">
              <Tv className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold font-brand tracking-tight">1,248</div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-500 mt-1 font-medium">
              <TrendingUp className="size-3.5" />
              <span>+14 titles this month</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Total Episodes Streamed */}
        <Card className="border-border/60 shadow-xs hover:border-border transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Episodes Streamed
            </CardTitle>
            <div className="p-2 rounded-md bg-cyan-500/10 text-cyan-400">
              <PlayCircle className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold font-brand tracking-tight">8,920</div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-500 mt-1 font-medium">
              <TrendingUp className="size-3.5" />
              <span>+142 episode uploads</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Concurrent Viewers */}
        <Card className="border-border/60 shadow-xs hover:border-border transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Concurrent Viewers
            </CardTitle>
            <div className="p-2 rounded-md bg-indigo-500/10 text-indigo-400">
              <Users className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold font-brand tracking-tight">12,500</div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-500 mt-1 font-medium">
              <TrendingUp className="size-3.5" />
              <span>+18.4% peak usage</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: CDN Traffic */}
        <Card className="border-border/60 shadow-xs hover:border-border transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              CDN Bandwidth
            </CardTitle>
            <div className="p-2 rounded-md bg-purple-500/10 text-purple-400">
              <Activity className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold font-brand tracking-tight">38.6 Gbps</div>
            <div className="flex items-center gap-1.5 text-xs text-amber-500 mt-1 font-medium">
              <TrendingDown className="size-3.5" />
              <span>Normal operating capacity</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Streaming Traffic Chart & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Streaming Traffic Chart */}
        <Card className="lg:col-span-2 border-border/60 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold">Live Streaming Traffic & Concurrents</CardTitle>
              <CardDescription className="text-xs">
                Real-time active viewers and bandwidth consumption across all edge nodes today.
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-[11px] border-brand/30 text-brand">
              24-Hour Graph
            </Badge>
          </CardHeader>
          <CardContent className="pt-2">
            {mounted ? (
              <ChartContainer config={TRAFFIC_CHART_CONFIG} className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={TRAFFIC_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorStreams" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#34d094" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#34d094" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
                    <XAxis dataKey="time" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
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
              <Skeleton className="h-72 w-full rounded-lg bg-muted/30" />
            )}
          </CardContent>
        </Card>

        {/* Right 1 Col: Quick Control Shortcuts */}
        <Card className="border-border/60 shadow-xs flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <ShieldCheck className="size-4 text-brand" />
              Quick Action Studio
            </CardTitle>
            <CardDescription className="text-xs">
              Frequent management actions for content managers & admins.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2.5 my-auto">
            <Button variant="outline" className="w-full justify-start gap-2.5 h-10 border-border/60 text-xs font-medium cursor-pointer">
              <Plus className="size-4 text-brand shrink-0" />
              <span>Create New Anime Title Entry</span>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2.5 h-10 border-border/60 text-xs font-medium cursor-pointer">
              <Upload className="size-4 text-cyan-400 shrink-0" />
              <span>Upload Episode & Subtitle Files</span>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2.5 h-10 border-border/60 text-xs font-medium cursor-pointer">
              <RefreshCw className="size-4 text-purple-400 shrink-0" />
              <span>Flush CDN Cache & Edge Nodes</span>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2.5 h-10 border-border/60 text-xs font-medium cursor-pointer">
              <ExternalLink className="size-4 text-amber-400 shrink-0" />
              <span>View Public Streaming Site</span>
            </Button>
          </CardContent>
          <div className="p-4 border-t border-border/60 bg-muted/20 rounded-b-xl text-center">
            <span className="text-[11px] text-muted-foreground">
              Connected Node: <strong className="text-foreground">Edge-Tokyo-01</strong> (Latency 14ms)
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
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground gap-1 cursor-pointer">
            <span>View All Logs</span>
            <MoreHorizontal className="size-3.5" />
          </Button>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow className="border-border/60">
                <TableHead className="text-xs pl-6">Operator / User</TableHead>
                <TableHead className="text-xs">Action Performed</TableHead>
                <TableHead className="text-xs">Target Asset</TableHead>
                <TableHead className="text-xs">Time</TableHead>
                <TableHead className="text-xs text-right pr-6">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {RECENT_ACTIVITIES.map((act) => (
                <TableRow key={act.id} className="border-border/60">
                  <TableCell className="pl-6">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="size-7 rounded-md border border-border/60">
                        <AvatarImage src={act.user.avatar} alt={act.user.name} />
                        <AvatarFallback className="rounded-md bg-brand/10 text-brand text-[10px] font-bold">
                          {act.user.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold leading-tight">{act.user.name}</span>
                        <span className="text-[10px] text-muted-foreground">{act.user.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-medium">{act.action}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{act.target}</TableCell>
                  <TableCell className="text-xs text-muted-foreground/70">{act.timestamp}</TableCell>
                  <TableCell className="text-right pr-6">
                    <Badge
                      variant="outline"
                      className={
                        act.status === "completed"
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px]"
                          : "border-amber-500/30 bg-amber-500/10 text-amber-400 text-[10px]"
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
