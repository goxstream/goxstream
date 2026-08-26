"use client";

import { useRef } from "react";
import { Edit2, Save } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { AnimeEditFormContent } from "./anime-edit-form-content";
import type { AnimeItem } from "../../types";

interface AnimeEditSheetProps {
  anime: AnimeItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updated: AnimeItem) => void;
}

export function AnimeEditSheet({
  anime,
  open,
  onOpenChange,
  onSave,
}: AnimeEditSheetProps) {
  const formRef = useRef<{ save: () => void }>(null);

  if (!anime) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-md w-full p-0 flex flex-col h-full bg-background border-l border-border/60">
        <SheetHeader className="p-4 pb-3 border-b border-border/60">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Edit2 className="h-4 w-4" />
            </div>
            <div>
              <SheetTitle className="text-base font-bold">Edit Anime</SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground truncate max-w-[240px]">
                {anime.titleRomaji}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4">
          <AnimeEditFormContent
            anime={anime}
            onSave={(updated) => {
              onSave(updated);
              onOpenChange(false);
            }}
          />
        </div>

        <SheetFooter className="p-4 border-t border-border/60 bg-card/60 flex flex-row items-center justify-between gap-2">
          <SheetClose render={<Button type="button" variant="outline" size="sm" className="text-xs">Cancel</Button>} />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
