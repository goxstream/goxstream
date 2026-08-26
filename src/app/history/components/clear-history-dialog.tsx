"use client";

import { Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/alert-dialog";

interface ClearHistoryDialogProps {
  onConfirmClear: () => void;
}

export function ClearHistoryDialog({ onConfirmClear }: ClearHistoryDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="outline" size="sm" className="rounded-xl text-xs gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20 self-start sm:self-auto" />}>
        <Trash2 className="size-3.5" />
        Clear History
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-popover border border-border/80 rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-foreground">
            <AlertTriangle className="size-5 text-amber-500" />
            Clear Entire Watch History?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs text-muted-foreground">
            This action cannot be undone. All your saved watch positions and timestamp history will be permanently cleared.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel className="rounded-xl text-xs">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirmClear}
            className="rounded-xl text-xs bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Confirm Clear
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
