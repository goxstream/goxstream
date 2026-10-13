"use client";

import { Server } from "lucide-react";
import type { StreamSource } from "@/types/anime";

interface StreamServerBarProps {
  sources: StreamSource[];
  activeSourceId: string;
  onSelectSource: (sourceId: string) => void;
}

export function StreamServerBar({
  sources,
  activeSourceId,
  onSelectSource,
}: StreamServerBarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-card border border-border/60 shadow-xs">
      <div className="flex items-center gap-2">
        <Server className="w-4 h-4 text-primary shrink-0" />
        <span className="text-xs font-semibold text-foreground">Select Stream Server:</span>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {sources.map((source) => {
          const isActive = source.id === activeSourceId;
          const isPrimary = source.isPrimary || source.id === "default-r2-primary";

          return (
            <button
              key={source.id}
              onClick={() => onSelectSource(source.id)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 border ${
                isActive
                  ? "bg-primary text-primary-foreground border-primary shadow-xs"
                  : isPrimary
                  ? "bg-primary/10 hover:bg-primary/20 text-primary border-primary/30"
                  : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground border-border/60"
              }`}
            >
              <span>{source.serverName}</span>
              <span className={`text-[10px] px-1 py-0.2 rounded font-mono ${
                isActive
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-background/80 text-muted-foreground"
              }`}>
                {source.quality}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
