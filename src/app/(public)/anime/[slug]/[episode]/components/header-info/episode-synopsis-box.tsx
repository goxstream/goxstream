"use client";

interface EpisodeSynopsisBoxProps {
  synopsis: string;
}

export function EpisodeSynopsisBox({ synopsis }: EpisodeSynopsisBoxProps) {
  return (
    <div className="text-xs text-muted-foreground leading-relaxed bg-muted/20 p-3.5 rounded-xl border border-border/40">
      <span className="font-semibold text-foreground mr-1.5">Episode Synopsis:</span>
      {synopsis}
    </div>
  );
}
