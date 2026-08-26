"use client";

import Link from "next/link";
import { ArrowLeft, Save, CheckCircle2, Trash2, Eye, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { EpisodeStatus } from "@/app/dashboard/episodes/types";

interface EditEpisodeHeaderProps {
  episodeId: string;
  episodeNumber: number | string;
  title: string;
  animeTitle: string;
  status: EpisodeStatus;
  isSaving: boolean;
  viewsCount?: number;
  onSave: () => void;
  onDelete?: () => void;
}

export function EditEpisodeHeader({
  episodeId,
  episodeNumber,
  title,
  animeTitle,
  status,
  isSaving,
  viewsCount = 0,
  onSave,
  onDelete,
}: EditEpisodeHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-border/60 min-w-0">
      <div className="flex items-center gap-3 min-w-0">
        <Link href="/dashboard/episodes" className="shrink-0">
          <Button variant="outline" size="icon" className="size-9 border-border/60">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div className="min-w-0">
          <div className="flex items-center gap-2 min-w-0 flex-wrap">
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-foreground truncate">
              Edit Episode #{episodeNumber}
            </h1>
            <Badge variant="outline" className="text-xs font-mono bg-muted/30">
              {episodeId}
            </Badge>
            <Badge
              className={
                status === "published"
                  ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                  : status === "scheduled"
                  ? "bg-sky-500/10 text-sky-500 border-sky-500/20"
                  : status === "processing"
                  ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                  : "bg-muted text-muted-foreground"
              }
            >
              {status.toUpperCase()}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {animeTitle ? `${animeTitle} • ` : ""}{title || "Untitled Episode"}
            {viewsCount > 0 && ` • ${viewsCount.toLocaleString()} views`}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 flex-wrap">
        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="size-3.5 mr-1" />
            Delete
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={onSave}
          disabled={isSaving}
          className="text-xs border-border/60"
        >
          <Save className="size-3.5 mr-1.5" />
          Save Draft
        </Button>
        <Button
          size="sm"
          onClick={onSave}
          disabled={isSaving}
          className="text-xs bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <CheckCircle2 className="size-3.5 mr-1.5" />
          {isSaving ? "Saving..." : "Update Episode"}
        </Button>
      </div>
    </div>
  );
}
