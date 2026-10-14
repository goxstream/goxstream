import { Link, useLocation } from "react-router";
import { Sparkles, Calendar, Compass, Tv } from "lucide-react";
import { buttonVariants } from "@goxstream/ui/components/button";
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
  const { pathname } = useLocation();

  return (
    <header className="border-border/60 bg-background/85 sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-2 px-2.5 sm:gap-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Main Nav */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-4 lg:gap-6">
          <LogoBrand href="/" size="md" hideTextOnMobile />

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Header Right Actions */}
        <div className="flex min-w-0 flex-1 shrink-0 items-center justify-end gap-1.5 sm:gap-2">
          {/* Search Trigger */}
          <SearchDialog />

          {/* Theme Mode Toggle */}
          <ThemeToggle />

          {/* User Nav Dropdown / Account CTA (Desktop Only) */}
          <div className="lg:border-border/40 hidden shrink-0 items-center gap-1.5 lg:flex lg:border-l lg:pl-1">
            <UserNav />
          </div>

          {/* Mobile Sheet Nav */}
          <MobileNav navItems={NAV_ITEMS} />
        </div>
      </div>
    </header>
  );
}
