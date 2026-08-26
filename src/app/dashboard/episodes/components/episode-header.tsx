import Link from "next/link";
import { Plus, PlaySquare, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EpisodeHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-2 border-b border-border/60">
      <div>
        <div className="flex items-center gap-2">
          <PlaySquare className="size-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Episode Studio
          </h1>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Manage, upload, and organize episode video streams, subtitles, and server sources.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Link href="/dashboard/episodes/servers">
          <Button variant="outline" size="sm" className="gap-2">
            Server Health
            <ArrowUpRight className="size-4" />
          </Button>
        </Link>
        <Link href="/dashboard/episodes/new">
          <Button size="sm" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="size-4" />
            Add Episode
          </Button>
        </Link>
      </div>
    </div>
  );
}
