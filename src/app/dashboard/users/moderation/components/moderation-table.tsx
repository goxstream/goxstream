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
        return <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-500 text-[10px]">Spoiler</Badge>;
      case "spam_link":
        return <Badge variant="outline" className="border-destructive/30 bg-destructive/10 text-destructive text-[10px]">Spam Link</Badge>;
      case "hate_speech":
        return <Badge variant="outline" className="border-destructive/30 bg-destructive/10 text-destructive text-[10px]">Hate Speech</Badge>;
      default:
        return <Badge variant="secondary" className="text-[10px]">Community Standard</Badge>;
    }
  };

  if (reports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-border/60 bg-card p-12 text-center shadow-xs">
        <p className="text-sm font-medium text-foreground">Moderation queue is clean!</p>
        <p className="mt-1 text-xs text-muted-foreground">
          No pending user reports or community violations at this time.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border/60 bg-card shadow-xs overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-border/60 bg-muted/30 hover:bg-muted/30">
            <TableHead className="text-xs font-semibold text-foreground">Author & Comment</TableHead>
            <TableHead className="text-xs font-semibold text-foreground">Anime Episode</TableHead>
            <TableHead className="text-xs font-semibold text-foreground">Reason</TableHead>
            <TableHead className="text-xs font-semibold text-foreground">Reporter</TableHead>
            <TableHead className="text-xs font-semibold text-foreground">Status</TableHead>
            <TableHead className="w-[140px] text-right text-xs font-semibold text-foreground">Quick Action</TableHead>
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
                <TableCell className="py-3 max-w-[280px]">
                  <div className="flex items-start gap-3">
                    <Avatar className="size-8 border border-border/60 mt-0.5">
                      <AvatarImage src={item.author.avatar} alt={item.author.name} />
                      <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-foreground truncate">{item.author.name}</span>
                        <span className="text-[10px] text-muted-foreground">@{item.author.username}</span>
                        {item.flaggedBySystem && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground">
                            <Bot className="size-3" /> Auto
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-foreground bg-muted/30 p-2 rounded-md border border-border/40 line-clamp-2 italic">
                        "{item.commentText}"
                      </p>
                    </div>
                  </div>
                </TableCell>

                {/* Anime episode */}
                <TableCell className="py-3 text-xs text-foreground">
                  <div className="flex flex-col">
                    <span className="font-medium truncate">{item.animeTitle}</span>
                    <span className="text-[11px] text-muted-foreground">Episode {item.episodeNumber}</span>
                  </div>
                </TableCell>

                {/* Reason */}
                <TableCell className="py-3">{getReasonBadge(item.reason)}</TableCell>

                {/* Reporter */}
                <TableCell className="py-3 text-xs text-muted-foreground">
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
                    <span className="text-xs text-muted-foreground">Dismissed</span>
                  )}
                </TableCell>

                {/* Action buttons */}
                <TableCell className="py-3 text-right">
                  {item.status === "pending" ? (
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="outline"
                        size="icon"
                        className="size-7 text-emerald-500 border-border/60 hover:bg-emerald-500/10"
                        title="Approve / Dismiss Report"
                        onClick={() => onApproveReport(item.id)}
                      >
                        <Check className="size-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="size-7 text-destructive border-border/60 hover:bg-destructive/10"
                        title="Delete & Sanction User"
                        onClick={() => onOpenActionModal(item)}
                      >
                        <ShieldAlert className="size-3.5" />
                      </Button>
                    </div>
                  ) : (
                    <span className="text-[11px] text-muted-foreground">Done</span>
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
