"use client";

import { Server } from "lucide-react";
import type { StreamSource } from "@/types/anime";

interface StreamServerBarProps {
  sources: StreamSource[];
  activeSourceId: string;
  onSelectSource: (sourceId: string) => void;
}

export function StreamServerBar({ sources, activeSourceId, onSelectSource }: StreamServerBarProps) {
  return (
    <div className="bg-card border-border/60 flex flex-col justify-between gap-3 rounded-xl border p-3 shadow-xs sm:flex-row sm:items-center">
      <div className="flex items-center gap-2">
        <Server className="text-primary h-4 w-4 shrink-0" />
        <span className="text-foreground text-xs font-semibold">Select Stream Server:</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {sources.map((source) => {
          const isActive = source.id === activeSourceId;
          const isPrimary = source.isPrimary || source.id === "default-r2-primary";

          return (
            <button
              key={source.id}
              onClick={() => onSelectSource(source.id)}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground border-primary shadow-xs"
                  : isPrimary
                    ? "bg-primary/10 hover:bg-primary/20 text-primary border-primary/30"
                    : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground border-border/60"
              }`}
            >
              <span>{source.serverName}</span>
              <span
                className={`py-0.2 rounded px-1 font-mono text-[10px] ${
                  isActive
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-background/80 text-muted-foreground"
                }`}
              >
                {source.quality}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
