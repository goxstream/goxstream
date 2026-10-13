"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { AnimeSelectCombobox } from "../../components/anime-select-combobox";
import { ANIME_SERIES_OPTIONS } from "../constants";
import type { BasicEpisodeData } from "../types";

interface BasicInfoStepProps {
  formData: BasicEpisodeData;
  onChange: (key: string, value: string | boolean) => void;
}

export function BasicInfoStep({ formData, onChange }: BasicInfoStepProps) {
  return (
    <div className="bg-card border-border/60 min-w-0 space-y-4 rounded-xl border p-4 sm:p-6">
      <div className="border-border/60 border-b pb-3">
        <h3 className="text-foreground text-base font-semibold">Basic Episode Details</h3>
        <p className="text-muted-foreground mt-0.5 text-xs">
          Select the anime series and configure core metadata for this episode.
        </p>
      </div>

      <div className="grid min-w-0 gap-4 sm:grid-cols-2">
        {/* Searchable Anime Selection Combobox */}
        <div className="min-w-0 space-y-1.5 sm:col-span-2">
          <Label className="text-foreground text-xs font-medium">Select Anime Series *</Label>
          <AnimeSelectCombobox
            value={formData.animeId}
            onValueChange={(val) => onChange("animeId", val)}
            options={ANIME_SERIES_OPTIONS}
            allowAllOption={false}
            placeholder="Search anime series by title..."
            className="w-full min-w-0"
          />
        </div>

        {/* Episode Number */}
        <div className="min-w-0 space-y-1.5">
          <Label className="text-foreground text-xs font-medium">Episode Number *</Label>
          <Input
            type="number"
            placeholder="e.g. 12"
            value={formData.episodeNumber}
            onChange={(e) => onChange("episodeNumber", e.target.value)}
            className="border-border/60 h-9 w-full min-w-0 text-xs"
          />
        </div>

        {/* Episode Title */}
        <div className="min-w-0 space-y-1.5">
          <Label className="text-foreground text-xs font-medium">Episode Title *</Label>
          <Input
            placeholder="e.g. Arise, Monarch of Shadows"
            value={formData.title}
            onChange={(e) => onChange("title", e.target.value)}
            className="border-border/60 h-9 w-full min-w-0 text-xs"
          />
        </div>

        {/* Duration */}
        <div className="min-w-0 space-y-1.5">
          <Label className="text-foreground text-xs font-medium">Duration (mm:ss) *</Label>
          <Input
            placeholder="e.g. 23:45"
            value={formData.duration}
            onChange={(e) => onChange("duration", e.target.value)}
            className="border-border/60 h-9 w-full min-w-0 text-xs"
          />
        </div>

        {/* Air Date */}
        <div className="min-w-0 space-y-1.5">
          <Label className="text-foreground text-xs font-medium">Airing Date *</Label>
          <Input
            type="date"
            value={formData.airDate}
            onChange={(e) => onChange("airDate", e.target.value)}
            className="border-border/60 h-9 w-full min-w-0 text-xs"
          />
        </div>

        {/* Thumbnail URL */}
        <div className="min-w-0 space-y-1.5 sm:col-span-2">
          <Label className="text-foreground text-xs font-medium">Thumbnail / Cover Image URL</Label>
          <Input
            placeholder="https://images.unsplash.com/..."
            value={formData.thumbnail}
            onChange={(e) => onChange("thumbnail", e.target.value)}
            className="border-border/60 h-9 w-full min-w-0 text-xs"
          />
        </div>

        {/* Synopsis */}
        <div className="min-w-0 space-y-1.5 sm:col-span-2">
          <Label className="text-foreground text-xs font-medium">Episode Synopsis</Label>
          <Textarea
            placeholder="Enter a brief summary of what happens in this episode..."
            value={formData.synopsis}
            onChange={(e) => onChange("synopsis", e.target.value)}
            className="border-border/60 min-h-[90px] w-full min-w-0 text-sm"
          />
        </div>

        {/* VIP Lock */}
        <div className="border-border/60 bg-muted/20 flex min-w-0 items-center justify-between rounded-lg border p-3 sm:col-span-2">
          <div className="mr-2 min-w-0">
            <Label className="text-foreground block truncate text-sm font-semibold">
              VIP / Subscriber Only Access
            </Label>
            <p className="text-muted-foreground truncate text-xs">
              Require an active VIP subscription to watch this episode.
            </p>
          </div>
          <Switch
            checked={formData.isVip}
            onCheckedChange={(checked) => onChange("isVip", checked)}
            className="shrink-0"
          />
        </div>
      </div>
    </div>
  );
}
