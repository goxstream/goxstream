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
  const displayedText =
    isLongText && !isExpanded ? `${synopsis.slice(0, MAX_CHARACTERS).trim()}...` : synopsis;

  return (
    <div className="bg-card border-border/60 space-y-2 rounded-xl border p-4 shadow-xs">
      <div className="text-foreground flex items-center gap-2 text-xs font-semibold">
        <AlignLeft className="text-primary h-4 w-4 shrink-0" />
        <span>Episode Synopsis</span>
      </div>

      <p className="text-muted-foreground text-xs leading-relaxed">
        {displayedText}
        {isLongText && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-primary ml-1.5 inline-flex items-center gap-0.5 text-xs font-semibold hover:underline focus:outline-none"
          >
            <span>{isExpanded ? "Show Less" : "Read More"}</span>
            {isExpanded ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </button>
        )}
      </p>
    </div>
  );
}
