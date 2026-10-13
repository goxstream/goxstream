import Link from "next/link";
import { Plus, PlaySquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EpisodeHeader() {
  return (
    <div className="border-border/60 flex flex-col gap-4 border-b pb-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <PlaySquare className="text-primary size-6" />
          <h1 className="text-foreground text-2xl font-bold tracking-tight">Episode Studio</h1>
        </div>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage, upload, and organize episode video streams, subtitles, and server sources.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Link href="/dashboard/episodes/new">
          <Button
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
          >
            <Plus className="size-4" />
            Add Episode
          </Button>
        </Link>
      </div>
    </div>
  );
}
