"use client";

import { useState, useRef, useEffect } from "react";
import { Terminal, ChevronDown, Copy, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import type { TranscodeLogEntry } from "../lib/hls/types";

interface ConversionLogDrawerProps {
  logs: TranscodeLogEntry[];
  onClearLogs: () => void;
  onCopyLogs: () => void;
}

export function ConversionLogDrawer({ logs, onClearLogs, onCopyLogs }: ConversionLogDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new log entries arrive while open
  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, isOpen]);

  const handleCopy = () => {
    onCopyLogs();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (logs.length === 0) {
    return null;
  }

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="border-border/60 bg-card overflow-hidden rounded-lg border transition-all"
    >
      {/* Header Bar */}
      <div className="bg-muted/40 flex items-center justify-between px-3 py-2 text-xs select-none">
        <CollapsibleTrigger className="text-foreground hover:text-primary group/trigger flex items-center gap-2 font-medium transition-colors focus:outline-hidden">
          <Terminal className="text-primary size-3.5" />
          <span>Conversion Log History</span>
          <Badge variant="outline" className="h-4 px-1.5 font-mono text-[10px]">
            {logs.length} entries
          </Badge>
          <ChevronDown
            className={cn(
              "text-muted-foreground ml-1 size-3.5 transition-transform duration-200 ease-in-out",
              isOpen && "rotate-180",
            )}
          />
        </CollapsibleTrigger>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            title="Copy logs to clipboard"
            className="text-muted-foreground hover:text-foreground size-7"
          >
            {copied ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClearLogs}
            title="Clear logs"
            className="text-muted-foreground hover:text-destructive size-7"
          >
            <Trash2 className="size-3" />
          </Button>
        </div>
      </div>

      {/* Expandable Console Terminal Body with Grid Collapse Animation */}
      <CollapsibleContent
        className={cn(
          "border-border/40 grid border-t transition-[grid-template-rows,opacity] duration-300 ease-in-out",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div
            ref={scrollRef}
            className="max-h-56 space-y-1 divide-y divide-slate-800/50 overflow-y-auto bg-slate-950 p-3 font-mono text-[11px] text-slate-200"
          >
            {logs.map((log) => {
              let textColor = "text-slate-300";
              if (log.type === "error") textColor = "text-red-400 font-semibold";
              if (log.type === "success") textColor = "text-emerald-400 font-semibold";
              if (log.type === "ffmpeg") textColor = "text-cyan-400";
              if (log.type === "info") textColor = "text-slate-300";

              return (
                <div key={log.id} className="flex items-start gap-2 pt-1 leading-relaxed">
                  <span className="shrink-0 font-mono text-[10px] text-slate-500">
                    [{log.timestamp}]
                  </span>
                  <span className="shrink-0 rounded border border-slate-800 bg-slate-900 px-1 py-0.5 text-[9px] font-bold text-slate-400 uppercase">
                    {log.type}
                  </span>
                  <span className={`break-all ${textColor}`}>{log.message}</span>
                </div>
              );
            })}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
