"use client";

import Link from "next/link";
import {
  User,
  Bookmark,
  History,
  Settings,
  LogOut,
  Crown,
  Sparkles,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MOCK_USER_PROFILE } from "@/lib/mock-user";

export function UserNav() {
  const user = MOCK_USER_PROFILE;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<button className="relative rounded-full focus:outline-hidden focus:ring-2 focus:ring-primary/40" />}>
        <Avatar className="size-9 border border-border/80 hover:border-primary/50 transition-colors shadow-xs">
          <AvatarImage src={user.avatarUrl} alt={user.displayName} />
          <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
            {user.displayName.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 align-end side-bottom bg-popover/95 backdrop-blur-md border border-border/80 shadow-md rounded-xl p-1.5" sideOffset={8}>
        <div className="flex items-center gap-2.5 p-2">
          <Avatar className="size-10 border border-border/60">
            <AvatarImage src={user.avatarUrl} alt={user.displayName} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
              {user.displayName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm truncate text-foreground">
                {user.displayName}
              </span>
              {user.isVip && (
                <Badge variant="secondary" className="px-1 py-0 text-[10px] h-4 bg-amber-500/10 text-amber-500 border-amber-500/20 font-bold gap-0.5">
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

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem render={<Link href="/profile" className="flex items-center gap-2.5 px-2 py-1.5 text-xs font-medium rounded-lg cursor-pointer hover:bg-muted/70" />}>
            <User className="size-4 text-muted-foreground" />
            <span>Profile Overview</span>
          </DropdownMenuItem>

          <DropdownMenuItem render={<Link href="/watchlist" className="flex items-center gap-2.5 px-2 py-1.5 text-xs font-medium rounded-lg cursor-pointer hover:bg-muted/70" />}>
            <Bookmark className="size-4 text-muted-foreground" />
            <span>My Watchlist</span>
            <Badge variant="outline" className="ml-auto text-[10px] px-1.5 py-0 h-4 font-normal">
              {user.stats.watchlistCount}
            </Badge>
          </DropdownMenuItem>

          <DropdownMenuItem render={<Link href="/history" className="flex items-center gap-2.5 px-2 py-1.5 text-xs font-medium rounded-lg cursor-pointer hover:bg-muted/70" />}>
            <History className="size-4 text-muted-foreground" />
            <span>Watch History</span>
          </DropdownMenuItem>

          <DropdownMenuItem render={<Link href="/settings" className="flex items-center gap-2.5 px-2 py-1.5 text-xs font-medium rounded-lg cursor-pointer hover:bg-muted/70" />}>
            <Settings className="size-4 text-muted-foreground" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem render={<Link href="/login" className="flex items-center gap-2.5 px-2 py-1.5 text-xs font-medium text-destructive rounded-lg cursor-pointer hover:bg-destructive/10" />}>
          <LogOut className="size-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
