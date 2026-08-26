"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Play, Sparkles, Calendar, Compass } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { MobileNav } from "@/components/mobile-nav";
import { SearchDialog } from "@/components/search-dialog";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Browse", href: "/browse", iconName: "Compass" },
  { label: "Trending", href: "/trending", iconName: "Sparkles" },
  { label: "Schedule", href: "/schedule", iconName: "Calendar" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="size-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-xs shadow-primary/20 group-hover:scale-105 transition-transform">
              <Play className="size-4 fill-primary-foreground stroke-primary-foreground ml-0.5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-none tracking-tight text-foreground">
                Gox<span className="text-primary">Stream</span>
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                Anime Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* Search Trigger */}
          <SearchDialog />

          {/* Theme Mode Toggle */}
          <ThemeToggle />

          {/* Sign In CTA */}
          <Link
            href="#watch"
            className={buttonVariants({ variant: "default", size: "sm", className: "hidden sm:inline-flex rounded-lg font-semibold shadow-xs" })}
          >
            Sign In
          </Link>

          {/* Mobile Sheet Nav */}
          <MobileNav navItems={NAV_ITEMS} />
        </div>
      </div>
    </header>
  );
}
