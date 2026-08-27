"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Bookmark, History, Settings, Crown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useUserNav } from "@/hooks/use-user-nav";
import { cn } from "@/lib/utils";

const USER_HUB_TABS = [
  { label: "Profile Overview", href: "/profile", icon: User },
  { label: "My Watchlist", href: "/watchlist", icon: Bookmark },
  { label: "Watch History", href: "/history", icon: History },
  { label: "Account Settings", href: "/settings", icon: Settings },
];

export function UserAreaSidebar() {
  const pathname = usePathname();
  const { user, isLoading } = useUserNav();

  return (
    <aside className="w-full">
      {/* Vidio-Style Customer Portal Sidebar Container */}
      <div className="p-3 sm:p-4 rounded-2xl bg-card/70 backdrop-blur-md border border-border/60 shadow-xs space-y-4">
        {/* User Mini Profile Header (Tablet & Desktop) */}
        {isLoading ? (
          <div className="hidden md:flex items-center gap-3 p-2">
            <Skeleton className="size-11 rounded-full shrink-0" />
            <div className="space-y-2 flex-1 min-w-0">
              <Skeleton className="h-4 w-3/4 rounded" />
              <Skeleton className="h-3 w-1/2 rounded" />
            </div>
          </div>
        ) : user ? (
          <div className="hidden md:flex items-center gap-3 p-2">
            <Avatar className="size-11 border border-border/80 shadow-xs shrink-0">
              <AvatarImage src={user.avatarUrl || undefined} alt={user.displayName} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                {user.displayName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm truncate text-foreground">
                  {user.displayName}
                </span>
                {user.isVip && (
                  <Badge variant="secondary" className="px-1 py-0 text-[10px] h-4 bg-amber-500/10 text-amber-500 border-amber-500/20 font-bold gap-0.5 shrink-0">
                    <Crown className="size-2.5 fill-amber-500" />
                    VIP
                  </Badge>
                )}
              </div>
              <span className="text-xs text-muted-foreground truncate">
                @{user.username}
              </span>
            </div>
          </div>
        ) : null}

        {isLoading || user ? (
          <Separator className="hidden md:block bg-border/60" />
        ) : null}

        {/* Navigation Tabs (Vertical on Tablet/Desktop, Horizontal Scroll on Mobile) */}
        <nav className="flex md:flex-col gap-1 sm:gap-1.5 overflow-x-auto scrollbar-none py-0.5">
          {USER_HUB_TABS.map((tab) => {
            const isActive = pathname === tab.href;
            const Icon = tab.icon;

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "px-3.5 py-2.5 text-xs sm:text-sm font-medium rounded-xl flex items-center gap-3 transition-all whitespace-nowrap shrink-0 md:w-full",
                  isActive
                    ? "bg-primary/10 text-primary font-bold border-l-0 md:border-l-4 border-primary shadow-2xs md:rounded-l-xs md:rounded-r-xl"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                )}
              >
                <Icon className={cn("size-4 shrink-0", isActive ? "text-primary" : "text-muted-foreground")} />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

