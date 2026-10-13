"use client";

import * as React from "react";
import { Search, Bell, Moon, Sun, CheckCircle2, AlertCircle, Radio, Home } from "lucide-react";
import { useTheme } from "next-themes";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMounted } from "../hooks/use-mounted";
import { useDashboardHeader } from "../hooks/use-dashboard-header";
import { useDashboardOverview } from "../hooks/use-dashboard-overview";

export function DashboardHeader() {
  const { theme, setTheme } = useTheme();
  const mounted = useIsMounted();
  const { currentUser, notificationsOpen, setNotificationsOpen } = useDashboardHeader();
  const { notifications } = useDashboardOverview();

  return (
    <header className="border-border/60 bg-background/95 sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 backdrop-blur-md transition-all">
      {/* Left: Sidebar Toggle & Breadcrumb */}
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="border-border/60 mr-2 h-4" />
        <Breadcrumb className="hidden sm:block">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/dashboard"
                className="hover:text-foreground flex items-center text-xs font-medium"
                aria-label="Home"
              >
                <Home className="size-3.5" />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-brand text-xs font-semibold">
                Overview Dashboard
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Center/Right Actions: Command Search, System Status, Theme Toggle, Notifications */}
      <div className="flex items-center gap-2.5">
        {/* Search Command Input Placeholder */}
        <div className="relative hidden w-64 items-center md:flex lg:w-80">
          <Search className="text-muted-foreground pointer-events-none absolute left-2.5 size-4" />
          <Input
            type="search"
            placeholder="Search anime, episodes, users..."
            className="bg-muted/40 border-border/60 focus-visible:bg-background h-9 pr-12 pl-8 text-xs"
          />
          <div className="absolute right-2 flex items-center gap-0.5">
            <Kbd className="py-0.2 px-1 text-[10px]">Ctrl</Kbd>
            <Kbd className="py-0.2 px-1 text-[10px]">K</Kbd>
          </div>
        </div>

        {/* Live Cluster Health Badge */}
        <Badge
          variant="outline"
          className="hidden items-center gap-1.5 border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-400 xl:flex"
        >
          <Radio className="size-3 animate-pulse text-emerald-400" />
          <span>CDN Nodes: 100% Operational</span>
        </Badge>

        <Separator orientation="vertical" className="border-border/60 hidden h-4 sm:block" />

        {/* Theme Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          className="border-border/40 hover:bg-accent size-9 cursor-pointer rounded-lg border"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          title="Toggle Theme"
        >
          {mounted ? (
            <>
              <Sun className="size-4 scale-100 rotate-0 text-amber-500 transition-all dark:scale-0 dark:-rotate-90" />
              <Moon className="text-brand absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
            </>
          ) : (
            <div className="bg-muted size-4 animate-pulse rounded-full" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* Notifications Popover */}
        <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="border-border/40 hover:bg-accent relative size-9 cursor-pointer rounded-lg border"
              title="Notifications"
            >
              <Bell className="text-foreground size-4" />
              <span className="absolute top-1.5 right-1.5 flex size-2">
                <span className="bg-brand absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"></span>
                <span className="bg-brand relative inline-flex size-2 rounded-full"></span>
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="border-border/60 w-80 rounded-xl p-0 shadow-md" align="end">
            <div className="border-border/60 bg-muted/30 flex items-center justify-between border-b px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold">Admin Alerts</span>
                <Badge variant="secondary" className="bg-brand/10 text-brand h-4 text-[10px]">
                  {notifications.length} New
                </Badge>
              </div>
              <Button variant="ghost" className="text-muted-foreground h-6 px-2 text-[11px]">
                Mark all read
              </Button>
            </div>
            <div className="divide-border/60 max-h-72 divide-y overflow-y-auto">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="hover:bg-accent/40 flex gap-3 p-3 text-xs transition-colors"
                >
                  {n.type === "success" && (
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-400" />
                  )}
                  {n.type === "alert" && (
                    <AlertCircle className="mt-0.5 size-4 shrink-0 text-amber-400" />
                  )}
                  {n.type === "info" && <Bell className="text-brand mt-0.5 size-4 shrink-0" />}
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="text-foreground truncate font-semibold">{n.title}</span>
                    <span className="text-muted-foreground text-[11px] leading-normal">
                      {n.description}
                    </span>
                    <span className="text-muted-foreground/70 mt-1 text-[10px]">{n.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Quick User Avatar */}
        <Avatar className="border-border/60 h-8 w-8 cursor-pointer rounded-lg border transition-transform hover:scale-105">
          <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
          <AvatarFallback className="bg-brand/10 text-brand rounded-lg text-xs font-semibold">
            AV
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
