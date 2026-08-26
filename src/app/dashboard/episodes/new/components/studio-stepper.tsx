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
    <div className="flex items-center overflow-x-auto no-scrollbar w-full min-w-0 p-1 gap-1 rounded-xl border border-border/60 bg-card sm:grid sm:grid-cols-4">
      {STEPS.map((step) => {
        const isActive = pathname === step.href;
        return (
          <Link
            key={step.id}
            href={step.href}
            className={cn(
              "flex-1 shrink-0 inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3.5 py-2 text-xs font-semibold ring-offset-background transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
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
