"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { AnimeSelectCombobox } from "../../components/anime-select-combobox";
import type { BasicEpisodeData } from "../types";

interface BasicInfoStepProps {
  formData: BasicEpisodeData;
  onChange: (key: string, value: string | boolean) => void;
}

const ANIME_SERIES_OPTIONS = [
  { id: "a-01", title: "Solo Leveling Season 2: Arise from the Shadow" },
  { id: "a-02", title: "Demon Slayer: Hashira Training Arc" },
  { id: "a-03", title: "Jujutsu Kaisen Season 3: Culling Game" },
  { id: "a-04", title: "Frieren: Beyond Journey's End Season 2" },
];

export function BasicInfoStep({ formData, onChange }: BasicInfoStepProps) {
  return (
    <div className="space-y-4 bg-card p-4 sm:p-6 rounded-xl border border-border/60 min-w-0">
      <div className="border-b border-border/60 pb-3">
        <h3 className="text-base font-semibold text-foreground">Basic Episode Details</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Select the anime series and configure core metadata for this episode.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 min-w-0">
        {/* Searchable Anime Selection Combobox */}
        <div className="space-y-1.5 sm:col-span-2 min-w-0">
          <Label className="text-xs font-medium text-foreground">Select Anime Series *</Label>
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
        <div className="space-y-1.5 min-w-0">
          <Label className="text-xs font-medium text-foreground">Episode Number *</Label>
          <Input
            type="number"
            placeholder="e.g. 12"
            value={formData.episodeNumber}
            onChange={(e) => onChange("episodeNumber", e.target.value)}
            className="h-9 border-border/60 text-xs w-full min-w-0"
          />
        </div>

        {/* Episode Title */}
        <div className="space-y-1.5 min-w-0">
          <Label className="text-xs font-medium text-foreground">Episode Title *</Label>
          <Input
            placeholder="e.g. Arise, Monarch of Shadows"
            value={formData.title}
            onChange={(e) => onChange("title", e.target.value)}
            className="h-9 border-border/60 text-xs w-full min-w-0"
          />
        </div>

        {/* Duration */}
        <div className="space-y-1.5 min-w-0">
          <Label className="text-xs font-medium text-foreground">Duration (mm:ss) *</Label>
          <Input
            placeholder="e.g. 23:45"
            value={formData.duration}
            onChange={(e) => onChange("duration", e.target.value)}
            className="h-9 border-border/60 text-xs w-full min-w-0"
          />
        </div>

        {/* Air Date */}
        <div className="space-y-1.5 min-w-0">
          <Label className="text-xs font-medium text-foreground">Airing Date *</Label>
          <Input
            type="date"
            value={formData.airDate}
            onChange={(e) => onChange("airDate", e.target.value)}
            className="h-9 border-border/60 text-xs w-full min-w-0"
          />
        </div>

        {/* Thumbnail URL */}
        <div className="space-y-1.5 sm:col-span-2 min-w-0">
          <Label className="text-xs font-medium text-foreground">Thumbnail / Cover Image URL</Label>
          <Input
            placeholder="https://images.unsplash.com/..."
            value={formData.thumbnail}
            onChange={(e) => onChange("thumbnail", e.target.value)}
            className="h-9 border-border/60 text-xs w-full min-w-0"
          />
        </div>

        {/* Synopsis */}
        <div className="space-y-1.5 sm:col-span-2 min-w-0">
          <Label className="text-xs font-medium text-foreground">Episode Synopsis</Label>
          <Textarea
            placeholder="Enter a brief summary of what happens in this episode..."
            value={formData.synopsis}
            onChange={(e) => onChange("synopsis", e.target.value)}
            className="min-h-[90px] border-border/60 text-sm w-full min-w-0"
          />
        </div>

        {/* VIP Lock */}
        <div className="flex items-center justify-between p-3 rounded-lg border border-border/60 bg-muted/20 sm:col-span-2 min-w-0">
          <div className="min-w-0 mr-2">
            <Label className="text-sm font-semibold text-foreground block truncate">VIP / Subscriber Only Access</Label>
            <p className="text-xs text-muted-foreground truncate">
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
