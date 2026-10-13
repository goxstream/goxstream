"use client";

import { CheckCircle2, RefreshCw, Clock, AlertCircle, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { PipelineStage } from "../lib/hls/types";

interface PipelineStageBarProps {
  stages: PipelineStage[];
  totalDurationSeconds?: number;
}

export function PipelineStageBar({ stages, totalDurationSeconds = 0 }: PipelineStageBarProps) {
  const formatDuration = (secs?: number) => {
    if (secs === undefined || secs === null) return "";
    if (secs < 60) return `${secs}s`;
    const mins = Math.floor(secs / 60);
    const remainderSecs = secs % 60;
    return `${mins}m ${remainderSecs}s`;
  };

  const activeStage = stages.find((s) => s.status === "running");

  return (
    <div className="bg-card border-border/60 space-y-2.5 rounded-xl border p-3.5">
      {/* Header Bar */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="text-foreground flex items-center gap-1.5 font-semibold">
            <Clock className="text-primary size-3.5 shrink-0" />
            Build Pipeline Stages
          </span>
          {activeStage && (
            <span className="text-muted-foreground max-w-[220px] truncate text-[11px]">
              • {activeStage.label}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {totalDurationSeconds > 0 && (
            <Badge
              variant="outline"
              className="bg-muted/50 border-border/60 text-muted-foreground h-5 font-mono text-[10px]"
            >
              Total: {formatDuration(totalDurationSeconds)}
            </Badge>
          )}
        </div>
      </div>

      {/* Cloudflare-Style Fluid Segmented Stage Pills */}
      <div className="flex flex-col items-stretch gap-1.5 sm:flex-row">
        {stages.map((stage) => {
          const isCompleted = stage.status === "completed";
          const isRunning = stage.status === "running";
          const isPending = stage.status === "pending";
          const isError = stage.status === "error";

          return (
            <div
              key={stage.id}
              className={cn(
                "flex min-w-0 items-center justify-between rounded-lg border px-2.5 py-2 text-xs transition-all duration-300",
                isRunning
                  ? "bg-primary/10 border-primary/50 text-foreground flex-[1.5] font-semibold shadow-xs"
                  : "flex-1",
                isCompleted && "text-foreground border-emerald-500/25 bg-emerald-500/10",
                isPending && "bg-muted/30 border-border/40 text-muted-foreground/60 opacity-70",
                isError && "bg-destructive/10 border-destructive/30 text-destructive font-medium",
              )}
            >
              <div className="flex items-center gap-1.5 truncate">
                {isCompleted && <CheckCircle2 className="size-3.5 shrink-0 text-emerald-500" />}
                {isRunning && <RefreshCw className="text-primary size-3.5 shrink-0 animate-spin" />}
                {isPending && <PlayCircle className="text-muted-foreground/40 size-3.5 shrink-0" />}
                {isError && <AlertCircle className="text-destructive size-3.5 shrink-0" />}
                <span className="truncate text-[11px]">{stage.label}</span>
              </div>

              {/* Duration or Status Badge */}
              <div className="ml-1.5 shrink-0">
                {isCompleted && stage.durationSeconds !== undefined && (
                  <Badge className="h-4 border-emerald-500/30 bg-emerald-500/20 px-1 font-mono text-[9px] text-emerald-500">
                    {formatDuration(stage.durationSeconds)}
                  </Badge>
                )}
                {isRunning && (
                  <Badge className="bg-primary text-primary-foreground h-4 animate-pulse px-1 font-mono text-[9px]">
                    {formatDuration(stage.durationSeconds || 0)}
                  </Badge>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
