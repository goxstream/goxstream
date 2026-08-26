"use client";

import * as React from "react";
import { Search, Bell, Moon, Sun, CheckCircle2, AlertCircle, Radio } from "lucide-react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMounted } from "../hooks/use-mounted";
import { NOTIFICATIONS_DATA, CURRENT_USER } from "../lib/mock-data";

export function DashboardHeader() {
  const { theme, setTheme } = useTheme();
  const mounted = useIsMounted();
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border/60 bg-background/95 px-4 backdrop-blur-md transition-all">
      {/* Left: Sidebar Toggle & Breadcrumb */}
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4 border-border/60" />
        <Breadcrumb className="hidden sm:block">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard" className="text-xs font-medium">
                GoxStream Master
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-xs font-semibold text-brand">
                Overview Dashboard
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Center/Right Actions: Command Search, System Status, Theme Toggle, Notifications */}
      <div className="flex items-center gap-2.5">
        {/* Search Command Input Placeholder */}
        <div className="relative hidden md:flex items-center w-64 lg:w-80">
          <Search className="absolute left-2.5 size-4 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Search anime, episodes, users..."
            className="pl-8 pr-12 h-9 text-xs bg-muted/40 border-border/60 focus-visible:bg-background"
          />
          <div className="absolute right-2 flex items-center gap-0.5">
            <Kbd className="text-[10px] px-1 py-0.2">Ctrl</Kbd>
            <Kbd className="text-[10px] px-1 py-0.2">K</Kbd>
          </div>
        </div>

        {/* Live Cluster Health Badge */}
        <Badge
          variant="outline"
          className="hidden xl:flex items-center gap-1.5 text-[11px] font-medium py-1 px-2.5 border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
        >
          <Radio className="size-3 animate-pulse text-emerald-400" />
          <span>CDN Nodes: 100% Operational</span>
        </Badge>

        <Separator orientation="vertical" className="hidden sm:block h-4 border-border/60" />

        {/* Theme Toggle Button dengan Hydration Guard */}
        <Button
          variant="ghost"
          size="icon"
          className="size-9 rounded-lg border border-border/40 hover:bg-accent cursor-pointer"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          title="Toggle Theme"
        >
          {mounted ? (
            <>
              <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
              <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-brand" />
            </>
          ) : (
            <div className="size-4 rounded-full bg-muted animate-pulse" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* Notifications Popover */}
        <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
          <PopoverTrigger>
            <Button
              variant="ghost"
              size="icon"
              className="relative size-9 rounded-lg border border-border/40 hover:bg-accent cursor-pointer"
              title="Notifications"
            >
              <Bell className="size-4 text-foreground" />
              <span className="absolute top-1.5 right-1.5 flex size-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
                <span className="relative inline-flex rounded-full size-2 bg-brand"></span>
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0 rounded-xl border-border/60 shadow-md" align="end">
            <div className="flex items-center justify-between border-b border-border/60 px-4 py-3 bg-muted/30">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold">Admin Alerts</span>
                <Badge variant="secondary" className="text-[10px] h-4 bg-brand/10 text-brand">
                  3 New
                </Badge>
              </div>
              <Button variant="ghost" className="text-[11px] h-6 px-2 text-muted-foreground">
                Mark all read
              </Button>
            </div>
            <div className="divide-y divide-border/60 max-h-72 overflow-y-auto">
              {NOTIFICATIONS_DATA.map((n) => (
                <div key={n.id} className="flex gap-3 p-3 text-xs hover:bg-accent/40 transition-colors">
                  {n.type === "success" && (
                    <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                  )}
                  {n.type === "alert" && (
                    <AlertCircle className="size-4 text-amber-400 shrink-0 mt-0.5" />
                  )}
                  {n.type === "info" && (
                    <Bell className="size-4 text-brand shrink-0 mt-0.5" />
                  )}
                  <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                    <span className="font-semibold text-foreground truncate">{n.title}</span>
                    <span className="text-[11px] text-muted-foreground leading-normal">
                      {n.description}
                    </span>
                    <span className="text-[10px] text-muted-foreground/70 mt-1">{n.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Quick User Avatar */}
        <Avatar className="h-8 w-8 rounded-lg border border-border/60 cursor-pointer transition-transform hover:scale-105">
          <AvatarImage src={CURRENT_USER.avatar} alt={CURRENT_USER.name} />
          <AvatarFallback className="rounded-lg bg-brand/10 text-brand font-semibold text-xs">
            AV
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
