"use client";

import Link from "next/link";
import {
  User,
  Bookmark,
  History,
  Settings,
  LogOut,
  Crown,
  LayoutDashboard,
  LogIn,
  UserPlus,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserNav } from "@/hooks/use-user-nav";

export function UserNav() {
  const { user, isLoading, logout } = useUserNav();

  if (isLoading) {
    return <Skeleton className="size-8 shrink-0 rounded-full sm:size-9" />;
  }

  if (!user) {
    return (
      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <Link
          href="/login"
          className={buttonVariants({
            variant: "default",
            size: "sm",
            className:
              "h-8 shrink-0 gap-1.5 rounded-lg px-3 text-xs font-semibold shadow-xs sm:h-9",
          })}
        >
          <LogIn className="size-3.5" />
          <span>Sign In</span>
        </Link>
        <Link
          href="/signup"
          className={buttonVariants({
            variant: "outline",
            size: "sm",
            className:
              "hidden h-8 shrink-0 gap-1.5 rounded-lg px-3 text-xs font-semibold sm:h-9 2xl:inline-flex",
          })}
        >
          <UserPlus className="size-3.5" />
          <span>Create Account</span>
        </Link>
      </div>
    );
  }

  const isStaff = user.role && user.role !== "user";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="focus:ring-primary/40 relative shrink-0 cursor-pointer rounded-full focus:ring-2 focus:outline-hidden">
          <Avatar className="border-border/80 hover:border-primary/50 size-8 border shadow-xs transition-colors sm:size-9">
            <AvatarImage src={user.avatarUrl || undefined} alt={user.displayName} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
              {user.displayName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="align-end side-bottom bg-popover/95 border-border/80 w-56 rounded-xl border p-1.5 shadow-md backdrop-blur-md"
        sideOffset={8}
      >
        <div className="flex items-center gap-2.5 p-2">
          <Avatar className="border-border/60 size-10 border">
            <AvatarImage src={user.avatarUrl || undefined} alt={user.displayName} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
              {user.displayName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-foreground truncate text-sm font-semibold">
                {user.displayName}
              </span>
              {user.isVip && (
                <Badge
                  variant="secondary"
                  className="h-4 gap-0.5 border-amber-500/20 bg-amber-500/10 px-1 py-0 text-[10px] font-bold text-amber-500"
                >
                  <Crown className="size-2.5 fill-amber-500" />
                  VIP
                </Badge>
              )}
            </div>
            <span className="text-muted-foreground truncate text-xs">@{user.username}</span>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          {isStaff && (
            <DropdownMenuItem asChild>
              <Link
                href="/dashboard"
                className="text-primary hover:bg-primary/10 flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-xs font-semibold"
              >
                <LayoutDashboard className="text-primary size-4" />
                <span>Admin Dashboard</span>
              </Link>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem asChild>
            <Link
              href="/profile"
              className="hover:bg-muted/70 flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-xs font-medium"
            >
              <User className="text-muted-foreground size-4" />
              <span>Profile Overview</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              href="/watchlist"
              className="hover:bg-muted/70 flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-xs font-medium"
            >
              <Bookmark className="text-muted-foreground size-4" />
              <span>My Watchlist</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              href="/history"
              className="hover:bg-muted/70 flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-xs font-medium"
            >
              <History className="text-muted-foreground size-4" />
              <span>Watch History</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              href="/settings"
              className="hover:bg-muted/70 flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-xs font-medium"
            >
              <Settings className="text-muted-foreground size-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={logout}
          className="text-destructive hover:bg-destructive/10 focus:text-destructive focus:bg-destructive/10 flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-xs font-medium"
        >
          <LogOut className="size-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
