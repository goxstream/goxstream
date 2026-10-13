"use client";

import { ShieldCheck, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ModerationHeaderProps {
  onClearDismissed: () => void;
}

export function ModerationHeader({ onClearDismissed }: ModerationHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-foreground text-2xl font-bold tracking-tight">Moderation Queue</h1>
        <p className="text-muted-foreground text-sm">
          Review reported episode comments, manage community safety, and take swift moderation
          actions.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onClearDismissed}
          className="border-border/60 h-9 gap-1.5 text-xs"
        >
          <CheckCheck className="size-4" />
          <span>Clear Dismissed</span>
        </Button>
      </div>
    </div>
  );
}
