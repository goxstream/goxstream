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
    <div className="border-border/60 flex min-w-0 flex-col gap-3 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <Link href="/dashboard/episodes" className="shrink-0">
          <Button variant="outline" size="icon" className="border-border/60 size-9">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div className="min-w-0">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <h1 className="text-foreground truncate text-lg font-bold tracking-tight sm:text-xl">
              Edit Episode #{episodeNumber}
            </h1>
            <Badge variant="outline" className="bg-muted/30 font-mono text-xs">
              {episodeId}
            </Badge>
            <Badge
              className={
                status === "published"
                  ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
                  : status === "scheduled"
                    ? "border-sky-500/20 bg-sky-500/10 text-sky-500"
                    : status === "processing"
                      ? "border-amber-500/20 bg-amber-500/10 text-amber-500"
                      : "bg-muted text-muted-foreground"
              }
            >
              {status.toUpperCase()}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-0.5 truncate text-xs">
            {animeTitle ? `${animeTitle} • ` : ""}
            {title || "Untitled Episode"}
            {viewsCount > 0 && ` • ${viewsCount.toLocaleString()} views`}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-2">
        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="text-destructive hover:text-destructive hover:bg-destructive/10 text-xs"
          >
            <Trash2 className="mr-1 size-3.5" />
            Delete
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={onSave}
          disabled={isSaving}
          className="border-border/60 text-xs"
        >
          <Save className="mr-1.5 size-3.5" />
          Save Draft
        </Button>
        <Button
          size="sm"
          onClick={onSave}
          disabled={isSaving}
          className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs"
        >
          <CheckCircle2 className="mr-1.5 size-3.5" />
          {isSaving ? "Saving..." : "Update Episode"}
        </Button>
      </div>
    </div>
  );
}
