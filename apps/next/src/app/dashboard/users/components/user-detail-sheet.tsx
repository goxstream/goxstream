"use client";

import { Crown, Mail, Calendar, Eye, Shield, Tv, Clock } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { UserAccount } from "../types";

interface UserDetailSheetProps {
  user: UserAccount | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onToggleStatus: (userId: string) => void;
}

export function UserDetailSheet({
  user,
  isOpen,
  onOpenChange,
  onToggleStatus,
}: UserDetailSheetProps) {
  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto p-6">
        <SheetHeader className="text-left">
          <SheetTitle className="text-xl font-bold">User Details</SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">
            Complete account profile, watching statistics, and quick administrative actions.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 flex flex-col gap-6">
          {/* User Header Profile */}
          <div className="flex items-center gap-4">
            <Avatar className="size-16 border border-border/60">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-sm font-semibold">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">{user.name}</h3>
                {user.membershipTier === "vip_pro" && (
                  <Badge variant="secondary" className="gap-1 bg-amber-500/10 text-amber-500 text-[10px] font-medium border-amber-500/20">
                    <Crown className="size-3" />
                    <span>VIP PRO</span>
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">@{user.username}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Mail className="size-3" />
                <span>{user.email}</span>
              </div>
            </div>
          </div>

          <Separator className="bg-border/60" />

          {/* Quick Account Info Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex flex-col gap-1 rounded-md border border-border/60 p-2.5 bg-card">
              <span className="text-muted-foreground font-medium flex items-center gap-1">
                <Shield className="size-3" /> Role
              </span>
              <span className="font-semibold capitalize text-foreground">{user.role.replace("_", " ")}</span>
            </div>
            <div className="flex flex-col gap-1 rounded-md border border-border/60 p-2.5 bg-card">
              <span className="text-muted-foreground font-medium flex items-center gap-1">
                <Clock className="size-3" /> Account Status
              </span>
              <span className="font-semibold capitalize text-foreground">{user.status}</span>
            </div>
            <div className="flex flex-col gap-1 rounded-md border border-border/60 p-2.5 bg-card">
              <span className="text-muted-foreground font-medium flex items-center gap-1">
                <Calendar className="size-3" /> Registered
              </span>
              <span className="font-semibold text-foreground">
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex flex-col gap-1 rounded-md border border-border/60 p-2.5 bg-card">
              <span className="text-muted-foreground font-medium flex items-center gap-1">
                <Eye className="size-3" /> Last Active
              </span>
              <span className="font-semibold text-foreground">
                {new Date(user.lastActiveAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <Separator className="bg-border/60" />

          {/* Watch Statistics */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Anime Watching Activity
            </h4>
            <div className="rounded-lg border border-border/60 bg-muted/20 p-3 flex flex-col gap-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Tv className="size-3.5" /> Total Episodes Watched:
                </span>
                <span className="font-bold text-foreground">{user.watchHistory.totalWatchedEpisodes} eps</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Clock className="size-3.5" /> Watch Time:
                </span>
                <span className="font-bold text-foreground">{user.watchHistory.totalWatchTimeHours} hrs</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Favorite Genre:</span>
                <span className="font-medium text-foreground">{user.watchHistory.favoriteGenre}</span>
              </div>
              <Separator className="my-1 bg-border/40" />
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] text-muted-foreground">Last Watched Title:</span>
                <span className="font-medium text-foreground truncate">{user.watchHistory.lastWatchedTitle}</span>
              </div>
            </div>
          </div>

          <Separator className="bg-border/60" />

          {/* Admin Action Buttons */}
          <div className="flex flex-col gap-2">
            <Button
              variant={user.status === "suspended" ? "default" : "outline"}
              size="sm"
              className="w-full text-xs"
              onClick={() => onToggleStatus(user.id)}
            >
              {user.status === "suspended" ? "Unsuspend Account" : "Suspend Account"}
            </Button>
            <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground hover:text-foreground">
              Send Password Reset Email
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
