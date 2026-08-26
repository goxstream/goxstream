"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ReportedComment } from "../types";

interface ModerationActionModalProps {
  report: ReportedComment | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmAction: (reportId: string, actionType: "delete" | "mute" | "dismiss", duration?: string) => void;
}

export function ModerationActionModal({
  report,
  isOpen,
  onOpenChange,
  onConfirmAction,
}: ModerationActionModalProps) {
  const [muteDuration, setMuteDuration] = useState("24h");

  if (!report) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Take Moderation Action</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Apply enforcement on reported comment for <span className="font-semibold text-foreground">@{report.author.username}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2 text-xs">
          <div className="rounded-md border border-border/60 bg-muted/20 p-3 flex flex-col gap-1">
            <span className="font-semibold text-foreground">Reported Comment:</span>
            <p className="text-muted-foreground italic">"{report.commentText}"</p>
            <span className="mt-1 text-[11px] text-muted-foreground">
              Episode: {report.animeTitle} (Ep {report.episodeNumber})
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-medium text-foreground">Select Sanction Duration for Mute:</label>
            <Select value={muteDuration} onValueChange={(val) => setMuteDuration(val ?? "24h")}>
              <SelectTrigger className="h-9 border-border/60 text-xs">
                <SelectValue placeholder="Duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h" className="text-xs">Mute for 24 Hours</SelectItem>
                <SelectItem value="7d" className="text-xs">Mute for 7 Days</SelectItem>
                <SelectItem value="permanent" className="text-xs">Permanent Comment Ban</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onConfirmAction(report.id, "dismiss");
              onOpenChange(false);
            }}
            className="h-9 text-xs"
          >
            Dismiss Report
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              onConfirmAction(report.id, "mute", muteDuration);
              onOpenChange(false);
            }}
            className="h-9 text-xs gap-1.5"
          >
            Delete & Mute User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
