"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  Tv,
  Sparkles,
  Calendar,
  Compass,
  Film,
  LogIn,
  UserPlus,
  LayoutDashboard,
  User,
  Bookmark,
  History,
  Settings,
  LogOut,
  Crown,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { LogoBrand } from "@/components/logo-brand";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useUserNav } from "@/hooks/use-user-nav";

const ICON_MAP: Record<string, React.ElementType> = {
  Compass,
  Sparkles,
  Tv,
  Calendar,
  Film,
};

interface MobileNavProps {
  navItems: Array<{ label: string; href: string; iconName?: string }>;
}

export function MobileNav({ navItems }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const { user, isLoading, logout } = useUserNav();

  const isStaff = user?.role && user.role !== "user";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden size-9 rounded-lg"
            aria-label="Toggle Navigation Menu"
          />
        }
      >
        <Menu className="size-5 text-foreground" />
      </SheetTrigger>

      <SheetContent side="right" className="w-[300px] sm:w-[360px] bg-background border-border p-6 flex flex-col justify-between">
        <div className="space-y-6">
          <SheetHeader className="p-0 text-left">
            <SheetTitle>
              <LogoBrand href="/" size="lg" />
            </SheetTitle>
          </SheetHeader>

          {/* User Header Info if Logged In */}
          {user && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border/60">
              <Avatar className="size-10 border border-border">
                <AvatarImage src={user.avatarUrl || undefined} alt={user.displayName} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                  {user.displayName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0 flex-1">
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
          )}

          <nav className="flex flex-col gap-1.5 pt-2">
            {navItems.map((item) => {
              const Icon = (item.iconName && ICON_MAP[item.iconName]) || Tv;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                >
                  <Icon className="size-4 text-primary" />
                  {item.label}
                </Link>
              );
            })}

            <Link
              href="/activate"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
            >
              <Tv className="size-4 text-primary" />
              Pair TV Device
            </Link>

            {/* Authenticated User Links */}
            {user && (
              <>
                <div className="my-2 border-t border-border/60" />

                {isStaff && (
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold text-primary hover:bg-primary/10 transition-colors"
                  >
                    <LayoutDashboard className="size-4 text-primary" />
                    Admin Dashboard
                  </Link>
                )}

                <Link
                  href="/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                >
                  <User className="size-4 text-muted-foreground" />
                  Profile Overview
                </Link>

                <Link
                  href="/watchlist"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                >
                  <Bookmark className="size-4 text-muted-foreground" />
                  My Watchlist
                </Link>

                <Link
                  href="/history"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                >
                  <History className="size-4 text-muted-foreground" />
                  Watch History
                </Link>

                <Link
                  href="/settings"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                >
                  <Settings className="size-4 text-muted-foreground" />
                  Settings
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* Drawer Bottom Actions */}
        <div className="space-y-3 pt-6 border-t border-border">
          {isLoading ? (
            <Skeleton className="h-11 w-full rounded-lg" />
          ) : user ? (
            <Button
              variant="destructive"
              size="lg"
              onClick={() => {
                setOpen(false);
                logout();
              }}
              className="w-full h-11 rounded-lg font-medium justify-center gap-2"
            >
              <LogOut className="size-4" />
              Sign Out
            </Button>
          ) : (
            <>
              <Link
                href="/signup"
                onClick={() => setOpen(false)}
                className={buttonVariants({
                  variant: "default",
                  size: "lg",
                  className: "w-full h-11 rounded-lg font-semibold justify-center gap-2",
                })}
              >
                <UserPlus className="size-4" />
                Create Free Account
              </Link>

              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className={buttonVariants({
                  variant: "outline",
                  size: "lg",
                  className: "w-full h-11 rounded-lg font-medium justify-center gap-2",
                })}
              >
                <LogIn className="size-4 text-muted-foreground" />
                Sign In
              </Link>
            </>
          )}

          <p className="text-xs text-center text-muted-foreground pt-1">
            Fast • Ad-Free • 1080p Simulcasts
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}

