"use client";

import { useState } from "react";
import { Upload, CheckCircle2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { AnimeSelectCombobox } from "../../components/anime-select-combobox";

const ANIME_SERIES_OPTIONS = [
  { id: "a-01", title: "Solo Leveling Season 2" },
  { id: "a-02", title: "Demon Slayer: Hashira Training Arc" },
  { id: "a-03", title: "Jujutsu Kaisen Season 3" },
  { id: "a-04", title: "Frieren: Beyond Journey's End Season 2" },
];

export function SubtitleUploaderCard() {
  const [selectedLanguage, setSelectedLanguage] = useState("id");
  const [targetAnime, setTargetAnime] = useState("a-01");
  const [isUploaded, setIsUploaded] = useState(false);

  const handleSimulateUpload = () => {
    setIsUploaded(true);
    setTimeout(() => setIsUploaded(false), 3000);
  };

  return (
    <div className="bg-card p-6 rounded-xl border border-border/60 space-y-4">
      <div className="border-b border-border/60 pb-3">
        <h3 className="text-base font-semibold text-foreground">
          Batch Subtitle Uploader (.vtt / .srt)
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Select target anime and language, then drop your subtitle files for auto-assignment.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-foreground">Target Anime Series</Label>
          <AnimeSelectCombobox
            value={targetAnime}
            onValueChange={setTargetAnime}
            options={ANIME_SERIES_OPTIONS}
            allowAllOption={false}
            placeholder="Search anime series..."
            className="w-full"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-foreground">Subtitle Language</Label>
          <Select value={selectedLanguage} onValueChange={(val) => val && setSelectedLanguage(val)}>
            <SelectTrigger className="h-9 border-border/60 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="id">Indonesian (Bahasa Indonesia)</SelectItem>
              <SelectItem value="en">English (Full)</SelectItem>
              <SelectItem value="ja">Japanese (日本語)</SelectItem>
              <SelectItem value="ms">Malay (Bahasa Melayu)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Drag Zone */}
      <div
        onClick={handleSimulateUpload}
        className="border-2 border-dashed border-border/80 hover:border-primary p-8 rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors flex flex-col items-center justify-center cursor-pointer text-center"
      >
        <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
          {isUploaded ? (
            <CheckCircle2 className="size-6 text-emerald-500" />
          ) : (
            <Upload className="size-6" />
          )}
        </div>
        {isUploaded ? (
          <div className="space-y-1">
            <p className="text-sm font-semibold text-emerald-500">
              Subtitles Uploaded Successfully!
            </p>
            <p className="text-xs text-muted-foreground">
              3 VTT files matched with Solo Leveling Season 2 episodes.
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">
              Click or drag VTT / SRT subtitle files here
            </p>
            <p className="text-xs text-muted-foreground">
              Supported formats: .vtt, .srt, .ass (Max size: 10MB per file)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
