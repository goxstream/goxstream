"use client";

import { Plus, Trash2, Globe, Volume2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SubtitleTrack, AudioTrack } from "../types";

interface SubtitlesAudioStepProps {
  subtitles: SubtitleTrack[];
  audioTracks: AudioTrack[];
  onAddSubtitle: () => void;
  onRemoveSubtitle: (id: string) => void;
  onUpdateSubtitle: (id: string, key: keyof SubtitleTrack, value: any) => void;
  onAddAudio: () => void;
  onRemoveAudio: (id: string) => void;
  onUpdateAudio: (id: string, key: keyof AudioTrack, value: any) => void;
}

export function SubtitlesAudioStep({
  subtitles,
  audioTracks,
  onAddSubtitle,
  onRemoveSubtitle,
  onUpdateSubtitle,
  onAddAudio,
  onRemoveAudio,
  onUpdateAudio,
}: SubtitlesAudioStepProps) {
  return (
    <div className="min-w-0 space-y-6">
      {/* Subtitles Section */}
      <div className="bg-card border-border/60 min-w-0 space-y-4 rounded-xl border p-4 sm:p-6">
        <div className="border-border/60 flex min-w-0 flex-col justify-between gap-3 border-b pb-3 sm:flex-row sm:items-center">
          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-2">
              <Globe className="text-primary size-4 shrink-0" />
              <h3 className="text-foreground truncate text-base font-semibold">Subtitle Tracks</h3>
            </div>
            <p className="text-muted-foreground mt-0.5 truncate text-xs">
              Add multi-language subtitle files (WebVTT or SRT format).
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={onAddSubtitle}
            className="shrink-0 gap-1.5 self-start sm:self-auto"
          >
            <Plus className="size-4" /> Add Subtitle
          </Button>
        </div>

        <div className="min-w-0 space-y-3">
          {subtitles.map((sub) => (
            <div
              key={sub.id}
              className="border-border/60 bg-muted/20 flex min-w-0 flex-col items-stretch gap-3 overflow-hidden rounded-lg border p-3 sm:flex-row sm:items-center"
            >
              <div className="grid w-full min-w-0 flex-1 grid-cols-1 gap-2 sm:grid-cols-3">
                <Input
                  placeholder="Language (e.g. Indonesian)"
                  value={sub.language}
                  onChange={(e) => onUpdateSubtitle(sub.id, "language", e.target.value)}
                  className="border-border/60 h-8 w-full min-w-0 text-xs"
                />
                <Select
                  value={sub.code}
                  onValueChange={(val) => onUpdateSubtitle(sub.id, "code", val)}
                >
                  <SelectTrigger className="border-border/60 h-8 w-full min-w-0 text-xs">
                    <SelectValue placeholder="ISO Code" className="truncate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="id">Indonesian (id)</SelectItem>
                    <SelectItem value="en">English (en)</SelectItem>
                    <SelectItem value="ja">Japanese (ja)</SelectItem>
                    <SelectItem value="ms">Malay (ms)</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Subtitle URL (.vtt / .srt)"
                  value={sub.url}
                  onChange={(e) => onUpdateSubtitle(sub.id, "url", e.target.value)}
                  className="border-border/60 h-8 w-full min-w-0 truncate font-mono text-xs"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemoveSubtitle(sub.id)}
                className="text-muted-foreground hover:text-destructive size-8 shrink-0 self-end sm:self-center"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
          {subtitles.length === 0 && (
            <p className="text-muted-foreground py-4 text-center text-xs italic">
              No subtitles added yet.
            </p>
          )}
        </div>
      </div>

      {/* Audio Tracks Section */}
      <div className="bg-card border-border/60 min-w-0 space-y-4 rounded-xl border p-4 sm:p-6">
        <div className="border-border/60 flex min-w-0 flex-col justify-between gap-3 border-b pb-3 sm:flex-row sm:items-center">
          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-2">
              <Volume2 className="text-primary size-4 shrink-0" />
              <h3 className="text-foreground truncate text-base font-semibold">
                Audio & Dubbing Tracks
              </h3>
            </div>
            <p className="text-muted-foreground mt-0.5 truncate text-xs">
              Specify available voice language tracks for this episode.
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={onAddAudio}
            className="shrink-0 gap-1.5 self-start sm:self-auto"
          >
            <Plus className="size-4" /> Add Audio Track
          </Button>
        </div>

        <div className="min-w-0 space-y-3">
          {audioTracks.map((aud) => (
            <div
              key={aud.id}
              className="border-border/60 bg-muted/20 flex min-w-0 flex-col items-stretch gap-3 overflow-hidden rounded-lg border p-3 sm:flex-row sm:items-center"
            >
              <div className="grid w-full min-w-0 flex-1 grid-cols-1 gap-2 sm:grid-cols-2">
                <Input
                  placeholder="Language Label (e.g. Japanese Original Voice)"
                  value={aud.label}
                  onChange={(e) => onUpdateAudio(aud.id, "label", e.target.value)}
                  className="border-border/60 h-8 w-full min-w-0 text-xs"
                />
                <Select
                  value={aud.type}
                  onValueChange={(val) => onUpdateAudio(aud.id, "type", val)}
                >
                  <SelectTrigger className="border-border/60 h-8 w-full min-w-0 text-xs">
                    <SelectValue className="truncate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="original">Original Voice</SelectItem>
                    <SelectItem value="dub">Dubbed Voice</SelectItem>
                    <SelectItem value="commentary">Audio Commentary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemoveAudio(aud.id)}
                className="text-muted-foreground hover:text-destructive size-8 shrink-0 self-end sm:self-center"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
          {audioTracks.length === 0 && (
            <p className="text-muted-foreground py-4 text-center text-xs italic">
              No additional audio tracks configured.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
