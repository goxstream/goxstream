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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
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
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 shrink-0 rounded-lg sm:size-9 lg:hidden"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="text-foreground size-5" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="bg-background border-border inset-y-0 right-0 flex h-dvh max-h-dvh w-[85vw] max-w-[360px] flex-col justify-between overflow-hidden p-0 sm:w-[360px]"
      >
        {/* Hamburger Header (Fixed / Top) */}
        <div className="border-border/40 shrink-0 border-b px-6 pt-6 pb-4">
          <SheetHeader className="p-0 text-left">
            <SheetTitle>
              <LogoBrand href="/" size="lg" />
            </SheetTitle>
          </SheetHeader>
        </div>

        {/* Hamburger Body (Scrollable Main Content) */}
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-4">
          {/* User Header Info if Logged In */}
          {user && (
            <div className="bg-muted/50 border-border/60 flex items-center gap-3 rounded-xl border p-3">
              <Avatar className="border-border size-10 border">
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
          )}

          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const Icon = (item.iconName && ICON_MAP[item.iconName]) || Tv;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="text-muted-foreground hover:text-foreground hover:bg-muted/80 flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors"
                >
                  <Icon className="text-primary size-4" />
                  {item.label}
                </Link>
              );
            })}

            <Link
              href="/activate"
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:text-foreground hover:bg-muted/80 flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors"
            >
              <Tv className="text-primary size-4" />
              Pair TV Device
            </Link>

            {/* Authenticated User Links */}
            {user && (
              <>
                <div className="border-border/60 my-2 border-t" />

                {isStaff && (
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="text-primary hover:bg-primary/10 flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-semibold transition-colors"
                  >
                    <LayoutDashboard className="text-primary size-4" />
                    Admin Dashboard
                  </Link>
                )}

                <Link
                  href="/profile"
                  onClick={() => setOpen(false)}
                  className="text-muted-foreground hover:text-foreground hover:bg-muted/80 flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors"
                >
                  <User className="text-muted-foreground size-4" />
                  Profile Overview
                </Link>

                <Link
                  href="/watchlist"
                  onClick={() => setOpen(false)}
                  className="text-muted-foreground hover:text-foreground hover:bg-muted/80 flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors"
                >
                  <Bookmark className="text-muted-foreground size-4" />
                  My Watchlist
                </Link>

                <Link
                  href="/history"
                  onClick={() => setOpen(false)}
                  className="text-muted-foreground hover:text-foreground hover:bg-muted/80 flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors"
                >
                  <History className="text-muted-foreground size-4" />
                  Watch History
                </Link>

                <Link
                  href="/settings"
                  onClick={() => setOpen(false)}
                  className="text-muted-foreground hover:text-foreground hover:bg-muted/80 flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors"
                >
                  <Settings className="text-muted-foreground size-4" />
                  Settings
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* Hamburger Footer (Fixed / Bottom) */}
        <div className="border-border bg-background shrink-0 space-y-3 border-t p-6 pt-4">
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
              className="h-11 w-full justify-center gap-2 rounded-lg font-medium"
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
                  className: "h-11 w-full justify-center gap-2 rounded-lg font-semibold",
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
                  className: "h-11 w-full justify-center gap-2 rounded-lg font-medium",
                })}
              >
                <LogIn className="text-muted-foreground size-4" />
                Sign In
              </Link>
            </>
          )}

          <p className="text-muted-foreground pt-1 text-center text-xs">
            Fast • Ad-Free • 1080p Simulcasts
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
