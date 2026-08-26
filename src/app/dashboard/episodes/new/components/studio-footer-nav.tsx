"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEpisodeForm } from "../context/episode-form-context";

const NAVIGATION_MAP: Record<string, { prev?: { href: string; label: string }; next?: { href: string; label: string } }> = {
  "/dashboard/episodes/new/basic": {
    next: { href: "/dashboard/episodes/new/sources", label: "Video Sources" },
  },
  "/dashboard/episodes/new/sources": {
    prev: { href: "/dashboard/episodes/new/basic", label: "Basic Info" },
    next: { href: "/dashboard/episodes/new/subtitles", label: "Subs & Audio" },
  },
  "/dashboard/episodes/new/subtitles": {
    prev: { href: "/dashboard/episodes/new/sources", label: "Video Sources" },
    next: { href: "/dashboard/episodes/new/publish", label: "Publish Settings" },
  },
  "/dashboard/episodes/new/publish": {
    prev: { href: "/dashboard/episodes/new/subtitles", label: "Subs & Audio" },
  },
};

export function StudioFooterNav() {
  const pathname = usePathname();
  const { isSaving, handleSave } = useEpisodeForm();
  const currentNav = NAVIGATION_MAP[pathname];

  if (!currentNav) return null;

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-border/60 mt-6 min-w-0">
      <div>
        {currentNav.prev ? (
          <Link href={currentNav.prev.href} className="w-full sm:w-auto block">
            <Button variant="outline" size="sm" className="w-full sm:w-auto gap-1.5 text-xs">
              <ArrowLeft className="size-3.5" />
              Previous: {currentNav.prev.label}
            </Button>
          </Link>
        ) : (
          <div />
        )}
      </div>

      <div className="flex items-center gap-2">
        {currentNav.next ? (
          <Link href={currentNav.next.href} className="w-full sm:w-auto block">
            <Button size="sm" className="w-full sm:w-auto gap-1.5 text-xs bg-primary text-primary-foreground hover:bg-primary/90">
              Next: {currentNav.next.label}
              <ArrowRight className="size-3.5" />
            </Button>
          </Link>
        ) : (
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            className="w-full sm:w-auto gap-1.5 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <CheckCircle2 className="size-4" />
            {isSaving ? "Publishing..." : "Publish Episode"}
          </Button>
        )}
      </div>
    </div>
  );
}
