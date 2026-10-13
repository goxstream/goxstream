"use client";

import { Check, ShieldAlert, Bot, MessageSquare } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ReportedComment } from "../types";

interface ModerationTableProps {
  reports: ReportedComment[];
  onOpenActionModal: (report: ReportedComment) => void;
  onApproveReport: (reportId: string) => void;
}

export function ModerationTable({
  reports,
  onOpenActionModal,
  onApproveReport,
}: ModerationTableProps) {
  const getReasonBadge = (reason: ReportedComment["reason"]) => {
    switch (reason) {
      case "spoiler":
        return (
          <Badge
            variant="outline"
            className="border-amber-500/30 bg-amber-500/10 text-[10px] text-amber-500"
          >
            Spoiler
          </Badge>
        );
      case "spam_link":
        return (
          <Badge
            variant="outline"
            className="border-destructive/30 bg-destructive/10 text-destructive text-[10px]"
          >
            Spam Link
          </Badge>
        );
      case "hate_speech":
        return (
          <Badge
            variant="outline"
            className="border-destructive/30 bg-destructive/10 text-destructive text-[10px]"
          >
            Hate Speech
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="text-[10px]">
            Community Standard
          </Badge>
        );
    }
  };

  if (reports.length === 0) {
    return (
      <div className="border-border/60 bg-card flex flex-col items-center justify-center rounded-lg border p-12 text-center shadow-xs">
        <p className="text-foreground text-sm font-medium">Moderation queue is clean!</p>
        <p className="text-muted-foreground mt-1 text-xs">
          No pending user reports or community violations at this time.
        </p>
      </div>
    );
  }

  return (
    <div className="border-border/60 bg-card overflow-hidden rounded-lg border shadow-xs">
      <Table>
        <TableHeader>
          <TableRow className="border-border/60 bg-muted/30 hover:bg-muted/30">
            <TableHead className="text-foreground text-xs font-semibold">
              Author & Comment
            </TableHead>
            <TableHead className="text-foreground text-xs font-semibold">Anime Episode</TableHead>
            <TableHead className="text-foreground text-xs font-semibold">Reason</TableHead>
            <TableHead className="text-foreground text-xs font-semibold">Reporter</TableHead>
            <TableHead className="text-foreground text-xs font-semibold">Status</TableHead>
            <TableHead className="text-foreground w-[140px] text-right text-xs font-semibold">
              Quick Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((item) => {
            const initials = item.author.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .substring(0, 2)
              .toUpperCase();

            return (
              <TableRow key={item.id} className="border-border/60 hover:bg-muted/20">
                {/* Author & comment */}
                <TableCell className="max-w-[280px] py-3">
                  <div className="flex items-start gap-3">
                    <Avatar className="border-border/60 mt-0.5 size-8 border">
                      <AvatarImage src={item.author.avatar} alt={item.author.name} />
                      <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex min-w-0 flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-foreground truncate text-xs font-semibold">
                          {item.author.name}
                        </span>
                        <span className="text-muted-foreground text-[10px]">
                          @{item.author.username}
                        </span>
                        {item.flaggedBySystem && (
                          <span className="text-muted-foreground inline-flex items-center gap-0.5 text-[10px]">
                            <Bot className="size-3" /> Auto
                          </span>
                        )}
                      </div>
                      <p className="text-foreground bg-muted/30 border-border/40 line-clamp-2 rounded-md border p-2 text-xs italic">
                        "{item.commentText}"
                      </p>
                    </div>
                  </div>
                </TableCell>

                {/* Anime episode */}
                <TableCell className="text-foreground py-3 text-xs">
                  <div className="flex flex-col">
                    <span className="truncate font-medium">{item.animeTitle}</span>
                    <span className="text-muted-foreground text-[11px]">
                      Episode {item.episodeNumber}
                    </span>
                  </div>
                </TableCell>

                {/* Reason */}
                <TableCell className="py-3">{getReasonBadge(item.reason)}</TableCell>

                {/* Reporter */}
                <TableCell className="text-muted-foreground py-3 text-xs">
                  {item.flaggedBySystem ? "System Bot" : `@${item.reporter.username}`}
                </TableCell>

                {/* Status */}
                <TableCell className="py-3">
                  {item.status === "pending" ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-500">
                      <span className="size-1.5 rounded-full bg-amber-500" />
                      Pending
                    </span>
                  ) : item.status === "resolved" ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-500">
                      <Check className="size-3" />
                      Resolved
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-xs">Dismissed</span>
                  )}
                </TableCell>

                {/* Action buttons */}
                <TableCell className="py-3 text-right">
                  {item.status === "pending" ? (
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-border/60 size-7 text-emerald-500 hover:bg-emerald-500/10"
                        title="Approve / Dismiss Report"
                        onClick={() => onApproveReport(item.id)}
                      >
                        <Check className="size-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-destructive border-border/60 hover:bg-destructive/10 size-7"
                        title="Delete & Sanction User"
                        onClick={() => onOpenActionModal(item)}
                      >
                        <ShieldAlert className="size-3.5" />
                      </Button>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-[11px]">Done</span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
