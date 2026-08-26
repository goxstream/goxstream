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
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-border/60">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/episodes">
          <Button variant="outline" size="icon" className="size-9 border-border/60">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <PlaySquare className="size-5 text-primary" />
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Add New Episode
            </h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Configure metadata, video sources, subtitles, and release schedule.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSave}
          disabled={isSaving}
        >
          <Save className="size-4 mr-1.5" />
          Save Draft
        </Button>
        <Button
          size="sm"
          onClick={handleSave}
          disabled={isSaving}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
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
      <div className="space-y-6 p-6 max-w-4xl mx-auto">
        <StudioHeader />
        <StudioStepper />
        <div className="min-h-[580px]">{children}</div>
      </div>
    </EpisodeFormProvider>
  );
}
