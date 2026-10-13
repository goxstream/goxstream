"use client";

import { Crown, Mail, Calendar, Eye, Shield, Tv, Clock } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
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
      <SheetContent className="w-full overflow-y-auto p-6 sm:max-w-md">
        <SheetHeader className="text-left">
          <SheetTitle className="text-xl font-bold">User Details</SheetTitle>
          <SheetDescription className="text-muted-foreground text-xs">
            Complete account profile, watching statistics, and quick administrative actions.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 flex flex-col gap-6">
          {/* User Header Profile */}
          <div className="flex items-center gap-4">
            <Avatar className="border-border/60 size-16 border">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-sm font-semibold">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h3 className="text-foreground font-semibold">{user.name}</h3>
                {user.membershipTier === "vip_pro" && (
                  <Badge
                    variant="secondary"
                    className="gap-1 border-amber-500/20 bg-amber-500/10 text-[10px] font-medium text-amber-500"
                  >
                    <Crown className="size-3" />
                    <span>VIP PRO</span>
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground text-xs">@{user.username}</p>
              <div className="text-muted-foreground flex items-center gap-1 text-xs">
                <Mail className="size-3" />
                <span>{user.email}</span>
              </div>
            </div>
          </div>

          <Separator className="bg-border/60" />

          {/* Quick Account Info Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="border-border/60 bg-card flex flex-col gap-1 rounded-md border p-2.5">
              <span className="text-muted-foreground flex items-center gap-1 font-medium">
                <Shield className="size-3" /> Role
              </span>
              <span className="text-foreground font-semibold capitalize">
                {user.role.replace("_", " ")}
              </span>
            </div>
            <div className="border-border/60 bg-card flex flex-col gap-1 rounded-md border p-2.5">
              <span className="text-muted-foreground flex items-center gap-1 font-medium">
                <Clock className="size-3" /> Account Status
              </span>
              <span className="text-foreground font-semibold capitalize">{user.status}</span>
            </div>
            <div className="border-border/60 bg-card flex flex-col gap-1 rounded-md border p-2.5">
              <span className="text-muted-foreground flex items-center gap-1 font-medium">
                <Calendar className="size-3" /> Registered
              </span>
              <span className="text-foreground font-semibold">
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="border-border/60 bg-card flex flex-col gap-1 rounded-md border p-2.5">
              <span className="text-muted-foreground flex items-center gap-1 font-medium">
                <Eye className="size-3" /> Last Active
              </span>
              <span className="text-foreground font-semibold">
                {new Date(user.lastActiveAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <Separator className="bg-border/60" />

          {/* Watch Statistics */}
          <div className="flex flex-col gap-3">
            <h4 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Anime Watching Activity
            </h4>
            <div className="border-border/60 bg-muted/20 flex flex-col gap-2 rounded-lg border p-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Tv className="size-3.5" /> Total Episodes Watched:
                </span>
                <span className="text-foreground font-bold">
                  {user.watchHistory.totalWatchedEpisodes} eps
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Clock className="size-3.5" /> Watch Time:
                </span>
                <span className="text-foreground font-bold">
                  {user.watchHistory.totalWatchTimeHours} hrs
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Favorite Genre:</span>
                <span className="text-foreground font-medium">
                  {user.watchHistory.favoriteGenre}
                </span>
              </div>
              <Separator className="bg-border/40 my-1" />
              <div className="flex flex-col gap-0.5">
                <span className="text-muted-foreground text-[11px]">Last Watched Title:</span>
                <span className="text-foreground truncate font-medium">
                  {user.watchHistory.lastWatchedTitle}
                </span>
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
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground w-full text-xs"
            >
              Send Password Reset Email
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
