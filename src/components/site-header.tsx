"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Calendar, Compass, Tv } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { LogoBrand } from "@/components/logo-brand";
import { MobileNav } from "@/components/mobile-nav";
import { SearchDialog } from "@/components/search-dialog";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/user-nav";
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
      <div className="mx-auto flex h-16 max-w-7xl w-full items-center justify-between px-2.5 sm:px-6 lg:px-8 gap-2 sm:gap-4">
        {/* Brand Logo & Main Nav */}
        <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 shrink-0">
          <LogoBrand href="/" size="md" hideTextOnMobile />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap",
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
        <div className="flex items-center justify-end gap-1.5 sm:gap-2 flex-1 min-w-0 shrink-0">
          {/* Search Trigger */}
          <SearchDialog />

          {/* Theme Mode Toggle */}
          <ThemeToggle />

          {/* Pair TV Link (Extra Large Desktop Only) */}
          <div className="hidden 2xl:block">
            <Link
              href="/activate"
              className={buttonVariants({
                variant: "ghost",
                size: "sm",
                className: "rounded-lg text-xs gap-1.5 font-medium text-muted-foreground hover:text-foreground shrink-0",
              })}
            >
              <Tv className="size-3.5" />
              Pair TV
            </Link>
          </div>

          {/* User Nav Dropdown / Account CTA (Desktop Only) */}
          <div className="hidden lg:flex items-center gap-1.5 lg:pl-1 lg:border-l lg:border-border/40 shrink-0">
            <UserNav />
          </div>

          {/* Mobile Sheet Nav */}
          <MobileNav navItems={NAV_ITEMS} />
        </div>
      </div>
    </header>
  );
}


