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
    <div className="border-border/60 flex min-w-0 flex-col gap-3 border-b pb-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <Link href="/dashboard/episodes" className="shrink-0">
          <Button variant="outline" size="icon" className="border-border/60 size-9">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-2">
            <PlaySquare className="text-primary size-5 shrink-0" />
            <h1 className="text-foreground truncate text-lg font-bold tracking-tight sm:text-xl">
              Add New Episode
            </h1>
          </div>
          <p className="text-muted-foreground truncate text-xs">
            Configure metadata, video sources, subtitles, and release schedule.
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSave}
          disabled={isSaving}
          className="text-xs"
        >
          <Save className="mr-1.5 size-4" />
          Save Draft
        </Button>
        <Button
          size="sm"
          onClick={handleSave}
          disabled={isSaving}
          className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs"
        >
          <CheckCircle2 className="mr-1.5 size-4" />
          {isSaving ? "Publishing..." : "Publish Episode"}
        </Button>
      </div>
    </div>
  );
}

export default function NewEpisodeLayout({ children }: { children: React.ReactNode }) {
  return (
    <EpisodeFormProvider>
      <div className="mx-auto max-w-4xl min-w-0 space-y-5 overflow-x-hidden p-3.5 sm:p-6">
        <StudioHeader />
        <StudioStepper />
        <div className="min-h-[500px] min-w-0">{children}</div>
      </div>
    </EpisodeFormProvider>
  );
}
