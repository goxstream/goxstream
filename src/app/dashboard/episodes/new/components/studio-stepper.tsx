"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: "basic", label: "1. Basic Info", href: "/dashboard/episodes/new/basic" },
  { id: "sources", label: "2. Video Sources", href: "/dashboard/episodes/new/sources" },
  { id: "subtitles", label: "3. Subs & Audio", href: "/dashboard/episodes/new/subtitles" },
  { id: "publish", label: "4. Publish", href: "/dashboard/episodes/new/publish" },
];

export function StudioStepper() {
  const pathname = usePathname();

  return (
    <div className="grid grid-cols-4 w-full h-11 border border-border/60 bg-card p-1 rounded-xl">
      {STEPS.map((step) => {
        const isActive = pathname === step.href;
        return (
          <Link
            key={step.id}
            href={step.href}
            className={cn(
              "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold ring-offset-background transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              isActive
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            {step.label}
          </Link>
        );
      })}
    </div>
  );
}
