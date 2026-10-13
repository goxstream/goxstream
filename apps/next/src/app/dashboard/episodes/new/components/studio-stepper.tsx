"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { STUDIO_STEPS } from "../constants";

export function StudioStepper() {
  const pathname = usePathname();

  return (
    <div className="no-scrollbar border-border/60 bg-card flex w-full min-w-0 items-center gap-1 overflow-x-auto rounded-xl border p-1 sm:grid sm:grid-cols-4">
      {STUDIO_STEPS.map((step) => {
        const isActive = pathname === step.href;
        return (
          <Link
            key={step.id}
            href={step.href}
            className={cn(
              "ring-offset-background focus-visible:ring-ring inline-flex flex-1 shrink-0 items-center justify-center rounded-lg px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden",
              isActive
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
            )}
          >
            {step.label}
          </Link>
        );
      })}
    </div>
  );
}
