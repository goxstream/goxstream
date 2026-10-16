"use client";

import { Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@goxstream/ui/components/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@goxstream/ui/components/alert-dialog";

interface ClearHistoryDialogProps {
  onConfirmClear: () => void;
}

export function ClearHistoryDialog({ onConfirmClear }: ClearHistoryDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20 gap-1.5 self-start rounded-xl text-xs sm:self-auto"
        >
          <Trash2 className="size-3.5" />
          Clear History
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-popover border-border/80 rounded-2xl border">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-foreground flex items-center gap-2">
            <AlertTriangle className="size-5 text-amber-500" />
            Clear Entire Watch History?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground text-xs">
            This action cannot be undone. All your saved watch positions and timestamp history will
            be permanently cleared.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel className="rounded-xl text-xs">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirmClear}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl text-xs"
          >
            Confirm Clear
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
