"use client";

import { useRef } from "react";
import { X, Save, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimeEditFormContent } from "./edit/anime-edit-form-content";
import type { AnimeItem } from "../types";

interface AnimeInlineEditFormProps {
  anime: AnimeItem;
  onSave: (updated: AnimeItem) => void;
  onCancel: () => void;
}

export function AnimeInlineEditForm({ anime, onSave, onCancel }: AnimeInlineEditFormProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="bg-muted/20 border-border/60 animate-in fade-in-50 my-1 space-y-4 overflow-hidden rounded-md border-t border-b p-4 duration-150"
    >
      {/* Header Bar */}
      <div className="border-border/40 flex items-center justify-between border-b pb-2">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 text-primary flex h-6 w-6 items-center justify-center rounded">
            <Film className="h-3.5 w-3.5" />
          </div>
          <h4 className="text-foreground text-xs font-semibold">
            Quick Inline Edit — <span className="text-primary">{anime.titleRomaji}</span>
          </h4>
        </div>
        <div className="flex items-center gap-1.5">
          <Button size="xs" variant="ghost" onClick={onCancel} className="h-7 px-2.5 text-xs">
            <X className="mr-1 h-3 w-3" />
            Cancel
          </Button>
        </div>
      </div>

      <AnimeEditFormContent anime={anime} onSave={onSave} />
    </div>
  );
}
