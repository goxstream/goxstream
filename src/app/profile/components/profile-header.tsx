"use client";

import Link from "next/link";
import { Calendar, Settings, ShieldCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { getImageStyle } from "@/lib/utils";
import type { UserProfile } from "@/types/user";

interface ProfileHeaderProps {
  user: UserProfile;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-border/60 bg-card shadow-xs">
      {/* Banner */}
      <div
        className="h-44 sm:h-56 w-full relative bg-muted"
        style={getImageStyle(user.bannerUrl)}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
      </div>

      {/* Profile Details Overlay Container */}
      <div className="px-6 pb-6 pt-0 relative flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-16 sm:-mt-20">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
          {/* Avatar */}
          <Avatar className="size-28 sm:size-36 border-4 border-background ring-2 ring-primary/20 shadow-md">
            <AvatarImage src={user.avatarUrl} alt={user.displayName} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-2xl">
              {user.displayName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* User Information */}
          <div className="flex flex-col gap-1 sm:pb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                {user.displayName}
              </h1>
              {user.isVip && (
                <Badge variant="secondary" className="px-2 py-0.5 text-xs bg-amber-500/10 text-amber-500 border border-amber-500/30 font-bold gap-1">
                  {user.vipTier || "VIP Member"}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
              <span className="font-medium text-foreground/80">@{user.username}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="size-3.5" />
                Joined {user.joinDate}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="size-3.5 text-emerald-500" />
                Verified Account
              </span>
            </div>

            <p className="text-sm text-muted-foreground mt-2 max-w-xl line-clamp-2">
              {user.bio}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="sm:pb-2 self-stretch sm:self-auto flex items-center gap-2">
          <Link
            href="/settings"
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className: "rounded-xl font-medium gap-2 text-xs flex-1 sm:flex-none border-border/80 hover:bg-muted/70",
            })}
          >
            <Settings className="size-3.5" />
            Edit Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
