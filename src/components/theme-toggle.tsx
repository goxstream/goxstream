"use client";

import * as React from "react";
import { Moon, Sun, Laptop } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="size-8 sm:size-9 rounded-lg border border-border/50 shrink-0">
        <Sun className="size-4 text-muted-foreground" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex size-8 sm:size-9 items-center justify-center rounded-lg border border-border/60 bg-background/50 hover:bg-muted/80 text-foreground transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0">
        <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
        <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-sky-400" />
        <span className="sr-only">Toggle theme</span>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-36 rounded-lg p-1 shadow-sm border border-border">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium rounded-md cursor-pointer"
        >
          <Sun className="size-3.5 text-amber-500" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium rounded-md cursor-pointer"
        >
          <Moon className="size-3.5 text-sky-400" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium rounded-md cursor-pointer"
        >
          <Laptop className="size-3.5 text-muted-foreground" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
