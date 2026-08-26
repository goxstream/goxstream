"use client";

import { useRef } from "react";
import { X, Save, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimeEditFormContent } from "./edit/anime-edit-form-content";
import type { AnimeItem } from "./types";

interface AnimeInlineEditFormProps {
  anime: AnimeItem;
  onSave: (updated: AnimeItem) => void;
  onCancel: () => void;
}

export function AnimeInlineEditForm({
  anime,
  onSave,
  onCancel,
}: AnimeInlineEditFormProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="p-4 bg-muted/20 border-t border-b border-border/60 rounded-md my-1 space-y-4 animate-in fade-in-50 duration-150 overflow-hidden"
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-border/40 pb-2">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-primary/10 text-primary flex items-center justify-center">
            <Film className="h-3.5 w-3.5" />
          </div>
          <h4 className="text-xs font-semibold text-foreground">
            Quick Inline Edit — <span className="text-primary">{anime.titleRomaji}</span>
          </h4>
        </div>
        <div className="flex items-center gap-1.5">
          <Button size="xs" variant="ghost" onClick={onCancel} className="h-7 text-xs px-2.5">
            <X className="h-3 w-3 mr-1" />
            Cancel
          </Button>
        </div>
      </div>

      <AnimeEditFormContent anime={anime} onSave={onSave} />
    </div>
  );
}
