"use client";

import Link from "next/link";
import { Calendar, Settings, ShieldCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { getImageStyle } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import type { UserProfile } from "@/types/user";

interface ProfileHeaderProps {
  user?: UserProfile | null;
  isLoading?: boolean;
}

export function ProfileHeader({ user, isLoading }: ProfileHeaderProps) {
  if (isLoading || !user) {
    return (
      <div className="border-border/60 bg-card relative overflow-hidden rounded-2xl border shadow-xs">
        <div className="bg-muted relative h-44 w-full sm:h-56">
          <Skeleton className="size-full" />
        </div>
        <div className="relative z-20 -mt-16 flex flex-col items-start justify-between gap-4 px-6 pt-0 pb-6 sm:-mt-20 sm:flex-row sm:items-end">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-end">
            <Skeleton className="border-background size-28 rounded-full border-4 sm:size-36" />
            <div className="flex flex-col gap-2 sm:pb-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="mt-2 h-4 w-64" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isBannerGradient = user.bannerUrl && user.bannerUrl.startsWith("linear-gradient");
  const hasBanner = Boolean(user.bannerUrl && user.bannerUrl.trim() !== "");

  return (
    <div className="border-border/60 bg-card relative overflow-hidden rounded-2xl border shadow-xs">
      {/* Banner */}
      <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 sm:h-56">
        {hasBanner &&
          (isBannerGradient ? (
            <div className="absolute inset-0 size-full" style={getImageStyle(user.bannerUrl!)} />
          ) : (
            <img
              src={user.bannerUrl}
              alt={user.displayName}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 size-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ))}
        <div className="from-background via-background/40 absolute inset-0 z-10 bg-gradient-to-t to-transparent" />
      </div>

      {/* Profile Details Overlay Container */}
      <div className="relative z-20 -mt-16 flex flex-col items-start justify-between gap-4 px-6 pt-0 pb-6 sm:-mt-20 sm:flex-row sm:items-end">
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-end">
          {/* Avatar */}
          <Avatar className="border-background ring-primary/20 bg-card size-28 border-4 shadow-md ring-2 sm:size-36">
            {user.avatarUrl ? <AvatarImage src={user.avatarUrl} alt={user.displayName} /> : null}
            <AvatarFallback className="bg-primary/10 text-primary text-3xl font-bold">
              {user.displayName ? user.displayName.substring(0, 2).toUpperCase() : "US"}
            </AvatarFallback>
          </Avatar>

          {/* User Information */}
          <div className="flex flex-col gap-1 sm:pb-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-foreground text-2xl font-extrabold tracking-tight drop-shadow-xs sm:text-3xl">
                {user.displayName}
              </h1>
              {user.isVip && (
                <Badge
                  variant="secondary"
                  className="gap-1 border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-xs font-bold text-amber-500 shadow-2xs"
                >
                  {user.vipTier || "VIP Member"}
                </Badge>
              )}
            </div>

            <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-xs">
              <span className="text-foreground/80 font-medium">@{user.username}</span>
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

            <p className="text-muted-foreground mt-2 line-clamp-2 max-w-xl text-sm">{user.bio}</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto sm:pb-2">
          <Link
            href="/settings"
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className:
                "border-border/80 hover:bg-muted/70 flex-1 cursor-pointer gap-2 rounded-xl text-xs font-medium sm:flex-none",
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
