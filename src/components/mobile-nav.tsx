"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Play, Tv, Sparkles, Calendar, Compass, Film } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 group"
              >
                <div className="size-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground group-hover:scale-105 transition-transform">
                  <Play className="size-4 fill-primary-foreground stroke-primary-foreground" />
                </div>
                <span className="font-bold text-xl tracking-tight text-foreground">
                  Gox<span className="text-primary">Stream</span>
                </span>
              </Link>
            </SheetTitle>
          </SheetHeader>

          <nav className="flex flex-col gap-1.5 pt-4">
            {navItems.map((item) => {
              const Icon = (item.iconName && ICON_MAP[item.iconName]) || Tv;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3.5 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                >
                  <Icon className="size-4 text-primary" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-3 pt-6 border-t border-border">
          <Link
            href="#watch"
            onClick={() => setOpen(false)}
            className={buttonVariants({
              variant: "default",
              size: "lg",
              className: "w-full h-11 rounded-lg font-semibold justify-center",
            })}
          >
            Start Watching Free
          </Link>

          <p className="text-xs text-center text-muted-foreground">
            Fast • Ad-Free • 1080p Simulcasts
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
