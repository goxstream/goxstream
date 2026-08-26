"use client";

import { useState, useRef, useEffect } from "react";
import { Terminal, ChevronDown, ChevronUp, Copy, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { TranscodeLogEntry } from "../lib/hls/types";

interface ConversionLogDrawerProps {
  logs: TranscodeLogEntry[];
  onClearLogs: () => void;
  onCopyLogs: () => void;
}

export function ConversionLogDrawer({
  logs,
  onClearLogs,
  onCopyLogs,
}: ConversionLogDrawerProps) {
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
    <div className="rounded-lg border border-border/60 bg-card overflow-hidden transition-all">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-muted/40 text-xs select-none">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-foreground font-medium hover:text-primary transition-colors focus:outline-hidden"
        >
          <Terminal className="size-3.5 text-primary" />
          <span>Conversion Log History</span>
          <Badge variant="outline" className="text-[10px] h-4 px-1.5 font-mono">
            {logs.length} entries
          </Badge>
          {isOpen ? (
            <ChevronUp className="size-3.5 text-muted-foreground ml-1" />
          ) : (
            <ChevronDown className="size-3.5 text-muted-foreground ml-1" />
          )}
        </button>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            title="Copy logs to clipboard"
            className="size-7 text-muted-foreground hover:text-foreground"
          >
            {copied ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClearLogs}
            title="Clear logs"
            className="size-7 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="size-3" />
          </Button>
        </div>
      </div>

      {/* Expandable Console Terminal Body */}
      {isOpen && (
        <div
          ref={scrollRef}
          className="p-3 bg-slate-950 text-slate-200 font-mono text-[11px] max-h-56 overflow-y-auto space-y-1 divide-y divide-slate-800/50 border-t border-border/40"
        >
          {logs.map((log) => {
            let textColor = "text-slate-300";
            if (log.type === "error") textColor = "text-red-400 font-semibold";
            if (log.type === "success") textColor = "text-emerald-400 font-semibold";
            if (log.type === "ffmpeg") textColor = "text-cyan-400";
            if (log.type === "info") textColor = "text-slate-300";

            return (
              <div key={log.id} className="pt-1 flex items-start gap-2 leading-relaxed">
                <span className="text-slate-500 shrink-0 text-[10px] font-mono">
                  [{log.timestamp}]
                </span>
                <span className="uppercase text-[9px] px-1 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 shrink-0 font-bold">
                  {log.type}
                </span>
                <span className={`break-all ${textColor}`}>{log.message}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
