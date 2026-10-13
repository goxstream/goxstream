"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, AlignLeft } from "lucide-react";

interface EpisodeSynopsisBoxProps {
  synopsis: string;
}

const MAX_CHARACTERS = 200;

export function EpisodeSynopsisBox({ synopsis }: EpisodeSynopsisBoxProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const isLongText = synopsis && synopsis.length > MAX_CHARACTERS;
  const displayedText = isLongText && !isExpanded
    ? `${synopsis.slice(0, MAX_CHARACTERS).trim()}...`
    : synopsis;

  return (
    <div className="p-4 rounded-xl bg-card border border-border/60 shadow-xs space-y-2">
      <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
        <AlignLeft className="w-4 h-4 text-primary shrink-0" />
        <span>Episode Synopsis</span>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">
        {displayedText}
        {isLongText && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-0.5 text-xs font-semibold text-primary hover:underline ml-1.5 focus:outline-none"
          >
            <span>{isExpanded ? "Show Less" : "Read More"}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        )}
      </p>
    </div>
  );
}
