"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEpisodeForm } from "../context/episode-form-context";
import { STUDIO_NAVIGATION_MAP } from "../constants";

export function StudioFooterNav() {
  const pathname = usePathname();
  const { isSaving, handleSave } = useEpisodeForm();
  const currentNav = STUDIO_NAVIGATION_MAP[pathname];

  if (!currentNav) return null;

  return (
    <div className="border-border/60 mt-6 flex min-w-0 flex-col items-stretch justify-between gap-3 border-t pt-4 sm:flex-row sm:items-center">
      <div>
        {currentNav.prev ? (
          <Link href={currentNav.prev.href} className="block w-full sm:w-auto">
            <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs sm:w-auto">
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
          <Link href={currentNav.next.href} className="block w-full sm:w-auto">
            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90 w-full gap-1.5 text-xs sm:w-auto"
            >
              Next: {currentNav.next.label}
              <ArrowRight className="size-3.5" />
            </Button>
          </Link>
        ) : (
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            className="bg-primary text-primary-foreground hover:bg-primary/90 w-full gap-1.5 text-xs sm:w-auto"
          >
            <CheckCircle2 className="size-4" />
            {isSaving ? "Publishing..." : "Publish Episode"}
          </Button>
        )}
      </div>
    </div>
  );
}
