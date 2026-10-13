"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { ReportedComment } from "../types";

interface ModerationActionModalProps {
  report: ReportedComment | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmAction: (
    reportId: string,
    actionType: "delete" | "mute" | "dismiss",
    duration?: string,
    moderatorNote?: string,
  ) => void;
}

export function ModerationActionModal({
  report,
  isOpen,
  onOpenChange,
  onConfirmAction,
}: ModerationActionModalProps) {
  const [muteDuration, setMuteDuration] = useState("24h");
  const [moderatorNote, setModeratorNote] = useState("");

  if (!report) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Take Moderation Action</DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs">
            Apply enforcement on reported comment for{" "}
            <span className="text-foreground font-semibold">@{report.author.username}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2 text-xs">
          <div className="border-border/60 bg-muted/20 flex flex-col gap-1 rounded-md border p-3">
            <span className="text-foreground font-semibold">Reported Comment:</span>
            <p className="text-muted-foreground italic">"{report.commentText}"</p>
            <span className="text-muted-foreground mt-1 text-[11px]">
              Episode: {report.animeTitle} (Ep {report.episodeNumber})
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-foreground font-medium">Sanction Duration for Mute:</Label>
            <Select value={muteDuration} onValueChange={(val) => setMuteDuration(val ?? "24h")}>
              <SelectTrigger className="border-border/60 h-9 text-xs">
                <SelectValue placeholder="Duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h" className="text-xs">
                  Mute for 24 Hours
                </SelectItem>
                <SelectItem value="7d" className="text-xs">
                  Mute for 7 Days
                </SelectItem>
                <SelectItem value="permanent" className="text-xs">
                  Permanent Comment Ban
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-foreground font-medium">
              Moderator Internal Note (Optional):
            </Label>
            <Textarea
              placeholder="Provide reason or context for audit log..."
              value={moderatorNote}
              onChange={(e) => setModeratorNote(e.target.value)}
              className="border-border/60 min-h-[70px] text-xs"
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onConfirmAction(report.id, "dismiss", undefined, moderatorNote);
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
              onConfirmAction(report.id, "mute", muteDuration, moderatorNote);
              onOpenChange(false);
            }}
            className="h-9 gap-1.5 text-xs"
          >
            Delete & Mute User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
