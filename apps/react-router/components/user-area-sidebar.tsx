"use client";

import { Link, useLocation } from "react-router";
import { User, Bookmark, History, Settings, Crown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@goxstream/ui/components/avatar";
import { Badge } from "@goxstream/ui/components/badge";
import { Skeleton } from "@goxstream/ui/components/skeleton";
import { Separator } from "@goxstream/ui/components/separator";
import { useUserNav } from "@/hooks/use-user-nav";
import { cn } from "@/lib/utils";

const USER_HUB_TABS = [
  { label: "Profile Overview", href: "/profile", icon: User },
  { label: "My Watchlist", href: "/watchlist", icon: Bookmark },
  { label: "Watch History", href: "/history", icon: History },
  { label: "Account Settings", href: "/settings", icon: Settings },
];

export function UserAreaSidebar() {
  const { pathname } = useLocation();
  const { user, isLoading } = useUserNav();

  return (
    <aside className="w-full">
      <div className="bg-card/70 border-border/60 space-y-4 rounded-2xl border p-3 shadow-xs backdrop-blur-md sm:p-4">
        {/* User Mini Profile Header (Tablet & Desktop) */}
        {isLoading ? (
          <div className="hidden items-center gap-3 p-2 md:flex">
            <Skeleton className="size-11 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4 rounded" />
              <Skeleton className="h-3 w-1/2 rounded" />
            </div>
          </div>
        ) : user ? (
          <div className="hidden items-center gap-3 p-2 md:flex">
            <Avatar className="border-border/80 bg-card size-11 shrink-0 border shadow-xs">
              {user.avatarUrl ? <AvatarImage src={user.avatarUrl} alt={user.displayName} /> : null}
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                {user.displayName ? user.displayName.substring(0, 2).toUpperCase() : "US"}
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-foreground truncate text-sm font-bold">
                  {user.displayName}
                </span>
                {user.isVip && (
                  <Badge
                    variant="secondary"
                    className="h-4 shrink-0 gap-0.5 border-amber-500/20 bg-amber-500/10 px-1 py-0 text-[10px] font-bold text-amber-500"
                  >
                    <Crown className="size-2.5 fill-amber-500" />
                    VIP
                  </Badge>
                )}
              </div>
              <span className="text-muted-foreground truncate text-xs">@{user.username}</span>
            </div>
          </div>
        ) : null}

        {isLoading || user ? <Separator className="bg-border/60 hidden md:block" /> : null}

        {/* Navigation Tabs */}
        <nav className="scrollbar-none flex gap-1 overflow-x-auto py-0.5 sm:gap-1.5 md:flex-col">
          {USER_HUB_TABS.map((tab) => {
            const isActive = pathname === tab.href;
            const Icon = tab.icon;

            return (
              <Link
                key={tab.href}
                to={tab.href}
                className={cn(
                  "flex shrink-0 cursor-pointer items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-medium whitespace-nowrap transition-all sm:text-sm md:w-full",
                  isActive
                    ? "bg-primary/10 text-primary border-primary border-l-0 font-bold shadow-2xs md:rounded-l-xs md:rounded-r-xl md:border-l-4"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                )}
              >
                <Icon
                  className={cn(
                    "size-4 shrink-0",
                    isActive ? "text-primary" : "text-muted-foreground",
                  )}
                />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
