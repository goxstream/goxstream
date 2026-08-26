"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Save, CheckCircle2, PlaySquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EpisodeFormProvider, useEpisodeForm } from "./context/episode-form-context";
import { StudioStepper } from "./components/studio-stepper";

function StudioHeader() {
  const { isSaving, handleSave } = useEpisodeForm();

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-border/60 min-w-0">
      <div className="flex items-center gap-3 min-w-0">
        <Link href="/dashboard/episodes" className="shrink-0">
          <Button variant="outline" size="icon" className="size-9 border-border/60">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div className="min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <PlaySquare className="size-5 text-primary shrink-0" />
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-foreground truncate">
              Add New Episode
            </h1>
          </div>
          <p className="text-xs text-muted-foreground truncate">
            Configure metadata, video sources, subtitles, and release schedule.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSave}
          disabled={isSaving}
          className="text-xs"
        >
          <Save className="size-4 mr-1.5" />
          Save Draft
        </Button>
        <Button
          size="sm"
          onClick={handleSave}
          disabled={isSaving}
          className="text-xs bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <CheckCircle2 className="size-4 mr-1.5" />
          {isSaving ? "Publishing..." : "Publish Episode"}
        </Button>
      </div>
    </div>
  );
}

export default function NewEpisodeLayout({ children }: { children: React.ReactNode }) {
  return (
    <EpisodeFormProvider>
      <div className="space-y-5 p-3.5 sm:p-6 max-w-4xl mx-auto min-w-0 overflow-x-hidden">
        <StudioHeader />
        <StudioStepper />
        <div className="min-h-[500px] min-w-0">{children}</div>
      </div>
    </EpisodeFormProvider>
  );
}
