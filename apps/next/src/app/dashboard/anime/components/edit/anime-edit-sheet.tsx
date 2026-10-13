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

export function AnimeEditSheet({ anime, open, onOpenChange, onSave }: AnimeEditSheetProps) {
  const formRef = useRef<{ save: () => void }>(null);

  if (!anime) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="bg-background border-border/60 flex h-full w-full flex-col border-l p-0 sm:max-w-md"
      >
        <SheetHeader className="border-border/60 border-b p-4 pb-3">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-lg">
              <Edit2 className="h-4 w-4" />
            </div>
            <div>
              <SheetTitle className="text-base font-bold">Edit Anime</SheetTitle>
              <SheetDescription className="text-muted-foreground max-w-[240px] truncate text-xs">
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

        <SheetFooter className="border-border/60 bg-card/60 flex flex-row items-center justify-between gap-2 border-t p-4">
          <SheetClose asChild>
            <Button type="button" variant="outline" size="sm" className="text-xs">
              Cancel
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
