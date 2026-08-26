"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Bookmark, History, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const USER_HUB_TABS = [
  { label: "Profile Overview", href: "/profile", icon: User },
  { label: "My Watchlist", href: "/watchlist", icon: Bookmark },
  { label: "Watch History", href: "/history", icon: History },
  { label: "Account Settings", href: "/settings", icon: Settings },
];

export function UserHubNav() {
  const pathname = usePathname();

  return (
    <div className="w-full border-b border-border/60 bg-card/60 backdrop-blur-md sticky top-16 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2 scrollbar-none">
          {USER_HUB_TABS.map((tab) => {
            const isActive = pathname === tab.href;
            const Icon = tab.icon;

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "px-3.5 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 transition-all whitespace-nowrap shrink-0",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                )}
              >
                <Icon className="size-3.5" />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
