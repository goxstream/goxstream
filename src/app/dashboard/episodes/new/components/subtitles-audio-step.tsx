"use client";

import { Plus, Trash2, Globe, Volume2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
    <div className="space-y-6 min-w-0">
      {/* Subtitles Section */}
      <div className="space-y-4 bg-card p-4 sm:p-6 rounded-xl border border-border/60 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3 min-w-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <Globe className="size-4 text-primary shrink-0" />
              <h3 className="text-base font-semibold text-foreground truncate">Subtitle Tracks</h3>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              Add multi-language subtitle files (WebVTT or SRT format).
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={onAddSubtitle} className="gap-1.5 shrink-0 self-start sm:self-auto">
            <Plus className="size-4" /> Add Subtitle
          </Button>
        </div>

        <div className="space-y-3 min-w-0">
          {subtitles.map((sub) => (
            <div
              key={sub.id}
              className="p-3 rounded-lg border border-border/60 bg-muted/20 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 min-w-0 overflow-hidden"
            >
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2 w-full min-w-0">
                <Input
                  placeholder="Language (e.g. Indonesian)"
                  value={sub.language}
                  onChange={(e) => onUpdateSubtitle(sub.id, "language", e.target.value)}
                  className="h-8 text-xs border-border/60 w-full min-w-0"
                />
                <Select
                  value={sub.code}
                  onValueChange={(val) => onUpdateSubtitle(sub.id, "code", val)}
                >
                  <SelectTrigger className="h-8 text-xs border-border/60 w-full min-w-0">
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
                  className="h-8 text-xs border-border/60 font-mono w-full min-w-0 truncate"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemoveSubtitle(sub.id)}
                className="size-8 text-muted-foreground hover:text-destructive shrink-0 self-end sm:self-center"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
          {subtitles.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-4 italic">
              No subtitles added yet.
            </p>
          )}
        </div>
      </div>

      {/* Audio Tracks Section */}
      <div className="space-y-4 bg-card p-4 sm:p-6 rounded-xl border border-border/60 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3 min-w-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <Volume2 className="size-4 text-primary shrink-0" />
              <h3 className="text-base font-semibold text-foreground truncate">Audio & Dubbing Tracks</h3>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              Specify available voice language tracks for this episode.
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={onAddAudio} className="gap-1.5 shrink-0 self-start sm:self-auto">
            <Plus className="size-4" /> Add Audio Track
          </Button>
        </div>

        <div className="space-y-3 min-w-0">
          {audioTracks.map((aud) => (
            <div
              key={aud.id}
              className="p-3 rounded-lg border border-border/60 bg-muted/20 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 min-w-0 overflow-hidden"
            >
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 w-full min-w-0">
                <Input
                  placeholder="Language Label (e.g. Japanese Original Voice)"
                  value={aud.label}
                  onChange={(e) => onUpdateAudio(aud.id, "label", e.target.value)}
                  className="h-8 text-xs border-border/60 w-full min-w-0"
                />
                <Select
                  value={aud.type}
                  onValueChange={(val) => onUpdateAudio(aud.id, "type", val)}
                >
                  <SelectTrigger className="h-8 text-xs border-border/60 w-full min-w-0">
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
                className="size-8 text-muted-foreground hover:text-destructive shrink-0 self-end sm:self-center"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
          {audioTracks.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-4 italic">
              No additional audio tracks configured.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
