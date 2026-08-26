"use client";

import { CheckCircle2, RefreshCw, Clock, AlertCircle, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { PipelineStage } from "../lib/hls/types";

interface PipelineStageBarProps {
  stages: PipelineStage[];
  totalDurationSeconds?: number;
}

export function PipelineStageBar({
  stages,
  totalDurationSeconds = 0,
}: PipelineStageBarProps) {
  const formatDuration = (secs?: number) => {
    if (secs === undefined || secs === null) return "";
    if (secs < 60) return `${secs}s`;
    const mins = Math.floor(secs / 60);
    const remainderSecs = secs % 60;
    return `${mins}m ${remainderSecs}s`;
  };

  const activeStage = stages.find((s) => s.status === "running");

  return (
    <div className="space-y-2.5 bg-card p-3.5 rounded-xl border border-border/60">
      {/* Header Bar */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground flex items-center gap-1.5">
            <Clock className="size-3.5 text-primary shrink-0" />
            Build Pipeline Stages
          </span>
          {activeStage && (
            <span className="text-[11px] text-muted-foreground truncate max-w-[220px]">
              • {activeStage.label}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {totalDurationSeconds > 0 && (
            <Badge
              variant="outline"
              className="text-[10px] h-5 font-mono bg-muted/50 border-border/60 text-muted-foreground"
            >
              Total: {formatDuration(totalDurationSeconds)}
            </Badge>
          )}
        </div>
      </div>

      {/* Cloudflare-Style Fluid Segmented Stage Pills */}
      <div className="flex flex-col sm:flex-row gap-1.5 items-stretch">
        {stages.map((stage) => {
          const isCompleted = stage.status === "completed";
          const isRunning = stage.status === "running";
          const isPending = stage.status === "pending";
          const isError = stage.status === "error";

          return (
            <div
              key={stage.id}
              className={cn(
                "px-2.5 py-2 rounded-lg border text-xs flex items-center justify-between transition-all duration-300 min-w-0",
                isRunning
                  ? "flex-[1.5] bg-primary/10 border-primary/50 text-foreground font-semibold shadow-xs"
                  : "flex-1",
                isCompleted && "bg-emerald-500/10 border-emerald-500/25 text-foreground",
                isPending && "bg-muted/30 border-border/40 text-muted-foreground/60 opacity-70",
                isError && "bg-destructive/10 border-destructive/30 text-destructive font-medium"
              )}
            >
              <div className="flex items-center gap-1.5 truncate">
                {isCompleted && (
                  <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                )}
                {isRunning && (
                  <RefreshCw className="size-3.5 text-primary animate-spin shrink-0" />
                )}
                {isPending && (
                  <PlayCircle className="size-3.5 text-muted-foreground/40 shrink-0" />
                )}
                {isError && (
                  <AlertCircle className="size-3.5 text-destructive shrink-0" />
                )}
                <span className="truncate text-[11px]">{stage.label}</span>
              </div>

              {/* Duration or Status Badge */}
              <div className="shrink-0 ml-1.5">
                {isCompleted && stage.durationSeconds !== undefined && (
                  <Badge className="bg-emerald-500/20 text-emerald-500 border-emerald-500/30 text-[9px] h-4 px-1 font-mono">
                    {formatDuration(stage.durationSeconds)}
                  </Badge>
                )}
                {isRunning && (
                  <Badge className="bg-primary text-primary-foreground text-[9px] h-4 px-1 font-mono animate-pulse">
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
